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

3. Run the environment setup script:

   ```bash
   npm run setup:env
   ```

   This will create a `.env.development.local` file based on the example template.

4. Edit the `.env.development.local` file and add your API key:

   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

### Running Locally

```
npm run dev:local
```

This will start the development server at `http://localhost:8787`.

### Deployment

For deployment to Cloudflare Workers:

1. Install Wrangler CLI if you haven't already:

   ```bash
   npm install -g wrangler
   ```

2. Authenticate with Cloudflare:

   ```bash
   wrangler login
   ```

   This will open a browser window where you'll need to log in to your Cloudflare account and authorize Wrangler.

3. Set your secret API key:

   ```bash
   wrangler secret put GEMINI_API_KEY
   ```

   When prompted, enter your Gemini API key. This securely stores it in Cloudflare.

4. Deploy to Cloudflare Workers:

   ```bash
   npm run deploy
   ```

   This will build your project and deploy it to Cloudflare Workers.

5. After successful deployment, you'll receive a URL for your worker (typically `https://alt-text-generator.<your-account>.workers.dev`).

6. Test your deployment with a simple request:

   ```bash
   curl "https://alt-text-generator.<your-account>.workers.dev/?url=https://example.com/sample-image.jpg"
   ```

You can also manage your worker through the [Cloudflare Dashboard](https://dash.cloudflare.com/) where you can view logs, update settings, and monitor usage.

## Environment Variables

| Variable Name  | Description                                   | Required | Validation       |
| -------------- | --------------------------------------------- | -------- | ---------------- |
| GEMINI_API_KEY | Google Gemini API key used for image analysis | Yes      | Non-empty string |

This project uses [Zod](https://github.com/colinhacks/zod) for environment variable validation. If validation fails, the application will display an error message indicating which variable failed and why.

## API Usage

The API only accepts images via URL query parameter using GET requests:

```
GET https://your-worker-url.workers.dev/?url=https://example.com/path/to/image.jpg
```

### Response

The API returns a JSON response with the generated alt text and source URL:

```json
{
  "altText": "Generated description of the image..."
}
```

## Security Best Practices

- **Never commit secrets to version control**
- **Never hardcode API keys in your code**
- Use different API keys for development and production environments
- Regularly rotate your API keys
- Use the minimum required permissions for your API keys
- Monitor your API usage for unexpected activity

## Troubleshooting

If you encounter an error like "Environment validation failed", check the error message for details about which variable is causing the issue. For example:

```
Environment validation failed:
GEMINI_API_KEY: Required
```

For any issues with environment variables, check the Cloudflare dashboard or run:

```bash
wrangler secret list
```

## License

[MIT License](LICENSE)
