interface AltTextDisplayProps {
  altText: string | null;
}

export function AltTextDisplay({ altText }: AltTextDisplayProps) {
  if (!altText) return null;

  return (
    <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
        Generated Alt Text
      </h2>
      <p className="text-gray-700 dark:text-gray-300">{altText}</p>
    </div>
  );
}
