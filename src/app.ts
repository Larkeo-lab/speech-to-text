// src/app.ts
import cors from "cors";
import express from "express";
import speechRouter from "./features/speech-to-text/speech.route";
import {
  errorMiddleware,
  errorNotFound,
} from "./shared/middleware/error-handler";
const app: express.Application = express();

// --- 1. Global Middlewares ---
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static("public")); // Serve static files from public folder

// --- 2. Routes ---

const ROUTES = "/api/v1";
app.use(`${ROUTES}/speech`, speechRouter);

// --- 3. Health Check ---
app.get(`${ROUTES}/health`, (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Smart ODSC Users Service is running!",
    timestamp: new Date().toISOString(),
  });
});

// --- 4. 404 Handler ---
app.use(errorNotFound);

// --- 5. Global Error Handler (Must be last) ---
app.use(errorMiddleware);

export default app;
