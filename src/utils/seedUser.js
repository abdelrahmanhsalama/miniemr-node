require("dotenv").config();
const pool = require("../db/pool");
const bcrypt = require("bcrypt");

async function seedUser(username, email, password, name, role) {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      "INSERT INTO users (username, email, password_hash, name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [username, email, passwordHash, name, role],
    );
    return rows[0];
  } catch (error) {
    console.log(error);
  }
}

async function doSeeding(username, email, password, name, role) {
  const seededUser = await seedUser(username, email, password, name, role);
  console.log(seededUser);
}

doSeeding("admin", "admin@emr.com", "Admin123", "Admin", "admin");
