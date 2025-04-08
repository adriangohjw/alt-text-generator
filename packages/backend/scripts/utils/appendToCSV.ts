import { ImageResult } from "../types";
import fs from "fs";
import { stringify } from "csv-stringify/sync";

interface AppendToCSVOptions {
  result: ImageResult;
  outputFile: string;
}

export function appendToCSV({ result, outputFile }: AppendToCSVOptions): void {
  const row = [[result.imageName, result.altText || ""]];
  const csvString = stringify(row, { header: false });
  fs.appendFileSync(outputFile, csvString);
}
