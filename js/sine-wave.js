/**
 * ==========================================================================
 * SINE WAVE OSCILLOSCOPE NAVIGATION (Índice Lateral Interactivo)
 * Hub de Portafolios y Ciclo 2026 - Matías Mansilla (ETRR)
 * ==========================================================================
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.getElementById('sine-nav-container');
    if (!navContainer) return;

    const svgPath = document.getElementById('sine-wave-path');
    const svgTraceGlow = document.getElementById('sine-wave-glow');
    const nodesContainer = document.getElementById('sine-nodes-group');
    const telemetrySection = document.getElementById('sine-telemetry-sec');
    const telemetryPhase = document.getElementById('sine-telemetry-phase');
    const mobileNavBadge = document.getElementById('mobile-nav-sec-badge');
    const mobileNavPrev = document.getElementById('mobile-nav-prev');
    const mobileNavNext = document.getElementById('mobile-nav-next');

    /* ----------------------------------------------------------------------
       RESPALDO LÓGICA ANTERIOR (6 Secciones con Nodo 00):
       const sections = [
         { id: 'sec-0', code: '00', label: 'Retorno al Aula', tag: 'V_IN // INTRO' },
         { id: 'sec-1', code: '01', label: 'Auditorio Tenaris', tag: 'IA & RESILIENCIA' },
         { id: 'sec-2', code: '02', label: '4to TEL: Oratoria', tag: 'TRANSFORMADORES' },
         { id: 'sec-3', code: '03', label: 'Extensión & Muestras', tag: 'CITGRIP · MAPE · ROBÓTICA' },
         { id: 'sec-4', code: '04', label: 'Proyecto Central', tag: 'FUENTES REGULADAS' },
         { id: 'sec-5', code: '05', label: 'Proyección 2027', tag: 'V_OUT // CIERRE' }
       ];
       ---------------------------------------------------------------------- */

    // NUEVA ESTRUCTURA (7 Secciones Independientes con Eje Central Destacado)
    const sections = [
      { id: 'sec-1', code: '01', label: 'Charlas Tenaris', tag: 'SEGURIDAD · BORTNIK · MURCIÉLAGOS' },
      { id: 'sec-2', code: '02', label: '4to TEL: Auditorio', tag: 'EXPOSICIONES ORALES' },
      { id: 'sec-3', code: '03', label: 'Tecnoclubes', tag: 'ROBÓTICA Y SOCIOEMOCIONAL' },
      { id: 'sec-4', code: '04', label: 'CITgrip', tag: 'REHABILITADOR POST-ACV' },
      { id: 'sec-5', code: '05', label: 'Fuentes Reguladas', tag: 'EJE CENTRAL 4to TEL' },
      { id: 'sec-6', code: '06', label: 'MAPE', tag: 'PROYECTOS Y COMUNIDAD' },
      { id: 'sec-7', code: '07', label: 'Proyección 2027', tag: 'CONSOLIDACIÓN Y METAS' }
    ];

    const SVG_WIDTH = 70;
    const SVG_HEIGHT = 480;
    const CENTER_X = SVG_WIDTH / 2;
    const AMPLITUDE = 16;
    const WAVELENGTH = 130;
    const TOP_PAD = 30;
    const BOTTOM_PAD = 30;
    const AVAILABLE_H = SVG_HEIGHT - (TOP_PAD + BOTTOM_PAD);
    const STEP_Y = AVAILABLE_H / (sections.length - 1);

    let currentPhase = 0;
    let targetPhase = 0;
    let activeIndex = 0;
    let animationFrameId = null;

    // Calcular coordenada x(y, phase)
    function calcX(y, phase) {
      const angle = ((y * 2 * Math.PI) / WAVELENGTH) + phase;
      return CENTER_X + AMPLITUDE * Math.sin(angle);
    }

    // Generar path SVG
    function buildSinePath(phase) {
      let d = '';
      const step = 4;
      for (let y = 0; y <= SVG_HEIGHT; y += step) {
        const x = calcX(y, phase);
        if (y === 0) {
          d += `M ${x.toFixed(2)} ${y}`;
        } else {
          d += ` L ${x.toFixed(2)} ${y}`;
        }
      }
      return d;
    }

    // Crear elementos DOM de los nodos
    function initNodes() {
      if (!nodesContainer) return;
      nodesContainer.innerHTML = '';

      sections.forEach((sec, idx) => {
        const y = TOP_PAD + idx * STEP_Y;
        const x = calcX(y, currentPhase);

        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', `sine-node ${idx === 0 ? 'active' : ''}`);
        g.setAttribute('data-target-id', sec.id);
        g.setAttribute('data-index', idx);
        g.setAttribute('tabindex', '0');
        g.setAttribute('role', 'button');
        g.setAttribute('aria-label', `Sección ${sec.code}: ${sec.label}`);

        // Anillo exterior / Solder Pad (sin transformaciones que provoquen saltos)
        const pad = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        pad.setAttribute('class', 'node-pad');
        pad.setAttribute('cx', x.toFixed(2));
        pad.setAttribute('cy', y.toFixed(2));
        pad.setAttribute('r', '11');

        // Vía interior / Punto de soldadura
        const via = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        via.setAttribute('class', 'node-via');
        via.setAttribute('cx', x.toFixed(2));
        via.setAttribute('cy', y.toFixed(2));
        via.setAttribute('r', '4.5');

        g.appendChild(pad);
        g.appendChild(via);

        // Click para scroll suave
        g.addEventListener('click', (e) => {
          e.preventDefault();
          scrollToSection(sec.id);
        });

        g.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            scrollToSection(sec.id);
          }
        });

        // Hover sin saltos de escala, solo actualiza previsualización
        g.addEventListener('mouseenter', () => {
          updateActivePreview(idx);
        });
        g.addEventListener('mouseleave', () => {
          updateActivePreview(activeIndex);
        });

        nodesContainer.appendChild(g);
      });
    }

    // Scroll suave con compensación de barra sticky
    function scrollToSection(id) {
      const el = document.getElementById(id);
      if (!el) return;
      const headerOffset = 70;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }

    // Actualizar coordenadas de los nodos según la fase de la onda
    function updateNodePositions(phase) {
      const nodeElements = nodesContainer.querySelectorAll('.sine-node');
      nodeElements.forEach((g, idx) => {
        const y = TOP_PAD + idx * STEP_Y;
        const x = calcX(y, phase);

        const pad = g.querySelector('.node-pad');
        const via = g.querySelector('.node-via');
        if (pad) {
          pad.setAttribute('cx', x.toFixed(2));
          pad.setAttribute('cy', y.toFixed(2));
        }
        if (via) {
          via.setAttribute('cx', x.toFixed(2));
          via.setAttribute('cy', y.toFixed(2));
        }
      });
    }

    // Actualizar el texto de telemetría y tooltip sin truncar
    function updateActivePreview(idx) {
      if (idx < 0 || idx >= sections.length) return;
      const sec = sections[idx];
      if (telemetrySection) {
        telemetrySection.textContent = `${sec.code} // ${sec.label.toUpperCase()}`;
      }
      if (mobileNavBadge) {
        mobileNavBadge.textContent = `${sec.code} // ${sec.label.toUpperCase()}`;
      }
    }

    // Marcar nodo activo
    function setActiveNode(idx) {
      if (idx === activeIndex && nodesContainer.querySelector('.sine-node.active')) return;
      activeIndex = idx;

      const nodeElements = nodesContainer.querySelectorAll('.sine-node');
      nodeElements.forEach((g, i) => {
        if (i === idx) {
          g.classList.add('active');
        } else {
          g.classList.remove('active');
        }
      });

      updateActivePreview(idx);
    }

    // Loop de renderizado suave de la animación
    function renderLoop() {
      // Lerp para que la fase fluya con suavidad
      currentPhase += (targetPhase - currentPhase) * 0.12;

      const pathData = buildSinePath(currentPhase);
      if (svgPath) svgPath.setAttribute('d', pathData);
      if (svgTraceGlow) svgTraceGlow.setAttribute('d', pathData);

      updateNodePositions(currentPhase);

      if (telemetryPhase) {
        const deg = ((currentPhase * (180 / Math.PI)) % 360).toFixed(0);
        telemetryPhase.textContent = `φ: ${deg >= 0 ? '+' : ''}${deg}°`;
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    }

    // Vincular scroll del navegador a la fase
    function onScroll() {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      targetPhase = scrollY * 0.016;
      detectActiveSection();
    }

    // Detección robusta de sección activa
    function detectActiveSection() {
      const scrollPosition = window.scrollY + window.innerHeight * 0.35;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveNode(i);
            break;
          }
        }
      }
    }

    // Inicializar todo
    initNodes();

    if (mobileNavPrev) {
      mobileNavPrev.addEventListener('click', () => {
        const targetIdx = Math.max(0, activeIndex - 1);
        scrollToSection(sections[targetIdx].id);
      });
    }

    if (mobileNavNext) {
      mobileNavNext.addEventListener('click', () => {
        const targetIdx = Math.min(sections.length - 1, activeIndex + 1);
        scrollToSection(sections[targetIdx].id);
      });
    }

    onScroll();
    renderLoop();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      onScroll();
    });
  });
})();
