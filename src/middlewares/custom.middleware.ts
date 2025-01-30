import { NextFunction, Request, Response } from "express";
import { ValidationResult } from "joi";

class CustomMiddlewares {

  public validateRequestBody = (
    validator: (req: Request) => ValidationResult
  ) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error, value } = validator(req);

      if (error) throw error;

      req.body = value;

      next();
    };
  };
}

export default new CustomMiddlewares();