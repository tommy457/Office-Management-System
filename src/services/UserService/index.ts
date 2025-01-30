import { BaseService } from "../base.service";
import dbClient from "../../utils/clients/dbClient";
import { User, Prisma } from "@prisma/client";
import {
  NotFoundError,
} from "../../middlewares/errors.middleware";

class UserService extends BaseService<
  User,
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput,
  Prisma.UserInclude,
  Prisma.UserSelect
  > {
  constructor() {
    super(dbClient.client().user, 'user');
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.findById(id);
    if(!user) throw new NotFoundError("User Not Found.");

    return user;
  }

  async findUser(fields: {[key: string]: (string) | any}): Promise<User> {
    const user = await this.findByMultipleFields(fields);
    return user;
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    const updatedUser = await super.update(
      id,
      data,
    );
    return updatedUser;
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return await super.create(data);
  }

  async isProfileOwner(id: string, userId: string): Promise<boolean> {
    return id === userId;
  }
}

export default new UserService();