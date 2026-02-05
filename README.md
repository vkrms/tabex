# TabEx - Tab Explorer

A Chrome browser extension that helps you manage and explore all your tabs across all browser windows.

## Features

- **View All Tabs**: See all tabs from all open browser windows in one place
- **Tab Metadata**: View useful information about each tab:
  - Last accessed time (e.g., "5m ago", "2h ago")
  - Tab groups with colored indicators
  - Active/Pinned status
  - Window organization
- **Quick Navigation**: Double-click any tab to instantly switch to it
- **Search**: Quickly find tabs by title or URL
- **Real-time Updates**: Tab information updates automatically

## Installation

### Install from Source

1. Clone this repository or download the source code
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top-right corner)
4. Click "Load unpacked"
5. Select the directory containing the extension files
6. The TabEx icon should now appear in your browser toolbar

## Usage

1. Click the TabEx icon in your browser toolbar to open the interface in a new tab
2. Browse through all your tabs organized by window
3. Use the search bar to filter tabs by title or URL
4. Double-click on any tab to switch to it instantly

## Features Explained

### Tab Metadata

Each tab displays the following information:

- **Title and URL**: The page title and full URL
- **Active Status**: Shows which tab is currently active with a green "Active" badge
- **Pinned Status**: Shows if a tab is pinned with a 📌 icon
- **Group Information**: If a tab is in a group, it shows the group name with a colored indicator
- **Last Accessed**: Displays how long ago the tab was last accessed (updates in real-time)

### Window Organization

Tabs are organized by window, with a header showing:
- Window identifier
- Whether it's the current window
- Number of tabs in that window

## Technical Details

- Built using Manifest V3 (the latest Chrome extension standard)
- Uses Chrome's Tabs API and Tab Groups API
- Real-time tab monitoring and updates
- Clean, modern UI with gradient design

## Permissions

This extension requires the following permissions:
- `tabs`: To access and list all tabs
- `tabGroups`: To retrieve tab group information

## Future Enhancements

Potential features for future versions:
- Tab memory consumption display (if Chrome API supports it)
- Sort and filter options
- Tab management actions (close, pin, group)
- Export tab lists
- Tab session management

## License

MIT License