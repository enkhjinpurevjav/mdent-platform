import express from "express";
import cors from "cors";
import pino from "pino";
import pinoHttp from "pino-http";
import dotenv from "dotenv";
import { randomUUID } from "crypto";

dotenv.config();

export function createServer() {
  const app = express();
  const logger = pino({ level: process.env.LOG_LEVEL || "info" });

  app.use(pinoHttp({ logger }));
  app.use(cors());
  app.use(express.json());

  // Request ID
  app.use((req, _res, next) => {
    (req as any).requestId = randomUUID();
    next();
  });

  app.get("/health", (_req, res) => res.json({ status: "ok", ts: new Date().toISOString() }));

  // Auth stub
  app.post("/internal/auth/login", (_req, res) => {
    res.json({ token: "dev-token" });
  });

  // Public stub
  app.get("/public/branches", (_req, res) => {
    res.json([{ id: "default-branch", name: "Main Branch" }]);
  });

  // Error handler
  app.use((err: any, _req: any, res: any, _next: any) => {
    logger.error({ err }, "Unhandled error");
    res.status(err.status || 500).json({ error: err.message || "Internal Error" });
  });

  return app;
}
