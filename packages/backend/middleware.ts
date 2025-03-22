/**
 * HTTP middleware utilities for the API server
 *
 * This file contains middleware functions for handling common HTTP operations
 * such as CORS headers and request method validation.
 *
 * The API exclusively supports POST requests for image processing,
 * accepting either image uploads (base64+contentType) or image URLs.
 */

// CORS headers for cross-origin requests
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/**
 * Handles OPTIONS request (preflight request)
 * This is necessary for browsers to make cross-origin POST requests.
 *
 * @param request The incoming request
 * @returns Response with CORS headers if it's an OPTIONS request, null otherwise
 */
export function handleOptionsRequest(request: Request): Response | null {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
}
