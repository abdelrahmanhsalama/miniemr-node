import { Router } from "express";
import { addIdRole } from "../middlewares/addIdRole.js";
import { checkRoles } from "../middlewares/checkRoles.js";
import { validatePatient } from "../utils/validations.js";
import { validateReq } from "../middlewares/validateReq.js";
import {
  createPatient,
  getOnePatient,
  getPatients,
  updatePatient,
} from "../controllers/patientsController.js";

export const patientsRouter = Router();

patientsRouter.post(
  "/",
  addIdRole,
  checkRoles("admin", "admission"),
  validatePatient,
  validateReq,
  createPatient,
);

patientsRouter.get(
  "/",
  addIdRole,
  checkRoles("admin", "admission", "doctor"),
  getPatients,
);

patientsRouter.get("/:mrn", getOnePatient);

patientsRouter.put(
  "/:id",
  addIdRole,
  checkRoles("admin", "admission"),
  validatePatient,
  validateReq,
  updatePatient,
);
