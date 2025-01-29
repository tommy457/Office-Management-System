import { User } from '@prisma/client';
import { jwtTokenIdentity } from '../../interfaces/jwt.interface';

declare module "express" {
    export interface Request {
      user?: jwtTokenIdentity;
    }
}