import { Router } from "express";
import authRoutes from "./authRoutes";
import { NotFoundError } from "../../../middlewares/errors.middleware";

class V1Routes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes(): void {
    this.router.use("/auth", authRoutes);

    this.router.use("*", () => {
      throw new NotFoundError(
        "API Endpoint does not exist or is currently under construction"
      );
    });
  }
}

export default new V1Routes().router;