/**
 * Environment Configuration
 *
 * This file provides a central place for accessing environment variables
 * with proper type safety and validation using Zod schema validation.
 */

import { z } from "zod";

// Define the environment schema using Zod
const environmentSchema = z.object({
  // API Keys with validation rules - now optional
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required").optional(),

  // Optional environment variables (example)
  // DEBUG: z.enum(['true', 'false']).optional().default('false'),

  // Add more environment variables as needed
});

// Export the type derived from the Zod schema
export type EnvironmentConfig = z.infer<typeof environmentSchema>;

/**
 * Validates and parses environment variables using Zod schema
 *
 * @param env - The environment object from Cloudflare Workers
 * @returns The validated environment configuration with proper types
 * @throws Error with detailed validation issues if environment is invalid
 */
export function validateEnvironment(
  env: Record<string, unknown>
): EnvironmentConfig {
  try {
    // Parse and validate the environment using the Zod schema
    const validatedEnv = environmentSchema.parse(env);
    return validatedEnv;
  } catch (error) {
    // Enhance error message for better debugging
    if (error instanceof z.ZodError) {
      const errorDetails = error.errors
        .map((err) => {
          const path = err.path.join(".");
          return `${path}: ${err.message}`;
        })
        .join("\n");

      throw new Error(
        `Environment validation failed:\n${errorDetails}\n\n` +
          `Make sure to set required variables using 'wrangler secret put VARIABLE_NAME'`
      );
    }

    // If it's not a Zod error, rethrow
    throw error;
  }
}
