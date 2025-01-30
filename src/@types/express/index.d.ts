import { User } from '@prisma/client';
import { jwtTokenIdentity } from '../../interfaces/jwt.interface';
import { ReqQueryOptions } from "../../interfaces/misc.interface";

declare module "express" {
    export interface Request {
      user?: jwtTokenIdentity;
      queryOpts?: ReqQueryOptions;
    }
}