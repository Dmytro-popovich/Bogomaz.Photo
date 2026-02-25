// ===== BOGOMAZ PHOTO STUDIO — Main JS =====

document.addEventListener('DOMContentLoaded', () => {

  // ===== CURSOR =====
  const cursor = document.querySelector('.cursor');
  const cursorRing = document.querySelector('.cursor-ring');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  if (cursor && cursorRing) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX - 6 + 'px';
      cursor.style.top = mouseY - 6 + 'px';
    });

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.left = ringX - 18 + 'px';
      cursorRing.style.top = ringY - 18 + 'px';
      requestAnimationFrame(animateRing);
    };
    animateRing();

    document.querySelectorAll('a, button, .service-card, .portfolio-item, .faq-question').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('expand'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('expand'));
    });
  }

  // ===== LOADER =====
  const loader = document.querySelector('.loader');
  const loaderLine = document.querySelector('.loader-line');
  if (loader) {
    setTimeout(() => loaderLine && loaderLine.classList.add('active'), 100);
    setTimeout(() => loader.classList.add('hidden'), 1800);
  }

  // ===== NAVIGATION =====
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile');

  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
    if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ===== HERO SLIDER =====
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  let currentSlide = 0;
  let sliderTimer;

  function goToSlide(index) {
    slides[currentSlide]?.classList.remove('active');
    dots[currentSlide]?.classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide]?.classList.add('active');
    dots[currentSlide]?.classList.add('active');
  }

  function startSlider() {
    clearInterval(sliderTimer);
    sliderTimer = setInterval(() => goToSlide(currentSlide + 1), 5500);
  }

  if (slides.length > 0) {
    slides[0].classList.add('active');
    dots[0]?.classList.add('active');
    startSlider();
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goToSlide(i); startSlider(); });
    });
  }

  // ===== SCROLL REVEAL =====
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // ===== FAQ =====
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ===== TESTIMONIALS =====
  const track = document.querySelector('.testimonials-track');
  const tDots = document.querySelectorAll('.t-dot');
  let currentT = 0;
  let tTimer;

  function goToT(index) {
    tDots[currentT]?.classList.remove('active');
    currentT = (index + tDots.length) % tDots.length;
    if (track) track.style.transform = `translateX(-${currentT * 100}%)`;
    tDots[currentT]?.classList.add('active');
  }

  function startT() {
    clearInterval(tTimer);
    tTimer = setInterval(() => goToT(currentT + 1), 5000);
  }

  if (track && tDots.length > 0) {
    tDots[0]?.classList.add('active');
    startT();
    tDots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goToT(i); startT(); });
    });
  }

  // ===== LIGHTBOX =====
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  const portfolioItems = Array.from(document.querySelectorAll('.portfolio-item[data-src]'));
  let currentIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  function updateLightbox(index) {
    if (index < 0) index = portfolioItems.length - 1;
    if (index >= portfolioItems.length) index = 0;
    currentIndex = index;
    const item = portfolioItems[currentIndex];
    if (lightboxImg) {
      lightboxImg.style.opacity = '0';
      setTimeout(() => {
        lightboxImg.src = item.dataset.src;
        lightboxImg.alt = item.dataset.alt || '';
        lightboxImg.style.opacity = '1';
      }, 200);
    }
  }

  portfolioItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      if (lightbox) {
        updateLightbox(index);
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    updateLightbox(currentIndex - 1);
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    updateLightbox(currentIndex + 1);
  };

  if (lightboxPrev) lightboxPrev.addEventListener('click', handlePrev);
  if (lightboxNext) lightboxNext.addEventListener('click', handleNext);

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightbox?.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // Swipe detection
  lightbox?.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox?.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      handleNext();
    } else if (touchEndX > touchStartX + swipeThreshold) {
      handlePrev();
    }
  }

  document.addEventListener('keydown', e => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape') {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    } else if (e.key === 'ArrowRight') {
      handleNext();
    } else if (e.key === 'ArrowLeft') {
      handlePrev();
    }
  });

  // ===== SCROLL TOP =====
  const scrollTopBtn = document.querySelector('.scroll-top');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ===== SMOOTH SECTION TRANSITIONS =====
  const counters = document.querySelectorAll('.about-stat-num[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const step = target / 60;
        const interval = setInterval(() => {
          current += step;
          if (current >= target) {
            clearInterval(interval);
            el.textContent = target + suffix;
          } else {
            el.textContent = Math.floor(current) + suffix;
          }
        }, 25);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  // ===== SMOOTH SECTION TRANSITIONS =====
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

});
