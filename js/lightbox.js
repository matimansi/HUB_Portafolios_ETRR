/**
 * ==========================================================================
 * LIGHTBOX & VISOR MULTIMEDIA TÉCNICO
 * Hub de Portafolios & Ciclo 2026 - Matías Mansilla (ETRR)
 * ==========================================================================
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // Crear el overlay en el DOM si no existe
    let overlay = document.getElementById('global-lightbox');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'global-lightbox';
      overlay.className = 'lightbox-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', 'Visor multimedia interactivo');

      overlay.innerHTML = `
        <div class="lightbox-content">
          <div class="lightbox-header">
            <div class="lightbox-title" id="lightbox-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <span id="lightbox-title-text">Inspección de Registro</span>
            </div>
            <button class="lightbox-close-btn" id="lightbox-close-btn" aria-label="Cerrar visor">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="lightbox-body">
            <div class="lightbox-media-container" id="lightbox-media-box"></div>
            <div class="lightbox-caption" id="lightbox-caption"></div>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
    }

    const mediaBox = document.getElementById('lightbox-media-box');
    const captionEl = document.getElementById('lightbox-caption');
    const titleEl = document.getElementById('lightbox-title-text');
    const closeBtn = document.getElementById('lightbox-close-btn');

    function openLightbox(htmlContent, title, caption) {
      mediaBox.innerHTML = htmlContent;
      titleEl.textContent = title || 'Inspección de Registro Técnico';
      captionEl.innerHTML = caption || '';
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => {
        // Pausar cualquier video si estaba en reproducción
        const vid = mediaBox.querySelector('video');
        if (vid) vid.pause();
        mediaBox.innerHTML = '';
      }, 300);
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeLightbox);
    }

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        closeLightbox();
      }
    });

    // Detectar clics en elementos con data-lightbox, .gallery-thumb-item, .important-media-box o .tech-placeholder
    document.addEventListener('click', (e) => {
      // Ignorar si el clic fue en un botón de control de video nativo
      if (e.target.tagName === 'BUTTON' && !e.target.classList.contains('lightbox-close-btn')) {
        if (!e.target.closest('[data-lightbox], .gallery-thumb-item, .important-media-box')) return;
      }

      const trigger = e.target.closest('[data-lightbox], .gallery-thumb-item, .important-media-box, .tech-placeholder');
      if (!trigger) return;

      // Si es un video directo con controles que el usuario está clicando para reproducir inline, no interferir
      if (e.target.tagName === 'VIDEO' && e.target.hasAttribute('controls') && !trigger.classList.contains('gallery-thumb-item')) {
        return;
      }

      e.preventDefault();

      const title = trigger.getAttribute('data-title') || 
                    trigger.querySelector('.tag')?.textContent || 
                    trigger.querySelector('.tech-placeholder-title')?.textContent || 
                    'Registro de Taller y Cátedra';
      
      const caption = trigger.getAttribute('data-caption') || 
                      trigger.querySelector('.desc')?.textContent || 
                      trigger.querySelector('.tech-placeholder-desc')?.textContent || 
                      '';

      const mediaSrc = trigger.getAttribute('data-src') || 
                       trigger.querySelector('img')?.getAttribute('src') || 
                       trigger.querySelector('video')?.getAttribute('src');

      const isVideo = trigger.getAttribute('data-type') === 'video' || 
                      trigger.classList.contains('video-item') || 
                      (mediaSrc && mediaSrc.toLowerCase().endsWith('.mp4'));

      let contentHtml = '';

      if (isVideo && mediaSrc) {
        contentHtml = `
          <video src="${mediaSrc}" controls autoplay playsinline style="max-width:100%; max-height:68vh; border-radius:8px; background:#000;">
            Tu navegador no soporta reproducción de video.
          </video>
        `;
      } else if (mediaSrc) {
        contentHtml = `
          <img src="${mediaSrc}" alt="${title}" style="max-width:100%; max-height:68vh; border-radius:8px; object-fit:contain;">
        `;
      } else {
        contentHtml = `
          <div style="background:var(--bg-primary); border:1px solid var(--border-highlight); padding:2rem; border-radius:12px; text-align:center; width:100%; max-width:550px;">
            <h3 style="font-family:var(--font-mono); font-size:1.1rem; color:var(--text-primary); margin-bottom:0.75rem;">${title}</h3>
            <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.6;">${caption}</p>
          </div>
        `;
      }

      openLightbox(contentHtml, title, caption);
    });

    window.Lightbox = {
      open: openLightbox,
      close: closeLightbox
    };
  });
})();
