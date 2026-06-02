import { pool } from "./pool.js";

export async function createPatientQuery(
  firstName: string,
  lastName: string,
  nationalId: string,
  dob: string,
  gender: string,
  phone: string,
) {
  const { rows } = await pool.query(
    "INSERT INTO patients (f_name, l_name, national_id, dob, gender, phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [firstName, lastName, nationalId, dob, gender, phone],
  );
  return rows[0] ?? null;
}

export async function getPatientsQuery() {
  const { rows } = await pool.query(
    "SELECT id, mrn, f_name, l_name, dob, gender, phone, active_visit, national_id FROM patients ORDER BY id",
  );
  return rows;
}

export async function queryPatientsQuery(query: string) {
  const { rows } = await pool.query(
    "SELECT id, mrn, name, dob, gender, phone, active_visit, national_id FROM patients WHERE name ILIKE $1 ORDER BY id",
    [`%${query}%`],
  );
  return rows;
}

export async function getOnePatientQuery(mrn: number) {
  const { rows } = await pool.query(
    "SELECT id, mrn, f_name, l_name, dob, gender, phone, active_visit, national_id FROM patients WHERE mrn = $1",
    [mrn],
  );
  return rows[0] ?? null;
}

export async function updatePatientQuery(
  firstName: string,
  lastName: string,
  nationalId: string,
  dob: string,
  gender: string,
  phone: string,
  userId: number,
  patientId: number,
) {
  const { rows } = await pool.query(
    "UPDATE patients SET f_name = $1, l_name = $2, national_id = $3, dob = $4, gender = $5, phone = $6, updated_by = $7, updated_at = now() WHERE id = $8 RETURNING *",
    [firstName, lastName, nationalId, dob, gender, phone, userId, patientId],
  );
  return rows[0] ?? null;
}
