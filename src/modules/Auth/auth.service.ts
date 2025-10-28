import { sendVerifyEmail } from "@/infra/mailservice";
import { UserRepository } from "@/modules/User/user.repository";
import { ApiError } from "@/utils/ApiError";
import { JwtPayload, signToken } from "@/utils/jwt";
import * as bcrypt from "bcrypt";
import { AuthProvider, UserRole, UserStatus } from "futbol-in-core/enum";
import {
  GoogleSignInBody,
  LoginBody,
  RegisterBody,
  ResendCodeBody,
  VerifyEmailBody,
} from "futbol-in-core/schemas";
import { OAuth2Client } from "google-auth-library";
import { AuthRepository } from "./auth.repository";
import {
  buildJwt,
  gen6Code,
  normalizeEmail,
  normalizeUsername,
} from "./auth.utils";
const CODE_TTL_MINUTES = 10;
const BCRYPT_ROUNDS = 10;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const login = async ({ email, password }: LoginBody) => {
  const user = await AuthRepository.findByEmail(normalizeEmail(email));
  const valid = user && (await bcrypt.compare(password, user.password ?? ""));
  if (!valid) throw new ApiError(401, "Credenciales inválidas");

  const payload: JwtPayload = {
    id: String(user._id),
    email: user.email ?? "",
    name: user.name ?? "",
    role: (user.role || [UserRole.USER]).map(String),
    status: (user.status as UserStatus) ?? UserStatus.MUST_CONFIRM_EMAIL,
    provider: user.provider ?? "",
    imagen: user.imagen ?? "",
  };
  const token = await signToken(payload);
  return { token, user: payload };
};

const register = async ({ email, username, password }: RegisterBody) => {
  const emailN = normalizeEmail(email);
  const usernameN = normalizeUsername(username);

  const existingByEmail = await AuthRepository.findByEmail(emailN);
  if (existingByEmail)
    throw new ApiError(409, "Ya existe una cuenta con ese email");

  const existingByUsername = await AuthRepository.findByUsername(usernameN);
  if (existingByUsername)
    throw new ApiError(409, "Nombre de usuario no disponible");

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const code = gen6Code();
  const codeHash = await bcrypt.hash(code, BCRYPT_ROUNDS);
  const expires = new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000);

  await UserRepository.create({
    email: emailN,
    name: usernameN, // o deja vacío si tienes "username" separado; ajusta si tu modelo lo tiene
    password: passwordHash,
    provider: AuthProvider.CREDENTIALS,
    status: UserStatus.MUST_CONFIRM_EMAIL,
    verificationCode: codeHash,
    verificationCodeExpires: expires,
  });

  await sendVerifyEmail(emailN, code);

  // login
  return login({ email, password });
};

const verifyEmail = async ({ email, code }: VerifyEmailBody) => {
  const emailN = normalizeEmail(email);
  const user = await AuthRepository.findByEmailWithSensitive(emailN);
  if (!user) throw new ApiError(404, "Usuario no encontrado");
  if (!user.verificationCode || !user.verificationCodeExpires)
    throw new ApiError(400, "No hay verificación pendiente");

  if (user.verificationCodeExpires.getTime() < Date.now()) {
    throw new ApiError(400, "El código ha expirado");
  }

  const okCode = await bcrypt.compare(code, user.verificationCode);
  if (!okCode) throw new ApiError(400, "Código inválido");

  await AuthRepository.markEmailVerified(user._id);

  const payload: JwtPayload = {
    id: String(user._id),
    email: user.email,
    name: user.name ?? "",
    role: (user.role || [UserRole.USER]).map(String),
    status: UserStatus.DONE,
    provider: user.provider ?? AuthProvider.CREDENTIALS,
    imagen: user.imagen ?? "",
  };
  const token = await signToken(payload);
  return { token, user: payload };
};

const resendCode = async ({ email }: ResendCodeBody) => {
  const emailN = normalizeEmail(email);
  const user = await AuthRepository.findByEmailWithSensitive(emailN);
  if (!user) throw new ApiError(404, "Usuario no encontrado");
  if (user.status === UserStatus.DONE)
    throw new ApiError(400, "El correo ya está verificado");

  // Genera nuevo código y reinicia TTL
  const code = gen6Code();
  const codeHash = await bcrypt.hash(code, BCRYPT_ROUNDS);
  const expires = new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000);

  await AuthRepository.setVerificationCode(user._id, codeHash, expires);
  await sendVerifyEmail(emailN, code);
};

export const googleSignIn = async ({ idToken }: GoogleSignInBody) => {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload?.email || !payload.email_verified)
    throw new ApiError(400, "Email de Google no verificado");
  const email = normalizeEmail(payload.email);

  const existing = await AuthRepository.findByEmailWithSensitive(email);
  if (existing) {
    if (existing.provider !== AuthProvider.GOOGLE)
      throw new ApiError(409, "Este email ya está registrado con credenciales");
    // Login Google existente
    const p = buildJwt(existing);
    const token = await signToken(p);
    return { token, user: p };
  }

  // Alta Google -> debe crear username
  const created = await UserRepository.create({
    email,
    provider: AuthProvider.GOOGLE,
    status: UserStatus.MUST_CREATE_USERNAME,
    role: [UserRole.USER],
    imagen: "", // no importar picture
  });

  const p = buildJwt(created, UserStatus.MUST_CREATE_USERNAME);
  const token = await signToken(p);
  return { token, user: p };
};

export const setUsername = async ({
  userId,
  username,
}: {
  userId: string;
  username: string;
}) => {

  const usernameN = normalizeUsername(username);
  const me = await UserRepository.findById(userId);
  
  if (!me) throw new ApiError(404, "Usuario no encontrado");
  if (me.provider !== AuthProvider.GOOGLE)
    throw new ApiError(400, "Solo aplica a cuentas Google");
  if (me.status !== UserStatus.MUST_CREATE_USERNAME)
    throw new ApiError(400, "El usuario ya tiene username");

  const conflict = await AuthRepository.findByUsername(usernameN);
  if (conflict) throw new ApiError(409, "Nombre de usuario no disponible");

  await AuthRepository.setUsernameAndDone(me._id, usernameN);

  const payload: JwtPayload = {
    id: String(me._id),
    email: me.email ?? "",
    name: me.name ?? "",
    role: (me.role || [UserRole.USER]).map(String),
    status: UserStatus.DONE,
    provider: me.provider ?? "",
    imagen: me.imagen ?? "",
  };
  const token = await signToken(payload);

  return { token, user: payload };
};

export const AuthService = {
  login,
  register,
  verifyEmail,
  resendCode,
  googleSignIn,
  setUsername,
};
