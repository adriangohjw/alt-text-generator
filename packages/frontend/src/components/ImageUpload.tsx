import { useRef, DragEvent, ChangeEvent } from "react";

interface ImageUploadProps {
  imagePreview: string | null;
  onFileUpload: (file: File) => void;
  onRemoveImage: () => void;
}

const ImageUpload = ({
  imagePreview,
  onFileUpload,
  onRemoveImage,
}: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      onFileUpload(file);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onFileUpload(file);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer 
        ${
          imagePreview
            ? "border-green-500"
            : "border-gray-300 hover:border-gray-400"
        } 
        transition-colors duration-200`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      {imagePreview ? (
        <div className="space-y-4">
          <img
            src={imagePreview}
            alt="Preview"
            className="max-h-64 mx-auto rounded-lg"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveImage();
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Remove Image
          </button>
        </div>
      ) : (
        <div className="py-4">
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            Click to upload or drag and drop
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Supports: JPG, PNG, GIF
          </p>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInputChange}
      />
    </div>
  );
};

export default ImageUpload;
