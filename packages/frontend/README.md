# Alt Text Generator Frontend

This is the frontend interface for the Alt Text Generator service, which automatically generates accessible alt text for images using Google's Gemini 2.0 Flash AI model.

## Features

- User-friendly interface for uploading images or providing image URLs
- Preview of uploaded/selected images
- Display of generated alt text with option to copy to clipboard
- Responsive design that works on desktop and mobile devices

## Setup and Configuration

### Prerequisites

- Node.js and npm
- Backend service running (either locally or deployed)

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure the backend API endpoint:

   Create a `.env.local` file in the root of the frontend package:

   ```
   VITE_API_ENDPOINT=http://localhost:8787
   ```

   For production, this should point to your deployed backend worker URL.

### Running Locally

```bash
bun run dev
```

This will start the development server, typically at `http://localhost:5173`.

### Building for Production

```bash
bun run build
```

This generates a production build in the `dist` directory.

### Deployment

The frontend can be deployed to any static hosting service:

1. Build the project:

   ```bash
   bun run build
   ```

2. Deploy the contents of the `dist` directory to your preferred hosting service.

## Development Guidelines

- Follow the established project structure
- Maintain accessibility standards
- Test with various image types and sizes
- Ensure responsive design works across devices

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
