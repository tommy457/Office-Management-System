import { NotFoundError } from './errors.middleware';
import { Request, Response, NextFunction } from 'express';

const pageNotFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new NotFoundError('Page Not Found!');
  next(error);
};

export default pageNotFound;