// Tab metadata tracking
const tabAccessTimes = new Map();

// Default favicon SVG for tabs without a favicon
const DEFAULT_FAVICON = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><rect width="16" height="16" fill="%23ddd"/></svg>';

// Utility function to format time ago
function formatTimeAgo(timestamp) {
  if (!timestamp) return 'Unknown';
  
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// Utility function to get favicon URL
function getFaviconUrl(tab) {
  if (tab.favIconUrl && tab.favIconUrl.startsWith('http')) {
    return tab.favIconUrl;
  }
  // Use Google's favicon service as fallback
  try {
    const url = new URL(tab.url);
    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=16`;
  } catch (e) {
    return DEFAULT_FAVICON;
  }
}

// Get all tabs from all windows
async function getAllTabs() {
  try {
    const windows = await chrome.windows.getAll({ populate: true });
    const tabGroups = await chrome.tabGroups.query({});
    
    // Create a map of group IDs to group info
    const groupMap = new Map();
    tabGroups.forEach(group => {
      groupMap.set(group.id, group);
    });
    
    return windows.map(window => ({
      windowId: window.id,
      focused: window.focused,
      tabs: window.tabs.map(tab => {
        const group = tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE 
          ? groupMap.get(tab.groupId) 
          : null;
        
        return {
          id: tab.id,
          title: tab.title || 'Untitled',
          url: tab.url || '',
          favIconUrl: getFaviconUrl(tab),
          active: tab.active,
          pinned: tab.pinned,
          groupId: tab.groupId,
          group: group ? {
            title: group.title || 'Unnamed Group',
            color: group.color
          } : null,
          lastAccessed: tabAccessTimes.get(tab.id) || (tab.active ? Date.now() : null),
          windowId: window.id
        };
      })
    }));
  } catch (error) {
    console.error('Error getting tabs:', error);
    return [];
  }
}

// Switch to a specific tab
async function switchToTab(tabId, windowId) {
  try {
    // First, focus the window
    await chrome.windows.update(windowId, { focused: true });
    // Then activate the tab
    await chrome.tabs.update(tabId, { active: true });
    // Update access time
    tabAccessTimes.set(tabId, Date.now());
  } catch (error) {
    console.error('Error switching to tab:', error);
  }
}

// Create tab element
function createTabElement(tab, windowId) {
  const tabItem = document.createElement('div');
  tabItem.className = 'tab-item';
  if (tab.active) {
    tabItem.classList.add('active');
  }
  
  // Create group indicator if tab is in a group
  if (tab.group) {
    const groupIndicator = document.createElement('div');
    groupIndicator.className = 'tab-group-indicator';
    groupIndicator.style.backgroundColor = getGroupColor(tab.group.color);
    tabItem.appendChild(groupIndicator);
  }
  
  // Favicon
  const favicon = document.createElement('div');
  favicon.className = 'tab-favicon';
  const faviconImg = document.createElement('img');
  faviconImg.src = tab.favIconUrl;
  faviconImg.onerror = function() {
    this.src = DEFAULT_FAVICON;
  };
  favicon.appendChild(faviconImg);
  tabItem.appendChild(favicon);
  
  // Content
  const content = document.createElement('div');
  content.className = 'tab-content';
  
  const title = document.createElement('div');
  title.className = 'tab-title';
  title.textContent = tab.title;
  title.title = tab.title; // Full title on hover
  
  const url = document.createElement('div');
  url.className = 'tab-url';
  url.textContent = tab.url;
  url.title = tab.url; // Full URL on hover
  
  const metadata = document.createElement('div');
  metadata.className = 'tab-metadata';
  
  // Active badge
  if (tab.active) {
    const activeBadge = document.createElement('span');
    activeBadge.className = 'metadata-badge active';
    activeBadge.textContent = '● Active';
    metadata.appendChild(activeBadge);
  }
  
  // Pinned badge
  if (tab.pinned) {
    const pinnedBadge = document.createElement('span');
    pinnedBadge.className = 'metadata-badge';
    pinnedBadge.textContent = '📌 Pinned';
    metadata.appendChild(pinnedBadge);
  }
  
  // Group badge
  if (tab.group) {
    const groupBadge = document.createElement('span');
    groupBadge.className = 'metadata-badge group';
    groupBadge.textContent = `📁 ${tab.group.title}`;
    metadata.appendChild(groupBadge);
  }
  
  // Last accessed time
  if (tab.lastAccessed) {
    const timeBadge = document.createElement('span');
    timeBadge.className = 'metadata-badge last-accessed';
    timeBadge.textContent = `🕒 ${formatTimeAgo(tab.lastAccessed)}`;
    metadata.appendChild(timeBadge);
  }
  
  content.appendChild(title);
  content.appendChild(url);
  content.appendChild(metadata);
  tabItem.appendChild(content);
  
  // Double-click to switch to tab
  tabItem.addEventListener('dblclick', () => {
    switchToTab(tab.id, windowId);
  });
  
  return tabItem;
}

// Get group color in hex
function getGroupColor(colorName) {
  const colors = {
    'grey': '#5f6368',
    'blue': '#1a73e8',
    'red': '#d93025',
    'yellow': '#f9ab00',
    'green': '#1e8e3e',
    'pink': '#e91e63',
    'purple': '#9c27b0',
    'cyan': '#00bcd4',
    'orange': '#ff6d00'
  };
  return colors[colorName] || '#5f6368';
}

// Render all tabs
async function renderTabs(searchQuery = '') {
  const container = document.getElementById('tabs-container');
  container.innerHTML = '';
  
  const windows = await getAllTabs();
  
  if (windows.length === 0) {
    container.innerHTML = '<div class="no-results">No tabs found</div>';
    return;
  }
  
  let totalTabs = 0;
  const query = searchQuery.toLowerCase();
  
  windows.forEach(window => {
    const filteredTabs = window.tabs.filter(tab => {
      if (!query) return true;
      return tab.title.toLowerCase().includes(query) || 
             tab.url.toLowerCase().includes(query);
    });
    
    if (filteredTabs.length === 0) return;
    
    totalTabs += filteredTabs.length;
    
    // Create window group
    const windowGroup = document.createElement('div');
    windowGroup.className = 'window-group';
    
    const windowHeader = document.createElement('div');
    windowHeader.className = 'window-header';
    
    const windowTitle = document.createElement('span');
    windowTitle.textContent = window.focused ? 'Window (Current)' : 'Window';
    
    const windowInfo = document.createElement('span');
    windowInfo.className = 'window-id';
    windowInfo.textContent = `${filteredTabs.length} tabs`;
    
    windowHeader.appendChild(windowTitle);
    windowHeader.appendChild(windowInfo);
    windowGroup.appendChild(windowHeader);
    
    // Add tabs
    filteredTabs.forEach(tab => {
      const tabElement = createTabElement(tab, window.windowId);
      windowGroup.appendChild(tabElement);
    });
    
    container.appendChild(windowGroup);
  });
  
  // Update tab count
  document.getElementById('tab-count').textContent = 
    `${totalTabs} tab${totalTabs !== 1 ? 's' : ''}`;
  
  if (totalTabs === 0) {
    container.innerHTML = '<div class="no-results">No tabs match your search</div>';
  }
}

// Initialize search functionality
function initSearch() {
  const searchInput = document.getElementById('search-input');
  
  // Note: debouncing is handled in the main initialization
  searchInput.addEventListener('input', (e) => {
    // Trigger debounced render via custom event
    window.dispatchEvent(new CustomEvent('tabsearch', { detail: e.target.value }));
  });
}

// Initialize the popup
document.addEventListener('DOMContentLoaded', () => {
  initSearch();
  renderTabs();
  
  const searchInput = document.getElementById('search-input');
  let debounceTimeout;
  
  // Debounced render function to avoid excessive re-renders
  const debouncedRender = () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      renderTabs(searchInput.value);
    }, 300);
  };
  
  // Handle search input via custom event
  window.addEventListener('tabsearch', (e) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      renderTabs(e.detail);
    }, 300);
  });
  
  // Listen for tab changes to update in real-time
  const onUpdatedListener = () => debouncedRender();
  const onCreatedListener = () => debouncedRender();
  const onRemovedListener = () => debouncedRender();
  const onActivatedListener = (activeInfo) => {
    tabAccessTimes.set(activeInfo.tabId, Date.now());
    debouncedRender();
  };
  
  if (chrome.tabs) {
    if (chrome.tabs.onUpdated) {
      chrome.tabs.onUpdated.addListener(onUpdatedListener);
    }
    if (chrome.tabs.onCreated) {
      chrome.tabs.onCreated.addListener(onCreatedListener);
    }
    if (chrome.tabs.onRemoved) {
      chrome.tabs.onRemoved.addListener(onRemovedListener);
    }
    if (chrome.tabs.onActivated) {
      chrome.tabs.onActivated.addListener(onActivatedListener);
    }
  }
  
  // Cleanup listeners when popup is closed
  window.addEventListener('unload', () => {
    clearTimeout(debounceTimeout);
    
    if (chrome.tabs) {
      if (chrome.tabs.onUpdated) {
        chrome.tabs.onUpdated.removeListener(onUpdatedListener);
      }
      if (chrome.tabs.onCreated) {
        chrome.tabs.onCreated.removeListener(onCreatedListener);
      }
      if (chrome.tabs.onRemoved) {
        chrome.tabs.onRemoved.removeListener(onRemovedListener);
      }
      if (chrome.tabs.onActivated) {
        chrome.tabs.onActivated.removeListener(onActivatedListener);
      }
    }
  });
});
