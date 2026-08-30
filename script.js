(() => {
  'use strict';
  const CONFIG = {
    whatsappNumber: '5571900000000',
    whatsappMessage: 'Olá, Dr. Lucas! Gostaria de agendar uma consulta.',
  };

  function setupWhatsappLinks() {
    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`;
    document.querySelectorAll('[data-whatsapp-cta]').forEach((el) => {
      el.setAttribute('href', url);
    });
  }
  function setupMobileNav() {
    const toggle = document.getElementById('navToggle');
    const nav = document.getElementById('mainNav');
    if (!toggle || !nav) return;

    const closeNav = () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNav();
    });
  }

  function setupHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function setupScrollReveal() {
    const items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    items.forEach((el) => observer.observe(el));
  }

  function setupTestimonialsSlider() {
    const track = document.getElementById('testimonialsTrack');
    const prevBtn = document.getElementById('reviewPrev');
    const nextBtn = document.getElementById('reviewNext');
    if (!track || !prevBtn || !nextBtn) return;

    const scrollByCard = (direction) => {
      const card = track.querySelector('.review-card');
      if (!card) return;
      const gap = parseFloat(getComputedStyle(track).gap) || 24;
      const distance = card.getBoundingClientRect().width + gap;
      track.scrollBy({ left: distance * direction, behavior: 'smooth' });
    };

    prevBtn.addEventListener('click', () => scrollByCard(-1));
    nextBtn.addEventListener('click', () => scrollByCard(1));
  }

  function setupFooterYear() {
    const yearEl = document.getElementById('anoAtual');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupWhatsappLinks();
    setupMobileNav();
    setupHeaderScroll();
    setupScrollReveal();
    setupTestimonialsSlider();
    setupFooterYear();
  });
})();
