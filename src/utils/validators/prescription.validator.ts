import Joi, { ValidationResult } from "joi";
import { Request } from "express";
import { validationOption } from ".";


class PrescriptionValidator {
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
      medication: Joi.string()
        .required()
        .label("Medication")
        .messages({
          "string.empty": "Medication is required",
          "any.required": "Medication is required",
        }),
      dosage: Joi.string()
        .required()
        .label("Dosage")
        .messages({
          "string.empty": "Dosage is required",
          "any.required": "Dosage is required",
        }),
      frequency: Joi.string()
        .required()
        .label("Frequency")
        .messages({
          "string.empty": "Frequency is required",
          "any.required": "Frequency is required",
        }),
      startDate: Joi.string()
        .required()
        .label("Start Date")
        .messages({
          "string.empty": "Start Date is required",
          "any.required": "Start Date is required",
        }),
      endDate: Joi.string()
        .required()
        .label("End Date")
        .messages({
          "string.empty": "End Date is required",
          "any.required": "End Date is required",
        }),
    });

    return schema.validate(req.body, this.validatorOption);
  };

  public updateSchema = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      medication: Joi.string()
        .label("Medication")
        .messages({
          "string.empty": "Medication is required",
        }),
      dosage: Joi.string()
        .label("Dosage")
        .messages({
          "string.empty": "Dosage is required",
        }),
      patientId: Joi.string()
        .label("Date And Time")
        .messages({
          "string.empty": "Patient Id is required",
        }),
      frequency: Joi.string()
        .label("Frequency")
        .messages({
          "string.empty": "Frequency is required",
        }),
      startDate: Joi.string()
        .label("Start Date")
        .messages({
          "string.empty": "Start Date is required",
        }),
      endDate: Joi.string()
        .label("End Date")
        .messages({
          "string.empty": "End Date is required",
        }),
    });

    return schema.validate(req.body, this.validatorOption);
  };
}

export default new PrescriptionValidator();