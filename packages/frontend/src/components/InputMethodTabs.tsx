import { InputMethod } from "../types";

interface InputMethodTabsProps {
  inputMethod: InputMethod;
  onSelectMethod: (method: InputMethod) => void;
}

export function InputMethodTabs({
  inputMethod,
  onSelectMethod,
}: InputMethodTabsProps) {
  const tabs: { id: InputMethod; label: string }[] = [
    { id: "upload", label: "Upload Image" },
    { id: "url", label: "Image URL" },
  ];

  return (
    <div className="flex border-b border-gray-300 dark:border-gray-700 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`px-4 py-2 font-medium text-sm transition-colors duration-200 ${
            inputMethod === tab.id
              ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          }`}
          onClick={() => onSelectMethod(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
