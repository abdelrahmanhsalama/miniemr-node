import { pool } from "./pool.js";

export async function createPatientQuery(
  name: string,
  nationalId: string,
  dob: string,
  gender: string,
  phone: string,
) {
  const { rows } = await pool.query(
    "INSERT INTO patients (name, national_id, dob, gender, phone) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [name, nationalId, dob, gender, phone],
  );
  return rows[0] ?? null;
}

export async function getPatientsQuery() {
  const { rows } = await pool.query(
    "SELECT id, mrn, name, dob, gender, phone, active_visit, national_id FROM patients ORDER BY id",
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

export async function updatePatientQuery(
  name: string,
  nationalId: string,
  dob: string,
  gender: string,
  phone: string,
  userId: number,
  patientId: number,
) {
  const { rows } = await pool.query(
    "UPDATE patients SET name = $1, national_id = $2, dob = $3, gender = $4, phone = $5, updated_by = $6, updated_at = now() WHERE id = $7 RETURNING *",
    [name, nationalId, dob, gender, phone, userId, patientId],
  );
  return rows[0] ?? null;
}
