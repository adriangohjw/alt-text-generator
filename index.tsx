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
  },
} satisfies ExportedHandler<Env>;
