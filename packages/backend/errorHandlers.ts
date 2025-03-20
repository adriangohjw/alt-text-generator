/**
 * Error handling utilities for the API server
 *
 * This file contains functions for handling different types of errors
 * and converting them to appropriate HTTP responses.
 */

import { corsHeaders } from "./middleware";

/**
 * Handles environment configuration errors
 *
 * @param error The error that occurred during environment validation
 * @returns Response with appropriate error message and status code
 */
export function handleEnvironmentError(error: unknown): Response {
  return new Response(
    `Server configuration error: ${
      error instanceof Error ? error.message : "Unknown error"
    }`,
    {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    }
  );
}

/**
 * Handles missing query parameters
 *
 * @param paramName The name of the missing parameter
 * @returns Response with appropriate error message and status code
 */
export function handleMissingParam(paramName: string): Response {
  return new Response(`Missing '${paramName}' query parameter`, {
    status: 400,
    headers: { ...corsHeaders, "Content-Type": "text/plain" },
  });
}

/**
 * Handles image fetch errors
 *
 * @param statusText The status text from the failed fetch
 * @returns Response with appropriate error message and status code
 */
export function handleImageFetchError(statusText: string): Response {
  return new Response(`Failed to fetch image: ${statusText}`, {
    status: 400,
    headers: { ...corsHeaders, "Content-Type": "text/plain" },
  });
}

/**
 * Handles invalid content type errors
 *
 * @returns Response with appropriate error message and status code
 */
export function handleInvalidContentType(): Response {
  return new Response("The URL does not point to a valid image", {
    status: 400,
    headers: { ...corsHeaders, "Content-Type": "text/plain" },
  });
}

/**
 * Handles general server errors during request processing
 *
 * @param error The error that occurred during request processing
 * @returns Response with appropriate error message and status code
 */
export function handleServerError(error: unknown): Response {
  console.error("Error generating alt text:", error);

  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  return new Response(`Error generating alt text: ${errorMessage}`, {
    status: 500,
    headers: { ...corsHeaders, "Content-Type": "text/plain" },
  });
}
