import { Router } from "express";
import AuthController from "../../controllters/auth.controller";
import authenticate from "../../../../middlewares/auth.middleware";

const authRouter = Router();

authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login);
authRouter.post("/refresh", AuthController.refresh);
authRouter.post("/logout", authenticate, AuthController.logout);
authRouter.put("/change-password", authenticate, AuthController.changePassword);

export default authRouter;