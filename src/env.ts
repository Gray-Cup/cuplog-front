import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
 
export const env = createEnv({
  server: {
    // BetterAuth
    BETTER_AUTH_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(1),
    // Database
    DATABASE_URL: z.string().min(1),
    // Google
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    // Bucket0 S3 (required for file uploads)
    BUCKET0_ACCESS_KEY_ID: z.string().min(1).optional(),
    BUCKET0_SECRET_ACCESS_KEY: z.string().min(1).optional(),
    BUCKET0_BUCKET_NAME: z.string().min(1).optional(),
  },
  client: {},
  experimental__runtimeEnv: {},
});
