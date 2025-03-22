import { ExportedHandler, ExecutionContext } from "@cloudflare/workers-types";
import { generateAltText } from "./altTextGenerationService";
import { validateEnvironment, EnvironmentConfig } from "./config";
import { handleEnvironmentError, handleServerError } from "./errorHandlers";
import { corsHeaders, handleOptionsRequest } from "./middleware";
import { validateAndFetchImage, arrayBufferToBase64 } from "./requestUtils";

/**
 * Alt Text Generator API
 *
 * This API provides functionality to generate alt text for images.
 * It supports two methods of image input:
 * 1. Direct upload: Send base64-encoded image data with content type
 * 2. URL reference: Send a URL to an image that the service will fetch and process
 *
 * All requests must use the POST method.
 */

// Define the interface for Cloudflare Workers environment
interface Env {
  [key: string]: unknown;
  GEMINI_API_KEY?: string;
}

/**
 * Interface for the POST request body
 *
 * The request must include EITHER:
 * - imageData (base64) and contentType, OR
 * - imageUrl
 */
interface GenerateAltTextRequest {
  imageData?: string;
  contentType?: string;
  imageUrl?: string;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    // Validate environment configuration
    let config: EnvironmentConfig;
    try {
      config = validateEnvironment(env);
    } catch (error) {
      return handleEnvironmentError(error);
    }

    // Handle OPTIONS requests (CORS preflight)
    const optionsResponse = handleOptionsRequest(request);
    if (optionsResponse) return optionsResponse;

    // Check request method
    const method = request.method;

    if (method === "POST") {
      try {
        // Parse the request body
        const body = (await request.json()) as GenerateAltTextRequest;
        let imageData: string;
        let contentType: string;

        // Case 1: Direct base64 image data provided
        if (body.imageData && body.contentType) {
          imageData = body.imageData;
          contentType = body.contentType;
        }
        // Case 2: Image URL provided
        else if (body.imageUrl) {
          // Validate and fetch the image from URL
          const fetchResult = await validateAndFetchImage(body.imageUrl);
          if (!fetchResult.success) {
            return fetchResult.response;
          }

          // Convert the image to base64
          imageData = arrayBufferToBase64(fetchResult.arrayBuffer);
          contentType = fetchResult.contentType;
        } else {
          return new Response(
            JSON.stringify({
              error:
                "Missing required parameters. Provide either imageData+contentType or imageUrl",
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // Generate alt text using the service
        const altText = await generateAltText({
          imageData,
          contentType,
          apiKey: config.GEMINI_API_KEY,
        });

        // Return the generated alt text
        return new Response(JSON.stringify({ altText }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (error) {
        return handleServerError(error);
      }
    } else {
      // Method not allowed
      return new Response(
        "Method not allowed. Use POST to send image data or image URL.",
        {
          status: 405,
          headers: { ...corsHeaders },
        }
      );
    }
  },
} satisfies ExportedHandler<Env>;
