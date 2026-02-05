import { SpeechClient } from "@google-cloud/speech";
import * as fs from "fs";

export async function transcribeAudioService(
  fileName: string,
  encoding?: "LINEAR16" | "WEBM_OPUS",
): Promise<string> {
  const client = new SpeechClient();

  // Read the local audio file and convert to base64
  const file = fs.readFileSync(fileName);
  const audioBytes = file.toString("base64");

  // Configure the audio and recognition settings
  const audio = {
    content: audioBytes,
  };

  const config = {
    encoding: encoding || "LINEAR16",
    // sampleRateHertz: 16000, // Optional: Can be auto-detected by Google Cloud
    languageCode: "lo-LA", // Lao language
  };

  const request = {
    audio: audio,
    config: config,
  };

  // Perform speech recognition
  const [response] = await client.recognize(request);

  console.log("response", response.results?.[0].alternatives);

  if (!response.results || response.results.length === 0) {
    return "No transcription results found.";
  }

  const transcription = response.results
    .map((result: any) =>
      result.alternatives ? result.alternatives[0].transcript : "",
    )
    .join("\n");

  return transcription;
}
