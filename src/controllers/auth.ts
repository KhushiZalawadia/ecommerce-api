// =========================================================
//  Auth controllers  —  register + login
//  - Validation with zod  (never trust req.body raw)
//  - Passwords hashed with bcrypt  (never stored plain)
//  - Login returns a JWT  (never returns password_hash)
// =========================================================

import bcrypt from "bcrypt";
import { z } from "zod";
import { ok, fail } from "../utils/responds.js";
import { newToken } from "../utils/jwt.js";
import { createUser, findUserByEmail, emailExists } from "../models/user.js";

// ---------------------------------------------------------
//  Validation schemas  —  the gate before any logic runs.
// ---------------------------------------------------------
const RegisterSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  role: z.string().optional(),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// =========================================================
//  REGISTER
// =========================================================
export async function register(req: any, res: any) {
  // 1. Validate the body.
  const parsed = RegisterSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(fail("Validation failed", parsed.error));
  }

  const name = parsed.data.name;
  const email = parsed.data.email;
  const password = parsed.data.password;
  const role = parsed.data.role === "admin" ? "admin" : "user";

  try {
     // 2. Email must be free.
  if (await emailExists(email)) {
    return res.status(409).json(fail("Email already registered"));
  }

  // 3. Hash the password — NEVER store the plain one.
  const passwordHash = await bcrypt.hash(password, 10);

  // 4. Write the user.
  const newId = await createUser(name, email, passwordHash, role);

  // 5. Response — NO hash, ever.
  return res.json(
    ok({ id: newId, name, email, role }, "Registered successfully")
  );
  } catch (error) {
  console.error('REGISTER DB ERROR:', error);
  return res.status(500).json({
    success: false,
    message: 'Register failed',
    error: error instanceof Error ? error.message : String(error),
  });
}
 
}

// =========================================================
//  LOGIN
// =========================================================
export async function login(req: any, res: any) {
  // 1. Validate the body.
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(fail("Validation failed", parsed.error));
  }

  const email = parsed.data.email;
  const password = parsed.data.password;

  // 2. Find the user.
  const user = await findUserByEmail(email);
 try{
   if (!user) {
    // Note: same message as a wrong password — see "Why" below.
    return res.status(401).json(fail("Invalid credentials"));
  }

  // 3. Compare the pass.
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    return res.status(401).json(fail("Invalid credentials"));
  }

  // 4. Mint the token from the MINIMAL payload.
  const token = newToken(user.id, user.email, user.role);

  // 5. Response — token ONLY. No hash, no other row internals.
  return res.json(ok({ token }, "Login successful"));
 }
  catch (error) {
  console.error('LOGIN DB ERROR:', error);
  return res.status(500).json({
    success: false,
    message: 'Login failed',
    error: error instanceof Error ? error.message : String(error),
    
  });
}
}