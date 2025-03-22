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
      className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:bg-blue-400 transition-colors hover:cursor-pointer disabled:cursor-default"
    >
      {isGenerating ? "Generating..." : "Generate Alt Text"}
    </button>
  );
}
