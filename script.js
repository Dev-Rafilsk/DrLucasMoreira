(() => {
  'use strict';

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

  function openDialog(dialog) {
    if (!dialog || dialog.open) return;
    dialog.showModal();
    requestAnimationFrame(() => dialog.classList.add('is-visible'));
  }

  function closeDialog(dialog) {
    if (!dialog || !dialog.open) return;
    dialog.classList.remove('is-visible');

    const finish = () => {
      dialog.removeEventListener('transitionend', finish);
      if (dialog.open) dialog.close();
    };
    dialog.addEventListener('transitionend', finish);
    window.setTimeout(finish, 400);
  }

  function bindDialogDismiss(dialog) {
    dialog.addEventListener('click', (event) => {
      const box = dialog.getBoundingClientRect();
      const clickedInside =
        event.clientX >= box.left && event.clientX <= box.right &&
        event.clientY >= box.top && event.clientY <= box.bottom;
      if (!clickedInside) closeDialog(dialog);
    });

    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      closeDialog(dialog);
    });

    dialog.querySelectorAll('[data-close-modal]').forEach((btn) => {
      btn.addEventListener('click', () => closeDialog(dialog));
    });
  }

  function setupProcedureModals() {
    const triggers = document.querySelectorAll('[data-modal-target]');
    const modals = document.querySelectorAll('dialog.procedure-modal');
    if (!triggers.length || !modals.length) return;

    modals.forEach(bindDialogDismiss);

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const dialog = document.getElementById(`modal-${trigger.dataset.modalTarget}`);
        openDialog(dialog);
      });
    });
  }

  function setupGalleryLightbox() {
    const items = Array.from(document.querySelectorAll('.gallery-item'));
    const lightbox = document.getElementById('lightbox');
    if (!items.length || !lightbox) return;

    const image = document.getElementById('lightboxImage');
    const caption = document.getElementById('lightboxCaption');
    const counter = document.getElementById('lightboxCounter');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');

    const photos = items.map((item) => {
      const img = item.querySelector('img');
      return {
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt') || '',
        caption: item.dataset.caption || '',
      };
    });

    let currentIndex = 0;

    function render(index) {
      currentIndex = (index + photos.length) % photos.length;
      const photo = photos[currentIndex];
      image.src = photo.src;
      image.alt = photo.alt;
      caption.textContent = photo.caption;
      counter.textContent = `${currentIndex + 1} / ${photos.length}`;
    }

    items.forEach((item, index) => {
      item.addEventListener('click', () => {
        render(index);
        openDialog(lightbox);
      });
    });

    prevBtn.addEventListener('click', () => render(currentIndex - 1));
    nextBtn.addEventListener('click', () => render(currentIndex + 1));

    lightbox.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') render(currentIndex - 1);
      if (event.key === 'ArrowRight') render(currentIndex + 1);
    });
    let touchStartX = null;
    lightbox.addEventListener('touchstart', (event) => {
      touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener('touchend', (event) => {
      if (touchStartX === null) return;
      const delta = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 40) render(currentIndex + (delta < 0 ? 1 : -1));
      touchStartX = null;
    }, { passive: true });

    bindDialogDismiss(lightbox);
  }

  function setupLocationMaps() {
    document.querySelectorAll('[data-map-toggle]').forEach((button) => {
      const card = button.closest('.location-card');
      const container = card ? card.querySelector('[data-map-container]') : null;
      if (!container) return;

      button.addEventListener('click', () => {
        const isOpen = !container.hidden;

        if (isOpen) {
          container.hidden = true;
          button.textContent = 'Mostrar mapa';
          button.setAttribute('aria-expanded', 'false');
          return;
        }

        if (!container.dataset.loaded) {
          const titleEl = card.querySelector('h3');
          const iframe = document.createElement('iframe');
          iframe.src = button.dataset.mapSrc;
          iframe.loading = 'lazy';
          iframe.referrerPolicy = 'no-referrer-when-downgrade';
          iframe.title = `Mapa — ${titleEl ? titleEl.textContent : 'localização da clínica'}`;
          container.appendChild(iframe);
          container.dataset.loaded = 'true';
        }

        container.hidden = false;
        button.textContent = 'Ocultar mapa';
        button.setAttribute('aria-expanded', 'true');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupMobileNav();
    setupHeaderScroll();
    setupScrollReveal();
    setupTestimonialsSlider();
    setupFooterYear();
    setupProcedureModals();
    setupGalleryLightbox();
    setupLocationMaps();
  });
})();
