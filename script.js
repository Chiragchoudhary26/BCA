/* ============================================
   BCA_HUB - JavaScript
   Author: BCA_HUB Team
   Version: 2.0 (2026)
   ============================================ */

'use strict';

/* ============================================
   1. DOM READY
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initParticles();
  initNavbar();
  initScrollReveal();
  initStatCounters();
  initSearch();
  initTestimonialSlider();
  initContactForm();
  initBackToTop();
  initFooterYear();
  initNewsletter();
  initKeyboardAccessibility();
  initHeroTypewriter();
  console.log('%c✅ BCA_HUB Loaded Successfully!', 'color:#8A95A5;font-size:14px;font-weight:bold;');
});

/* ============================================
   2. LOADING SCREEN
   ============================================ */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Hide loader after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 2000); // 2s for progress bar animation to complete
  });

  // Prevent scrolling while loading
  document.body.style.overflow = 'hidden';
}

/* ============================================
   3. FLOATING PARTICLES
   ============================================ */
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const colors = ['#06b6d4', '#8b5cf6', '#1e3a8a', '#10b981', '#06b6d4'];
  const count = window.innerWidth < 600 ? 18 : 35;

  for (let i = 0; i < count; i++) {
    createParticle(container, colors);
  }
}

function createParticle(container, colors) {
  const p = document.createElement('div');
  p.className = 'particle';

  const size = Math.random() * 4 + 2;
  const color = colors[Math.floor(Math.random() * colors.length)];
  const left = Math.random() * 100;
  const duration = Math.random() * 12 + 6;
  const delay = Math.random() * 10;
  const drift = (Math.random() - 0.5) * 200;
  const opacity = Math.random() * 0.4 + 0.1;

  p.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${left}%;
    bottom: -10px;
    background: ${color};
    opacity: ${opacity};
    box-shadow: 0 0 ${size * 2}px ${color};
    --duration: ${duration}s;
    --delay: ${delay}s;
    --drift: ${drift}px;
  `;

  container.appendChild(p);

  // Recreate particle after animation ends
  const totalTime = (duration + delay) * 1000;
  setTimeout(() => {
    p.remove();
    createParticle(container, colors);
  }, totalTime);
}

/* ============================================
   4. NAVBAR
   ============================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const links = navLinks ? navLinks.querySelectorAll('.nav-link') : [];
  const navOverlay = document.getElementById('navOverlay');

  if (!navbar) return;

  let lastScrollY = window.scrollY;

  // Scroll effect
  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    // Add/remove scrolled class
    if (currentScrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Hide navbar on scroll down, show on scroll up
    if (currentScrollY > lastScrollY && currentScrollY > 120) {
      if (navLinks && !navLinks.classList.contains('open')) {
        navbar.classList.add('nav-hidden');
      }
    } else {
      navbar.classList.remove('nav-hidden');
    }

    lastScrollY = currentScrollY;
    updateActiveLink();
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Hamburger toggle
  if (hamburger && navLinks) {
    const toggleMobileMenu = () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen.toString());
      if (navOverlay) navOverlay.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    const closeMobileMenu = () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      if (navOverlay) navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', toggleMobileMenu);
    if (navOverlay) navOverlay.addEventListener('click', closeMobileMenu);

    // Close menu on link click
    links.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }
}

/* Active nav link based on scroll position */
function updateActiveLink() {
  const sections = ['home', 'notes', 'syllabus', 'programming', 'papers', 'updates', 'career', 'contact'];
  const navLinks = document.querySelectorAll('.nav-link');

  let current = 'home';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= 120) current = id;
    }
  });

  navLinks.forEach(link => {
    const section = link.getAttribute('data-section');
    link.classList.toggle('active', section === current);
  });
}

/* ============================================
   5. SCROLL REVEAL ANIMATIONS
   ============================================ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger animation for sibling elements
        const siblings = entry.target.parentElement.querySelectorAll('.reveal:not(.visible)');
        let delay = 0;
        siblings.forEach((sib, idx) => {
          if (sib === entry.target) delay = idx * 80;
        });

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, Math.min(delay, 400));

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ============================================
   6. STATS COUNTER ANIMATION
   ============================================ */
function initStatCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const duration = 2000;
  const step = Math.ceil(target / (duration / 16));
  let current = 0;

  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = formatNumber(current);
    if (current >= target) clearInterval(timer);
  }, 16);
}

function formatNumber(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'K';
  return n.toString();
}

/* ============================================
   7. SEARCH FUNCTIONALITY
   ============================================ */
function initSearch() {
  const input = document.getElementById('searchInput');
  const btn = document.getElementById('searchBtn');
  const searchBox = document.getElementById('search-box');

  if (!input || !btn) return;

  // Search button click
  btn.addEventListener('click', performSearch);

  // Enter key
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
  });

  // Input focus glow
  input.addEventListener('focus', () => {
    searchBox.style.setProperty('border-color', 'var(--accent-cyan)');
  });
  input.addEventListener('blur', () => {
    searchBox.style.removeProperty('border-color');
  });
}

function fillSearch(term) {
  const input = document.getElementById('searchInput');
  if (input) {
    input.value = term;
    input.focus();
    // Visual feedback on tag click
    performSearch();
  }
}

function performSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;

  const query = input.value.trim().toLowerCase();
  if (!query) {
    shakeSearchBox();
    return;
  }

  // Mapping search terms to sections
  const searchMap = {
    'bca notes': '#notes',
    'notes': '#notes',
    'python': '#programming',
    'c programming': '#programming',
    'programming': '#programming',
    'web dev': '#features',
    'web development': '#features',
    'previous papers': '#papers',
    'prev papers': '#papers',
    'papers': '#papers',
    'career': '#career',
    'syllabus': '#syllabus',
    'practical': '#features',
  };

  let targetId = '#features';
  for (const [key, val] of Object.entries(searchMap)) {
    if (query.includes(key)) { targetId = val; break; }
  }

  const target = document.querySelector(targetId);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    flashHighlight(target);
  }

  // Visual feedback
  const btn = document.getElementById('searchBtn');
  if (btn) {
    btn.innerHTML = '<i class="fas fa-check"></i>';
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-arrow-right"></i>';
      btn.style.background = '';
    }, 1500);
  }
}

function shakeSearchBox() {
  const box = document.getElementById('search-box');
  if (!box) return;
  box.style.animation = 'shake 0.4s ease';
  setTimeout(() => box.style.animation = '', 400);
}

function flashHighlight(el) {
  el.style.transition = 'box-shadow 0.3s ease';
  el.style.boxShadow = '0 0 0 4px rgba(6,182,212,0.4)';
  setTimeout(() => el.style.boxShadow = '', 1000);
}

// Add shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-8px); }
    40%, 80% { transform: translateX(8px); }
  }
`;
document.head.appendChild(shakeStyle);

/* ============================================
   8. TESTIMONIAL SLIDER
   ============================================ */
function initTestimonialSlider() {
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('sliderDots');

  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const total = cards.length;
  if (!total) return;

  let currentIndex = 0;
  let autoplayTimer = null;
  let cardsPerView = window.innerWidth < 900 ? 1 : 2;

  // Create dots
  const dots = [];
  const numDots = Math.ceil(total / cardsPerView);

  for (let i = 0; i < numDots; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
    dots.push(dot);
  }

  function goTo(index) {
    currentIndex = (index + numDots) % numDots;
    const cardWidth = cards[0].offsetWidth + 24; // gap = 24px
    track.style.transform = `translateX(-${currentIndex * cardsPerView * cardWidth}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
    resetAutoplay();
  }

  function next() { goTo(currentIndex + 1); }
  function prev() { goTo(currentIndex - 1); }

  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);

  // Autoplay
  function startAutoplay() {
    autoplayTimer = setInterval(next, 4000);
  }
  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  startAutoplay();

  // Pause on hover
  track.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
  track.addEventListener('mouseleave', startAutoplay);

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) { delta > 0 ? next() : prev(); }
  }, { passive: true });

  // Resize handler
  window.addEventListener('resize', () => {
    cardsPerView = window.innerWidth < 900 ? 1 : 2;
    goTo(0);
  });
}

/* ============================================
   9. CONTACT FORM
   ============================================ */
function initContactForm() {
  const form = document.getElementById('contactFormEl');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName');
    const email = document.getElementById('contactEmail');
    const message = document.getElementById('contactMessage');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const msgError = document.getElementById('msgError');
    const success = document.getElementById('formSuccess');

    // Reset errors
    [nameError, emailError, msgError].forEach(el => { if (el) el.textContent = ''; });

    let valid = true;

    // Validate name
    if (!name || name.value.trim().length < 2) {
      if (nameError) nameError.textContent = 'Please enter your full name (at least 2 characters).';
      valid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.value.trim())) {
      if (emailError) emailError.textContent = 'Please enter a valid email address.';
      valid = false;
    }

    // Validate message
    if (!message || message.value.trim().length < 10) {
      if (msgError) msgError.textContent = 'Please write a message (at least 10 characters).';
      valid = false;
    }

    if (!valid) return;

    // Submit animation
    const btn = document.getElementById('submitBtn');
    if (btn) {
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;
    }

    // Simulate API call
    setTimeout(() => {
      form.reset();
      if (btn) {
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        btn.disabled = false;
      }
      if (success) success.classList.add('show');
      setTimeout(() => { if (success) success.classList.remove('show'); }, 5000);
    }, 1800);
  });

  // Real-time input highlight
  const inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const errorId = input.id.replace('contact', '').toLowerCase() + 'Error';
      const errorEl = document.getElementById(errorId.charAt(0).toUpperCase() + errorId.slice(1));
      if (errorEl) errorEl.textContent = '';
    });
  });
}

/* ============================================
   10. BACK TO TOP BUTTON
   ============================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================
   11. FOOTER YEAR
   ============================================ */
function initFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ============================================
   12. NEWSLETTER
   ============================================ */
function initNewsletter() {
  const btn = document.getElementById('newsletterBtn');
  const input = document.getElementById('newsletterEmail');
  if (!btn || !input) return;

  btn.addEventListener('click', () => {
    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      input.style.borderColor = 'var(--red)';
      input.placeholder = 'Enter valid email!';
      setTimeout(() => {
        input.style.borderColor = '';
        input.placeholder = 'Your email...';
      }, 2000);
      return;
    }

    // Success feedback
    btn.innerHTML = '<i class="fas fa-check"></i>';
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    input.value = '';
    input.placeholder = 'Subscribed! Thank you 🎉';

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-arrow-right"></i>';
      btn.style.background = '';
      input.placeholder = 'Your email...';
    }, 3000);
  });

  // Enter key
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') btn.click();
  });
}

/* ============================================
   13. KEYBOARD ACCESSIBILITY
   ============================================ */
function initKeyboardAccessibility() {
  // Cards keyboard navigation
  const cards = document.querySelectorAll('.card, .popular-card, .update-card, .resource-item');
  cards.forEach(card => {
    card.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const link = card.querySelector('a');
        if (link) link.click();
      }
    });
  });

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ============================================
   14. DYNAMIC HOVER GLOW ON CARDS
   ============================================ */
document.addEventListener('mousemove', (e) => {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    }
  });
});

/* ============================================
   15. PAGE VISIBILITY API (Pause animations)
   ============================================ */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    document.body.classList.add('paused');
  } else {
    document.body.classList.remove('paused');
  }
});

/* ============================================
   16. PERFORMANCE: Lazy Loading Images
   ============================================ */
if ('IntersectionObserver' in window) {
  const lazyImages = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });
  lazyImages.forEach(img => imageObserver.observe(img));
}

/* ============================================
   17. TYPED EFFECT ON HERO SUBTITLE
   ============================================ */
function initTypedEffect() {
  const taglines = [
    '🚀 Happy Learning!',
    '📚 Study Smart, Score High!',
    '💡 Knowledge is Power!',
    '🎓 Your BCA Journey Starts Here!'
  ];

  const el = document.querySelector('.hero-tagline');
  if (!el) return;

  let idx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function type() {
    const current = taglines[idx];
    if (!isDeleting) {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        isDeleting = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        idx = (idx + 1) % taglines.length;
      }
    }
    setTimeout(type, isDeleting ? 40 : 60);
  }

  // Start after page loads
  setTimeout(type, 3000);
}

window.addEventListener('load', initTypedEffect);

/* ============================================
   18. SCROLL PROGRESS BAR
   ============================================ */
(function initScrollProgress() {
  const bar = document.createElement('div');
  bar.id = 'scrollProgress';
  bar.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #FAF9F6, #8A95A5);
    z-index: 9998;
    transition: width 0.1s linear;
    border-radius: 0 2px 2px 0;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ============================================
   19. TYPEWRITER ANIMATION FOR HERO MAIN TITLE
   ============================================ */
function initHeroTypewriter() {
  const textEl = document.getElementById('typingHeroText');
  if (!textEl) return;

  const phrases = [
    'BCA_HUB 🎓',
    'Your BCA Guide 🎓',
    'Learn · Grow · Succeed 🎓'
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function type() {
    const currentPhrase = phrases[phraseIdx];

    if (isDeleting) {
      textEl.textContent = currentPhrase.substring(0, charIdx - 1);
      charIdx--;
      typeSpeed = 40; // faster deleting
    } else {
      textEl.textContent = currentPhrase.substring(0, charIdx + 1);
      charIdx++;
      typeSpeed = 100; // normal typing
    }

    if (!isDeleting && charIdx === currentPhrase.length) {
      isDeleting = true;
      typeSpeed = 2000; // pause at the end of phrase
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typeSpeed = 500; // pause before typing next phrase
    }

    setTimeout(type, typeSpeed);
  }

  type();
}
