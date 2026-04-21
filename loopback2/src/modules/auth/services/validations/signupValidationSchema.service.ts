import { Request } from '@loopback/rest';
import { z, ZodSchema } from 'zod';
import { NextFunction, Response } from "express";

export const SignupRequestSchema = z.object({
  username: z.string().min(3, 'El usuario debe de tener al menos 3 caracteres'),
  email: z.string().email('El correo electrónico no es válido'),
  password: z.string().min(8, 'La contraseña debe de tener al menos 8 caracteres')
});

export type SignupRequest = z.infer<typeof SignupRequestSchema>;



export function validateSignup(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map(e => ({
        field: e.path.join('.'),
        message: e.message

      }));

      return res.status(422).json({
        message: "Unprocessable Entity",
        details: errors
      });

    }

    req.body = result.data;
    next();

  };
}


export function validateSignupData(data: unknown) {
  return SignupRequestSchema.safeParse(data);
}
