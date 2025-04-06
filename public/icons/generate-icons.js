// This file generates placeholder icons for the PWA
// Place this in public/icons/generate-icons.js

// Create basic HTML canvas script to generate icons
document.addEventListener('DOMContentLoaded', function() {
  const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
  
  sizes.forEach(size => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Draw background
    ctx.fillStyle = '#4285f4';
    ctx.fillRect(0, 0, size, size);
    
    // Draw "C" letter for Connections
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${size * 0.6}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('C', size / 2, size / 2);
    
    // Add a border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = size * 0.05;
    ctx.strokeRect(size * 0.1, size * 0.1, size * 0.8, size * 0.8);
    
    // Download the icon
    const link = document.createElement('a');
    link.download = `icon-${size}x${size}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
});