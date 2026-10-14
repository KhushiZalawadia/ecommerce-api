// =========================================================
//  DB transport layer  —  the ONLY place the driver plugs in
//  Interface is FINAL. Driver wiring lands when MySQL does.
// =========================================================

// Notee: no import from "mysql2" yet — MySQL is not installed.
// When it is, only THIS file gets the real wiring. Nothing else moves.

import 'dotenv/config';
import mysql, { Pool } from 'mysql2/promise';

const pool: Pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'ecommerce_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ---------------------------------------------------------
//  1. The only query function controllers/models will use.
//     Guarantees the connection returns, even on error.
// ---------------------------------------------------------
export async function dbQuery<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const [rows] = await pool.execute(sql, params);
  return rows as T[];
}

// ---------------------------------------------------------
//  2. Health-check — never throws, returns true / false.
// ---------------------------------------------------------
export async function dbPing(): Promise<boolean> {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch {
    return false;
  }
}

export async function dbTestConnection(): Promise<void> {
  const [rows] = await pool.query('SELECT 1 AS ok');
  console.log('DB connected successfully:', rows);
}

export { pool };