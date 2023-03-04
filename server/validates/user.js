import validate from "validate.js";
import { ROLES } from "../constants.js";
import sendError from "../utils/sendError.js";

export const validateUser = (req, res, next) => {
  // Get data from request body
  const { address, email, firstName, lastName, password, phone, role } =
    req.body;

  // The properties to validate
  const attributes = {
    address,
    email,
    firstName,
    lastName,
    password,
    phone,
    role,
  };

  // Check that the request body data meets the specified constraints
  const constraints = {
    address: {
      presence: true,
    },
    email: {
      presence: true,
      email: true,
    },
    firstName: {
      presence: true,
    },
    lastName: {
      presence: true,
    },
    password: {
      presence: true,
      length: {
        minimum: 8,
      },
      format: {
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
        message:
          "must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
      },
    },
    phone: {
      presence: true,
      format: {
        pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
        message: "must be a valid phone number",
      },
    },
    role: {
      inclusion: {
        within: ROLES,
      },
    },
  };

  // Find errors
  const errors = validate(attributes, constraints);

  // Check if errors occur
  if (errors) {
    sendError(res, errors);
  } else {
    next();
  }
};