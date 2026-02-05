import { envData } from "@src/config/env";

// Mocking Prisma to allow server to start without a generated client or database
export const prisma = new Proxy({} as any, {
  get: (target, prop) => {
    return async () => {
      console.warn(
        `⚠️ Prisma method "${String(prop)}" called but database is not connected/initialized.`,
      );
      return null;
    };
  },
});

export const connectDatabase = async () => {
  console.log(
    "ℹ️ Skipping real database connection (Prisma is mocked to allow Speech-to-Text to work).",
  );
};
