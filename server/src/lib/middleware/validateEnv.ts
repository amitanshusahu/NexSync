import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();

const envSchema = z.object({
  JWT_SECRET: z.string().nonempty('SECRET must be provided'),
});

export const env = envSchema.parse(process.env);