// =========================================================
//  Auth routes  —  URL  →  controller
//  /api/auth/register   →  POST  →  register
//  /api/auth/login      →  POST  →  login
// =========================================================

import express from "express";
import { register, login } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

export default router;