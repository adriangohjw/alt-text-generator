/**
 * Converts a file to a base64 string
 * @param file The file to convert
 * @returns A promise that resolves to a base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(",")[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Generates alt text for an image using base64 image data
 * @param imageData Base64 image data
 * @param contentType MIME type of the image
 * @param apiKey Optional Gemini API key
 * @returns A promise that resolves to the generated alt text
 */
export async function generateAltTextApi(
  imageData: string,
  contentType: string,
  apiKey?: string
): Promise<string> {
  const response = await fetch("/api/generate-alt-text", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      imageData,
      contentType,
      apiKey,
    }),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.altText;
}

/**
 * Generates alt text for an image using an image URL
 * @param imageUrl URL of the image to analyze
 * @param apiKey Optional Gemini API key
 * @returns A promise that resolves to the generated alt text
 */
export async function generateAltTextFromUrlApi(
  imageUrl: string,
  apiKey?: string
): Promise<string> {
  const response = await fetch("/api/generate-alt-text", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      imageUrl,
      apiKey,
    }),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.altText;
}
