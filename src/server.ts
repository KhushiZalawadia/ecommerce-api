// =========================================================
//  The web server entry point.
//  - Boots Express
//  - Mounts CORS + JSON body parsing
//  - Reports DB status gracefully (MySQL may be pending)
//  - Exposes  GET /health  and  GET /
// =========================================================

import express from "express";
import cors from "cors";
import { Port } from "./config/env.js";
import { dbPing, dbTestConnection } from "./config/db.js";
import { ok } from "./utils/responds.js";
import { swaggerHtmlPage } from "./swagger.js";
import  { openapiYaml } from "./openapi.js";
import authRouter from "./routes/auth.js";
import productRouter from "./routes/product.js";

const app = express();

// ---------------------------------------------------------
// 1. Global middlewares
// ---------------------------------------------------------
app.use(express.json());   // parse JSON request bodies (built-in in Express 5)
app.use(cors());           // allow browsers from any origin

// ---------------------------------------------------------
// 2. Routes that do NOT touch the DB
// ---------------------------------------------------------
app.get("/", (req, res) => {
  res.json(ok({ service: "eCommerce API", version: "1.0.0" }, "API is alive"));
});

app.get("/health", async (req, res) => {
  const dbUp = await dbPing();
  res.json(ok(
    { server: "up", database: dbUp ? "connected" : "deferred-not-installed" },
    "Service health check"
  ));
});

app.get("/swagger", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(swaggerHtmlPage());
});

app.get("/openapi.yaml", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(openapiYaml());
});
app.use("/api/auth", authRouter);
app.use("/api/product", productRouter);
// ---------------------------------------------------------
// 3. Start listening
// ---------------------------------------------------------
app.listen(Port, async () => {
  const dbUp = await dbPing();
  console.log(`=======================================`);
  console.log(`  eCommerce API running on port ${Port}`);
  console.log(`  DB: ${dbUp ? "connected" : "not reachable yet (fine, deferred)"}`);
  console.log(`  Health: [http://localhost:${Port}/health]`);
  console.log(`=======================================`);
});

async function startServer() {
  await dbTestConnection();
  console.log('Server started');
}

startServer();