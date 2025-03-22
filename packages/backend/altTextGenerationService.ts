import { GENERATE_ALT_TEXT_PROMPT, GEMINI_API_ENDPOINT } from "./constants";

/**
 * Alt Text Generation Service using Google Gemini 2.0 Flash API
 *
 * This service takes an image (as base64 or URL) and generates accessible alt text
 * using Google's Gemini 2.0 Flash model.
 */

interface GeminiResponse {
  candidates?: Array<{
    content: {
      parts: Array<{
        text?: string;
      }>;
    };
    finishReason?: string;
  }>;
  promptFeedback?: any;
}

/**
 * Generates alt text for an image using Google Gemini 2.0 Flash API
 *
 * @param imageData - Base64 encoded image data (without prefix) or URL to the image
 * @param contentType - The MIME type of the image data
 * @param apiKey - Google Gemini API Key
 * @returns Generated alt text as a string
 */
interface GenerateAltTextOptions {
  imageData: string;
  contentType: string;
  apiKey: string;
}

export async function generateAltText({
  imageData,
  contentType,
  apiKey,
}: GenerateAltTextOptions): Promise<string> {
  // Create the request payload with the prompt and image
  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: GENERATE_ALT_TEXT_PROMPT,
          },
          {
            inline_data: {
              data: imageData,
              mimeType: contentType,
            },
          },
        ],
      },
    ],
  };

  try {
    // Make request to Gemini API
    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    // Handle API error responses
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errorText}`);
    }

    // Parse the response
    const data = (await response.json()) as GeminiResponse;

    // Extract the generated text from the response
    if (
      data.candidates &&
      data.candidates[0]?.content?.parts &&
      data.candidates[0].content.parts[0]?.text
    ) {
      return data.candidates[0].content.parts[0].text.trim();
    } else {
      throw new Error("Could not extract alt text from Gemini API response");
    }
  } catch (error) {
    console.error("Alt text generation failed:", error);
    throw error;
  }
}
