// =========================================================
//  Auth middleware
//  - Reads  Authorization: Bearer <token>
//  - Verifies the token
//  - Attaches req.user  (id, email, role)
//  - isAuth  : any valid token
//  - isAdmin : valid token AND role = admin
// =========================================================

import { verifyToken } from "../utils/jwt.js";
import { fail } from "../utils/responds.js";

// ---------------------------------------------------------
//  1. Any logged-in user (user OR admin)
// ---------------------------------------------------------
export function isAuth(req: any, res: any, next: any): void {
  const header = req.headers.authorization;

  if (!header) {
    res.status(401).json(fail("No token provided — please log in"));
    return;
  }

  const user = verifyToken(header);

  if (!user) {
    res.status(401).json(fail("Invalid or expired token — please log in again"));
    return;
  }

  req.user = user;   // available to every route below
  next();            // pass control along
}

// ---------------------------------------------------------
//  2. Admin only
// ---------------------------------------------------------
export function isAdmin(req: any, res: any, next: any): void {
  const header = req.headers.authorization;

  if (!header) {
    res.status(401).json(fail("No token provided — please log in"));
    return;
  }

  const user = verifyToken(header);

  if (!user) {
    res.status(401).json(fail("Invalid or expired token — please log in again"));
    return;
  }

  if (user.role !== "admin") {
    res.status(403).json(fail("Admin privileges required"));
    return;
  }

  req.user = user;
  next();
}