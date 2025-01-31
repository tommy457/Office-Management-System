import prescriptionValidator from "../../../../utils/validators/prescription.validator";
import PrescriptionController from "../../controllters/prescription.controller";
import CustomMiddleware from "../../../../middlewares/custom.middleware";
import isDoctor from "../../../../middlewares/is-doctor.middleware";
import authenticate from "../../../../middlewares/auth.middleware";
import { Router } from "express";

const prescriptionRouter = Router();

prescriptionRouter.post(
  "/",
  authenticate,
  isDoctor,
  CustomMiddleware.validateRequestBody(prescriptionValidator.createSchema),
  PrescriptionController.create
);
prescriptionRouter.put(
  "/:id",
  authenticate,
  isDoctor,
  CustomMiddleware.validateRequestBody(prescriptionValidator.updateSchema),
  PrescriptionController.update,
);
prescriptionRouter.delete(
  "/:id",
  authenticate,
  isDoctor,
  PrescriptionController.delete,
);
prescriptionRouter.get(
  "/:id",
  authenticate,
  PrescriptionController.view
);
prescriptionRouter.get(
  "/",
  authenticate,
  PrescriptionController.viewAll
);

export default prescriptionRouter;