import { useState } from "react";
import { SimpleToast } from "./SimpleToast";
import { GENERATING_ALT_TEXT_MESSAGE } from "../constants";

const CopyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <rect
      x="9"
      y="9"
      width="13"
      height="13"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <rect
      x="3"
      y="3"
      width="13"
      height="13"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

interface AltTextDisplayProps {
  altText: string | null;
}

export function AltTextDisplay({ altText }: AltTextDisplayProps) {
  const [showToast, setShowToast] = useState(false);

  if (!altText) return null;

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(altText);
      setShowToast(true);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 relative">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
        Generated Alt Text
      </h2>
      <p className="text-gray-700 dark:text-gray-300">{altText}</p>

      {altText && altText !== GENERATING_ALT_TEXT_MESSAGE && (
        <button
          className="mt-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 mr-2 cursor-pointer flex items-center gap-2"
          onClick={handleCopyToClipboard}
          type="button"
          aria-label="Copy to clipboard"
        >
          <CopyIcon />
          Copy to clipboard
        </button>
      )}

      {showToast && (
        <SimpleToast
          message="Copied to clipboard!"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
