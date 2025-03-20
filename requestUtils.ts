/**
 * Request utility functions for the API server
 *
 * This file contains functions for extracting and validating parameters
 * from incoming requests.
 */

import {
  handleMissingParam,
  handleImageFetchError,
  handleInvalidContentType,
} from "./errorHandlers";

/**
 * Extracts the image URL from the request
 *
 * @param request The incoming request
 * @returns The image URL or null if not found
 */
export function extractImageUrl(request: Request): string | null {
  const url = new URL(request.url);
  return url.searchParams.get("url");
}

/**
 * Validates the image URL and fetches the image
 *
 * @param imageUrl The URL of the image to fetch
 * @returns A promise resolving to an object with image data or an error response
 */
export async function validateAndFetchImage(
  imageUrl: string | null
): Promise<
  | { success: true; arrayBuffer: ArrayBuffer; contentType: string }
  | { success: false; response: Response }
> {
  // If no URL parameter provided, return an error
  if (!imageUrl) {
    return { success: false, response: handleMissingParam("url") };
  }

  // Download the image from the provided URL
  const imageResponse = await fetch(imageUrl);

  if (!imageResponse.ok) {
    return {
      success: false,
      response: handleImageFetchError(imageResponse.statusText),
    };
  }

  // Check if the response is an image
  const contentType = imageResponse.headers.get("Content-Type") || "";
  if (!contentType.startsWith("image/")) {
    return { success: false, response: handleInvalidContentType() };
  }

  // Get the image data
  const arrayBuffer = await imageResponse.arrayBuffer();
  return { success: true, arrayBuffer, contentType };
}

/**
 * Converts an ArrayBuffer to a base64 string
 *
 * @param buffer The ArrayBuffer to convert
 * @returns A base64 encoded string
 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}
