/* -------- LOADER -------- */
window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('loader').classList.add('hidden');
    }, 900);
  });
  
  /* -------- PARTICLES -------- */
  (function spawnParticles() {
    const container = document.getElementById('particles');
    const count = window.innerWidth < 600 ? 14 : 28;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 3 + 1;
      const left = Math.random() * 100;
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
  
  /* -------- NAVBAR SCROLL & SCROLL PROGRESS -------- */
  const navbar = document.getElementById('navbar');
  const myBar = document.getElementById('myBar');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    // Navbar Shadow
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    highlightNav();

    // Scroll Progress Bar
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    if(myBar) myBar.style.width = scrolled + "%";

    // Back to top button visibility
    if (winScroll > 300) {
        backToTop.style.display = "block";
    } else {
        backToTop.style.display = "none";
    }
  }, { passive: true });
  
  /* -------- BACK TO TOP ACTION -------- */
  if(backToTop) {
      backToTop.addEventListener('click', () => {
          document.body.scrollTop = 0; // For Safari
          document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
      });
  }

  /* -------- HAMBURGER -------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    if (open) {
      mobileMenu.classList.add('open');
      mobileMenu.style.display = 'flex';
      requestAnimationFrame(() => {
        mobileMenu.style.transform = 'translateY(0)';
        mobileMenu.style.opacity  = '1';
      });
    } else {
      mobileMenu.style.transform = 'translateY(-20px)';
      mobileMenu.style.opacity  = '0';
      setTimeout(() => { mobileMenu.style.display = 'none'; mobileMenu.classList.remove('open'); }, 300);
    }
  });
  
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.style.transform = 'translateY(-20px)';
      mobileMenu.style.opacity  = '0';
      setTimeout(() => { mobileMenu.style.display = 'none'; mobileMenu.classList.remove('open'); }, 300);
    });
  });
  
  /* -------- ACTIVE NAV HIGHLIGHT -------- */
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = ['home','features','popular-notes','resources','contact'];
  function highlightNav() {
    let current = '';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 120) current = id;
    });
    navLinks.forEach(a => {
      a.classList.remove('active');
      const href = a.getAttribute('href').replace('#','');
      if (href === current || (current === 'features' && href === 'home')) a.classList.add('active');
      if (href === current) a.classList.add('active');
    });
  }
  
  /* -------- SCROLL REVEAL -------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObserver.observe(el));
  
  /* -------- SEARCH -------- */
  document.getElementById('searchBtn').addEventListener('click', doSearch);
  document.getElementById('searchInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') doSearch();
  });
  function doSearch() {
    const q = document.getElementById('searchInput').value.trim();
    if (!q) return showToast('Please enter a search term.');
    showToast(`Searching for "${q}"…`);
    document.getElementById('searchInput').value = '';
  }
  
  /* -------- CONTACT FORM -------- */
  document.getElementById('formSubmit').addEventListener('click', () => {
    const name  = document.getElementById('fname').value.trim();
    const email = document.getElementById('email').value.trim();
    const msg   = document.getElementById('message').value.trim();
    if (!name || !email || !msg) {
      showToast('Please fill in all required fields.'); return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      showToast('Please enter a valid email address.'); return;
    }
    showToast('✅ Message sent! We\'ll reply within 24 hours.');
    document.getElementById('fname').value = '';
    document.getElementById('email').value = '';
    document.getElementById('subject').value = '';
    document.getElementById('message').value = '';
  });
  
  /* -------- TOAST -------- */
  let toastTimer;
  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
  }
  
  /* -------- NOTE DOWNLOAD CLICK -------- */
  document.querySelectorAll('.note-dl').forEach(btn => {
    btn.addEventListener('click', e => {
        // If it's a real link, let it open normally
        if(btn.getAttribute('href') !== "LINK_PASTE_HERE" && btn.getAttribute('href') !== "#") {
            showToast('📄 Opening File...');
            return; 
        }
        e.preventDefault();
        showToast('📄 Please update the Google Drive link!');
    });
  });
  
  /* -------- RESOURCE / CARD LINKS -------- */
  document.querySelectorAll('.card-link, .res-btn').forEach(btn => {
    btn.addEventListener('click', e => {
        if(btn.getAttribute('href') !== "LINK_PASTE_HERE" && !btn.getAttribute('href').startsWith("#")) {
            return; // Let real links open normally
        }
        if(btn.getAttribute('href') === "LINK_PASTE_HERE"){
            e.preventDefault();
            showToast('🚀 Please update the Drive link!');
        }
    });
  });

  /* -------- FAQ ACCORDION -------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      // Close other open faqs
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
            otherItem.classList.remove('active');
        }
      });
      item.classList.toggle('active');
    });
  });

  /* -------- DYNAMIC TYPING EFFECT -------- */
  const textArray = ["Coding.", "Smarter.", "Faster.", "BCA."];
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingElement = document.querySelector(".typing-text");

  function typeEffect() {
      const currentText = textArray[textIndex];
      
      if(isDeleting) {
          typingElement.textContent = currentText.substring(0, charIndex - 1);
          charIndex--;
      } else {
          typingElement.textContent = currentText.substring(0, charIndex + 1);
          charIndex++;
      }

      let typingSpeed = isDeleting ? 50 : 100;

      if (!isDeleting && charIndex === currentText.length) {
          typingSpeed = 2000; // Pause at end of word
          isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          textIndex = (textIndex + 1) % textArray.length;
          typingSpeed = 500; // Pause before typing next word
      }

      setTimeout(typeEffect, typingSpeed);
  }

  // Start the typing effect once DOM is loaded
  if(typingElement) {
      setTimeout(typeEffect, 1000); // Slight delay before starting
  }
