import { useState } from "react";
import {
  ImageUpload,
  GenerateButton,
  AltTextDisplay,
  Footer,
  UrlInput,
} from "./components";
import {
  fileToBase64,
  generateAltTextApi,
  generateAltTextFromUrlApi,
} from "./utils";

type InputMethod = "upload" | "url";

function App() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [altText, setAltText] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [inputMethod, setInputMethod] = useState<InputMethod>("upload");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileUpload = (file: File) => {
    if (file.type.startsWith("image/")) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setAltText(null); // Clear any existing alt text
      setPreviewUrl(null); // Clear any existing URL
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    setAltText(null);
  };

  const handleGenerateAltTextFromUpload = async () => {
    if (!image) return;

    try {
      setIsGenerating(true);
      setAltText("Generating alt text...");

      const base64Image = await fileToBase64(image);
      const generatedAltText = await generateAltTextApi(
        base64Image,
        image.type
      );

      setAltText(generatedAltText);
    } catch (error) {
      console.error("Error generating alt text:", error);
      setAltText("Error generating alt text. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUrlSubmit = async (url: string) => {
    try {
      setIsGenerating(true);
      setAltText("Generating alt text...");
      setPreviewUrl(url);

      // Clear any existing uploaded image
      setImage(null);
      setImagePreview(null);

      const generatedAltText = await generateAltTextFromUrlApi(url);
      setAltText(generatedAltText);
    } catch (error) {
      console.error("Error generating alt text from URL:", error);
      setAltText(
        "Error generating alt text. Please check the URL and try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const renderInputMethod = () => {
    if (inputMethod === "upload") {
      return (
        <>
          <ImageUpload
            imagePreview={imagePreview}
            onFileUpload={handleFileUpload}
            onRemoveImage={handleRemoveImage}
          />

          <GenerateButton
            hasImage={!!image}
            isGenerating={isGenerating}
            onGenerate={handleGenerateAltTextFromUpload}
          />
        </>
      );
    } else {
      return (
        <>
          <UrlInput onUrlSubmit={handleUrlSubmit} isDisabled={isGenerating} />

          {previewUrl && (
            <div className="mt-4 p-4 border border-gray-200 rounded-lg dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Image URL Preview:
              </h3>
              <img
                src={previewUrl}
                alt="URL Preview"
                className="max-h-64 mx-auto rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    // Fallback SVG image for when the URL image fails to load
                    // Shows a gray rectangle with "Image Load Error" text
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFRUVFRUUiLz48dGV4dCB4PSI0MCIgeT0iMTAwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY2NjY2NiI+SW1hZ2UgTG9hZCBFcnJvcjwvdGV4dD48L3N2Zz4=";
                }}
              />
            </div>
          )}
        </>
      );
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Image Alt Text Generator
      </h1>

      <div className="w-full max-w-md space-y-6">
        <div className="flex border-b border-gray-300 dark:border-gray-700 mb-4">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              inputMethod === "upload"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => {
              setInputMethod("upload");
              setPreviewUrl(null);
            }}
          >
            Upload Image
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              inputMethod === "url"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => {
              setInputMethod("url");
              setImage(null);
              setImagePreview(null);
            }}
          >
            Image URL
          </button>
        </div>

        {renderInputMethod()}

        <AltTextDisplay altText={altText} />
      </div>
      <Footer />
    </div>
  );
}

export default App;
