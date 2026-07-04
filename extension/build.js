#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const BROWSERS = {
  chrome: {
    manifest_version: 3,
    background: {
      service_worker: 'src/background.js',
      type: 'module'
    },
    permissions: ['activeTab', 'storage'],
    host_permissions: ['https://corevalidate.vercel.app/*'],
    content_security_policy: {
      extension_pages: "script-src 'self'; object-src 'self'; style-src 'self' 'unsafe-inline'"
    }
  },
  firefox: {
    manifest_version: 3,
    background: {
      service_worker: 'src/background.js',
      type: 'module'
    },
    permissions: ['activeTab', 'storage'],
    host_permissions: ['https://corevalidate.vercel.app/*'],
    browser_specific_settings: {
      gecko: {
        id: 'corevalidate@extension',
        strict_min_version: '109.0'
      }
    }
  },
  edge: {
    manifest_version: 3,
    background: {
      service_worker: 'src/background.js',
      type: 'module'
    },
    permissions: ['activeTab', 'storage'],
    host_permissions: ['https://corevalidate.vercel.app/*'],
    content_security_policy: {
      extension_pages: "script-src 'self'; object-src 'self'; style-src 'self' 'unsafe-inline'"
    }
  },
  safari: {
    manifest_version: 3,
    background: {
      scripts: ['src/background.js']
    },
    permissions: ['activeTab', 'storage'],
    host_permissions: ['https://corevalidate.vercel.app/*'],
    browser_specific_settings: {
      safari: {
        strict_min_version: '17.0'
      }
    }
  }
};

const BASE_MANIFEST = {
  name: 'CoreValidate - Trust Layer',
  version: '1.0.0',
  description: 'Verify any content you browse. Get instant trust scores for websites, images, and text.',
  action: {
    default_popup: 'src/popup.html',
    default_icon: {
      '16': 'icons/icon16.png',
      '48': 'icons/icon48.png',
      '128': 'icons/icon128.png'
    }
  },
  icons: {
    '16': 'icons/icon16.png',
    '48': 'icons/icon48.png',
    '128': 'icons/icon128.png'
  },
  content_scripts: [
    {
      matches: ['<all_urls>'],
      js: ['src/content.js'],
      css: ['src/content.css'],
      run_at: 'document_end'
    }
  ]
};

function createManifest(browser) {
  const manifest = { ...BASE_MANIFEST, ...BROWSERS[browser] };
  return manifest;
}

function copyFiles(srcDir, destDir) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Copy src directory
  const srcPath = path.join(srcDir, 'src');
  const destSrcPath = path.join(destDir, 'src');
  if (fs.existsSync(srcPath)) {
    copyDirSync(srcPath, destSrcPath);
  }

  // Copy icons directory
  const iconsPath = path.join(srcDir, 'icons');
  const destIconsPath = path.join(destDir, 'icons');
  if (fs.existsSync(iconsPath)) {
    copyDirSync(iconsPath, destIconsPath);
  }

  // Copy root-level icon files
  const iconFiles = ['icon16.png', 'icon48.png', 'icon128.png'];
  iconFiles.forEach(file => {
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);
    if (fs.existsSync(srcFile)) {
      fs.copyFileSync(srcFile, destFile);
    }
  });
}

function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  entries.forEach(entry => {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

function buildBrowser(browser) {
  console.log(`Building for ${browser}...`);
  
  const extensionDir = __dirname;
  const distDir = path.join(extensionDir, 'dist', browser);
  
  // Create manifest
  const manifest = createManifest(browser);
  const manifestPath = path.join(distDir, 'manifest.json');
  
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`  Created manifest.json`);
  
  // Copy source files
  copyFiles(extensionDir, distDir);
  console.log(`  Copied source files`);
  
  // Copy webextension-polyfill if it exists
  const polyfillPath = path.join(extensionDir, 'node_modules', 'webextension-polyfill', 'dist');
  if (fs.existsSync(polyfillPath)) {
    const destPolyfillPath = path.join(distDir, 'lib');
    copyDirSync(polyfillPath, destPolyfillPath);
    console.log(`  Copied webextension-polyfill`);
  }
  
  console.log(`  Built ${browser} extension in ${distDir}`);
}

function main() {
  const args = process.argv.slice(2);
  const browser = args[0] || 'all';
  
  if (browser === 'all') {
    Object.keys(BROWSERS).forEach(buildBrowser);
  } else if (BROWSERS[browser]) {
    buildBrowser(browser);
  } else {
    console.error(`Unknown browser: ${browser}`);
    console.error(`Supported browsers: ${Object.keys(BROWSERS).join(', ')}, all`);
    process.exit(1);
  }
  
  console.log('\nBuild complete!');
}

main();
