#!/bin/bash

# CoreValidate Extension Test Script
# This script helps test the extension in different browsers

echo "CoreValidate Extension Test Script"
echo "=================================="
echo ""

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "Error: dist directory not found. Run 'npm run build:all' first."
    exit 1
fi

# Function to open Chrome with extension
open_chrome() {
    echo "Opening Chrome with extension..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open -a "Google Chrome" --args --load-extension="$(pwd)/dist/chrome"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        google-chrome --load-extension="$(pwd)/dist/chrome"
    else
        echo "Please manually load the extension from: $(pwd)/dist/chrome"
    fi
}

# Function to open Firefox with extension
open_firefox() {
    echo "Opening Firefox..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open -a "Firefox"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        firefox &
    else
        echo "Please manually load the extension from: $(pwd)/dist/firefox"
    fi
    echo "Note: Firefox requires temporary install via about:debugging"
}

# Function to open Edge with extension
open_edge() {
    echo "Opening Edge with extension..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open -a "Microsoft Edge" --args --load-extension="$(pwd)/dist/edge"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        microsoft-edge --load-extension="$(pwd)/dist/edge"
    else
        echo "Please manually load the extension from: $(pwd)/dist/edge"
    fi
}

# Function to open test page
open_test_page() {
    echo "Opening test page..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "$(pwd)/test.html"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open "$(pwd)/test.html"
    else
        echo "Please open: $(pwd)/test.html"
    fi
}

# Main menu
echo "Choose a browser to test:"
echo "1. Chrome"
echo "2. Firefox"
echo "3. Edge"
echo "4. Open test page only"
echo "5. Exit"
echo ""

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        open_chrome
        open_test_page
        ;;
    2)
        open_firefox
        open_test_page
        ;;
    3)
        open_edge
        open_test_page
        ;;
    4)
        open_test_page
        ;;
    5)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo "Invalid choice. Please enter 1-5."
        exit 1
        ;;
esac

echo ""
echo "Test page opened. Check for the CoreValidate badge in the bottom-right corner."
echo "Hover over the badge to see the detailed breakdown."
echo "Click the badge to open the dashboard."
