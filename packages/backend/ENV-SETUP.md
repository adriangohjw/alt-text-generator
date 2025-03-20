# Environment Variables Setup Guide

This document explains how to properly set up and manage environment variables for the Alt Text Generator backend.

## Required Environment Variables

The following environment variables are required for the application to function properly:

| Variable Name  | Description                                   | Example                      | Validation Rules |
| -------------- | --------------------------------------------- | ---------------------------- | ---------------- |
| GEMINI_API_KEY | Google Gemini API key used for image analysis | (secure value, do not share) | Non-empty string |

## Schema Validation

This project uses [Zod](https://github.com/colinhacks/zod) for environment variable validation, which provides:

- Type safety for environment variables
- Runtime validation with detailed error messages
- Automatically generated TypeScript types

If an environment variable fails validation, the application will display a detailed error message indicating which variable failed and why.

## Local Development Setup

For local development, you have two options:

### Option 1: Using .env.development.local (Recommended for Development)

1. Use the provided setup script to create your local environment file:

   ```bash
   npm run setup:env
   ```

   This will create a `.env.development.local` file based on the example template.

2. Edit the `.env.development.local` file and add your API key:

   ```
   GEMINI_API_KEY=your_api_key_here
   ```

   Replace `your_api_key_here` with your actual Gemini API key.

3. Run the application using the local development script:

   ```bash
   npm run dev:local
   ```

   This script will automatically load environment variables from `.env.development.local`.

4. This file is already added to `.gitignore` so it won't be committed to version control.

### Option 2: Using Wrangler

This is recommended for production deployments:

1. Install Wrangler CLI if you haven't already:

   ```bash
   npm install -g wrangler
   ```

2. Authenticate with Cloudflare:

   ```bash
   wrangler login
   ```

3. Set your secret API key:

   ```bash
   wrangler secret put GEMINI_API_KEY
   ```

   When prompted, enter your Gemini API key value. This will securely store the secret in Cloudflare for your worker.

4. For non-sensitive environment variables, you can add them directly to `wrangler.toml` under the `[vars]` section.

## Production Environment

For production deployments:

1. Configure secrets in the Cloudflare dashboard:

   - Go to the Workers section
   - Find your worker (alt-text-generator-backend)
   - Navigate to Settings > Variables
   - Add your environment variables in the "Environment Variables" section
   - For secret values like API keys, click the "Encrypt" option

2. Alternatively, use the Wrangler CLI:
   ```bash
   wrangler secret put GEMINI_API_KEY --env production
   ```

## Security Best Practices

- **Never commit secrets to version control**
- **Never hardcode API keys in your code**
- Use different API keys for development and production environments
- Regularly rotate your API keys
- Use the minimum required permissions for your API keys
- Monitor your API usage for unexpected activity

## Troubleshooting

If you encounter an error like "Environment validation failed", check the error message for details about which variable is causing the issue. Zod validation errors will include specific information about what's wrong with each environment variable.

For example:

```
Environment validation failed:
GEMINI_API_KEY: Required
```

This means you need to set the GEMINI_API_KEY secret using the steps described above.

For any issues with environment variables, check the Cloudflare dashboard or run:

```bash
wrangler secret list
```
