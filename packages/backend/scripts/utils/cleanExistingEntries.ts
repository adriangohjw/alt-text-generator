import fs from "fs";

interface GetExistingValidEntriesOptions {
  outputFile: string;
}

export function cleanExistingEntries({
  outputFile,
}: GetExistingValidEntriesOptions): void {
  const existingEntries: Set<string> = new Set();

  if (!fs.existsSync(outputFile)) {
    return;
  }

  const csvContent = fs.readFileSync(outputFile, "utf-8");
  const lines = csvContent.split("\n");

  const validEntries: string[] = [];
  validEntries.push(lines[0]); // Keep the header row

  // Process the rest of the lines
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const [imageName, altText] = line.split(",");
    if (altText === "undefined") continue;
    existingEntries.add(imageName);
    validEntries.push(line);
  }

  // Overwrite the CSV with only valid entries
  fs.writeFileSync(outputFile, validEntries.join("\n"));
}
