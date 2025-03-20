import { ExportedHandler, ExecutionContext } from "@cloudflare/workers-types";
import { generateAltText } from "./altTextGenerationService";
import { validateEnvironment, EnvironmentConfig } from "./config";

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

    // CORS headers for cross-origin requests
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle OPTIONS request (preflight request)
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Only allow GET requests
    if (request.method !== "GET") {
      return new Response(
        "Method not allowed. Use GET with a URL query parameter.",
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "text/plain" },
        }
      );
    }

    try {
      // Get image URL from the query parameter
      const url = new URL(request.url);
      const imageUrl = url.searchParams.get("url");

      // If no URL parameter provided, return an error
      if (!imageUrl) {
        return new Response("Missing 'url' query parameter", {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "text/plain" },
        });
      }

      // Download the image from the provided URL
      console.log("Downloading image from URL:", imageUrl);
      const imageResponse = await fetch(imageUrl);
      console.log("Image response:", imageResponse);

      if (!imageResponse.ok) {
        return new Response(
          `Failed to fetch image: ${imageResponse.statusText}`,
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "text/plain" },
          }
        );
      }

      // Check if the response is an image
      const contentType = imageResponse.headers.get("Content-Type") || "";
      if (!contentType.startsWith("image/")) {
        return new Response("The URL does not point to a valid image", {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "text/plain" },
        });
      }

      // Convert the image to base64
      const arrayBuffer = await imageResponse.arrayBuffer();
      const base64Image = btoa(
        String.fromCharCode(...new Uint8Array(arrayBuffer))
      );

      // Generate alt text using the service
      const altText = await generateAltText({
        imageData: base64Image,
        contentType,
        apiKey: config.GEMINI_API_KEY,
      });

      // Return the generated alt text
      return new Response(JSON.stringify({ altText, sourceUrl: imageUrl }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error generating alt text:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return new Response(`Error generating alt text: ${errorMessage}`, {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "text/plain" },
      });
    }
  },
} satisfies ExportedHandler<Env>;
