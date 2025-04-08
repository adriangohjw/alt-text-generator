import path from "path";
import { contentTypeMap } from "../types";

export function getContentType(imagePath: string): string {
  const ext = path
    .extname(imagePath)
    .toLowerCase() as keyof typeof contentTypeMap;
  return contentTypeMap[ext] || "image/jpeg";
}
