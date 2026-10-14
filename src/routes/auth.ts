// =========================================================
//  Auth routes  —  URL  →  controller
//  /api/auth/register   →  POST  →  register
//  /api/auth/login      →  POST  →  login
// =========================================================

import express from "express";
import { register, login } from "../controllers/auth.js";

const router = express.Router();

// Here we are not passing any middleware to the route handlers, which means that these endpoints are publicly accessible and do not require authentication. This is appropriate for registration and login endpoints, as users need to be able to access them without being logged in.
router.post("/register", register);
router.post("/login", login);

export default router;