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
 * Generates alt text for an image
 * @param imageData Base64 image data
 * @param contentType MIME type of the image
 * @returns A promise that resolves to the generated alt text
 */
export async function generateAltTextApi(
  imageData: string,
  contentType: string
): Promise<string> {
  const response = await fetch("/api/generate-alt-text", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      imageData,
      contentType,
    }),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.altText;
}
