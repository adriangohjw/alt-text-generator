/**
 * HTTP middleware utilities for the API server
 *
 * This file contains middleware functions for handling common HTTP operations
 * such as CORS headers and request method validation.
 */

// CORS headers for cross-origin requests
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/**
 * Handles OPTIONS request (preflight request)
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

/**
 * Validates that the request method is GET
 *
 * @param request The incoming request
 * @returns Error response if method is not GET, null otherwise
 */
export function validateGetMethod(request: Request): Response | null {
  if (request.method !== "GET") {
    return new Response(
      "Method not allowed. Use GET with a URL query parameter.",
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "text/plain" },
      }
    );
  }
  return null;
}
