# Alt Text Generator

A service that automatically generates accessible alt text for images using Google's Gemini 2.0 Flash AI model. This service provides a simple API endpoint that accepts images (either via direct upload or URL) and returns descriptive alt text suitable for improving web accessibility.

## Features

- Generates contextually relevant, descriptive alt text for any image
- Supports both image file uploads and image URLs
- Built as a Cloudflare Worker for global, low-latency deployment
- Simple API interface for easy integration with any frontend

## Setup and Configuration

### Prerequisites

- Node.js and npm
- A Google Gemini API key
- Cloudflare account (for deployment)

### Installation

1. Clone this repository
2. Install dependencies:

   ```
   npm install
   ```

3. Configure your Gemini API key:
   - Create a `.env.development.local` file in the root directory with the following content:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

### Running Locally

```
npm run dev
```

This will start the development server at `http://localhost:8787`.

### Deployment

```
npm run deploy
```

## API Usage

The API offers multiple ways to generate alt text for images, all using POST requests:

### 1. Using a URL query parameter

Send a POST request with the image URL as a query parameter:

```
POST https://your-worker-url.workers.dev/?url=https://example.com/path/to/image.jpg
```

The response will contain the generated alt text and the source URL:

```json
{
  "altText": "Generated description of the image...",
  "sourceUrl": "https://example.com/path/to/image.jpg"
}
```

### 2. Using JSON with base64 encoded image or URL

```bash
curl -X POST https://your-worker-url.workers.dev/ \
  -H "Content-Type: application/json" \
  -d '{
    "imageData": "your_base64_encoded_image_or_image_url",
    "isUrl": true_or_false
  }'
```

- Set `isUrl` to `true` if providing an image URL, or `false` (or omit) if providing base64 encoded image data.

### 3. Using form data with an image file

```bash
curl -X POST https://your-worker-url.workers.dev/ \
  -F "image=@path/to/your/image.jpg"
```

### Response

The API returns a JSON response with the generated alt text:

```json
{
  "altText": "Generated description of the image..."
}
```

## Example: Google Gemini API Usage

The service uses the Google Gemini 2.0 Flash API. Here's the core API interaction:

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_API_KEY" \
-H 'Content-Type: application/json' \
-X POST \
-d '{
  "contents": [{
    "parts": [
      {"text": "Generate a concise and descriptive alt text for this image."},
      {"inline_data": {"data": "BASE64_IMAGE_DATA", "mimeType": "image/jpeg"}}
    ]
  }]
}'
```

For more information about Gemini models, visit the [Google AI for Developers documentation](https://ai.google.dev/gemini-api/docs/models/gemini).

## License

[MIT License](LICENSE)
