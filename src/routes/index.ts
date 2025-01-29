import { NextFunction, Request, Response, Router } from "express";
import apiResponse from "../utils/apiResponse";
import { NotFoundError } from "../middlewares/errors.middleware";
import config from "../config";
import v1Routes from "../modules/v1/v1Routes";

class Routes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes(): void {
    this.router.get("/", (req: Request, res: Response, next: NextFunction) => {
      const data: object = {
        owner: "Mohamed Lamine Boukhalfa",
        developer: "Mohamed Lamine Boukhalfa",
      };

      return apiResponse.successResponse(
        res,
        200,
        "Office Managment System",
        data
      );
    });

    this.router.use(`${config.V1_URL}`, v1Routes);

    this.router.use("*", () => {
      throw new NotFoundError(
        "API Endpoint does not exist or is currently in construction"
      );
    });
  }
}

export default new Routes().router;