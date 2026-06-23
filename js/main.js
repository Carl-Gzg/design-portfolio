/* ============================================
   GarfieldZ's Portfolio — Main Script
   Features: scroll effects, float animation, lightbox, form
   ============================================ */

(function () {
  'use strict';

  // --- DOM refs ---
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav-links a');
  const bentoItems = document.querySelectorAll('.bento-item');
  const floatItems = document.querySelectorAll('.float-item');
  const lightbox = document.querySelector('.lightbox');
  const lightboxContent = document.querySelector('.lightbox-content');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  let currentLightboxIndex = -1;
  let lightboxItems = [];

  // --- Nav scroll effect ---
  function updateNav() {
    const scrolled = window.scrollY > 20;
    nav.classList.toggle('scrolled', scrolled);
  }

  // --- Active nav link ---
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 64;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  // --- Intersection Observer for float + bento ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  floatItems.forEach(el => observer.observe(el));
  bentoItems.forEach(el => observer.observe(el));

  // --- Lightbox ---
  function openLightbox(index) {
    currentLightboxIndex = index;
    const item = lightboxItems[index];
    if (!item) return;

    lightboxContent.innerHTML = '';

    if (item.type === 'video') {
      const video = document.createElement('video');
      video.src = item.src;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.onerror = function () {
        // Fallback: display a static placeholder
        lightboxContent.innerHTML = '';
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 800 450');
        svg.setAttribute('width', '800');
        svg.setAttribute('height', '450');
        svg.innerHTML = '<rect width="800" height="450" fill="#111114"/><circle cx="400" cy="225" r="60" fill="none" stroke="#FFCC00" stroke-width="2" opacity="0.4"/><polygon points="380,195 380,255 430,225" fill="#FFCC00" opacity="0.5"/><text x="400" y="330" text-anchor="middle" fill="#EDEAF0" font-family="sans-serif" font-size="18" opacity="0.4">Video placeholder</text>';
        lightboxContent.appendChild(svg);
      };
      lightboxContent.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.title || '';
      img.onerror = function () {
        img.style.display = 'none';
        const fallback = document.createElement('div');
        fallback.style.cssText = 'width:640px;height:400px;background:#141418;display:flex;align-items:center;justify-content:center;color:#8C8A94;font-size:0.9rem;border-radius:12px';
        fallback.textContent = 'Image not found: ' + (item.title || '');
        lightboxContent.appendChild(fallback);
      };
      lightboxContent.appendChild(img);
    }

    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    currentLightboxIndex = -1;

    // Stop video
    const video = lightboxContent.querySelector('video');
    if (video) {
      video.pause();
      video.src = '';
    }
    lightboxContent.innerHTML = '';
  }

  function navigateLightbox(dir) {
    if (lightboxItems.length === 0) return;
    const newIndex = (currentLightboxIndex + dir + lightboxItems.length) % lightboxItems.length;
    openLightbox(newIndex);
  }

  // Collect lightbox items from bento
  bentoItems.forEach((item, i) => {
    const type = item.dataset.mediaType || 'image';
    const src = item.dataset.mediaSrc;
    const title = item.querySelector('.bento-title')?.textContent || '';
    if (src) {
      const idx = lightboxItems.length;
      lightboxItems.push({ type, src, title, element: item });
      item.addEventListener('click', () => openLightbox(idx));
    }
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
  lightboxNext.addEventListener('click', () => navigateLightbox(1));

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  // --- Scroll handlers ---
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateNav();
        updateActiveLink();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Language switch
  const langBtns = document.querySelectorAll('.lang-btn');
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      langBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.lang-content').forEach(el => el.style.display = 'none');
      document.querySelector('.lang-' + lang).style.display = '';
    });
  });

  // Initial calls
  updateNav();
  updateActiveLink();
})();
