/**
 * Playground Interactive Demos
 * Shows how users would interact with components using simple DOM manipulation
 */

// ═══ BADGE INTERACTIONS ═══════════════════════════════════════════════════════

function incrementBadge(selector) {
  const badge = document.querySelector(selector);
  if (!badge) return;
  const current = parseInt(badge.getAttribute('count') || '0', 10);
  badge.setAttribute('count', current + 1);
}

function decrementBadge(selector) {
  const badge = document.querySelector(selector);
  if (!badge) return;
  const current = parseInt(badge.getAttribute('count') || '0', 10);
  badge.setAttribute('count', Math.max(0, current - 1));
}

function setBadgeCount(selector, count) {
  const badge = document.querySelector(selector);
  if (!badge) return;
  badge.setAttribute('count', count);
}

function randomBadgeCount(selector, max = 200) {
  const badge = document.querySelector(selector);
  if (!badge) return;
  badge.setAttribute('count', Math.floor(Math.random() * max));
}

function toggleBadgeStatus(selector) {
  const badge = document.querySelector(selector);
  if (!badge) return;
  
  const v = badge.getAttribute('v') || '';
  
  if (v.includes('success')) {
    badge.setAttribute('v', v.replace('success', 'error'));
  } else if (v.includes('error')) {
    badge.setAttribute('v', v.replace('error', 'warning'));
  } else if (v.includes('warning')) {
    badge.setAttribute('v', v.replace('warning', 'success'));
  } else {
    badge.setAttribute('v', `${v} success`);
  }
}

function setBadgeStatus(selector, status) {
  const badge = document.querySelector(selector);
  if (!badge) return;
  
  const v = badge.getAttribute('v') || '';
  const newV = v.replace(/\b(success|error|warning|info|primary|default)\b/, status);
  badge.setAttribute('v', newV);
}

// ═══ BUTTON INTERACTIONS ═══════════════════════════════════════════════════════

function toggleButtonLoading(selector) {
  const button = document.querySelector(selector);
  if (!button) return;
  const v = button.getAttribute('v') || '';
  if (v.includes('loading')) {
    button.setAttribute('v', v.replace('loading', '').trim());
  } else {
    button.setAttribute('v', `${v} loading`.trim());
  }
}

function toggleButtonDisabled(selector) {
  const button = document.querySelector(selector);
  if (!button) return;
  const v = button.getAttribute('v') || '';
  if (v.includes('disabled')) {
    button.setAttribute('v', v.replace('disabled', '').trim());
  } else {
    button.setAttribute('v', `${v} disabled`.trim());
  }
}

// ═══ MODAL/DIALOG INTERACTIONS ═══════════════════════════════════════════════

function openModal(selector) {
  const modal = document.querySelector(selector);
  if (!modal) return;
  modal.setAttribute('open', '');
}

function closeModal(selector) {
  const modal = document.querySelector(selector);
  if (!modal) return;
  modal.removeAttribute('open');
}

// ═══ TOAST NOTIFICATIONS ═══════════════════════════════════════════════════════

function showToast(message, variant = 'info') {
  console.log(`Toast: [${variant}] ${message}`);
}

console.log('🎮 Playground interactive demos loaded');

// ═══ WIRE UP INTERACTIVE DEMOS ════════════════════════════════════════════════

// For more complex logic, use .onclick in JS file
document.querySelector('.btn-cart-add').onclick = () => {
  const badge = document.querySelector('.cart-badge');
  const count = parseInt(badge.getAttribute('count') || '0');
  badge.setAttribute('count', count + 1);
};

document.querySelector('.btn-notif-random').onclick = () => {
  const random = Math.floor(Math.random() * 200);
  document.querySelector('#notif-badge').setAttribute('count', random);
};

document.querySelector('.btn-toggle').onclick = () => {
  const badge = document.querySelector('.status-demo');
  const v = badge.getAttribute('v');
  
  if (v.includes('success')) {
    badge.setAttribute('v', v.replace('success', 'error'));
  } else if (v.includes('error')) {
    badge.setAttribute('v', v.replace('error', 'warning'));
  } else {
    badge.setAttribute('v', v.replace('warning', 'success'));
  }
};
