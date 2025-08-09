# Meal Map Demo

A custom web app for managing delivery routes across LA County for Project Angel Food. The map implementation relies on **Mapbox GL JS** instead of Google Maps.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Development](#development)
- [Building for Production](#building-for-production)
- [API Documentation](#api-documentation)
- [Security](#security)
- [Contributing](#contributing)

## Features

- Interactive map with day selector
- Route overlays with labels
- Restricted zone styling (grayed out)
- Address search and zone matching
- Editable zones using Mapbox Draw (draw, label, assign day, toggle restricted)
- Dark mode toggle
- Route capacity management
- Driver assignment
- WorkWave Route Manager integration
- Data import/export
- Mobile-responsive design

## Project Structure

```
mealmap-demo/
├── assets/            # Static assets (images, icons)
├── config/            # Configuration files
├── dist/              # Production build output (generated)
├── docs/              # Documentation
├── node_modules/      # Dependencies (generated)
├── server/            # Server-side code
│   ├── utils/         # Server utilities
│   └── server.js      # Express server
├── src/               # Source code
│   ├── components/    # Reusable UI components
│   ├── css/           # Stylesheets
│   ├── js/            # JavaScript files
│   │   ├── core/      # Core functionality modules
│   │   ├── features/  # Feature-specific modules
│   │   └── utils/     # Utility modules
│   └── data/          # Static data files
├── .babelrc           # Babel configuration
├── .eslintrc.js       # ESLint configuration
├── .gitignore         # Git ignore file
├── index.html         # Main HTML file
├── jest.config.js     # Jest configuration
├── package.json       # NPM package configuration
├── README.md          # Project documentation
└── webpack.config.js  # Webpack configuration
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/wzly-wrks/mealmap-demo.git
   cd mealmap-demo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3003
   API_KEY=your_workwave_api_key
   TERRITORY_ID=your_workwave_territory_id
   ```

4. Copy `config.js.example` to `config.js` and place your Mapbox token in `window.MAPBOX_TOKEN`.
   This file is gitignored so your secret key stays private.

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:9000`

## Development

### Development Server

Run the development server with:

```bash
npm run dev
```

This will start both the backend server and the frontend development server with hot reloading.

For a simple static server:

```bash
npm install -g serve
serve .
```

To run the application with just the backend server:

```bash
npm start
```

This will start the Express server on port 3003 (or the port specified in your .env file).

### Code Linting

Lint your code with:

```bash
npm run lint
```

Fix linting issues automatically with:

```bash
npm run lint:fix
```

### Testing

Run tests with:

```bash
npm test
```

## Building for Production

Build the application for production with:

```bash
npm run build
```

This will create a `dist` directory with the compiled assets.

## API Documentation

### WorkWave Integration API

#### Test API Connection

```
GET /api/workwave/test
```

Tests the connection to the WorkWave API using the provided credentials.

**Headers:**
- `X-WorkWave-Key`: Your WorkWave API key
- `X-Territory-ID`: Your WorkWave territory ID

**Response:**
```json
{
  "success": true,
  "message": "WorkWave API connection successful",
  "territories": [...]
}
```

#### Get Today's Orders

```
GET /api/workwave/current-orders
```

Fetches the current day's orders from WorkWave Route Manager.

**Headers:**
- `X-WorkWave-Key`: Your WorkWave API key
- `X-Territory-ID`: Your WorkWave territory ID

**Response:**
```json
{
  "success": true,
  "orders": [...],
  "message": "Successfully fetched X orders from Y current routes"
}
```

#### Get Orders for a Specific Date

```
GET /api/workwave/orders?date=YYYY-MM-DD
```

Fetches orders for a specific date from WorkWave Route Manager.

**Headers:**
- `X-WorkWave-Key`: Your WorkWave API key
- `X-Territory-ID`: Your WorkWave territory ID

**Query Parameters:**
- `date`: The date in YYYY-MM-DD format

**Response:**
```json
{
  "success": true,
  "orders": [...],
  "message": "Successfully fetched X orders from Y routes"
}
```

## Security

### Security Features

- Input validation for all API endpoints
- HTML content sanitization to prevent XSS attacks
- HTTPS support for production environments
- Secure storage of API credentials
- Content Security Policy headers
- XSS protection headers

### Reporting Security Issues

If you discover a security vulnerability, please send an email to security@ninjatech.ai instead of opening a public issue.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

© 2025 NinjaTech AI | Project Angel Food
