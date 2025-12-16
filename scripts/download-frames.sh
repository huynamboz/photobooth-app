#!/bin/bash

# Script to download sample photobooth frames
# This script downloads placeholder frames for testing
# Replace with actual frame URLs after uploading to your CDN

echo "Downloading sample photobooth frames..."

# Create frames directory
mkdir -p assets/frames

# Download sample frames from placeholder services
# Note: These are placeholder images. Replace with actual frame PNGs

# Frame 1 - Classic Border
curl -L "https://via.placeholder.com/800x1200/16a34a/ffffff?text=Classic+Frame" \
  -o assets/frames/classic-frame.png

# Frame 2 - Modern Border  
curl -L "https://via.placeholder.com/800x1200/3b82f6/ffffff?text=Modern+Frame" \
  -o assets/frames/modern-frame.png

# Frame 3 - Vintage Border
curl -L "https://via.placeholder.com/800x1200/f59e0b/ffffff?text=Vintage+Frame" \
  -o assets/frames/vintage-frame.png

# Frame 4 - Elegant Border
curl -L "https://via.placeholder.com/800x1200/ef4444/ffffff?text=Elegant+Frame" \
  -o assets/frames/elegant-frame.png

echo "✅ Sample frames downloaded to assets/frames/"
echo ""
echo "⚠️  Note: These are placeholder images."
echo "To use real frames:"
echo "1. Download frames from:"
echo "   - https://www.penci.vn (Vietnamese frames)"
echo "   - https://pixabay.com (Free stock photos)"
echo "   - https://www.pexels.com (Free photos)"
echo ""
echo "2. Edit frames to have transparent center"
echo "3. Upload to your CDN/server"
echo "4. Update URLs in assetService.ts"

