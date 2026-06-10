/* ==============================================
   ATN's Junior & Degree College — Main Script
   ============================================== */
'use strict';
/* ── Utility ── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
/* ────────────────────────────────────────────
   ANNOUNCEMENT BAR
──────────────────────────────────────────── */
(function initAnnouncement() {
  const bar    = $('#announcementBar');
  const close  = $('#annClose');
  const header = $('#siteHeader');
  const nav    = $('#siteNav');
  function hideAnn() {
    bar.style.display = 'none';
    header.classList.add('ann-hidden');
    nav.classList.add('ann-hidden');
  }
  if (close) {
    close.addEventListener('click', hideAnn);
  }
})();
/* ────────────────────────────────────────────
   HERO SLIDER
──────────────────────────────────────────── */
(function initSlider() {
  const slides  = $$('.hero-slide');
  const dots    = $$('.dot');
  const prevBtn = $('#sliderPrev');
  const nextBtn = $('#sliderNext');
  if (!slides.length) return;
  let current   = 0;
  let autoTimer = null;
  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }
  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }
  function stopAuto() {
    clearInterval(autoTimer);
  }
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startAuto(); });
  });
  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });
  const sliderContainer = $('.hero-section');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', stopAuto);
    sliderContainer.addEventListener('mouseleave', startAuto);
  }
  startAuto();
})();
/* ────────────────────────────────────────────
   STICKY NAV + ACTIVE LINK
──────────────────────────────────────────── */
(function initNav() {
  const nav       = $('#siteNav');
  const header    = $('#siteHeader');
  const navLinks  = $$('.nav-link');
  const hamburger = $('#navHamburger');
  const navMenu   = $('#navLinks');
  // Hamburger toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });
    // Close on link click
    navMenu.addEventListener('click', (e) => {
      if (e.target.classList.contains('nav-link')) {
        navMenu.classList.remove('open');
      }
    });
  }
  // Active section tracking
  const sections = $$('section[id], div[id]');
  function updateActiveLink() {
    const scrollY = window.scrollY + 160;
    let active = null;
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollY) active = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (active && link.getAttribute('href') === `#${active}`) {
        link.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
})();
/* ────────────────────────────────────────────
   SMOOTH SCROLL
──────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 155; // header + nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
/* ────────────────────────────────────────────
   COUNTER ANIMATION
──────────────────────────────────────────── */
(function initCounters() {
  const counters = $$('.stat-number');
  let started    = false;
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = target === 2009 ? 1200 : 1600;
    const start    = target === 2009 ? 1990 : 0;
    const range    = target - start;
    const startTime = performance.now();
    function update(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.floor(start + range * easeOut(progress));
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString() + suffix;
    }
    requestAnimationFrame(update);
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        counters.forEach(animateCounter);
        observer.disconnect();
      }
    });
  }, { threshold: 0.4 });
  const statsSection = $('#stats');
  if (statsSection) observer.observe(statsSection);
})();
/* ────────────────────────────────────────────
   SCROLL-TRIGGERED ANIMATIONS
──────────────────────────────────────────── */
(function initScrollAnimations() {
  // Add fade-up class to key elements
  const targets = [
    '.stat-card', '.about-text', '.about-timeline',
    '.vm-card', '.leader-card', '.asst-card',
    '.course-card', '.trust-card', '.facility-card',
    '.partner-logo-wrap', '.gallery-item', '.timeline-item',
    '.adm-highlight', '.contact-detail-item',
  ];
  targets.forEach(sel => {
    $$(sel).forEach((el, i) => {
      el.classList.add('fade-up');
      el.style.transitionDelay = `${(i % 5) * 0.08}s`;
    });
  });
  const fadeIns = [
    '.section-header', '.section-tag', '.hero-badge',
    '.admission-info', '.portal-preview-wrap'
  ];
  fadeIns.forEach(sel => {
    $$(sel).forEach(el => el.classList.add('fade-in'));
  });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.fade-up, .fade-in').forEach(el => observer.observe(el));
})();
/* ────────────────────────────────────────────
   BACK TO TOP
──────────────────────────────────────────── */
(function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
/* ────────────────────────────────────────────
   ENQUIRY FORM
──────────────────────────────────────────── */
(function initEnquiryForm() {
  const form    = $('#enquiryForm');
  const success = $('#formSuccess');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const name   = $('#fullName').value.trim();
    const mobile = $('#mobileNumber').value.trim();
    const course = $('#courseInterested').value;
    // Basic validation
    const errors = [];
    if (!name)   errors.push('Full Name is required.');
    if (!mobile || !/^[\d\s\+\-]{10,15}$/.test(mobile)) errors.push('Valid Mobile Number is required.');
    if (!course) errors.push('Please select a course.');
    if (errors.length) {
      showFormError(errors[0]);
      return;
    }
    // Simulate submission
    const submitBtn = $('#submitEnquiryBtn');
    submitBtn.textContent = 'Submitting…';
    submitBtn.disabled = true;
    setTimeout(() => {
      form.style.display = 'none';
      success.style.display = 'block';
    }, 1200);
  });
  function showFormError(msg) {
    let errEl = form.querySelector('.form-error-msg');
    if (!errEl) {
      errEl = document.createElement('p');
      errEl.className = 'form-error-msg';
      errEl.style.cssText = 'color:#c0392b;font-size:0.85rem;margin-top:8px;font-weight:500;';
      form.appendChild(errEl);
    }
    errEl.textContent = '⚠️ ' + msg;
    setTimeout(() => { if (errEl) errEl.textContent = ''; }, 4000);
  }
})();
/* ────────────────────────────────────────────
   CONTACT FORM
──────────────────────────────────────────── */
(function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = $('#contactSubmitBtn');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = '✅ Message Sent!';
      btn.style.background = '#27ae60';
      form.reset();
      setTimeout(() => {
        btn.textContent = 'Send Message →';
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 1000);
  });
})();
/* ────────────────────────────────────────────
   PORTAL SIDEBAR INTERACTIVITY
──────────────────────────────────────────── */
(function initPortal() {
  const menuItems = $$('.portal-menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      menuItems.forEach(m => m.classList.remove('active-menu'));
      item.classList.add('active-menu');
    });
  });
})();
/* ────────────────────────────────────────────
   GALLERY LIGHTBOX (simple)
──────────────────────────────────────────── */
(function initGallery() {
  const items = $$('.gallery-item');
  // Build lightbox
  const lb = document.createElement('div');
  lb.id = 'galleryLightbox';
  lb.style.cssText = `
    display:none; position:fixed; inset:0; z-index:9999;
    background:rgba(12,39,64,0.96); align-items:center;
    justify-content:center; padding:20px; cursor:zoom-out;
  `;
  const lbImg = document.createElement('img');
  lbImg.style.cssText = 'max-width:90vw;max-height:88vh;border-radius:10px;object-fit:contain;box-shadow:0 20px 60px rgba(0,0,0,0.5);';
  const lbClose = document.createElement('button');
  lbClose.textContent = '✕';
  lbClose.setAttribute('aria-label', 'Close lightbox');
  lbClose.style.cssText = `
    position:absolute; top:20px; right:28px;
    color:#fff; font-size:2rem; background:none; border:none;
    cursor:pointer; opacity:0.8; transition:opacity 0.2s;
  `;
  lb.appendChild(lbImg);
  lb.appendChild(lbClose);
  document.body.appendChild(lb);
  function openLightbox(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt;
    lb.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lb.style.display = 'none';
    document.body.style.overflow = '';
  }
  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) openLightbox(img.src, img.alt);
    });
  });
  lbClose.addEventListener('click', closeLightbox);
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
})();
/* ────────────────────────────────────────────
   FLOATING WHATSAPP PULSE
──────────────────────────────────────────── */
(function initWhatsAppFloat() {
  const fab = document.createElement('a');
  fab.href = 'https://wa.me/919848789698?text=Hello%20ATN\'s%20College%2C%20I%20would%20like%20to%20enquire%20about%20admissions.';
  fab.target = '_blank';
  fab.rel = 'noopener noreferrer';
  fab.id = 'whatsappFAB';
  fab.setAttribute('aria-label', 'Chat on WhatsApp');
  fab.innerHTML = `
    <span style="font-size:1.6rem;">💬</span>
    <span class="fab-label">WhatsApp</span>
  `;
  fab.style.cssText = `
    position:fixed; bottom:90px; right:24px; z-index:800;
    background:#25D366; color:#fff;
    display:flex; align-items:center; gap:8px;
    padding:12px 16px; border-radius:50px;
    font-weight:700; font-size:0.85rem;
    box-shadow:0 4px 20px rgba(37,211,102,0.45);
    text-decoration:none;
    transition:transform 0.3s ease, box-shadow 0.3s ease;
    animation: waPulse 2.5s ease-in-out infinite;
  `;
  const style = document.createElement('style');
  style.textContent = `
    @keyframes waPulse {
      0%,100%{box-shadow:0 4px 20px rgba(37,211,102,0.45);}
      50%{box-shadow:0 4px 32px rgba(37,211,102,0.75), 0 0 0 8px rgba(37,211,102,0.1);}
    }
    #whatsappFAB:hover {
      transform:translateY(-4px) scale(1.04);
      box-shadow:0 8px 30px rgba(37,211,102,0.55);
    }
    @media(max-width:480px){
      #whatsappFAB .fab-label{display:none;}
      #whatsappFAB{border-radius:50%;width:52px;height:52px;padding:0;justify-content:center;}
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(fab);
})();
/* ────────────────────────────────────────────
   NAV SCROLL SHADOW
──────────────────────────────────────────── */
(function initNavShadow() {
  const header = $('#siteHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.style.boxShadow = '0 4px 20px rgba(18,57,91,0.15)';
    } else {
      header.style.boxShadow = '0 2px 8px rgba(18,57,91,0.08)';
    }
  }, { passive: true });
})();
/* ────────────────────────────────────────────
   FALLBACK: Logo image error handler
──────────────────────────────────────────── */
(function handleLogoFallback() {
  const logos = $$('img[alt*="Logo"]');
  logos.forEach(img => {
    img.addEventListener('error', function () {
      this.style.display = 'none';
      const fallback = document.createElement('div');
      fallback.style.cssText = `
        width:64px;height:64px;border-radius:50%;
        background:linear-gradient(135deg,#12395B,#1A4A73);
        border:2px solid #D4A24C;display:flex;
        align-items:center;justify-content:center;
        font-family:'Playfair Display',serif;
        font-size:1.1rem;font-weight:800;
        color:#D4A24C;letter-spacing:0.05em;
      `;
      fallback.textContent = 'ATN';
      this.parentNode.insertBefore(fallback, this);
    });
  });
})();
/* ────────────────────────────────────────────
   GALLERY MODAL
──────────────────────────────────────────── */
(function initGalleryModal() {
  const viewAllBtn = document.getElementById('viewAllGalleryBtn');
  const galleryModal = document.getElementById('galleryModal');
  const galleryModalClose = document.getElementById('galleryModalClose');
  if (viewAllBtn && galleryModal) {
    viewAllBtn.addEventListener('click', (e) => {
      e.preventDefault();
      galleryModal.classList.add('show');
      document.body.style.overflow = 'hidden';
    });
  }
  if (galleryModalClose && galleryModal) {
    const closeAndStopVideos = () => {
      galleryModal.classList.remove('show');
      document.body.style.overflow = '';
      
      // Stop videos playing when modal closes
      const iframes = galleryModal.querySelectorAll('iframe');
      iframes.forEach(iframe => {
        const src = iframe.src;
        iframe.src = src; 
      });
    };
    galleryModalClose.addEventListener('click', closeAndStopVideos);
    // Close on outside click
    window.addEventListener('click', (e) => {
      if (e.target === galleryModal) {
        closeAndStopVideos();
      }
    });
  }
})();

/* ────────────────────────────────────────────
   FACEBOOK GALLERY SLIDER
──────────────────────────────────────────── */
(function initFacebookSlider() {
  const slides = $$('.facebook-slide');
  const dots = $$('.fb-dot');
  const prevBtn = $('#fbPrevBtn');
  const nextBtn = $('#fbNextBtn');
  
  if (!slides.length) return;
  
  let currentSlide = 0;
  let autoTimer = null;
  
  function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }
  
  function nextSlide() {
    showSlide(currentSlide + 1);
    startAutoSlide();
  }
  
  function prevSlide() {
    showSlide(currentSlide - 1);
    startAutoSlide();
  }
  
  function startAutoSlide() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 6000);
  }
  
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  
  showSlide(0);
  startAutoSlide();
  
  // Stop auto-slide on hover
  const slider = $('#facebookSlider');
  if (slider) {
    slider.addEventListener('mouseenter', () => clearInterval(autoTimer));
    slider.addEventListener('mouseleave', startAutoSlide);
  }
})();

function goToFacebookSlide(n) {
  const slides = $$('.facebook-slide');
  const dots = $$('.fb-dot');
  
  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  
  slides[n].classList.add('active');
  dots[n].classList.add('active');
}

/* ────────────────────────────────────────────
   FACULTY PROFILE MODAL
──────────────────────────────────────────── */
const facultyData = {
  1: {
    name: 'A.C. Mohan Krishna',
    designation: 'Correspondent',
    qualification: 'M.Com.',
    subjects: 'Corporate Accounting, Business Statistics, Cost and Management Accounts',
    experience: '14 Year Teaching Experience, 14 Years Audit Experience. Handled more than 20 batches of CA. Author for study materials.',
    image: 'assets/mohan_krishna.png?v=2'
  },
  2: {
    name: 'A. Thirumaleswara Naidu',
    designation: 'Director',
    qualification: 'M.Com., CA',
    subjects: 'Fundamentals of Accounting, Advanced Accounting, Cost Accounting, Taxation',
    experience: '14 Year Teaching Experience, 17 Years Practical Experience as auditor. Handled more than 20 batches of CA. Guest Faculty in ICAI.',
    image: 'assets/thirumaleswara_naidu.png?v=2'
  },
  3: {
    name: 'G. Narendra Kumar',
    designation: 'Director & Principal',
    qualification: 'M.Com.',
    subjects: 'Motivation Sections, Personality Development',
    experience: '14 year Teaching Experience',
    image: 'assets/narendra_kumar.png?v=2'
  },
  4: {
    name: 'Y. Hari',
    designation: 'Assistant Director',
    qualification: 'M.Com., MBA',
    subjects: 'Financial Accounting, Cost Accounting, Management Accounting',
    experience: '7 year Experience',
    image: 'assets/profile.png?v=2'
  },
  5: {
    name: 'K. Poornima',
    designation: 'Assistant Director',
    qualification: 'M.Com., CA (Final)',
    subjects: 'Mercantile Law, Fundamentals of Accounting, Auditing & Taxation, Management Accounting',
    experience: '7 year Experience',
    image: 'assets/profile.png?v=2'
  },
  6: {
    name: 'B. Siva Krishna',
    designation: 'Assistant Director',
    qualification: 'M.Com., MBA',
    subjects: 'CRT Trainer, Personality Development',
    experience: '7 year experience',
    image: 'assets/profile.png?v=2'

  },
  7: {
    name: 'A. Raj Kumar',
    designation: 'Assistant Director',
    qualification: 'M.Com., MBA',
    subjects: 'Commerce, Business Organisation, Business Environment',
    experience: '7 Year Experience',
    image: 'assets/profile.png?v=2'
  },
  8: {
    name: 'Murali Krishna',
    designation: 'Faculty',
    qualification: 'MBA',
    subjects: 'Law, Strategic Management, Ethics & Communications',
    experience: '17 Year Experience',
    image: 'assets/profile.png?v=2'
  },
  9: {
    name: 'P. Vasu',
    designation: 'Faculty',
    qualification: 'M.A., Economics',
    subjects: 'General Economics, Business Environment',
    experience: '18 Year Experience',
    image: 'assets/profile.png?v=2'
  },
  10: {
    name: 'B. Siva Kumar',
    designation: 'Faculty',
    qualification: 'MBA',
    subjects: 'Management',
    experience: '4 year Experience',
    image: 'assets/profile.png?v=2'
  },
  11: {
    name: 'R. Jyothi',
    designation: 'Faculty',
    qualification: 'MA (English)',
    subjects: 'English Language & Communication',
    experience: '10 year Experience',
    image: 'assets/profile.png?v=2'
  },
  12: {
    name: 'Kiran',
    designation: 'Faculty',
    qualification: 'M.Sc. (Computer Science)',
    subjects: 'Java, Web Technology, Database Management',
    experience: '17 year Experience',
    image: 'assets/profile.png?v=2'
  },
  13: {
    name: 'B. Sree Devi',
    designation: 'Faculty',
    qualification: 'M.Sc. (Mathematics)',
    subjects: 'Quantitative Aptitude (Maths)',
    experience: '17 year Experience',
    image: 'assets/profile.png?v=2'
  },
  14: {
    name: 'P. Kishore',
    designation: 'Faculty',
    qualification: 'M.Sc. (Mathematics)',
    subjects: 'IPE Maths',
    experience: '10 year Experience',
    image: 'assets/profile.png?v=2'
  },
  15: {
    name: 'B. Srinivasulu',
    designation: 'Faculty',
    qualification: 'B.Com., CMA (Final)',
    subjects: 'Tally, ICT - 1&2',
    experience: '5 Year Teaching Experience. Handled more than 25 Batches in Tally. Guest Faculty in Govt Projects.',
    image: 'assets/profile.png?v=2'
  }
};

function openFacultyModal(id) {
  const modal = $('#facultyModal');
  const faculty = facultyData[id];
  
  if (!faculty) return;
  
  $('#modalFacultyName').textContent = faculty.name;
  $('#modalFacultyDesignation').textContent = faculty.designation;
  $('#modalFacultyQualification').textContent = faculty.qualification;
  $('#modalFacultySubjects').textContent = faculty.subjects;
  $('#modalFacultyExperience').textContent = faculty.experience;
  
  const photoImg = $('#modalFacultyPhoto');
  if (faculty.image) {
    photoImg.src = faculty.image;
  } else {
    photoImg.innerHTML = '<svg class="faculty-placeholder" viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg"><rect fill="#e0e0e0" width="200" height="250"/><circle cx="100" cy="75" r="35" fill="#999"/><path d="M60 140 Q100 120 140 140 L140 180 Q100 200 60 180 Z" fill="#999"/></svg>';
  }
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeFacultyModal() {
  const modal = $('#facultyModal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  const modal = $('#facultyModal');
  if (e.target === modal) {
    closeFacultyModal();
  }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeFacultyModal();
  }
});

console.log('✅ ATN\'s Junior & Degree College — Script initialized.');
