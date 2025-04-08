export interface ImageResult {
  imageName: string;
  altText: string | undefined;
}

export const contentTypeMap: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
} as const;

export const fileExtensions = Object.keys(contentTypeMap);
export const contentTypes = Object.values(contentTypeMap);
