import { BaseService } from "../base.service";
import dbClient from "../../utils/clients/dbClient";
import { User, Prisma } from "@prisma/client";
import UserService from "../UserService";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
} from "../../middlewares/errors.middleware";
import redisClient from "../../utils/clients/redisClient";
import { jwtTokenIdentity } from "../../interfaces/jwt.interface";


class AuthService extends BaseService<
  User,
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput,
  Prisma.UserInclude,
  Prisma.UserSelect
> {
  constructor() {
    super(dbClient.client().user, "user");
  }

  async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }

  async verfyToken(
    token: string,
    secret: string
  ): Promise<string | JwtPayload> {
    const userInfo = jwt.verify(token, secret);
    return userInfo;
  }

  async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }


  async generateJWToken(
    identity: object | string,
    secret: string | undefined,
    ttl?: string | any
  ): Promise<string> {
    if (!secret) throw new NotFoundError("Secret Key must be provided");
    const token = jwt.sign(identity, secret, { expiresIn: `${ttl}` });
    return token;
  }

  async register(fields: { [key: string]: string }): Promise<void | null> {
    const { email, password, name, specialization, date_of_birth, address } = fields;

    const lowerCaseEmail = email.toLowerCase();
    const existingUser = await UserService.findUser({ email: lowerCaseEmail });

    if (existingUser) {
      if (existingUser.email === lowerCaseEmail) {
        throw new BadRequestError("Email Already Registered.");
      } else {
        throw new BadRequestError("User Already Exists.");
      }
    }
    const hashedPassword = await this.hashPassword(password);
    await UserService.create({
      email,
      password: hashedPassword,
      name,
      specialization,
      date_of_birth,
      address,
    });

  }

  async login(email: string, password: string): Promise<object> {
    const user = await UserService.findUser({ email });

    if (!user) {
      throw new NotFoundError("User Not Found.");
    }
    const hashedPassword = user.password;
    const isAutherized = await this.comparePassword(password, hashedPassword);

    if (!isAutherized) {
      throw new UnauthorizedError("Wrong Password");
    }

    const identity = {
      id: user.id,
      name: user.name,
      role: user.role
    };

    const accessToken = await this.generateJWToken(
      identity,
      process.env.ACCESS_TOKEN_SECRET,
      `${process.env.ACCESS_TOKEN_TTL}m`
    );
    const refreshToken = await this.generateJWToken(
      identity,
      process.env.REFRESH_TOKEN_SECRET,
      `${process.env.REFRESH_TOKEN_TTL}d`
    );
    const userId = user.id;
    const accessTokenTTL = parseInt(process.env.ACCESS_TOKEN_TTL, 10) * 60;
    const refreshTokenTTL = parseInt(process.env.REFRESH_TOKEN_TTL, 10) * 24 * 3600;

    await redisClient.set(userId, `${accessToken.split(".")[1]}`, accessTokenTTL);
    await redisClient.set(
      `${userId}_refresh`,
      `${refreshToken.split(".")[1]}`,
      refreshTokenTTL
    );
    return { accessToken, refreshToken, userId, name: identity.name };
  }

  async refresh(refreshToken: string): Promise<string> {
    const user = (await this.verfyToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )) as jwtTokenIdentity;

    const isLoggedIn = await redisClient.get(`${user.id}_refresh`);
    if (!isLoggedIn || isLoggedIn !== `${refreshToken.split(".")[1]}`) {
      throw new ForbiddenError("The token is invalid or has expired");
    }

    const newAccessToken = await this.generateJWToken(
      { id: user.id, username: user.name, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      `${process.env.ACCESS_TTL}m`
    );

    await redisClient.set(
      user.id,
      `${newAccessToken.split(".")[1]}`,
      parseInt(process.env.ACCESS_TTL, 10) * 60
    );
    return newAccessToken;
  }

  async changePassword(
    id: string,
    newPassword: string,
    oldPassword: string
  ): Promise<void> {
    const user = await UserService.findUser({ id });

    if (!user) {
      throw new NotFoundError("User Not Found.");
    }
    const isAutherized = await this.comparePassword(oldPassword, user.password);

    if (!isAutherized) {
      throw new UnauthorizedError("Wrong Password");
    }

    const newHashedPassword = await this.hashPassword(newPassword);
    await UserService.update(id, { password: newHashedPassword });
  }
}

export default new AuthService();