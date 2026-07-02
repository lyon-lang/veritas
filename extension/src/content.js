// Veritas Content Script
// Shows trust score badge on web pages

(function() {
  'use strict';

  const API_URL = 'https://veritas.vercel.app'; // Change to your deployed URL
  let badge = null;
  let currentUrl = window.location.href;

  // Create badge element
  function createBadge(score, verdict, checks) {
    if (badge) {
      badge.remove();
    }

    badge = document.createElement('div');
    badge.className = 'veritas-badge';
    badge.innerHTML = `
      <div class="veritas-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      </div>
      <div class="veritas-info">
        <div class="veritas-score veritas-score-${getScoreLevel(score)}">${score}</div>
        <div class="veritas-label">${getVerdictLabel(verdict)}</div>
      </div>
      <div class="veritas-dismiss" title="Dismiss">×</div>
      ${createTooltip(score, verdict, checks)}
    `;

    // Add dismiss handler
    badge.querySelector('.veritas-dismiss').addEventListener('click', (e) => {
      e.stopPropagation();
      badge.remove();
      badge = null;
    });

    // Add click handler
    badge.addEventListener('click', () => {
      window.open(`${API_URL}/dashboard`, '_blank');
    });

    document.body.appendChild(badge);
  }

  // Create tooltip HTML
  function createTooltip(score, verdict, checks) {
    if (!checks || checks.length === 0) return '';

    const checksHtml = checks.map(check => `
      <div class="veritas-check">
        <span class="veritas-check-name">${check.name}</span>
        <span class="veritas-check-score veritas-check-${check.status}">${check.score}</span>
      </div>
    `).join('');

    return `
      <div class="veritas-tooltip">
        <div class="veritas-tooltip-header">
          <span class="veritas-tooltip-title">Trust Analysis</span>
          <span class="veritas-tooltip-verdict veritas-verdict-${verdict}">${verdict}</span>
        </div>
        <div class="veritas-tooltip-checks">
          ${checksHtml}
        </div>
        <div class="veritas-tooltip-footer">
          <a href="${API_URL}/dashboard" target="_blank" class="veritas-tooltip-link">View full report →</a>
        </div>
      </div>
    `;
  }

  // Get score level
  function getScoreLevel(score) {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  }

  // Get verdict label
  function getVerdictLabel(verdict) {
    switch (verdict) {
      case 'authentic': return 'Trusted';
      case 'suspicious': return 'Caution';
      case 'fake': return 'Untrusted';
      default: return 'Unknown';
    }
  }

  // Verify current page
  async function verifyPage() {
    try {
      // Check if we should verify this page
      if (currentUrl.startsWith('chrome://') || 
          currentUrl.startsWith('chrome-extension://') ||
          currentUrl.startsWith('about:')) {
        return;
      }

      const response = await fetch(`${API_URL}/api/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: currentUrl, type: 'url' }),
      });

      if (response.ok) {
        const data = await response.json();
        createBadge(data.trustScore, data.verdict, data.checks);
        
        // Save to storage
        chrome.storage.local.get('verifications', (stored) => {
          const verifications = stored.verifications || [];
          verifications.unshift({
            ...data,
            url: currentUrl,
            timestamp: new Date().toISOString()
          });
          chrome.storage.local.set({ verifications: verifications.slice(0, 50) });
        });
      }
    } catch (error) {
      console.error('Veritas: Error verifying page', error);
    }
  }

  // Listen for URL changes (SPA support)
  let lastUrl = '';
  const observer = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      currentUrl = location.href;
      verifyPage();
    }
  });

  observer.observe(document, { subtree: true, childList: true });

  // Initial verification
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', verifyPage);
  } else {
    verifyPage();
  }

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'verify') {
      verifyPage().then(() => {
        sendResponse({ success: true });
      });
      return true;
    }
    
    if (request.action === 'getUrl') {
      sendResponse({ url: currentUrl });
    }
  });
})();
