<p align="center">
<pre>
                     ██╗    ██╗███████╗██╗  ██╗   ██╗██╗    ██╗██████╗ ██╗  ██╗███████╗
                     ██║    ██║╚══███╔╝██║  ╚██╗ ██╔╝██║    ██║██╔══██╗██║ ██╔╝██╔════╝
                     ██║ █╗ ██║  ███╔╝ ██║   ╚████╔╝ ██║ █╗ ██║███████╔╝█████╔╝ █████╗  
                     ██║███╗██║ ███╔╝  ██║    ╚██╔╝  ██║███╗██║██╔══██╗██╔═██╗ ╚════██╗
                     ╚███╔███╔╝███████╗███████╗██║   ╚███╔███╔╝██║  ██║██║  ██╗███████║
                      ╚══╝╚══╝ ╚══════╝╚══════╝╚═╝    ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝
                                                wzly.wrks
</pre>
</p>

# Meal Map Demo

This is a custom web app for managing delivery routes across LA County. The map implementation now relies on **Mapbox GL JS** instead of Google Maps.

## Features
- Interactive map with day selector
- Route overlays with labels
- Restricted zone styling (grayed out)
- Address search and zone matching
- Editable zones using Mapbox Draw (draw, label, assign day, toggle restricted)
- Dark mode toggle

## Project Structure

```
mealmap-demo/
├── assets/            # Static assets (images, etc.)
├── config/            # Configuration files
├── docs/              # Documentation
├── server/            # Server-side code
├── src/               # Source code
│   ├── components/    # Reusable UI components
│   ├── css/           # CSS stylesheets
│   └── js/            # JavaScript files
├── index.html         # Main entry point
├── package.json       # Project dependencies
└── README.md          # This file
```

## Hosting
Upload this folder to GitHub Pages or any static host.
Before running locally, copy `config.js.example` to `config.js` and place your Mapbox token in `window.MAPBOX_TOKEN`.
This file is gitignored so your secret key stays private.
You can then start a simple server with:

```bash
npm install -g serve
serve .
```

## Development

To run the application with the backend server:

```bash
npm install
npm start
```

This will start the Express server on port 3003 (or the port specified in your .env file).