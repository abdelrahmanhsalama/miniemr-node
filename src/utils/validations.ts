import { body, param } from "express-validator";

export const validateLogin = [
  body("username")
    .notEmpty()
    .withMessage("Username required")
    .isString()
    .withMessage("Username must be a string"),
  body("password")
    .notEmpty()
    .withMessage("Password required")
    .isString()
    .withMessage("Password must be a string"),
];

export const validateCreateAccount = [
  body("name")
    .notEmpty()
    .withMessage("Name required")
    .isString()
    .withMessage("Name must be a string")
    .matches(/^[a-zA-Z0-9.\- ]+$/)
    .withMessage(
      "Name can only contain letters, numbers, periods (dots), hyphens, and spaces",
    ),
  body("username")
    .notEmpty()
    .withMessage("Username required")
    .isString()
    .withMessage("Username must be a string")
    .isLength({ min: 4, max: 32 })
    .withMessage("Username must be 4-32 characters long")
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage(
      "Username can only contain letters, numbers, underscores, periods (dots) and hyphens",
    ),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must contain at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
    .withMessage(
      "Password must include at least 1 uppercase letter, 1 lowercase letter , and 1 number",
    ),
  body("role")
    .notEmpty()
    .withMessage("Role required")
    .isIn(["admin", "doctor", "nurse", "admission"])
    .withMessage("Role must be admin, doctor, nurse or admission"),
];

export const validateUpdateAccount = [
  param("id").notEmpty().withMessage("ID required"),
  body("name")
    .notEmpty()
    .withMessage("Name required")
    .isString()
    .withMessage("Name must be a string")
    .matches(/^[a-zA-Z0-9.\- ]+$/)
    .withMessage(
      "Name can only contain letters, numbers, periods (dots), hyphens, and spaces",
    ),
  body("username")
    .notEmpty()
    .withMessage("Username required")
    .isString()
    .withMessage("Username must be a string")
    .isLength({ min: 4, max: 32 })
    .withMessage("Username must be 4-32 characters long")
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage(
      "Username can only contain letters, numbers, underscores, periods (dots) and hyphens",
    ),
  body("role")
    .notEmpty()
    .withMessage("Role required")
    .isIn(["admin", "doctor", "nurse", "admission"])
    .withMessage("Role must be admin, doctor, nurse or admission"),
];

export const validateUpdatePasswordByAdmin = [
  param("id").notEmpty().withMessage("ID required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must contain at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
    .withMessage(
      "Password must include at least 1 uppercase letter, 1 lowercase letter , and 1 number",
    ),
];

export const validateReverseActivation = [
  param("id").notEmpty().withMessage("ID required"),
];

export const validatePatient = [
  body("firstName")
    .notEmpty()
    .withMessage("First name required")
    .isString()
    .withMessage("Name must be a string")
    .matches(/^[a-zA-Z0-9.\- ]+$/)
    .withMessage(
      "First name can only contain letters, numbers, periods (dots) and hyphens",
    ),
  body("lastName")
    .notEmpty()
    .withMessage("Last name required")
    .isString()
    .withMessage("Name must be a string")
    .matches(/^[a-zA-Z0-9.\- ]+$/)
    .withMessage(
      "Last mame can only contain letters, numbers, periods (dots) and hyphens",
    ),
  body("nationalId")
    .notEmpty()
    .withMessage("National ID required")
    .isString()
    .withMessage("National ID must be a string")
    .matches(/^\d{14}$/)
    .withMessage("National ID must be a 14-digit number"),
  body("dob")
    .notEmpty()
    .withMessage("Date of birth required")
    .isString()
    .withMessage("Date of bith must be a string")
    .matches(/^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])$/)
    .withMessage("Date of birth must follow this format: YYYY-MM-DD"),
  body("gender")
    .notEmpty()
    .withMessage("Gender required")
    .isIn(["male", "female"])
    .withMessage("Gender must be male or female"),
  body("phone")
    .notEmpty()
    .withMessage("Phone required")
    .isString()
    .withMessage("Phone must be a string")
    .matches(/^01\d{9}$/)
    .withMessage("Phone must be follow this format: 01XXXXXXXXX"),
];

export const validateDeletePatient = [
  param("id")
    .notEmpty()
    .withMessage("Patient ID required")
    .isInt()
    .withMessage("Patient ID must be an integer"),
];

export const validateUserChangePassword = [
  body("oldPassword")
    .notEmpty()
    .withMessage("Old password required")
    .isString()
    .withMessage("Old password must be a string"),
  body("newPassword")
    .notEmpty()
    .withMessage("New password required")
    .isString()
    .withMessage("New password must be a string")
    .isLength({ min: 8 })
    .withMessage("Password must contain at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
    .withMessage(
      "Password must include at least 1 uppercase letter, 1 lowercase letter, and 1 number",
    )
    .custom((value, { req }) => {
      if (value === req.body.oldPassword) {
        throw new Error("New password must be different from old password");
      }
      return true;
    }),

  body("confirmNewPassword")
    .notEmpty()
    .withMessage("Confirm password required")
    .isString()
    .withMessage("Confirm password must be a string")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords must match");
      }
      return true;
    }),
];
