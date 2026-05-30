import { Router } from "express";
import {
  validateLogin,
  validateUserChangePassword,
} from "../utils/validations.js";
import { validateReq } from "../middlewares/validateReq.js";
import {
  loginToAccount,
  logoutFromAccount,
  refreshAccessToken,
  updatePasswordByUser,
} from "../controllers/authController.js";
import { addIdRole } from "../middlewares/addIdRole.js";

export const authRouter = Router();

authRouter.post("/login", validateLogin, validateReq, loginToAccount);
authRouter.post("/refresh", refreshAccessToken);
authRouter.post("/logout", logoutFromAccount);
authRouter.put(
  "/change-password",
  addIdRole,
  validateUserChangePassword,
  validateReq,
  updatePasswordByUser,
);
