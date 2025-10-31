import type { ZodTypeAny } from "zod";
import type { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      validated?: any;
      validatedParams?: any;
      validatedQuery?: any;
      user?: {
        id: string;
        email: string;
        name: string;
        role: string[];
        status: string;
        provider: string;
        imagen: string;
      };
    }
  }
}
