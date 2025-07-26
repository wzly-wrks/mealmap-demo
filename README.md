
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
Create a `config.js` file (based on `config.js.example`) and set `window.MAPBOX_TOKEN` to your Mapbox access token. This file is gitignored so your secret key stays private.
Legacy Google Maps scripts have been removed in favor of the new `mapbox.js` implementation.
