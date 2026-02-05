import { z } from "zod";

// Pagination Schema - reusable for all list endpoints
export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => {
      const num = val ? Number.parseInt(val, 10) : 1;
      return Number.isNaN(num) || num < 1 ? 1 : num;
    }),
  limit: z
    .string()
    .optional()
    .transform((val) => {
      const num = val ? Number.parseInt(val, 10) : 10;
      if (Number.isNaN(num) || num < 1) return 10;
      return num > 100 ? 100 : num;
    }),
});

export const idSchema = z.object({
  id: z
    .string()
    .uuid("Invalid UUID format")
    .transform((val) => {
      if (!val) throw new Error("ID is required");
      return val;
    }),
});

