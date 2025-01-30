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

  public formatRequestQuery(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        limit,
        cursor,
        orderBy,
        sortOrder,
      } = req.query;

      req.queryOpts = {
        limit: limit && Number(limit) > 0 ? Number(limit) : Number(process.env.RECORDS_LIMIT),
        cursor: cursor ? String(cursor) : undefined,
        orderBy: orderBy ? String(orderBy) : "createdAt",
        sortOrder: sortOrder === "asc" || sortOrder === "desc" ? sortOrder : "asc",
      }
      next();
    } catch (error) {
      next(error);
    }
  }
}

export default new CustomMiddlewares();