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
  window.toastManager.show({
    message,
    variant,
    duration: 5000,
    position: 'top-right'
  });
}

// Example: Progress toast that updates
function showProgressToast() {
  const toastId = window.toastManager.show({
    message: 'Processing... 0%',
    variant: 'info',
    duration: 10000,
    id: 'progress-toast'
  });

  let progress = 0;
  const interval = setInterval(() => {
    progress += 20;
    if (progress <= 100) {
      window.toastManager.update(toastId, {
        message: `Processing... ${progress}%`,
        variant: progress === 100 ? 'success' : 'info'
      });
    }
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        window.toastManager.dismiss(toastId);
      }, 1000);
    }
  }, 500);
}

// Make it available globally for demo buttons
window.showProgressToast = showProgressToast;

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

// ═══ CARD INTERACTIONS ════════════════════════════════════════════════════════

// Interactive card click counter
const demoCard = document.querySelector('.demo-card');
const clickCountDisplay = document.querySelector('.click-count');
let clickCount = 0;

if (demoCard && clickCountDisplay) {
  demoCard.addEventListener('k:click', () => {
    clickCount++;
    clickCountDisplay.textContent = clickCount;
  });
}

// ═══ LIGHTBOX/GALLERY INTERACTIONS ════════════════════════════════════════════

/**
 * Open gallery lightbox at specific index
 * Used by image gallery demos in Section 21
 */
function openGalleryLightbox(index = 0) {
  const galleryLightbox = document.querySelector('#gallery-lightbox');
  if (galleryLightbox && typeof galleryLightbox.open === 'function') {
    galleryLightbox.open(index);
  }
}

// Make it available globally for onclick handlers
window.openGalleryLightbox = openGalleryLightbox;

console.log('🖼️ Lightbox/Gallery interactions loaded');
