import { ResponseSuccess } from "@utils/response-format";
import type { Request, Response } from "express";
import * as fs from "fs";
import { transcribeAudioService } from "./speech.service";
import { audioFileSchema } from "./speech.validate";

// Extend Request to include multer's file property
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const speechController = {
  transcribeAudio,
};

async function transcribeAudio(req: MulterRequest, res: Response) {
  // Use Zod validation instead of manual check
  audioFileSchema.parse({ file: req.file });

  const filePath = req.file!.path;

  try {
    console.log(
      `ไฟล์: ${req.file!.originalname}, saved to: ${filePath}, mimetype: ${req.file!.mimetype}`,
    );

    // Determine audio encoding based on file type
    let encoding: "LINEAR16" | "WEBM_OPUS" = "LINEAR16";
    if (
      req.file!.mimetype.includes("webm") ||
      req.file!.originalname.endsWith(".webm")
    ) {
      encoding = "WEBM_OPUS";
    }

    // Call the transcription service
    const transcription = await transcribeAudioService(filePath, encoding);

    // Clean up the uploaded file
    fs.unlinkSync(filePath);

    // Send success response
    ResponseSuccess(res, { transcription });
  } catch (error) {
    console.error("Error processing audio:", error);

    // Clean up file even on error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Send error response
    res.status(500).json({ error: "Failed to transcribe audio." });
  }
}

export default speechController;
