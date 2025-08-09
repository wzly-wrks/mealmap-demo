#!/bin/bash

# Meal Map Application Enhancement Installation Script

echo "Meal Map Application Enhancement Installation"
echo "============================================="
echo

# Check if we're in the right directory
if [ ! -f "index.html" ] || [ ! -f "mapbox.js" ]; then
  echo "Error: This script must be run from the root directory of the Meal Map application."
  echo "Please navigate to the directory containing index.html and mapbox.js and try again."
  exit 1
fi

echo "Installing new JavaScript files..."

# Copy the new JavaScript files
cp ../admin-panel-fix.js ./
cp ../route-assignments.js ./
cp ../route-manager.js ./

# Update package.json
echo "Updating package.json dependencies..."
cp ../package.json ./

# Install updated dependencies
echo "Installing updated dependencies..."
npm install

# Add script tags to index.html if they don't exist
echo "Updating index.html..."
if ! grep -q "admin-panel-fix.js" index.html; then
  sed -i 's|</body>|<script src="admin-panel-fix.js"></script>\n</body>|' index.html
fi

if ! grep -q "route-assignments.js" index.html; then
  sed -i 's|</body>|<script src="route-assignments.js"></script>\n</body>|' index.html
fi

if ! grep -q "route-manager.js" index.html; then
  sed -i 's|</body>|<script src="route-manager.js"></script>\n</body>|' index.html
fi

echo
echo "Installation complete!"
echo
echo "The following files have been added or updated:"
echo "- admin-panel-fix.js: Improves admin panel navigation"
echo "- route-assignments.js: Manages route assignments"
echo "- route-manager.js: Provides UI for route capacity management"
echo "- package.json: Updated dependencies"
echo
echo "Please check index.html to ensure the script tags were added correctly."
echo "You may now commit these changes to your repository."