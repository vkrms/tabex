# TabEx Installation Guide

## Quick Start

### Install in Chrome (Developer Mode)

1. **Download the Extension**
   - Clone this repository or download the ZIP file
   - Extract to a local directory

2. **Open Chrome Extensions Page**
   - Open Google Chrome
   - Navigate to `chrome://extensions/`
   - Or click Menu (⋮) → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the Extension**
   - Click the "Load unpacked" button
   - Navigate to and select the directory containing the extension files
   - The TabEx icon should appear in your browser toolbar

5. **Start Using TabEx**
   - Click the TabEx icon in your toolbar
   - View all your tabs across all windows
   - Double-click any tab to switch to it

## Troubleshooting

### Extension doesn't load
- Make sure all files (manifest.json, popup.html, popup.css, popup.js, icons/) are in the same directory
- Check the Chrome Extensions page for any error messages
- Ensure you have the latest version of Chrome (Manifest V3 support required)

### Tabs not displaying
- Check that the extension has been granted the required permissions
- Try closing and reopening the popup
- Reload the extension from chrome://extensions/

### Can't switch to tabs
- Make sure you're double-clicking (not single-clicking) on the tab
- Check browser console for any JavaScript errors

## Compatibility

- **Minimum Chrome Version**: 88+ (Manifest V3 support)
- **Other Browsers**: Should work with Edge, Brave, and other Chromium-based browsers
- **Firefox**: Not currently supported (uses different extension API)

## Features

✓ List all tabs from all windows  
✓ Show last accessed time  
✓ Display tab groups with colors  
✓ Show active/pinned status  
✓ Search tabs by title or URL  
✓ Double-click to switch to tab  
✓ Real-time updates  

## Privacy

This extension:
- Runs locally in your browser
- Does not collect or send any data
- Does not make external network requests (except for favicons)
- Only requires permissions to access tab information

## Support

For issues, questions, or feature requests, please open an issue on GitHub.
