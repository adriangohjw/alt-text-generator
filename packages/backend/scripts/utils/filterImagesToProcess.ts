import path from "path";
import fs from "fs";
import { fileExtensions } from "../types";
import { parse } from "csv-parse/sync";

interface FilterImagesToProcessOptions {
  inputFolder: string;
  csvFilePath: string;
}

export function filterImagesToProcess({
  inputFolder,
  csvFilePath,
}: FilterImagesToProcessOptions): string[] {
  const imageFiles = getImageFiles(inputFolder);
  const existingEntries = getExistingEntries(csvFilePath);
  return imageFiles.filter((file) => !existingEntries.includes(file));
}

function getImageFiles(
  inputFolder: FilterImagesToProcessOptions["inputFolder"]
): string[] {
  const imageFiles: string[] = [];

  function traverseDirectory(dir: string, relativePath: string = "") {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const relativeItemPath = path.join(relativePath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Recursively traverse subdirectories
        traverseDirectory(fullPath, relativeItemPath);
      } else if (stat.isFile()) {
        // Check if it's an image file
        const ext = path.extname(item).toLowerCase();
        if (fileExtensions.includes(ext)) {
          imageFiles.push(relativeItemPath);
        }
      }
    }
  }

  traverseDirectory(inputFolder);
  return imageFiles;
}

function getExistingEntries(
  csvFilePath: FilterImagesToProcessOptions["csvFilePath"]
): string[] {
  if (!fs.existsSync(csvFilePath)) {
    return [];
  }

  try {
    const csvContent = fs.readFileSync(csvFilePath, "utf-8");
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    // Extract image names from the first column
    return records.map((record: any) => {
      // Get the first key of the record (which should be the image name)
      const keys = Object.keys(record);
      return keys.length > 0 ? record[keys[0]] : "";
    });
  } catch (error) {
    console.error("Error parsing CSV file:", error);
    return [];
  }
}
