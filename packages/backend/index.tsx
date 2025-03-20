import { ExportedHandler, ExecutionContext } from "@cloudflare/workers-types";
import { generateAltText } from "./altTextGenerationService";
import { validateEnvironment, EnvironmentConfig } from "./config";

// Define the interface for Cloudflare Workers environment
interface Env {
  [key: string]: unknown;
  GEMINI_API_KEY?: string;
}

// Define the interface for the request JSON body
interface AltTextRequest {
  imageData: string;
  isUrl?: boolean;
}

// Define a type for blob-like objects with arrayBuffer method
interface BlobLike {
  arrayBuffer(): Promise<ArrayBuffer>;
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
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle OPTIONS request (preflight request)
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Only allow POST requests
    if (request.method !== "POST") {
      return new Response("Method not allowed", {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "text/plain" },
      });
    }

    try {
      // Check for URL query parameter - we'll handle this with POST
      const url = new URL(request.url);
      const imageUrl = url.searchParams.get("url");

      if (imageUrl) {
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
        const altText = await generateAltText(
          base64Image,
          config.GEMINI_API_KEY
        );

        // Return the generated alt text
        return new Response(JSON.stringify({ altText, sourceUrl: imageUrl }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // If no URL parameter, check content type
      const contentType = request.headers.get("Content-Type") || "";

      // Handle different request content types
      if (contentType.includes("application/json")) {
        const requestData = (await request.json()) as AltTextRequest;

        if (!requestData.imageData) {
          return new Response("Missing imageData in request body", {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "text/plain" },
          });
        }

        // Generate alt text using the service
        const altText = await generateAltText(
          requestData.imageData,
          config.GEMINI_API_KEY,
          requestData.isUrl || false
        );

        // Return the generated alt text
        return new Response(JSON.stringify({ altText }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } else if (contentType.includes("multipart/form-data")) {
        const formData = await request.formData();
        const imageFile = formData.get("image");

        if (!imageFile) {
          return new Response("No image file uploaded", {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "text/plain" },
          });
        }

        // Check if it's a file or blob-like object with arrayBuffer method
        if (typeof imageFile !== "object" || !("arrayBuffer" in imageFile)) {
          return new Response("Uploaded item is not a valid file", {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "text/plain" },
          });
        }

        // Convert the image to base64
        const arrayBuffer = await (imageFile as BlobLike).arrayBuffer();
        const base64Image = btoa(
          String.fromCharCode(...new Uint8Array(arrayBuffer))
        );

        // Generate alt text using the service
        const altText = await generateAltText(
          base64Image,
          config.GEMINI_API_KEY
        );

        // Return the generated alt text
        return new Response(JSON.stringify({ altText }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } else {
        return new Response("Unsupported content type", {
          status: 415,
          headers: { ...corsHeaders, "Content-Type": "text/plain" },
        });
      }
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
