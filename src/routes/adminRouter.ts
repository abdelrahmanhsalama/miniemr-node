import { Router } from "express";
import { checkRoles } from "../middlewares/checkRoles.js";
import {
  createUser,
  getUsers,
  reverseActivation,
  updatePasswordByAdmin,
  updateUser,
} from "../controllers/adminController.js";
import {
  validateCreateAccount,
  validateReverseActivation,
  validateUpdateAccount,
  validateUpdatePasswordByAdmin,
} from "../utils/validations.js";
import { validateReq } from "../middlewares/validateReq.js";
import { addIdRole } from "../middlewares/addIdRole.js";

export const adminRouter = Router();

adminRouter.get("/users", addIdRole, checkRoles("admin"), getUsers);
adminRouter.post(
  "/users",
  addIdRole,
  checkRoles("admin"),
  validateCreateAccount,
  validateReq,
  createUser,
);
adminRouter.put(
  "/users/:id",
  addIdRole,
  checkRoles("admin"),
  validateUpdateAccount,
  validateReq,
  updateUser,
);
adminRouter.put(
  "/users/password/:id",
  addIdRole,
  checkRoles("admin"),
  validateUpdatePasswordByAdmin,
  validateReq,
  updatePasswordByAdmin,
);
adminRouter.put(
  "/users/activation/:id",
  addIdRole,
  checkRoles("admin"),
  validateReverseActivation,
  validateReq,
  reverseActivation,
);
