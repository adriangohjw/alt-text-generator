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
 * @param apiKey - Google Gemini API Key
 * @param isUrl - Whether the imageData is a URL (true) or base64 data (false)
 * @returns Generated alt text as a string
 */
interface GenerateAltTextOptions {
  imageData: string;
  apiKey: string;
  isUrl?: boolean;
}

export async function generateAltText({
  imageData,
  apiKey,
  isUrl = false,
}: GenerateAltTextOptions): Promise<string> {
  // Prepare image data based on input type
  const imageContent = isUrl
    ? { uri: imageData }
    : {
        data: imageData,
        mimeType: "image/jpeg", // Adjust if you need to support other formats explicitly
      };

  // Create the request payload with the prompt and image
  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: GENERATE_ALT_TEXT_PROMPT,
          },
          { inline_data: imageContent },
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
