import { AuthService } from "@/modules/Auth/auth.service";
import { ok } from "@/utils/ApiResponse";
import { ValidatedRequest } from "@/utils/types";
import {
  GoogleSignInBody,
  LoginBody,
  RegisterBody,
  ResendCodeBody,
  SetUsernameBody,
  VerifyEmailBody,
} from "futbol-in-core/schemas";

export const AuthController = {
  login: async (req: ValidatedRequest<any, LoginBody>) => {
    const { token, user } = await AuthService.login(req.validated!);
    return ok({ token, user }, "Login correcto");
  },

  register: async (req: ValidatedRequest<any, RegisterBody>) => {
    const { token, user } = await AuthService.register(req.validated!);
    return ok(
      { token, user },
      "Te enviamos un código de verificación a tu correo."
    );
  },

  verifyEmail: async (req: ValidatedRequest<any, VerifyEmailBody>) => {
    console.log('En controller', req.validated)
    const { token, user } = await AuthService.verifyEmail(req.validated!);
    return ok({ token, user }, "Correo verificado con éxito");
  },

  resendCode: async (req: ValidatedRequest<any, ResendCodeBody>) => {
    await AuthService.resendCode(req.validated!);
    return ok(null, "Nuevo código enviado");
  },

  googleSignIn: async (req: ValidatedRequest<any, GoogleSignInBody>) => {
    const { token, user } = await AuthService.googleSignIn(req.validated!);
    return ok({ token, user }, "Autenticado con Google");
  },

  setUsername: async (req: ValidatedRequest<any, SetUsernameBody>) => {
    const { token, user } = await AuthService.setUsername({
      userId: req.user!.id,
      username: req.validated.username,
    });
    return ok({ token, user }, "Nombre de usuario configurado");
  },
};
