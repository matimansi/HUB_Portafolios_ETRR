# Historial Técnico, Arquitectura y Registro del Proyecto
## Hub de Portafolios Docentes y Portafolio Ciclo 2026
**Docente:** Matías Mansilla  
**Especialidad:** Técnico Electrónico (TEL) · Escuela Técnica Roberto Rocca (ETRR)  
**Materias Dictadas (2026):**
- **AEA** — Aplicaciones de Electrónica Analógica (4to TEL) · Pareja pedagógica: *Emiliano Marinucci*
- **AED** — Aplicaciones de Electrónica Digital (4to, 5to y 6to TEL) · Pareja pedagógica: *Dario Jose Pena*
- **PyDE** — Proyecto y Diseño Electrónico (7mo TEL) · Pareja pedagógica: *Ramiro Sagripanti*
- **STEM** — (5to año) · Parejas pedagógicas: *Romina Petrolini y Nicolas Costa*

**Equipo de Trabajo y Extensión:** Emiliano Marinucci, Dario Jose Pena, Romina Petrolini, Nicolas Costa, Laureano Bolzan, Valeria Ortiz Etchepare y todo el equipo de Tecnoclubes.

---

## 1. Estructura de Archivos del Proyecto

```
Portfolios/
├── index.html                                 # Hub Principal: "Mis Portafolios Docentes" (Glassmorphism)
├── PROYECTO_NOTAS_Y_ARQUITECTURA.md          # Historial y guía técnica de mantenimiento
├── Informacion/                               # Consignas institucionales ETRR y planificaciones
│   ├── Portafolio - consigna 2026.pdf         # Guía de evaluación docente ETRR
│   ├── Planificacion Tecnoclubes - Robotica.pdf
│   └── Presentacion Taller de Robotica.pdf
├── 2025/                                      # Ciclo 2025 (Archivo histórico)
│   ├── Portfolio 2025 - Matias Mansilla.pdf   # Acceso directo para lectura/descarga
│   └── Portfolio 2025 - Matias Mansilla.docx  # Documento editable
├── 2026/                                      # Ciclo 2026 (Experiencia interactiva de electrónica)
│   ├── index.html                             # Portafolio 2026 (7 Nodos, Bento Grid, Onda Senoidal, CNC)
│   └── Resumen y Promt.txt                    # Notas y reflexiones iniciales de Matías
├── css/
│   ├── common.css                             # Tokens CSS, temas claro/oscuro, lightbox, mini-carruseles y galerías
│   ├── hub.css                                # Estilos específicos del Hub (grilla 2 columnas, logo ETRR)
│   └── portfolio.css                          # Estilos del Portafolio 2026 (onda senoidal sin marco, grilla 2x3)
├── js/
│   ├── theme.js                               # Gestor de tema claro/oscuro persistente en localStorage
│   ├── sine-wave.js                           # Motor SVG del índice vertical por onda senoidal vinculada al scroll
│   ├── lightbox.js                            # Visor universal modal para fotos, esquemas y videos
│   └── scroll-effects.js                      # IntersectionObserver estilo Apple, contadores, pestañas y carruseles
└── assets/
    ├── img/                                   # Archivos multimedia categorizados
    │   ├── Logo ETRR.jpg                      # Logo institucional de la escuela
    │   ├── foto_institucional_matias_mansilla.jpg
    │   ├── Charlas Tenaris/
    │   ├── CITGrip/
    │   ├── Fuentes Reguladas Variables 4to/
    │   ├── MAPE General pero Proyectos de  mis Estudiantes/
    │   ├── Presentaciones 4to/
    │   └── Tecnoclubes/
    └── icons/                                 # Iconografía vectorial técnica
```

---

## 2. Sistema de Diseño e Identidad Visual

### Colores Institucionales y Modos de Pantalla
- **Modo Oscuro (Estilo Osciloscopio / PCB Nocturno) — Predeterminado:**
  - Fondo primario: `#0B0F19`
  - Tarjetas translúcidas: `rgba(17, 24, 39, 0.72)` con `backdrop-filter: blur(14px)`
  - Texto principal: `#F1F5F9` (secundario `#94A3B8`)
  - Acento estructural: **Azul Eléctrico** (`#0EA5E9` / `#2563EB`)
  - Acento activo / Fósforo: **Naranja Técnico** (`#F97316`)
  - Glow fosfórico: `rgba(249, 115, 22, 0.28)`

- **Modo Claro (Estilo Datasheet / Esquemático Técnico):**
  - Fondo primario: `#F8FAFC`
  - Tarjetas translúcidas: `rgba(255, 255, 255, 0.88)` con `backdrop-filter: blur(14px)`
  - Texto principal: `#0F172A` (secundario `#334155`)
  - Acento estructural: **Azul Institucional** (`#1D4ED8`)
  - Acento activo: **Naranja Técnico** (`#EA580C`)

- **Tipografía y Subíndices:**
  - Cuerpo y títulos: **Plus Jakarta Sans**.
  - Etiquetas, nodos, métricas y telemetría: **JetBrains Mono**.
  - Variables y magnitudes con subíndice técnico real mediante etiquetas `<sub>` (ej. `V<sub>IN</sub>`, `V<sub>OUT</sub>`, `V<sub>pp</sub>`).

- **Reglas de Redacción:**
  - Eliminado el símbolo `&` como conjunción (reemplazado por `y`).
  - Lenguaje inclusivo institucional: `el estudiante` o `los estudiantes`.
  - Mención de `Camada 1824` reservada exclusivamente a la cabecera superior como firma de pertenencia institucional.

---

## 3. Componentes Interactivos Clave (Portafolio 2026)

1. **Índice Lateral con Onda Senoidal Animada (SVG):**
   - Implementado en `js/sine-wave.js` y `2026/index.html`.
   - Orientación vertical **sin marco ni recuadro exterior** contenedor.
   - El desfase ($\phi$) se calcula en tiempo real a partir del `window.scrollY`.
   - Nodos circulares (estilo *vías* o pads de soldadura) sobre la curva que en hover **únicamente se iluminan en naranja** sin saltos verticales de escala.
   - Telemetría superior y display adaptado para visualización completa de títulos largos sin recortes.
   - En pantallas móviles: dock inferior flotante ergonómico con botones anterior/siguiente y display de sección activa.

2. **Integración Multimedia (`IMPORTANTE` vs Galerías Desplegables):**
   - **Archivos `IMPORTANTE`:** Integrados directamente en el cuerpo de cada sección (fotos o videos destacados).
   - **Galerías desplegables:** Ubicadas al final de cada sección mediante un botón de alternancia (`Ver galería completa...`), desplegando una grilla de miniaturas que al hacer clic se abren en el visor *lightbox*.

3. **Mini-Carruseles Temporizados:**
   - Implementados en la Sección de Fuentes Reguladas (Etapas de *LTspice* y *KiCad*).
   - Transición automática cada 4.5 segundos, botones manuales de navegación anterior/siguiente, indicadores de punto y pausa al colocar el cursor encima.

4. **Pestañas Interactivas de Fuentes Reguladas:**
   - Permite alternar entre:
     - *1. Simulación en LTspice*
     - *2. Diseño en KiCad*
     - *3. Fresado CNC*
     - *4. Defensa y Exposición en MAPE*

---

## 4. Estructura de las 7 Secciones del Portafolio 2026

1. **`01 // CHARLAS TENARIS`**: Jornada de Seguridad con 5to año (simulacros, bomberos, auditorio), disertación de Sebastián Bortnik sobre IA y liderazgo de Los Murciélagos con Gonzalo Vilariño (con video TED embebido).
2. **`02 // 4to TEL: AUDITORIO`**: Exposiciones orales sobre transformadores ante el grupo y los docentes Emiliano Marinucci y Matías Mansilla. Dinámica de Kahoot y superación de la timidez.
3. **`03 // TECNOCLUBES`**: Talleres socioemocionales (rueda de emociones, barriletes, refugios) y robótica mBot con Laureano Bolzan (programación en mBlock y desafíos de navegación).
4. **`04 // CITGRIP`**: Acompañamiento a 5to año en la muestra de Escobar con su dispositivo rehabilitador de manos post-ACV, destacando la solvencia técnica y el compromiso ético.
5. **`05 // FUENTES REGULADAS`**: Eje central del año en 4to TEL. Réplica del proyecto de estudiante, simulación en LTspice, layout en KiCad, dificultades en CNC, defensa técnica en MAPE y compromiso voluntario extracurricular.
6. **`06 // MAPE`**: Muestra Abierta de Proyectos Estudiantiles con stands de AEA (4to), STEM (5to con MINI Titan) y PyDE (7mo).
7. **`07 // PROYECCIÓN 2027`**: Grilla de 2 columnas por 3 filas con 6 metas estratégicas (fabricación artesanal transfer/cloruro férrico, continuidad de oratoria, proyectos integradores, guías de ejercicios resueltos, registro fotográfico sistemático y simulación/IA).
