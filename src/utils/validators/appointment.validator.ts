import Joi, { ValidationResult } from "joi";
import { Request } from "express";
import { validationOption } from ".";
import { AppointmentStatus } from "../enums/appointment-status.enum";


class AppointmentValidator {
  private validatorOption = validationOption;

  public createSchema = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      patientId: Joi.string()
        .required()
        .label("Patient ID")
        .messages({
          "string.empty": "Patient ID is required",
          "any.required": "Patient ID required",
        }),
      reason: Joi.string()
        .required()
        .label("Reason")
        .messages({
          "string.empty": "Reason is required",
          "any.required": "Reason is required",
        }),
      date_and_time: Joi.string()
        .required()
        .label("Date And Time")
        .messages({
          "string.empty": "Date And Time is required",
          "any.required": "Date And Time is required",
        })
    });

    return schema.validate(req.body, this.validatorOption);
  };

  public updateSchema = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      reason: Joi.string()
        .label("Reason")
        .messages({
          "string.empty": "Reason is required",
        }),
      status: Joi.string()
        .valid(...Object.values(AppointmentStatus))
        .label("Status")
        .messages({
          "string.empty": "status is required",
        }),
      date_and_time: Joi.string()
        .label("Date And Time")
        .messages({
          "string.empty": "Date And Time is required",
        }),
      patientId: Joi.string()
        .required()
        .label("Date And Time")
        .messages({
          "string.empty": "Date And Time is required",
        }),
      doctorId: Joi.string()
        .label("Date And Time")
        .messages({
          "string.empty": "Date And Time is required",
        })
    });

    return schema.validate(req.body, this.validatorOption);
  };
}

export default new AppointmentValidator();