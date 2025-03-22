import { useState, useRef, useEffect } from "react";

interface ApiKeyInputProps {
  apiKey: string;
  onApiKeyChange: (apiKey: string) => void;
}

export function ApiKeyInput({ apiKey, onApiKeyChange }: ApiKeyInputProps) {
  const [showApiKey, setShowApiKey] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLButtonElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        linkRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !linkRef.current.contains(event.target as Node)
      ) {
        setShowPopover(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="mb-1">
        <div className="flex items-center flex-wrap">
          <div className="flex items-center">
            <label
              htmlFor="apiKey"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Gemini API Key
            </label>
            <span className="ml-1 text-red-500">*</span>
          </div>
          <div className="flex-grow flex justify-end text-xs text-gray-500 dark:text-gray-400">
            <span>(</span>
            <a
              href="https://aistudio.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Get one from Google AI Studio
            </a>
            <span>)</span>
          </div>
        </div>
      </div>
      <div className="relative mt-2">
        <input
          id="apiKey"
          type={showApiKey ? "text" : "password"}
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          placeholder="Enter your Gemini API key"
          className="w-full p-2 pr-20 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          required
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
            aria-label={showApiKey ? "Hide API key" : "Show API key"}
            title={showApiKey ? "Hide API key" : "Show API key"}
          >
            {showApiKey ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
          </button>
          {apiKey && (
            <button
              type="button"
              onClick={() => onApiKeyChange("")}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
              aria-label="Clear API key"
              title="Clear API key"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
        <div className="relative">
          <button
            ref={linkRef}
            type="button"
            onClick={() => setShowPopover(!showPopover)}
            className="text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
          >
            Why do I need to provide my own API key?
          </button>
          {showPopover && (
            <div
              ref={popoverRef}
              className=" flex justify-center absolute z-10 left-0 mt-2 w-64 px-4 py-3 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600"
            >
              <img
                src="/queen.webp"
                alt="Queen meme"
                className="w-full max-w-[200px] h-auto rounded"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
