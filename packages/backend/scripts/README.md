# Bulk Alt Text Generator

This script automates the process of generating alt text for multiple images using Google's Gemini API.

## Prerequisites

- Node.js installed
- A valid Gemini API key
- Images to process in the `images` directory

## Setup

1. Create a `.env.development.local` file in the `packages/backend` directory with your Gemini API key:

   ```
   GEMINI_API_KEY=your_api_key_here
   ```

2. Place your images in the `packages/backend/scripts/images` directory

## Usage

Run the script using:

```bash
npm run bulk-generate
```

The script will:

1. Clean any existing entries in the output CSV file
2. Scan the images directory for unprocessed images
3. Generate alt text for each image using Gemini API
4. Save the results to `alt-text-output.csv`

## Output

The script generates a CSV file (`alt-text-output.csv`) with the following columns:

- Image filename
- Generated alt text

## Error Handling

- The script will exit with an error if the Gemini API key is not found
- Failed image processing will be logged but won't stop the entire process
- The script maintains a record of processed images to avoid duplicates
