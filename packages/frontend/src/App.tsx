import { useState, useEffect } from "react";
import {
  ImageUpload,
  GenerateButton,
  AltTextDisplay,
  Footer,
  UrlInput,
  InputMethodTabs,
  ApiKeyInput,
} from "./components";
import {
  fileToBase64,
  generateAltTextApi,
  generateAltTextFromUrlApi,
} from "./utils";
import { InputMethod } from "./types";

function App() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [altText, setAltText] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [inputMethod, setInputMethod] = useState<InputMethod>("upload");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>("");

  // Load API key from localStorage on initial load
  useEffect(() => {
    const savedApiKey = localStorage.getItem("geminiApiKey");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  // Save API key to localStorage whenever it changes
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem("geminiApiKey", apiKey);
    } else {
      localStorage.removeItem("geminiApiKey");
    }
  }, [apiKey]);

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
    if (!image || !apiKey) return;

    try {
      setIsGenerating(true);
      setAltText("Generating alt text...");

      const base64Image = await fileToBase64(image);
      const generatedAltText = await generateAltTextApi(
        base64Image,
        image.type,
        apiKey
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
    if (!apiKey) {
      // Don't set altText for API key missing error
      // Instead, just return early
      return;
    }

    try {
      setIsGenerating(true);
      setAltText("Generating alt text...");
      setPreviewUrl(url);

      // Clear any existing uploaded image
      setImage(null);
      setImagePreview(null);

      const generatedAltText = await generateAltTextFromUrlApi(url, apiKey);
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

  const handleSelectInputMethod = (method: InputMethod) => {
    switch (method) {
      case "upload":
        setInputMethod("upload");
        setPreviewUrl(null);
        setAltText(null);
        break;
      case "url":
        setInputMethod("url");
        setImage(null);
        setImagePreview(null);
        setAltText(null);
        break;
      default: {
        const exhaustiveCheck: never = method;
        throw new Error(`Unsupported input method: ${exhaustiveCheck}`);
      }
    }
  };

  const handleApiKeyChange = (newApiKey: string) => {
    setApiKey(newApiKey);
  };

  const renderInputMethod = () => {
    switch (inputMethod) {
      case "upload":
        return (
          <>
            <ImageUpload
              imagePreview={imagePreview}
              onFileUpload={handleFileUpload}
              onRemoveImage={handleRemoveImage}
              isGenerating={isGenerating}
            />

            <GenerateButton
              hasImage={!!image && !!apiKey}
              isGenerating={isGenerating}
              onGenerate={handleGenerateAltTextFromUpload}
            />
          </>
        );
      case "url":
        return (
          <>
            <UrlInput
              onUrlSubmit={handleUrlSubmit}
              isDisabled={isGenerating || !apiKey}
            />

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
      default: {
        const exhaustiveCheck: never = inputMethod;
        throw new Error(`Unsupported input method: ${exhaustiveCheck}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
        Image Alt Text Generator
      </h1>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">
        Demo app for API deployed on Cloudflare Worker
      </p>

      <div className="w-full max-w-md space-y-6">
        <ApiKeyInput apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />

        <InputMethodTabs
          inputMethod={inputMethod}
          onSelectMethod={handleSelectInputMethod}
        />

        {renderInputMethod()}

        {altText && <AltTextDisplay altText={altText} />}
      </div>
      <Footer />
    </div>
  );
}

export default App;
