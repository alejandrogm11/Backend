import { Request } from "@loopback/rest";
import { NextFunction, Response } from "express";
import { ZodSchema, ZodError } from "zod";

export function validateRequestBody(schema: ZodSchema){
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if(!result.success){
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
    


