import { ValidationOptions } from "joi";

export const validationOption: ValidationOptions = {
  errors: {
    wrap: {
      label: "",
    },
  },
  abortEarly: false,
};