import * as path from "path";
import dotenv from "dotenv";
import {
  processImage,
  cleanExistingEntries,
  filterImagesToProcess,
  appendToCSV,
} from "./utils";

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

async function main() {
  try {
    cleanExistingEntries({ outputFile: OUTPUT_FILE });

    // Get all image files and filter out those that already have alt text
    const imagesToProcess = filterImagesToProcess({
      inputFolder: INPUT_FOLDER,
      csvFilePath: OUTPUT_FILE,
    });

    console.log(
      `Found ${imagesToProcess.length} images that need alt text generation`
    );

    // Process each image and append to CSV
    for (const file of imagesToProcess) {
      const imagePath = path.join(INPUT_FOLDER, file);
      const result = await processImage(imagePath);
      appendToCSV({ result, outputFile: OUTPUT_FILE });
    }

    console.log(`Successfully updated CSV file: ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
