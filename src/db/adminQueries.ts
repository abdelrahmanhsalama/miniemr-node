import { pool } from "./pool.js";

export async function getUsersQuery() {
  const { rows } = await pool.query(
    "SELECT id, is_active, name, role, username FROM users ORDER BY id",
  );
  return rows;
}

export async function createUserQuery(
  name: string,
  username: string,
  passwordHash: string,
  role: string,
) {
  const { rows } = await pool.query(
    "INSERT INTO users (name, username, password_hash, role, is_active) VALUES ($1, $2, $3, $4, true) RETURNING *",
    [name, username, passwordHash, role],
  );
  return rows[0] ?? null;
}

export async function updateUserQuery(
  name: string,
  username: string,
  role: string,
  userId: number,
) {
  await pool.query(
    "UPDATE users SET name = $1, username = $2, role = $3 WHERE id = $4",
    [name, username, role, userId],
  );
}

export async function updatePasswordByAdminQuery(
  passwordHash: string,
  userId: number,
) {
  await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
    passwordHash,
    userId,
  ]);
}

export async function reverseActivationQuery(userId: number) {
  await pool.query("UPDATE users SET is_active = NOT is_active WHERE id = $1", [
    userId,
  ]);
}
