/**
 * Request utility functions for the API server
 *
 * This file contains functions for validating and processing images
 * from URLs provided in POST request bodies.
 */

import {
  handleMissingParam,
  handleImageFetchError,
  handleInvalidContentType,
} from "./errorHandlers";

/**
 * Validates the image URL and fetches the image
 *
 * @param imageUrl The URL of the image to fetch (provided in POST request body)
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
    return { success: false, response: handleMissingParam("imageUrl") };
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
  const uint8Array = new Uint8Array(buffer);
  let binaryString = "";
  const chunkSize = 8192; // Process in 8KB chunks to avoid stack overflow

  // Process the array in chunks
  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.slice(i, i + chunkSize);
    binaryString += String.fromCharCode.apply(null, Array.from(chunk));
  }

  return btoa(binaryString);
}
