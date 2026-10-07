// =========================================================
//  User model  —  the ONLY place user SQL lives.
//  - Real, final queries. No stubs, no mocks.
//  - Dormant until MySQL is installed — but correct now.
//  - Every query uses ? placeholders (SQL-injection safe).
// =========================================================

import { dbQuery } from "../config/db.js";

// ---------------------------------------------------------
//  Type shape for a user row (matches the DB schema)
// ---------------------------------------------------------
export interface UserRow {
  id: number;
  name: string;
  email: string;
  role: string;
}

// ---------------------------------------------------------
//  1. Find a user by email  —  used by LOGIN
//     Returns the row (including password_hash) or null.
// ---------------------------------------------------------
export async function findUserByEmail(email: string): Promise<any | null> {
  const rows = await dbQuery(
    "SELECT id, name, email, password_hash, role FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  return rows.length ? rows[0] : null;
}

// ---------------------------------------------------------
//  2. Create a new user  —  used by REGISTER
//     Returns the new user's id.
// ---------------------------------------------------------
export async function createUser(
  name: string,
  email: string,
  passwordHash: string,
  role: string = "user"
): Promise<number> {
  await dbQuery(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
    [name, email, passwordHash, role]
  );
  const rows = await dbQuery(
    "SELECT LAST_INSERT_ID() AS id"
  );
  return rows[0].id;
}

// ---------------------------------------------------------
//  3. Find a user by id  —  used when a token only has id
// ---------------------------------------------------------
export async function findUserById(id: number): Promise<any | null> {
  const rows = await dbQuery(
    "SELECT id, name, email, role FROM users WHERE id = ? LIMIT 1",
    [id]
  );
  return rows.length ? rows[0] : null;
}

// ---------------------------------------------------------
//  4. Check if an email already exists  —  register guard
// ---------------------------------------------------------
export async function emailExists(email: string): Promise<boolean> {
  const rows = await dbQuery(
    "SELECT id FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  return rows.length > 0;
}