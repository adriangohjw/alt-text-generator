# Alt Text Generator - Backend

This is the backend service for the Alt Text Generator, built with Cloudflare Workers, utilizing Google's Gemini 2.0 Flash model.

## Environment Variables

This project uses [Zod](https://github.com/colinhacks/zod) for environment variable validation, providing:

- Type safety for all environment variables
- Runtime validation with detailed error messages
- Schema-based validation with custom rules
- Automatically generated TypeScript types

### Required Environment Variables

| Variable Name  | Description                                   | Validation Rules |
| -------------- | --------------------------------------------- | ---------------- |
| GEMINI_API_KEY | Google Gemini API key used for image analysis | Non-empty string |

### Setting Up Environment Variables

For detailed instructions on setting up environment variables, please see [ENV-SETUP.md](./ENV-SETUP.md).

Quick start for local development:

```bash
# Create a local environment file
cp .env.example .env.development.local

# Edit the file and add your API key
# GEMINI_API_KEY=your_api_key_here

# Start the development server with your environment variables
npm run dev
```

For deployment:

```bash
# Install wrangler CLI if you haven't already
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Set your secret API key
wrangler secret put GEMINI_API_KEY
```

## Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## Deployment

```bash
# Deploy to Cloudflare Workers
npm run deploy
```

## How Environment Validation Works

Environment variables are validated using Zod schemas defined in `config.ts`. If validation fails, the application will display a detailed error message indicating which variable failed and why.

To modify the environment schema or add new variables:

1. Update the `environmentSchema` in `config.ts`
2. Update the documentation in `ENV-SETUP.md`
3. Update the example in `.env.example`
