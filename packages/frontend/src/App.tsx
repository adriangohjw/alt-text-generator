import { useState } from "react";
import {
  ImageUpload,
  GenerateButton,
  AltTextDisplay,
  Footer,
} from "./components";
import { fileToBase64, generateAltTextApi } from "./utils";

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
      <Footer />
    </div>
  );
}

export default App;
