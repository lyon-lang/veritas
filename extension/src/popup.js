// CoreValidate Browser Extension - Popup Script

const API_URL = 'https://corevalidate.vercel.app';

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

function sanitize(str) {
  if (typeof str !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Load recent verifications
async function loadRecent() {
  try {
    const data = await chrome.storage.local.get('verifications');
    const verifications = data.verifications || [];
    
    if (verifications.length > 0) {
      recentSection.style.display = 'block';
      recentList.textContent = '';

      verifications.slice(0, 5).forEach(v => {
        const item = document.createElement('div');
        item.className = 'recent-item';
        item.dataset.url = v.url || '';
        item.dataset.content = v.content || '';

        const urlDiv = document.createElement('div');
        urlDiv.className = 'recent-url';
        urlDiv.textContent = v.url || (v.content ? v.content.substring(0, 50) + '...' : 'Unknown');

        const metaDiv = document.createElement('div');
        metaDiv.className = 'recent-meta';

        const badge = document.createElement('span');
        badge.className = `badge badge-${sanitize(v.verdict)}`;
        badge.textContent = v.verdict;

        const scoreSpan = document.createElement('span');
        scoreSpan.textContent = `Score: ${v.trustScore}/100`;

        const timeSpan = document.createElement('span');
        timeSpan.textContent = formatTime(v.timestamp);

        metaDiv.appendChild(badge);
        metaDiv.appendChild(scoreSpan);
        metaDiv.appendChild(timeSpan);

        item.appendChild(urlDiv);
        item.appendChild(metaDiv);

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

        recentList.appendChild(item);
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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(`${API_URL}/api/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: url, type: 'url' }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    if (typeof data.trustScore !== 'number' || typeof data.verdict !== 'string') {
      throw new Error('Invalid response format');
    }

    showResult(data);
    saveVerification({ ...data, url });
  } catch (error) {
    if (error.name === 'AbortError') {
      showError('Request timed out');
    } else {
      showError('Failed to verify URL');
    }
  }
}

// Verify text
async function verifyText(text) {
  showLoading();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(`${API_URL}/api/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text, type: 'text' }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    if (typeof data.trustScore !== 'number' || typeof data.verdict !== 'string') {
      throw new Error('Invalid response format');
    }

    showResult(data);
    saveVerification({ ...data, content: text });
  } catch (error) {
    if (error.name === 'AbortError') {
      showError('Request timed out');
    } else {
      showError('Failed to verify content');
    }
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

  const score = data.trustScore;
  scoreCircle.textContent = score;
  scoreCircle.className = 'score-circle ' + getScoreClass(score);

  verdict.textContent = getVerdictText(data.verdict);
  verdict.className = 'verdict verdict-' + sanitize(data.verdict);

  confidence.textContent = `Confidence: ${data.confidence}%`;

  checks.textContent = '';
  if (Array.isArray(data.checks)) {
    data.checks.forEach(check => {
      const item = document.createElement('div');
      item.className = 'check-item';

      const nameSpan = document.createElement('span');
      nameSpan.className = 'check-name';
      nameSpan.textContent = getCheckIcon(check.status) + ' ' + (check.name || '');

      const scoreSpan = document.createElement('span');
      scoreSpan.className = `check-score check-${sanitize(check.status)}`;
      scoreSpan.textContent = String(check.score);

      item.appendChild(nameSpan);
      item.appendChild(scoreSpan);
      checks.appendChild(item);
    });
  }
}

// Show error
function showError(message) {
  loading.style.display = 'none';
  emptyState.style.display = 'block';
  emptyState.textContent = '';

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');

  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', '12');
  circle.setAttribute('cy', '12');
  circle.setAttribute('r', '10');

  const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line1.setAttribute('x1', '15');
  line1.setAttribute('y1', '9');
  line1.setAttribute('x2', '9');
  line1.setAttribute('y2', '15');

  const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line2.setAttribute('x1', '9');
  line2.setAttribute('y1', '9');
  line2.setAttribute('x2', '15');
  line2.setAttribute('y2', '15');

  svg.appendChild(circle);
  svg.appendChild(line1);
  svg.appendChild(line2);

  const p = document.createElement('p');
  p.textContent = message;

  emptyState.appendChild(svg);
  emptyState.appendChild(p);
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
    case 'likely authentic': return '✓ Likely Authentic';
    case 'suspicious': return '⚠ Suspicious Content';
    case 'fake': return '✗ Likely Fake';
    case 'untrusted': return '✗ Untrusted';
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
      trustScore: data.trustScore,
      verdict: data.verdict,
      checks: data.checks,
      confidence: data.confidence,
      url: data.url,
      content: data.content,
      timestamp: new Date().toISOString()
    });

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

urlInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    verifyBtn.click();
  }
});

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  loadRecent();
  
  const currentUrl = await getCurrentTabUrl();
  if (currentUrl && !currentUrl.startsWith('chrome://')) {
    urlInput.value = currentUrl;
  }
});
