// Veritas Browser Extension - Popup Script

const API_URL = 'https://veritas.vercel.app'; // Change to your deployed URL

// DOM Elements
const urlInput = document.getElementById('urlInput');
const verifyBtn = document.getElementById('verifyBtn');
const result = document.getElementById('result');
const loading = document.getElementById('loading');
const emptyState = document.getElementById('emptyState');
const scoreCircle = document.getElementById('scoreCircle');
const verdict = document.getElementById('verdict');
const confidence = document.getElementById('confidence');
const checks = document.getElementById('checks');
const recentSection = document.getElementById('recentSection');
const recentList = document.getElementById('recentList');

// Load recent verifications
async function loadRecent() {
  try {
    const data = await chrome.storage.local.get('verifications');
    const verifications = data.verifications || [];
    
    if (verifications.length > 0) {
      recentSection.style.display = 'block';
      recentList.innerHTML = verifications.slice(0, 5).map(v => `
        <div class="recent-item" data-url="${v.url || ''}" data-content="${v.content || ''}">
          <div class="recent-url">${v.url || v.content?.substring(0, 50) + '...' || 'Unknown'}</div>
          <div class="recent-meta">
            <span class="badge badge-${v.verdict}">${v.verdict}</span>
            <span>Score: ${v.trustScore}/100</span>
            <span>${formatTime(v.timestamp)}</span>
          </div>
        </div>
      `).join('');

      // Add click handlers
      document.querySelectorAll('.recent-item').forEach(item => {
        item.addEventListener('click', () => {
          const url = item.dataset.url;
          const content = item.dataset.content;
          if (url) {
            urlInput.value = url;
            verifyUrl(url);
          } else if (content) {
            urlInput.value = content;
            verifyText(content);
          }
        });
      });
    }
  } catch (error) {
    console.error('Error loading recent:', error);
  }
}

// Format time
function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}

// Verify URL
async function verifyUrl(url) {
  showLoading();
  
  try {
    const response = await fetch(`${API_URL}/api/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: url, type: 'url' }),
    });

    const data = await response.json();
    showResult(data);
    saveVerification({ ...data, url });
  } catch (error) {
    showError('Failed to verify URL');
  }
}

// Verify text
async function verifyText(text) {
  showLoading();
  
  try {
    const response = await fetch(`${API_URL}/api/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text, type: 'text' }),
    });

    const data = await response.json();
    showResult(data);
    saveVerification({ ...data, content: text });
  } catch (error) {
    showError('Failed to verify content');
  }
}

// Show loading state
function showLoading() {
  result.style.display = 'none';
  emptyState.style.display = 'none';
  loading.style.display = 'block';
  verifyBtn.disabled = true;
}

// Show result
function showResult(data) {
  loading.style.display = 'none';
  result.style.display = 'block';
  verifyBtn.disabled = false;

  // Update score circle
  const score = data.trustScore;
  scoreCircle.textContent = score;
  scoreCircle.className = 'score-circle ' + getScoreClass(score);

  // Update verdict
  verdict.textContent = getVerdictText(data.verdict);
  verdict.className = 'verdict verdict-' + data.verdict;

  // Update confidence
  confidence.textContent = `Confidence: ${data.confidence}%`;

  // Update checks
  checks.innerHTML = data.checks.map(check => `
    <div class="check-item">
      <span class="check-name">
        ${getCheckIcon(check.status)}
        ${check.name}
      </span>
      <span class="check-score check-${check.status}">${check.score}</span>
    </div>
  `).join('');
}

// Show error
function showError(message) {
  loading.style.display = 'none';
  emptyState.style.display = 'block';
  emptyState.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
    <p>${message}</p>
  `;
  verifyBtn.disabled = false;
}

// Get score class
function getScoreClass(score) {
  if (score >= 80) return 'score-high';
  if (score >= 60) return 'score-medium';
  return 'score-low';
}

// Get verdict text
function getVerdictText(verdict) {
  switch (verdict) {
    case 'authentic': return '✓ Authentic Content';
    case 'suspicious': return '⚠ Suspicious Content';
    case 'fake': return '✗ Likely Fake';
    default: return 'Unknown';
  }
}

// Get check icon
function getCheckIcon(status) {
  switch (status) {
    case 'passed': return '✓';
    case 'warning': return '⚠';
    case 'failed': return '✗';
    default: return '•';
  }
}

// Save verification to storage
async function saveVerification(data) {
  try {
    const stored = await chrome.storage.local.get('verifications');
    const verifications = stored.verifications || [];
    
    verifications.unshift({
      ...data,
      timestamp: new Date().toISOString()
    });

    // Keep only last 50
    await chrome.storage.local.set({ verifications: verifications.slice(0, 50) });
    loadRecent();
  } catch (error) {
    console.error('Error saving verification:', error);
  }
}

// Get current tab URL
async function getCurrentTabUrl() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab?.url;
  } catch {
    return null;
  }
}

// Event listeners
verifyBtn.addEventListener('click', () => {
  const input = urlInput.value.trim();
  if (!input) return;

  if (input.startsWith('http://') || input.startsWith('https://')) {
    verifyUrl(input);
  } else {
    verifyText(input);
  }
});

urlInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    verifyBtn.click();
  }
});

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  loadRecent();
  
  // Pre-fill with current tab URL
  const currentUrl = await getCurrentTabUrl();
  if (currentUrl && !currentUrl.startsWith('chrome://')) {
    urlInput.value = currentUrl;
  }
});
