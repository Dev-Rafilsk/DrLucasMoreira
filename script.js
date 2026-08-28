/* ==========================================================================
   Dr. Lucas Moreira — Landing Page
   Vanilla JavaScript — sem dependências externas
   ========================================================================== */

(() => {
  'use strict';

  /* ---------- 1. Configuração central ----------
     Altere os valores abaixo para atualizar contato e textos em todo o site
     sem precisar mexer no HTML. */
  const CONFIG = {
    whatsappNumber: '5571900000000', // formato: 55 + DDD + número, somente dígitos
    whatsappMessage: 'Olá, Dr. Lucas! Gostaria de agendar uma consulta.',
  };

  /* Monta o link de WhatsApp e aplica em todos os elementos [data-whatsapp-cta] */
  function setupWhatsappLinks() {
    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`;
    document.querySelectorAll('[data-whatsapp-cta]').forEach((el) => {
      el.setAttribute('href', url);
    });
  }

  /* ---------- 2. Menu mobile ---------- */
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

    // Fecha o menu ao clicar em um link
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeNav);
    });

    // Fecha com a tecla Esc
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ---------- 3. Header com sombra ao rolar ---------- */
  function setupHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- 4. Fade-in ao rolar (Intersection Observer) ---------- */
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

  /* ---------- 5. Slider de depoimentos ---------- */
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

  /* ---------- 6. Ano atual no rodapé ---------- */
  function setupFooterYear() {
    const yearEl = document.getElementById('anoAtual');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- Inicialização ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    setupWhatsappLinks();
    setupMobileNav();
    setupHeaderScroll();
    setupScrollReveal();
    setupTestimonialsSlider();
    setupFooterYear();
  });
})();
