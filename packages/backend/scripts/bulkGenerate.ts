import * as fs from "fs";
import * as path from "path";
import { generateAltText } from "../altTextGenerationService";
import dotenv from "dotenv";

// Load environment variables from .env.development.local
const environmentFilePath = path.resolve(
  __dirname,
  "../.env.development.local"
);
dotenv.config({ path: environmentFilePath });

if (!process.env.GEMINI_API_KEY) {
  console.error("Error: GEMINI_API_KEY is required in .env.development.local");
  process.exit(1);
}

// folder containing your images, relative to this script
const INPUT_FOLDER = path.resolve(__dirname, "./images");

// where to save the CSV relative to this script
const OUTPUT_FILE = path.resolve(__dirname, "./alt-text-output.csv");

interface ImageResult {
  imageName: string;
  altText: string | undefined;
}

const contentTypeMap: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
} as const;

async function processImage(imagePath: string): Promise<ImageResult> {
  try {
    // Read image file and convert to base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");

    // Determine content type based on file extension
    const ext = path
      .extname(imagePath)
      .toLowerCase() as keyof typeof contentTypeMap;
    const contentType = contentTypeMap[ext] || "image/jpeg";

    // Generate alt text
    const altText = await generateAltText({
      imageData: base64Image,
      contentType,
      apiKey: process.env.GEMINI_API_KEY as string,
    });

    return {
      imageName: path.basename(imagePath),
      altText,
    };
  } catch (error) {
    console.error(`Error processing ${imagePath}:`, error);
    return {
      imageName: path.basename(imagePath),
      altText: undefined,
    };
  }
}

async function main() {
  try {
    // Create CSV file with headers
    fs.writeFileSync(OUTPUT_FILE, "Image Name,Alt Text\n");

    // Get all image files from the input folder
    const files = fs.readdirSync(INPUT_FOLDER);
    const imageFiles = files.filter((file: string) => {
      const ext = path.extname(file).toLowerCase();
      return [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext);
    });

    console.log(`Found ${imageFiles.length} images to process`);

    // Process each image and append to CSV
    for (const file of imageFiles) {
      console.log(`Processing ${file}...`);
      const imagePath = path.join(INPUT_FOLDER, file);
      const result = await processImage(imagePath);

      // Escape any commas in the alt text and wrap in quotes if needed
      const escapedAltText = result.altText?.includes(",")
        ? `"${result.altText?.replace(/"/g, '""')}"`
        : result.altText;

      // Append to CSV file
      fs.appendFileSync(OUTPUT_FILE, `${result.imageName},${escapedAltText}\n`);
    }

    console.log(`Successfully generated CSV file: ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
