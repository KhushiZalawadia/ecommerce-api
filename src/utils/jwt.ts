// =========================================================
//  JWT helpers  —  the ONLY place tokens are signed/verified.
//  Access-token only (no refresh) per project decision.
// =========================================================

import jsonwebtoken from "jsonwebtoken";
import { JwtSecret } from "../config/env.js";

// ---------------------------------------------------------
//  1. Build the payload we store inside the token.
//     Keep it SMALL — anything here is visible to the client.
// ---------------------------------------------------------
export function newToken(userId: number, email: string, role: string): string {
  const payload = {
    sub: userId,
    email,
    role,
  };
  return jsonwebtoken.sign(payload, JwtSecret, { expiresIn: "1h" });
}

// ---------------------------------------------------------
//  2. Verify an incoming token.
//     Returns the payload on success, or null on any failure.
// ---------------------------------------------------------
export function verifyToken(token: string): any | null {
  try {
    const plain = token.startsWith("Bearer") ? token.slice(7) : token;
    return jsonwebtoken.verify(plain, JwtSecret);
  } catch {
    return null;
  }
}