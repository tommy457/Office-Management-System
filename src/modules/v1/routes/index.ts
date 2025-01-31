import { Router } from "express";
import authRoutes from "./authRoutes";
import appointmentRouter from "./appointmentRoutes";
import prescriptionRouter from "./prescriptionRoutes";
import { NotFoundError } from "../../../middlewares/errors.middleware";

class V1Routes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes(): void {
    this.router.use("/auth", authRoutes);
    this.router.use("/appointments", appointmentRouter);
    this.router.use("/prescriptions", prescriptionRouter);

    this.router.use("*", () => {
      throw new NotFoundError(
        "API Endpoint does not exist or is currently under construction"
      );
    });
  }
}

export default new V1Routes().router;