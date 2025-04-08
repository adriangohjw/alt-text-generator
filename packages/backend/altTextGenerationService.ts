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

const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries: number = 3
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // If response is successful, return it immediately
      if (response.ok) {
        return response;
      }

      // If we get a 503 error, we'll retry with backoff
      if (response.status === 503) {
        const errorText = await response.text();
        lastError = new Error(
          `Gemini API error (${response.status}): ${errorText}`
        );

        // Use fixed backoff times: 1s, 3s, 5s
        const backoffTimes = [1000, 3000, 5000];
        const backoffTime = backoffTimes[attempt] || 5000; // Default to 5s if attempt is out of bounds
        console.log(
          `Attempt ${
            attempt + 1
          }/${maxRetries} failed with 503. Retrying in ${backoffTime}ms...`
        );

        // Wait before retrying
        await sleep(backoffTime);
        continue;
      }

      // For other errors, throw immediately
      const errorText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errorText}`);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // If it's not the last attempt, wait and retry
      if (attempt < maxRetries - 1) {
        const backoffTime = Math.pow(2, attempt) * 1000;
        console.log(
          `Attempt ${
            attempt + 1
          }/${maxRetries} failed. Retrying in ${backoffTime}ms...`
        );
        await sleep(backoffTime);
      }
    }
  }

  // If we've exhausted all retries, throw the last error
  throw (
    lastError ||
    new Error("Failed to get response from Gemini API after multiple attempts")
  );
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
    // Make request to Gemini API with retry logic
    const response = await fetchWithRetry(
      `${GEMINI_API_ENDPOINT}?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    // Parse the response
    const data = (await response.json()) as GeminiResponse;

    // Extract the generated text from the response
    if (
      data.candidates &&
      data.candidates[0]?.content?.parts &&
      data.candidates[0].content.parts[0]?.text
    ) {
      let text = data.candidates[0].content.parts[0].text.trim();

      // Remove double quotes if they wrap the entire text
      if (text.startsWith('"') && text.endsWith('"')) {
        text = text.slice(1, -1);
      }

      return text;
    } else {
      throw new Error("Could not extract alt text from Gemini API response");
    }
  } catch (error) {
    console.error("Alt text generation failed:", error);
    throw error;
  }
}
