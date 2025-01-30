import Joi, { ValidationResult } from "joi";
import { Request } from "express";
import { validationOption } from ".";


class AuthValidator {
  private validatorOption = validationOption;

  public registerSchema = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      email: Joi.string()
        .email()
        .required()
        .label("Email")
        .messages({
          "string.empty": "Email is required",
          "any.required": "Email is required",
        }),
      name: Joi.string()
        .required()
        .label("Name")
        .messages({
          "string.empty": "Name is required",
          "any.required": "Name is required",
        }),
      password: Joi.string()
        .min(8)
        .required()
        .label("Password")
        .messages({
          "string.empty": "Password is required",
          "string.min": "Password must be at least {{#limit}} characters long",
        }),
      specialization: Joi.string().label("Specialization").allow(null, ""),
      date_of_birth: Joi.string().label("Date Of Birth").allow(null, ""),
      address: Joi.string().label("Address").allow(null, ""),
    });

    return schema.validate(req.body, this.validatorOption);
  };

  public loginSchema = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      email: Joi.string()
        .email()
        .required()
        .label("Email")
        .messages({
          "string.empty": "Email is required",
          "any.required": "Email is required",
        }),
      password: Joi.string()
        .required()
        .label("Password")
        .messages({
          "string.empty": "Password is required",
          "any.required": "Password is required",
        })
    });

    return schema.validate(req.body, this.validatorOption);
  };

  public changePasswordSchema = (req: Request): ValidationResult => {
    const schema = Joi.object().keys({
      old_password: Joi.string()
        .label("Old Password")
        .min(8)
        .required()
        .messages({
          "string.empty": "Old Password is required",
          "any.required": "Old Password is required",
          "string.min": "Old Password must be at least 8 characters long",
        }),
      new_password: Joi.string()
        .label("Password")
        .min(8)
        .required()
        .messages({
          "string.empty": "New Password is required",
          "any.required": "New Password is required",
          "string.min": "New Password must be at least 8 characters long",
        }),
      confirm_new_password: Joi.string().label("Confirm New Password")
        .min(8)
        .required()
        .valid(Joi.ref('new_password'))
        .messages({
          "string.empty": "Confirm Password is required",
          "any.required": "Confirm Password is required",
          "any.only": "Your passwords don't match. Please try again",
          "string.min": "Password must be at least 8 characters long",
        })
    });

    return schema.validate(req.body, this.validatorOption);
  };
}

export default new AuthValidator();