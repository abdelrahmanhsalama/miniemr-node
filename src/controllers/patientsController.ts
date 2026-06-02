import { AppError } from "../utils/AppError.js";
import { Request, Response, NextFunction } from "express";
import {
  createPatientQuery,
  getOnePatientQuery,
  getPatientsQuery,
  queryPatientsQuery,
  updatePatientQuery,
} from "../db/patientsQueries.js";
import { RequestIdRole } from "../utils/types.js";

export async function createPatient(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { firstName, lastName, nationalId, dob, gender, phone } = req.body;

    await createPatientQuery(
      firstName.trim(),
      lastName.trim(),
      nationalId.trim(),
      dob.trim(),
      gender,
      phone.trim(),
    );

    return res.json({
      success: true,
    });
  } catch (error: any) {
    if (error.code == 23505) {
      return res.status(400).json({
        success: false,
        message: "Patient (National ID) already in database",
      });
    }
    next(error);
  }
}

export async function getPatients(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    let patients;
    const q = req.query.q;

    if (!q) {
      patients = await getPatientsQuery();
      return res.json({
        success: true,
        data: { patients },
      });
    }

    if (typeof q !== "string") {
      throw new AppError("Invalid query parameter", 400);
    } else {
      patients = await queryPatientsQuery(q);
      return res.json({
        success: true,
        data: { patients },
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function getOnePatient(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { mrn } = req.params;

    const patient = await getOnePatientQuery(Number(mrn));

    res.json({ success: true, data: { patient } });
  } catch (error) {
    next(error);
  }
}

export async function updatePatient(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id: patient_id } = req.params;
    const { firstName, lastName, nationalId, dob, gender, phone } = req.body;

    await updatePatientQuery(
      firstName.trim(),
      lastName.trim(),
      nationalId.trim(),
      dob.trim(),
      gender,
      phone.trim(),
      (req as RequestIdRole).userId,
      Number(patient_id),
    );

    return res.json({
      success: true,
    });
  } catch (error: any) {
    if (error.code == 23505) {
      return res.status(400).json({
        success: false,
        message: "National ID already in database",
      });
    }
    next(error);
  }
}
