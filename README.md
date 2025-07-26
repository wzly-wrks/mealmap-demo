
<p align="center">
<pre>
                     ██╗    ██╗███████╗██╗  ██╗   ██╗██╗    ██╗██████╗ ██╗  ██╗███████╗
                     ██║    ██║╚══███╔╝██║  ╚██╗ ██╔╝██║    ██║██╔══██╗██║ ██╔╝██╔════╝
                     ██║ █╗ ██║  ███╔╝ ██║   ╚████╔╝ ██║ █╗ ██║██████╔╝█████╔╝ ███████╗
                     ██║███╗██║ ███╔╝  ██║    ╚██╔╝  ██║███╗██║██╔══██╗██╔═██╗ ╚════██║
                     ╚███╔███╔╝███████╗███████╗██║██╗╚███╔███╔╝██║  ██║██║  ██╗███████║
                      ╚══╝╚══╝ ╚══════╝╚══════╝╚═╝╚═╝ ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝
                                                wzly.wrks
</pre>
</p>

# Meal Map Demo

This is a custom web app for managing delivery routes across LA County. The map implementation now relies on **Mapbox GL JS** instead of Google Maps.

## Features
- Interactive map with day selector
- Route overlays with labels
- Restricted zone styling (grayed out)
- Address search + zone match
- Editable zones (draw, label, assign day, toggle restricted)
- Dark mode toggle

## Hosting
Upload this folder to GitHub Pages or any static host.
Before running locally, copy `config.js.example` to `config.js` and place your Mapbox token in `window.MAPBOX_TOKEN`.
This file is gitignored so your secret key stays private.
You can then start a simple server with:

```bash
npm install -g serve
serve .
```
