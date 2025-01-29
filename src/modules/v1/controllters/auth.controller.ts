import apiResponse from "../../../utils/apiResponse";
import { Request, Response, NextFunction } from "express";
import AuthService from "../../../services/AuthService";
import {
  UnauthorizedError,
} from "../../../middlewares/errors.middleware";
import redisClient from "../../../utils/clients/redisClient";

class AuthController {
  static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const { email, password, name, specialization = null, date_of_birth = null, address = null } = req.body;
      const registerData = {
        email,
        password,
        name,
        specialization,
        date_of_birth,
        address,
      };
      await AuthService.register(registerData);

      return apiResponse.successResponse(
        res,
        200,
        "Account Created Successfully."
      );
    } catch (error) {
      console.error("Error Creating User:", error);
      next(error);
    }
  }

  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const { email, password } = req.body;

      await AuthService.login(email, password);

      return apiResponse.successResponse(
        res,
        200,
        "User Login Successfully."
      );
    } catch (error) {
      console.error("Error login User:", error);
      next(error);
    }
  }

  static async refresh(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    const { refreshToken } = req.body;

    try {
      if (!refreshToken) {
        throw new UnauthorizedError("Missing Refresh token");
      }
      const newAccessToken = await AuthService.refresh(refreshToken);
      return apiResponse.successResponse(
        res,
        200,
        "Refreched Access Token Successfully.",
        { accessToken: newAccessToken }
      );
    } catch (error) {
      console.error("Error Refreshing User Token:", error);
      next(error);
    }
  }

  static async logout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    const userId = req.user.id;

    try {
      await redisClient.del(userId.toString());
      await redisClient.del(`${userId}_refresh`);

      return apiResponse.successResponse(
        res,
        204,
        "User Logged Out Successfully."
      );
    } catch (error) {
      console.error("Error logging out User:", error);
      next(error);
    }
  }

  static async changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const currentUserId = req.user.id;
      const oldPassword = req.body.old_password;
      const newPassword = req.body.new_password;
      await AuthService.changePassword(currentUserId, newPassword, oldPassword);

      return apiResponse.successResponse(
        res,
        200,
        "Password Changed Successfully."
      );
    } catch (error) {
      console.error("Error Changing User Password:", error);
      next(error);
    }
  }
}
export default AuthController;