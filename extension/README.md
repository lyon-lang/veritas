# CoreValidate Browser Extension

Verify any content you browse. Get instant trust scores for websites, images, and text.

## Features

- 🛡️ **Trust Score Badge** - See trust scores on every website
- 🔍 **Instant Verification** - Verify URLs and text content
- 📊 **Detailed Breakdown** - C2PA, AI detection, source credibility
- 📝 **Verification History** - Track your verifications

## Installation

### Development Mode

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `extension` folder

### Production

1. Build the extension (coming soon)
2. Install from Chrome Web Store (coming soon)

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
- `src/popup.js` - Line 3
- `src/content.js` - Line 5

Change `API_URL` to your deployed CoreValidate URL.

## Files

```
extension/
├── manifest.json          # Extension manifest
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── src/
│   ├── popup.html        # Popup UI
│   ├── popup.js          # Popup logic
│   ├── content.js        # Content script
│   ├── content.css       # Content styles
│   └── background.js     # Background script
└── README.md
```

## API Integration

The extension connects to the CoreValidate API:
- `POST /api/verify` - Verify content
- `GET /api/user/verifications` - Get history

## Development

1. Make changes to source files
2. Go to `chrome://extensions/`
3. Click refresh on the CoreValidate extension
4. Test your changes

## License

Proprietary - CoreValidate © 2025
