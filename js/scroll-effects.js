/**
 * ==========================================================================
 * SCROLL-DRIVEN ANIMATIONS, GALERÍAS Y COMPONENTES TÉCNICOS
 * Hub de Portafolios & Ciclo 2026 - Matías Mansilla (ETRR)
 * ==========================================================================
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // 1. IntersectionObserver para Revelaciones Progresivas (Scroll-Driven Reveal)
    const revealElements = document.querySelectorAll('.scroll-reveal');

    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            animateCounters(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.12
      });

      revealElements.forEach(el => revealObserver.observe(el));
    } else {
      revealElements.forEach(el => el.classList.add('reveal-visible'));
    }

    // 2. Animación de Contadores Numéricos Técnicos
    function animateCounters(container) {
      const counters = container.querySelectorAll('[data-counter]');
      counters.forEach(counter => {
        if (counter.getAttribute('data-animated') === 'true') return;
        counter.setAttribute('data-animated', 'true');

        const target = parseFloat(counter.getAttribute('data-target') || counter.textContent);
        const prefix = counter.getAttribute('data-prefix') || '';
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = 1400; // ms
        const startTime = performance.now();

        function update(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentVal = Math.floor(easeProgress * target);

          counter.textContent = `${prefix}${currentVal}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            counter.textContent = `${prefix}${target}${suffix}`;
          }
        }

        requestAnimationFrame(update);
      });
    }

    // 3. Pestañas Interactivas de Proyecto (Fuentes Reguladas)
    const tabGroups = document.querySelectorAll('[data-tabs-group]');
    tabGroups.forEach(group => {
      const buttons = group.querySelectorAll('[data-tab-target]');
      const panes = group.querySelectorAll('[data-tab-pane]');

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const targetId = btn.getAttribute('data-tab-target');

          buttons.forEach(b => b.classList.remove('active'));
          panes.forEach(p => p.classList.remove('active'));

          btn.classList.add('active');
          const targetPane = group.querySelector(`[data-tab-pane="${targetId}"]`);
          if (targetPane) {
            targetPane.classList.add('active');
          }
        });
      });
    });

    // 4. Galerías Desplegables al Final de cada Sección
    const galleryButtons = document.querySelectorAll('.gallery-toggle-btn');
    galleryButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-gallery-target');
        const drawer = document.getElementById(targetId);
        if (!drawer) return;

        const isOpen = drawer.classList.contains('open');
        btn.classList.toggle('active', !isOpen);
        drawer.classList.toggle('open', !isOpen);

        const countText = btn.getAttribute('data-count-text') || 'registro fotográfico';
        const labelSpan = btn.querySelector('.btn-label');
        if (labelSpan) {
          labelSpan.textContent = isOpen ? `Ver galería completa (${countText})` : 'Ocultar galería de registros';
        }
      });
    });

    // 5. Mini Carruseles Temporizados (LTspice y KiCad)
    const carousels = document.querySelectorAll('.mini-carousel-container');
    carousels.forEach(car => {
      const slides = car.querySelectorAll('.mini-carousel-slide');
      const dots = car.querySelectorAll('.mini-carousel-dot');
      const prevBtn = car.querySelector('.mini-carousel-nav-btn.prev');
      const nextBtn = car.querySelector('.mini-carousel-nav-btn.next');

      if (slides.length <= 1) return;

      let currentIndex = 0;
      let timer = null;

      function goToSlide(idx) {
        slides[currentIndex].classList.remove('active');
        if (dots[currentIndex]) dots[currentIndex].classList.remove('active');

        currentIndex = (idx + slides.length) % slides.length;

        slides[currentIndex].classList.add('active');
        if (dots[currentIndex]) dots[currentIndex].classList.add('active');
      }

      function nextSlide() {
        goToSlide(currentIndex + 1);
      }

      function prevSlide() {
        goToSlide(currentIndex - 1);
      }

      function startTimer() {
        if (timer) clearInterval(timer);
        timer = setInterval(nextSlide, 4500);
      }

      function stopTimer() {
        if (timer) clearInterval(timer);
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          prevSlide();
          startTimer();
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          nextSlide();
          startTimer();
        });
      }

      dots.forEach((dot, dIdx) => {
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          goToSlide(dIdx);
          startTimer();
        });
      });

      car.addEventListener('mouseenter', stopTimer);
      car.addEventListener('mouseleave', startTimer);

      startTimer();
    });
  });
})();
