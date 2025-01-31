import apiResponse from "../../../utils/apiResponse";
import { Request, Response, NextFunction } from "express";
import { UserType } from "../../../utils/enums/user-role.enum";
import PrescriptionService from '../../../services/PrescriptionService'

class PrescriptionController {
  static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const doctorId = req.user.id;
      const { patientId, medication, dosage, frequency, startDate, endDate } = req.body;

      const prescriptionData = {
        doctor: doctorId ? { connect: { id: doctorId } } : undefined,
        patient: patientId ? { connect: { id: patientId } } : undefined,
        medication,
        dosage,
        frequency,
        startDate,
        endDate,
      };

      await PrescriptionService.create(prescriptionData);

      return apiResponse.successResponse(
        res,
        200,
        "Prescription Created Successfully."
      );
    } catch (error) {
      console.error("Error Creating Prescription:", error);
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
      const {
        patientId,
        medication,
        dosage,
        frequency,
        startDate,
        endDate
    } = req.body;

      const PrescriptionData = {
        medication,
        dosage,
        frequency,
        startDate,
        endDate,
      };

      if (patientId) {
        Object.assign(PrescriptionData, {
          patient: { connect: { id: patientId } },
        });
      };

      const data = await PrescriptionService.update(id, PrescriptionData);

      return apiResponse.successResponse(
        res,
        200,
        "Prescription Updated Successfully.",
        data
      );
    } catch (error) {
      console.error("Error Updating Prescription:", error);
      next(error);
    }
  }

  static async view(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    const { id } = req.params;
    try {
      const prescription = await PrescriptionService.findPrescriptionById(
        id,
        req.user.role,
        req.user.id
      );
      return apiResponse.successResponse(
        res,
        200,
        "Prescription Retrived Successfully.",
        prescription
      );
    } catch (error) {
      console.error("Error Retriving Prescription:", error);
      next(error);
    }
  }

  static async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const { id } = req.params;

      await PrescriptionService.delete(id);

      return apiResponse.successResponse(
        res,
        200,
        "Prescription Deleted Successfully."
      );
    } catch (error) {
      console.error("Error Deleting Prescription:", error);
      next(error);
    }
  }

  static async viewAll(
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

      const data = await PrescriptionService.getAllPrescriptions(req.queryOpts, filters);

      return apiResponse.successResponse(
        res,
        200,
        "Prescriptions Retrived Successfully.",
        data
      );
    } catch (error) {
      console.error("Error Retriving Prescriptions:", error);
      next(error);
    }
  }
}
export default PrescriptionController;