import { ExportedHandler, ExecutionContext } from "@cloudflare/workers-types";
import { generateAltText } from "./altTextGenerationService";
import { validateEnvironment, EnvironmentConfig } from "./config";
import { handleEnvironmentError, handleServerError } from "./errorHandlers";
import {
  corsHeaders,
  handleOptionsRequest,
  validateGetMethod,
} from "./middleware";
import {
  extractImageUrl,
  validateAndFetchImage,
  arrayBufferToBase64,
} from "./requestUtils";

// Define the interface for Cloudflare Workers environment
interface Env {
  [key: string]: unknown;
  GEMINI_API_KEY?: string;
}

// Define the interface for the POST request body
interface GenerateAltTextRequest {
  imageData: string;
  contentType: string;
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
      // Handle POST requests with base64 image data
      try {
        // Parse the request body
        const body = (await request.json()) as GenerateAltTextRequest;
        const { imageData, contentType } = body;

        if (!imageData || !contentType) {
          return new Response(
            JSON.stringify({ error: "Missing imageData or contentType" }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // Generate alt text using the service with the base64 image data
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
    } else if (method === "GET") {
      // Validate that the request method is GET
      const methodCheckResponse = validateGetMethod(request);
      if (methodCheckResponse) return methodCheckResponse;

      try {
        // Extract and validate the image URL
        const imageUrl = extractImageUrl(request);

        // Validate and fetch the image
        const fetchResult = await validateAndFetchImage(imageUrl);
        if (!fetchResult.success) {
          return fetchResult.response;
        }

        // Convert the image to base64
        const base64Image = arrayBufferToBase64(fetchResult.arrayBuffer);

        // Generate alt text using the service
        const altText = await generateAltText({
          imageData: base64Image,
          contentType: fetchResult.contentType,
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
      return new Response("Method not allowed", {
        status: 405,
        headers: { ...corsHeaders },
      });
    }
  },
} satisfies ExportedHandler<Env>;
