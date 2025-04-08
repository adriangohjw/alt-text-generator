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
  const files = fs.readdirSync(inputFolder);
  return files.filter((file: string) => {
    const ext = path.extname(file).toLowerCase();
    return fileExtensions.includes(ext);
  });
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
