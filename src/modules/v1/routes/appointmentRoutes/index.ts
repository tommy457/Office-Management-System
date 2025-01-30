import appointmentValidator from "../../../../utils/validators/appointment.validator";
import AppointmentController from "../../controllters/appointment.controller";
import CustomMiddleware from "../../../../middlewares/custom.middleware";
import isDoctor from "../../../../middlewares/is-doctor.middleware";
import authenticate from "../../../../middlewares/auth.middleware";
import { Router } from "express";

const appointmentRouter = Router();

appointmentRouter.post(
  "/",
  authenticate,
  isDoctor,
  CustomMiddleware.validateRequestBody(appointmentValidator.createSchema),
  AppointmentController.create
);
appointmentRouter.put(
  "/:id",
  authenticate,
  isDoctor,
  CustomMiddleware.validateRequestBody(appointmentValidator.updateSchema),
  AppointmentController.update,
);
appointmentRouter.get(
  "/:id",
  authenticate,
  AppointmentController.viewAppointment
);
appointmentRouter.get(
  "/",
  authenticate,
  AppointmentController.viewAllAppointments
);

export default appointmentRouter;