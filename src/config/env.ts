import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("8080"),
  DATABASE_URL: z.string().default(""),
  JWT_SECRET: z.string().default("secret"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  JWT_REFRESH_SECRET: z.string().default("refresh_secret"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  NODE_ENV: z.enum(["DEV", "UAT", "PROD"]).default("DEV"),
  OTP_RATE_LIMIT_SECONDS: z.string().default("120"),
  OTP_EXPIRATION_MINUTES: z.string().default("10"),
  SMS_API_KEY: z.string().default(""),
  MAX_OTP_ATTEMPTS: z.string().default("5"),

  SMTP_USER: z.string().default(""),
  SMTP_PASSWORD: z.string().default(""),
  SMTP_HOST: z.string().default(""),
  SMTP_PORT: z.string().default(""),

  OTP_SERVICE_URL: z.string().default(""),

  // LTC
  LTC_API_KEY: z.string().default(""),

  COUNTRY_LAO: z.string().default(""),
  GOOGLE_APPLICATION_CREDENTIALS: z.string().default("./service-account.json"),
});

export const envData = envSchema.parse(process.env);
export type EnvDataType = z.infer<typeof envSchema>;
