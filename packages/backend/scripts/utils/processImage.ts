import { generateAltText } from "../../altTextGenerationService";
import { ImageResult } from "../types";
import { getContentType } from "./getContentType";
import { imageToBase64 } from "./imageToBase64";
import path from "path";

export async function processImage(imagePath: string): Promise<ImageResult> {
  try {
    const base64Image = imageToBase64(imagePath);
    const contentType = getContentType(imagePath);
    const imageName = path.basename(imagePath);

    console.log(`Processing ${imageName}...`);

    const altText = await generateAltText({
      imageData: base64Image,
      contentType,
      apiKey: process.env.GEMINI_API_KEY as string,
    });

    console.log(`✓ Successfully generated alt text for ${imageName}`);

    return {
      imageName,
      altText,
    };
  } catch (error) {
    console.error(`❌ Error processing ${path.basename(imagePath)}:`, error);
    return {
      imageName: path.basename(imagePath),
      altText: undefined,
    };
  }
}
