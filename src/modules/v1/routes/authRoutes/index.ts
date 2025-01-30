import { Router } from "express";
import AuthController from "../../controllters/auth.controller";
import authenticate from "../../../../middlewares/auth.middleware";
import CustomMiddleware from "../../../../middlewares/custom.middleware";
import authValidator from "../../../../utils/validators/auth.validator";

const authRouter = Router();

authRouter.post(
    "/register",
    CustomMiddleware.validateRequestBody(authValidator.registerSchema),
    AuthController.register
);
authRouter.post(
    "/login",
    CustomMiddleware.validateRequestBody(authValidator.loginSchema),
    AuthController.login,
);
authRouter.patch(
    "/change-password",
    authenticate,
    CustomMiddleware.validateRequestBody(authValidator.changePasswordSchema),
    AuthController.changePassword
);
authRouter.post("/refresh", AuthController.refresh);
authRouter.post("/logout", authenticate, AuthController.logout);

export default authRouter;