import { errorHandler } from "@src/shared/middleware/error-handler";
import { Router } from "express";
import multer from "multer";
import speechController from "./speech.controller";

const router: Router = Router();

// Configure Multer for file uploads
const upload = multer({ dest: "uploads/" });

// Speech-to-Text route
router.post(
  "/transcribe",
  upload.single("audio"),
  errorHandler(speechController.transcribeAudio),
);

export default router;
