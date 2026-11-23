/**
 * ==========================================================================
 * THEME MANAGER (Modo Claro / Modo Oscuro)
 * Hub de Portafolios & Ciclo 2026 - Matías Mansilla (ETRR)
 * ==========================================================================
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'etrr_portfolio_theme';
  const root = document.documentElement;

  // Obtener tema inicial guardado o preferencia de sistema
  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark';
  }

  // Aplicar tema
  function applyTheme(theme) {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
    localStorage.setItem(STORAGE_KEY, theme);

    // Sincronizar todos los inputs de toggle en la página si existen
    const toggles = document.querySelectorAll('input[data-theme-toggle]');
    toggles.forEach(input => {
      input.checked = (theme === 'light');
    });

    // Notificar a listeners (ej: canvas de la onda senoidal si necesita recalcular colores)
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
  }

  // Inicializar inmediatamente antes del render completo
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  // Cuando el DOM esté listo, configurar el listener del switch
  document.addEventListener('DOMContentLoaded', () => {
    const toggles = document.querySelectorAll('input[data-theme-toggle]');
    
    toggles.forEach(toggle => {
      toggle.checked = (getPreferredTheme() === 'light');
      
      toggle.addEventListener('change', (e) => {
        const newTheme = e.target.checked ? 'light' : 'dark';
        applyTheme(newTheme);
      });
    });

    // Escuchar cambios del sistema operativo si el usuario no tiene una selección explícita
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
        if (!localStorage.getItem(STORAGE_KEY)) {
          applyTheme(e.matches ? 'light' : 'dark');
        }
      });
    }
  });

  // Exponer API global simple
  window.ThemeManager = {
    get: getPreferredTheme,
    set: applyTheme,
    toggle: () => {
      const current = getPreferredTheme();
      applyTheme(current === 'light' ? 'dark' : 'light');
    }
  };
})();
