import { pool } from "./pool.js";

export async function getUserByUsernameQuery(username: string) {
  const { rows } = await pool.query(
    "SELECT id, password_hash, is_active, role FROM users WHERE username = $1",
    [username],
  );
  return rows[0] ?? null;
}

export async function getUserByIdQuery(userId: number) {
  const { rows } = await pool.query(
    "SELECT username, role, is_active, password_hash FROM users WHERE id = $1",
    [userId],
  );
  return rows[0] ?? null;
}

export async function refreshRefreshTokenQuery(
  userId: number,
  newRefreshToken: string,
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query("DELETE FROM refresh_tokens WHERE user_id = $1", [
      userId,
    ]);

    const result = await client.query(
      "INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2) RETURNING id",
      [userId, newRefreshToken],
    );

    await client.query("COMMIT");

    return result.rows[0] ?? null;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function checkRefreshTokenQuery(refreshToken: string) {
  const { rows } = await pool.query(
    "SELECT user_id FROM refresh_tokens WHERE token = $1",
    [refreshToken],
  );
  return rows[0] ?? null;
}

export async function deleteRefreshTokenQuery(userId: number) {
  await pool.query("DELETE FROM refresh_tokens WHERE user_id = $1", [userId]);
}

export async function updatePasswordByUserQuery(
  userId: number,
  newPasswordHash: string,
) {
  await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
    newPasswordHash,
    userId,
  ]);
}
