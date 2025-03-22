import { useState } from "react";
import ImageUpload from "./components/ImageUpload";
import GenerateButton from "./components/GenerateButton";
import AltTextDisplay from "./components/AltTextDisplay";
import {
  fileToBase64,
  generateAltText as generateAltTextApi,
} from "./utils/imageUtils";

function App() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [altText, setAltText] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileUpload = (file: File) => {
    if (file.type.startsWith("image/")) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setAltText(null); // Clear any existing alt text
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    setAltText(null);
  };

  const handleGenerateAltText = async () => {
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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Alt Text Generator
      </h1>

      <div className="w-full max-w-md space-y-6">
        <ImageUpload
          imagePreview={imagePreview}
          onFileUpload={handleFileUpload}
          onRemoveImage={handleRemoveImage}
        />

        <GenerateButton
          hasImage={!!image}
          isGenerating={isGenerating}
          onGenerate={handleGenerateAltText}
        />

        <AltTextDisplay altText={altText} />
      </div>
    </div>
  );
}

export default App;
