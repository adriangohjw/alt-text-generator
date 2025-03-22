interface GenerateButtonProps {
  hasImage: boolean;
  isGenerating: boolean;
  onGenerate: () => void;
}

export function GenerateButton({
  hasImage,
  isGenerating,
  onGenerate,
}: GenerateButtonProps) {
  return (
    <button
      disabled={!hasImage || isGenerating}
      onClick={onGenerate}
      className={`w-full py-3 rounded-lg font-medium text-white 
        ${
          !hasImage || isGenerating
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
        } 
        transition-colors duration-200`}
    >
      {isGenerating ? "Generating..." : "Generate Alt Text"}
    </button>
  );
}
