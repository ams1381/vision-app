
# Frontend Colorization Interface

A modern web interface for media colorization powered by Vite + TypeScript

![Vite+TS](public/vite.svg)

## Prerequisites

- Node.js v16+
- npm v9+
- Backend API server (see [main project README](../backend/README.md))

## Installation

1. **Clone Repository** (if separate frontend)
   ```bash
   git clone https://github.com/yourusername/colorization-frontend.git
   cd colorization-frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```


## Running the Application

**Development Mode**
```bash
npx dev
```
- Access at: `http://localhost:5173`


## Project Structure

```
.
├── src/
│   ├── main.ts          # Application entry point
│   ├── index.ts         # DOM mounting
│   ├── upload.ts        # File upload logic
│   ├── fileManager.ts   # Media file management
│   ├── utils.ts         # Helper functions
│   └── style.css        # Global styles
├── public/              # Static assets
└── tsconfig.json        # TypeScript configuration
```

## Key Features

- Real-time progress tracking
- Colorized media previews
- API error handling
- Responsive design

## Available Scripts

| Command          | Description                     |
|------------------|---------------------------------|
| `npm run dev`    | Start development server        |
| `npm run build`  | Create production build         |
| `npm run preview`| Preview production build locally|
| `npm run lint`   | Run TypeScript linting          |

## Troubleshooting

1. **Dependency Issues**
   ```bash
   rm -rf node_modules && npm install
   ```

2. **Port Conflicts**
   ```bash
   VITE_PORT=3000 npm run dev
   ```

3. **API Connection**
   - Verify backend server is running
   - Inspect browser console for errors

## License

Distributed under MIT License - See [LICENSE](../LICENSE) for details