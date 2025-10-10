import { AuthService } from "@/modules/Auth/auth.service";
import { ApiResponse, ok } from "@/utils/ApiResponse";
import { GoogleSignInBody, LoginBody, RegisterBody, ResendCodeBody, SetUsernameBody, VerifyEmailBody } from "futbol-in-core/schemas";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;

export const login = async (req: {
  validated: LoginBody;
}): Promise<ApiResponse<{ token: string; user: unknown }>> => {
  const { token, user } = await AuthService.login(req.validated);
  return ok({ token, user }, "Login correcto");
};

const register = async (req: { validated: RegisterBody }) => {
  const {token, user} = await AuthService.register(req.validated);
  return ok({ token, user }, "Te enviamos un código de verificación a tu correo.");
};

const verifyEmail = async (req: { validated: VerifyEmailBody }) => {
  const { token, user } = await AuthService.verifyEmail(req.validated);
  return ok({ token, user }, "Correo verificado con éxito");
};

const resendCode = async (req: { validated: ResendCodeBody }) => {
  await AuthService.resendCode(req.validated);
  return ok(null, "Nuevo código enviado");
};

const googleSignIn = async (req:{validated:GoogleSignInBody})=>{
  const { token, user } = await AuthService.googleSignIn(req.validated);
  return ok({ token, user }, "Autenticado con Google");
};

const setUsername = async (req:{validated:SetUsernameBody; user: { id:string }})=>{
  const { token, user } = await AuthService.setUsername({ userId: req.user.id, username: req.validated.username });
  return ok({ token, user }, "Nombre de usuario configurado");
};



export const AuthController = {
  login,
  register,
  verifyEmail,
  resendCode,
  googleSignIn,
  setUsername
};
