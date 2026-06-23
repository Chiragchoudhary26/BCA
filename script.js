/* ============================================================
   BCA_HUB — script.js
   Smooth section slide-up navigation + all interactions
============================================================ */

/* ─────────────────────────────────────────────
   1. LOADER
───────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 900);
});

/* ─────────────────────────────────────────────
   2. FLOATING PARTICLES
───────────────────────────────────────────── */
(function spawnParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = window.innerWidth < 600 ? 14 : 28;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size  = Math.random() * 3 + 1;
    const left  = Math.random() * 100;
    const delay = Math.random() * 20;
    const dur   = Math.random() * 25 + 18;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${left}%;
      animation-delay:${delay}s;
      animation-duration:${dur}s;
    `;
    container.appendChild(p);
  }
})();

/* ─────────────────────────────────────────────
   3. NAVBAR SCROLL SHADOW
───────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ─────────────────────────────────────────────
   4. SMOOTH SLIDE-UP NAVIGATION
   
   Kaam kaise karta hai:
   - Navbar links click pe page scroll NAHI karta
   - Target section smoothly ek "new page" ki tarah
     upar se aata hai (slide-up animation)
   - Har section apni jagah scroll position yaad
     rakhta hai
───────────────────────────────────────────── */

// Map nav href → actual section id on page
const NAV_MAP = {
  'home':        'sec-home',
  'notes':       'sec-notes',
  'syllabus':    'sec-syllabus',
  'programming': 'sec-programming',
  'papers':      'sec-papers',
  'career':      'sec-career',
  'contact':     'sec-contact',
};

let isAnimating = false; // prevent rapid clicks

/**
 * navigateTo(targetId)
 * Smoothly scrolls the PAGE so the target section
 * slides into view from below → feels like "slide up"
 */
function navigateTo(targetId) {
  const sectionId = NAV_MAP[targetId] || targetId;
  const target = document.getElementById(sectionId);
  if (!target || isAnimating) return;

  isAnimating = true;

  const navHeight = navbar ? navbar.offsetHeight : 68;
  const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

  // Smooth scroll to that section
  window.scrollTo({ top: targetTop, behavior: 'smooth' });

  // Update active nav link
  updateActiveLink(targetId);

  // Allow next navigation after animation settles
  setTimeout(() => { isAnimating = false; }, 800);
}

/**
 * updateActiveLink(key)
 * Sets .active on the clicked nav link (desktop + mobile)
 */
function updateActiveLink(key) {
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    a.classList.remove('active');
    const href = a.getAttribute('data-target') || '';
    if (href === key) a.classList.add('active');
  });
}

// ── Attach click handlers to ALL nav links ──
function attachNavHandlers() {
  const allNavLinks = document.querySelectorAll('.nav-links a, .mobile-menu a, .nav-logo');
  allNavLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = link.getAttribute('data-target') || 'home';
      navigateTo(target);

      // Close mobile menu if open
      closeMobileMenu();
    });
  });

  // Logo → goes home
  const logo = document.querySelector('.nav-logo');
  if (logo) {
    logo.addEventListener('click', e => {
      e.preventDefault();
      navigateTo('home');
      closeMobileMenu();
    });
  }
}

/* ─────────────────────────────────────────────
   5. ACTIVE LINK ON SCROLL (IntersectionObserver)
   While user scrolls manually, active link updates
───────────────────────────────────────────── */
function setupScrollSpy() {
  const sectionEntries = Object.entries(NAV_MAP); // [['home','sec-home'], ...]

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Find which nav key matches this section id
        const found = sectionEntries.find(([, secId]) => secId === entry.target.id);
        if (found) updateActiveLink(found[0]);
      }
    });
  }, {
    rootMargin: `-${(navbar ? navbar.offsetHeight : 68) + 10}px 0px -60% 0px`,
    threshold: 0
  });

  sectionEntries.forEach(([, secId]) => {
    const el = document.getElementById(secId);
    if (el) observer.observe(el);
  });
}

/* ─────────────────────────────────────────────
   6. HAMBURGER + MOBILE MENU
───────────────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

function openMobileMenu() {
  if (!mobileMenu || !hamburger) return;
  hamburger.classList.add('open');
  mobileMenu.style.display = 'flex';
  // Force reflow before adding class for transition
  requestAnimationFrame(() => mobileMenu.classList.add('open'));
}

function closeMobileMenu() {
  if (!mobileMenu || !hamburger) return;
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  setTimeout(() => {
    if (!mobileMenu.classList.contains('open')) {
      mobileMenu.style.display = 'none';
    }
  }, 320);
}

if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('open');
    isOpen ? closeMobileMenu() : openMobileMenu();
  });
}

// Close mobile menu on outside click
document.addEventListener('click', e => {
  if (
    mobileMenu &&
    hamburger &&
    !mobileMenu.contains(e.target) &&
    !hamburger.contains(e.target) &&
    mobileMenu.classList.contains('open')
  ) {
    closeMobileMenu();
  }
});

/* ─────────────────────────────────────────────
   7. SCROLL REVEAL ANIMATION
───────────────────────────────────────────── */
function setupReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => revealObs.observe(el));
}

/* ─────────────────────────────────────────────
   8. SEARCH
───────────────────────────────────────────── */
function setupSearch() {
  const searchBtn   = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');
  if (!searchBtn || !searchInput) return;

  searchBtn.addEventListener('click', doSearch);
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') doSearch();
  });

  function doSearch() {
    const q = searchInput.value.trim();
    if (!q) { showToast('⚠️ Please enter a search term.'); return; }
    showToast(`🔍 Searching for "${q}"…`);
    searchInput.value = '';
  }
}

/* ─────────────────────────────────────────────
   9. CONTACT FORM
───────────────────────────────────────────── */
function setupContactForm() {
  const btn = document.getElementById('formSubmit');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const name  = document.getElementById('fname')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const msg   = document.getElementById('message')?.value.trim();
    if (!name || !email || !msg) { showToast('⚠️ Please fill in all required fields.'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { showToast('⚠️ Please enter a valid email.'); return; }
    showToast('✅ Message sent! We\'ll reply within 24 hours.');
    ['fname','email','subject','message'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
  });
}

/* ─────────────────────────────────────────────
   10. NOTE DOWNLOAD
───────────────────────────────────────────── */
function setupNoteDownloads() {
  document.querySelectorAll('.note-dl').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      showToast('📄 Download started!');
    });
  });
}

/* ─────────────────────────────────────────────
   11. CARD / RESOURCE LINKS
───────────────────────────────────────────── */
function setupCardLinks() {
  document.querySelectorAll('.card-link, .res-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      showToast('🚀 Opening resource…');
    });
  });
}

/* ─────────────────────────────────────────────
   12. FOOTER NAV LINKS (scroll to section)
───────────────────────────────────────────── */
function setupFooterLinks() {
  document.querySelectorAll('.footer-links a[data-target]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(a.getAttribute('data-target'));
    });
  });
}

/* ─────────────────────────────────────────────
   13. TOAST NOTIFICATION
───────────────────────────────────────────── */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
}

/* ─────────────────────────────────────────────
   14. HERO CTA BUTTONS
───────────────────────────────────────────── */
function setupHeroCTA() {
  const exploreBtn = document.getElementById('heroExplore');
  const notesBtn   = document.getElementById('heroNotes');
  if (exploreBtn) exploreBtn.addEventListener('click', e => { e.preventDefault(); navigateTo('notes'); });
  if (notesBtn)   notesBtn.addEventListener('click',   e => { e.preventDefault(); navigateTo('notes'); });
}

/* ─────────────────────────────────────────────
   15. INIT — Run everything after DOM ready
───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  attachNavHandlers();
  setupScrollSpy();
  setupReveal();
  setupSearch();
  setupContactForm();
  setupNoteDownloads();
  setupCardLinks();
  setupFooterLinks();
  setupHeroCTA();
});