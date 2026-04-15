import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function CreateValidator(schema: ZodSchema) {
  return () => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((e: any) => ({
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
