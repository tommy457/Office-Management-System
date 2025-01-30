import apiResponse from "../../../utils/apiResponse";
import { Request, Response, NextFunction } from "express";
import AppointmentService from "../../../services/AppointmentsService";
import { UserType } from "../../../utils/enums/user-role.enum";

class AppointmentController {
  static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const doctorId = req.user.id;
      const { patientId, reason, date_and_time } = req.body;

      const AppointmentData = {
        doctor: doctorId ? { connect: { id: doctorId } } : undefined,
        patient: patientId ? { connect: { id: patientId } } : undefined,
        reason,
        date_and_time,
      };

      await AppointmentService.create(AppointmentData);

      return apiResponse.successResponse(
        res,
        200,
        "Appointment Created Successfully."
      );
    } catch (error) {
      console.error("Error Creating Appointment:", error);
      next(error);
    }
  }

  static async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const { id } = req.params;
      const { patientId, doctorId, reason, date_and_time, status } = req.body;

      const AppointmentData = {
        reason,
        date_and_time,
        status,
      };
      if (doctorId) {
        Object.assign(AppointmentData, {
          doctor: { connect: { id: doctorId } },
        });
      };

      if (patientId) {
        Object.assign(AppointmentData, {
          patient: { connect: { id: patientId } },
        });
      };

      const data = await AppointmentService.update(id, AppointmentData);

      return apiResponse.successResponse(
        res,
        200,
        "Appointment Updated Successfully.",
        data
      );
    } catch (error) {
      console.error("Error Updating Appointment:", error);
      next(error);
    }
  }

  static async viewAppointment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    const { id } = req.params;
    try {
      const appointment = await AppointmentService.findAppointmentById(id);
      return apiResponse.successResponse(
        res,
        200,
        "Appointment Retrived Successfully.",
        appointment
      );
    } catch (error) {
      console.error("Error Retriving Appointment:", error);
      next(error);
    }
  }

  static async viewAllAppointments(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const userId = req.user.id;
      const filters: { doctor_id?: string; patient_id?: string } = {};

      if (req.user.role === UserType.DOCTOR) {
        Object.assign(filters, {
          doctor_id: userId,
        });
      } else if (req.user.role === UserType.PATIENT) {
        Object.assign(filters, {
          patient_id: userId,
        });
      }

      const data = await AppointmentService.getAllAppointments(req.queryOpts, filters);

      return apiResponse.successResponse(
        res,
        200,
        "Appointments Retrived Successfully.",
        data
      );
    } catch (error) {
      console.error("Error Retriving Appointment:", error);
      next(error);
    }
  }
}
export default AppointmentController;