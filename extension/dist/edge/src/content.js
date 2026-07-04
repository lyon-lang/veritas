// CoreValidate Content Script
// Shows trust score badge on web pages
// Cross-browser compatible using webextension-polyfill

(function() {
  'use strict';

  // Use browser namespace (polyfilled for Chrome)
  const api = typeof browser !== 'undefined' ? browser : chrome;

  const API_URL = 'https://corevalidate.vercel.app';
  let badge = null;
  let currentUrl = window.location.href;
  let lastVerifyTime = 0;
  const VERIFY_COOLDOWN = 5000;

  function sanitize(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function createBadge(score, verdict, checks) {
    if (badge) {
      badge.remove();
    }

    badge = document.createElement('div');
    badge.className = 'corevalidate-badge';

    const logo = document.createElement('div');
    logo.className = 'corevalidate-logo';
    logo.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';

    const info = document.createElement('div');
    info.className = 'corevalidate-info';

    const scoreEl = document.createElement('div');
    scoreEl.className = `corevalidate-score corevalidate-score-${getScoreLevel(score)}`;
    scoreEl.textContent = String(score);

    const labelEl = document.createElement('div');
    labelEl.className = 'corevalidate-label';
    labelEl.textContent = getVerdictLabel(verdict);

    info.appendChild(scoreEl);
    info.appendChild(labelEl);

    const dismiss = document.createElement('div');
    dismiss.className = 'corevalidate-dismiss';
    dismiss.title = 'Dismiss';
    dismiss.textContent = '×';

    badge.appendChild(logo);
    badge.appendChild(info);
    badge.appendChild(dismiss);

    if (checks && checks.length > 0) {
      badge.appendChild(createTooltip(score, verdict, checks));
    }

    dismiss.addEventListener('click', (e) => {
      e.stopPropagation();
      badge.remove();
      badge = null;
    });

    badge.addEventListener('click', () => {
      api.runtime.sendMessage({ action: 'openTab', url: `${API_URL}/dashboard` });
    });

    document.body.appendChild(badge);
  }

  function createTooltip(score, verdict, checks) {
    const tooltip = document.createElement('div');
    tooltip.className = 'corevalidate-tooltip';

    const header = document.createElement('div');
    header.className = 'corevalidate-tooltip-header';

    const title = document.createElement('span');
    title.className = 'corevalidate-tooltip-title';
    title.textContent = 'Trust Analysis';

    const verdictEl = document.createElement('span');
    const safeVerdict = sanitize(verdict);
    verdictEl.className = `corevalidate-tooltip-verdict corevalidate-verdict-${safeVerdict}`;
    verdictEl.textContent = verdict;

    header.appendChild(title);
    header.appendChild(verdictEl);

    const checksContainer = document.createElement('div');
    checksContainer.className = 'corevalidate-tooltip-checks';

    checks.forEach(check => {
      const checkEl = document.createElement('div');
      checkEl.className = 'corevalidate-check';

      const nameEl = document.createElement('span');
      nameEl.className = 'corevalidate-check-name';
      nameEl.textContent = check.name;

      const scoreEl = document.createElement('span');
      const safeStatus = sanitize(check.status);
      scoreEl.className = `corevalidate-check-score corevalidate-check-${safeStatus}`;
      scoreEl.textContent = String(check.score);

      checkEl.appendChild(nameEl);
      checkEl.appendChild(scoreEl);
      checksContainer.appendChild(checkEl);
    });

    const footer = document.createElement('div');
    footer.className = 'corevalidate-tooltip-footer';

    const link = document.createElement('a');
    link.href = `${API_URL}/dashboard`;
    link.target = '_blank';
    link.className = 'corevalidate-tooltip-link';
    link.textContent = 'View full report →';

    footer.appendChild(link);

    tooltip.appendChild(header);
    tooltip.appendChild(checksContainer);
    tooltip.appendChild(footer);

    return tooltip;
  }

  function getScoreLevel(score) {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  }

  function getVerdictLabel(verdict) {
    switch (verdict) {
      case 'authentic': return 'Trusted';
      case 'likely authentic': return 'Trusted';
      case 'suspicious': return 'Caution';
      case 'fake': return 'Untrusted';
      case 'untrusted': return 'Untrusted';
      default: return 'Unknown';
    }
  }

  async function verifyPage() {
    const now = Date.now();
    if (now - lastVerifyTime < VERIFY_COOLDOWN) {
      return;
    }
    lastVerifyTime = now;

    try {
      if (currentUrl.startsWith('chrome://') || 
          currentUrl.startsWith('chrome-extension://') ||
          currentUrl.startsWith('about:')) {
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${API_URL}/api/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: currentUrl, type: 'url' }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();

        if (typeof data.trustScore === 'number' && typeof data.verdict === 'string' && Array.isArray(data.checks)) {
          createBadge(data.trustScore, data.verdict, data.checks);

          api.storage.local.get('verifications').then((stored) => {
            const verifications = stored.verifications || [];
            verifications.unshift({
              trustScore: data.trustScore,
              verdict: data.verdict,
              checks: data.checks,
              url: currentUrl,
              timestamp: new Date().toISOString()
            });
            api.storage.local.set({ verifications: verifications.slice(0, 50) });
          });
        }
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('CoreValidate: Error verifying page', error);
      }
    }
  }

  let lastUrl = window.location.href;
  const observer = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      currentUrl = location.href;
      verifyPage();
    }
  });

  observer.observe(document.body || document.documentElement, { subtree: true, childList: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', verifyPage);
  } else {
    verifyPage();
  }

  api.runtime.onMessage.addListener((request, sender, sendResponse) => {
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
