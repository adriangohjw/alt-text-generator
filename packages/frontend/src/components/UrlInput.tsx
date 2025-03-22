import { useState, FormEvent } from "react";

interface UrlInputProps {
  onUrlSubmit: (url: string) => void;
  isDisabled: boolean;
}

export function UrlInput({ onUrlSubmit, isDisabled }: UrlInputProps) {
  const [url, setUrl] = useState<string>("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onUrlSubmit(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col">
        <label
          htmlFor="imageUrl"
          className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Image URL
        </label>
        <input
          id="imageUrl"
          type="url"
          placeholder="https://example.com/image.jpg"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isDisabled}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-60 disabled:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        />
      </div>
      <button
        type="submit"
        disabled={!url.trim() || isDisabled}
        className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:bg-blue-400 transition-colors hover:cursor-pointer disabled:cursor-default"
      >
        Generate from URL
      </button>
    </form>
  );
}
