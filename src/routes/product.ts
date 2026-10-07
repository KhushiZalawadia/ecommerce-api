// =========================================================
//  Product routes  —  URL  →  middleware  →  controller
//
//  ⚠ SECURITY NOTE: the middlewares on each line ARE the
//     authorization boundary. isAuth = any logged-in user.
//     isAdmin = admin only. Change one name, you change
//     the security of that endpoint.
// =========================================================

import express from "express";
import { isAuth, isAdmin } from "../middlewares/auth.js";
import { list, getOne, create, update, remove } from "../controllers/product.js";

const router = express.Router();

// ---------------------------------------------------------
//  READ  —  any logged-in user (isAuth)
// ---------------------------------------------------------
router.get("/", isAuth, list);          // GET    /api/product
router.get("/:id", isAuth, getOne);     // GET    /api/product/:id

// ---------------------------------------------------------
//  WRITE  —  admin only (isAdmin)   ← the security boundary
// ---------------------------------------------------------
router.post("/", isAdmin, create);        // POST   /api/product
router.put("/:id", isAdmin, update);      // PUT    /api/product/:id
router.delete("/:id", isAdmin, remove);   // DELETE /api/product/:id

export default router;