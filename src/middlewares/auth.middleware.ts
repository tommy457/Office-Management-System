import jwt from 'jsonwebtoken';
import redisClient from '../utils/clients/redisClient';
import { ForbiddenError } from './errors.middleware';
import { Request, Response, NextFunction } from 'express';
import { jwtTokenIdentity } from '../interfaces/jwt.interface';

async function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new ForbiddenError('Missing Access Token'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as jwtTokenIdentity;
    const userId = user.id;

    const isLoggedIn = await redisClient.get(userId.toString());
    if (!isLoggedIn || isLoggedIn !== `${token.split('.')[1]}`) {
      return next(new ForbiddenError('The token is invalid or has expired'));
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

export default authenticate;