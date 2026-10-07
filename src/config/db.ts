// =========================================================
//  DB transport layer  —  the ONLY place the driver plugs in
//  Interface is FINAL. Driver wiring lands when MySQL does.
// =========================================================

// Notee: no import from "mysql2" yet — MySQL is not installed.
// When it is, only THIS file gets the real wiring. Nothing else moves.

let pool: any = null;

// ---------------------------------------------------------
//  1. The only query function controllers/models will use.
//     Guarantees the connection returns, even on error.
// ---------------------------------------------------------
export async function dbQuery(sql: string, params: any[] = []): Promise<any> {
  if (!pool) {
    throw new Error(
      "MySQL not connected yet (install pending). dbQuery refused: " + sql
    );
  }
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(sql, params);
    return rows;
  } finally {
    conn.release();
  }
}

// ---------------------------------------------------------
//  2. Health-check — never throws, returns true / false.
// ---------------------------------------------------------
export async function dbPing(): Promise<boolean> {
  if (!pool) return false;
  try {
    const conn = await pool.getConnection();
    await conn.query("SELECT 1");
    conn.release();
    return true;
  } catch {
    return false;
  }
}