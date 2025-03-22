# Alt Text Generator

![Alt Text Generator Demo](/demo.gif)

A full-stack application that automatically generates accessible alt text for images using Google's Gemini 2.0 Flash AI model.

## Project Structure

This is a monorepo project with the following packages:

- **backend**: A Cloudflare Worker that provides an API for generating alt text from images
- **frontend**: A React-based web interface for uploading images and displaying generated alt text

## Key Features

- Generates contextually relevant, descriptive alt text for any image
- Supports both image file uploads and image URLs
- Built as a Cloudflare Worker for global, low-latency deployment
- Modern React-based UI with responsive design

## Getting Started

### Prerequisites

- Node.js and npm
- A Google Gemini API key
- Cloudflare account (for deployment)

### Installation

1. Clone this repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the backend environment:

   ```bash
   npm run setup:env:backend
   ```

   This will create a `.env.development.local` file. Edit it to add your Gemini API key.

4. Set up the frontend environment by creating a `.env.local` file in `packages/frontend`:

   ```
   VITE_API_ENDPOINT=http://localhost:8787
   ```

### Running Locally

To run the entire application:

```bash
npm run dev
```

To run only the backend:

```bash
npm run dev:backend
```

To run only the frontend:

```bash
npm run dev:frontend
```

### Deployment

For complete deployment instructions, see:

- [Backend Deployment](./packages/backend/README.md#deployment)
- [Frontend Deployment](./packages/frontend/README.md#deployment)

## Documentation

- [Backend Documentation](./packages/backend/README.md)
- [Frontend Documentation](./packages/frontend/README.md)
