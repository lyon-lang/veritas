# CoreValidate Browser Extension

Verify any content you browse. Get instant trust scores for websites, images, and text.

## Features

- **Trust Score Badge** - See trust scores on every website
- **Instant Verification** - Verify URLs and text content
- **Detailed Breakdown** - C2PA, AI detection, source credibility
- **Verification History** - Track your verifications
- **Cross-Browser Support** - Works on Chrome, Firefox, Edge, and Safari

## Installation

### Development Mode (All Browsers)

1. Install dependencies:
   ```bash
   cd extension
   npm install
   ```

2. Build for your browser:
   ```bash
   npm run build:chrome    # For Chrome
   npm run build:firefox   # For Firefox
   npm run build:edge      # For Edge
   npm run build:safari    # For Safari
   npm run build:all       # For all browsers
   ```

3. Load the extension:
   - **Chrome**: Go to `chrome://extensions/`, enable "Developer mode", click "Load unpacked", select `dist/chrome`
   - **Firefox**: Go to `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on", select `dist/firefox/manifest.json`
   - **Edge**: Go to `edge://extensions/`, enable "Developer mode", click "Load unpacked", select `dist/edge`
   - **Safari**: Open the Xcode project in `dist/safari`, build and run

### Production

1. Build for all browsers:
   ```bash
   npm run build:all
   ```

2. Submit to browser stores:
   - **Chrome Web Store**: https://chrome.google.com/webstore/devconsole
   - **Firefox Add-ons**: https://addons.mozilla.org/developers/
   - **Microsoft Edge Add-ons**: https://partner.microsoft.com/dashboard/microsoftedge/overview
   - **Mac App Store**: Via Xcode project in `dist/safari`

## Usage

### Trust Score Badge
- Automatically shows trust score on every page
- Hover for detailed breakdown
- Click to view full report

### Popup
- Click the extension icon
- Enter URL or text to verify
- View verification history

## Configuration

Update the API URL in these files:
- `src/popup.js` - Line 7
- `src/content.js` - Line 9

Change `API_URL` to your deployed CoreValidate URL.

## Files

```
extension/
├── manifest.json          # Base manifest (used by build script)
├── build.js               # Build script for cross-browser support
├── package.json           # Dependencies and build scripts
├── icons/                 # Extension icons
│   ├── icon.svg
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── src/
│   ├── popup.html        # Popup UI
│   ├── popup.js          # Popup logic
│   ├── content.js        # Content script
│   ├── content.css       # Content styles
│   └── background.js     # Background script
├── dist/                 # Built extensions (generated)
│   ├── chrome/
│   ├── firefox/
│   ├── edge/
│   └── safari/
└── README.md
```

## API Integration

The extension connects to the CoreValidate API:
- `POST /api/verify` - Verify content
- `GET /api/user/verifications` - Get history

## Cross-Browser Compatibility

This extension uses the [WebExtension Polyfill](https://github.com/nicedoc/webextension-polyfill) to ensure compatibility across browsers:

- **Chrome**: Full support, uses `chrome.*` APIs
- **Firefox**: Full support, uses `browser.*` APIs
- **Edge**: Full support, Chromium-based
- **Safari**: Support via Safari Web Extensions (requires Xcode)

## Development

1. Make changes to source files in `src/`
2. Run `npm run build` to rebuild
3. Reload the extension in your browser
4. Test your changes

## License

Proprietary - CoreValidate © 2025
