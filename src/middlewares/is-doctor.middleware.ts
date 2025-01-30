import { ForbiddenError } from './errors.middleware';
import { Request, Response, NextFunction } from 'express';
import UserService from '../services/UserService';
import { UserType } from '../utils/enums/user-role.enum';

async function isDoctor(req: Request, res: Response, next: NextFunction) {
  const userId = req.user.id;

  try {
    const user = await UserService.findById(userId);
    
    if (user.role !== UserType.DOCTOR) {
       next(new ForbiddenError('Access Denied.'));
     }
    next();
  } catch (err) {
    next(err);
  }
}

export default isDoctor;