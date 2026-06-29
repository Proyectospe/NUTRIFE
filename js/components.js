const pages = [
  { id: 'inicio', label: 'Inicio', href: 'index.html' },
  { id: 'que-es', label: '¿Qué es?', href: 'pages/que-es.html' },
  { id: 'tipos', label: 'Tipos', href: 'pages/tipos.html' },
  { id: 'causas', label: 'Causas', href: 'pages/causas.html' },
  { id: 'diagnostico', label: 'Diagnostico', href: 'pages/diagnostico.html' },
  { id: 'alimentos', label: 'Alimentos', href: 'pages/alimentos.html' },
  { id: 'prevencion', label: 'Prevencion', href: 'pages/prevencion.html' },
  { id: 'datos', label: 'Datos', href: 'pages/datos.html' },
  { id: 'noticias', label: 'Noticias', href: 'pages/noticias.html' },
  { id: 'recetas', label: 'Recetas', href: 'pages/recetas.html' }
];

const isInsidePages = window.location.pathname.includes('/pages/');
const basePath = isInsidePages ? '../' : './';

function renderNav() {
  const current = document.body.dataset.page;
  const navMount = document.querySelector('[data-nav]');
  if (!navMount) return;

  navMount.innerHTML = `
    <nav class="site-nav" aria-label="Navegacion principal">
      <a class="brand" href="${basePath}index.html">NUTRIFE</a>
      <div class="nav-links">
        ${pages.map(page => `
          <a href="${basePath}${page.href}" class="${page.id === current ? 'active' : ''}">${page.label}</a>
        `).join('')}
      </div>
    </nav>
  `;
}

function renderHeader() {
  const headerMount = document.querySelector('[data-header]');
  if (!headerMount) return;

  const title = headerMount.dataset.title || 'NUTRIFE';
  const kicker = headerMount.dataset.kicker || 'Salud';
  const description = headerMount.dataset.description || '';
  const variant = headerMount.dataset.variant === 'home' ? 'page-header home-header' : 'page-header';
  const titleContent = title.trim().toUpperCase() === 'NUTRIFE'
    ? `<img class="hero-logo" src="${basePath}imagenes/LogoNutrife-cropped.png" alt="NUTRIFE" />`
    : title;

  headerMount.outerHTML = `
    <header class="${variant}">
      <div class="header-content">
        <div class="etiqueta">${kicker}</div>
        <h1>${titleContent}</h1>
        ${description ? `<p>${description}</p>` : ''}
      </div>
    </header>
  `;
}

function renderFooter() {
  const footerMount = document.querySelector('[data-footer]');
  if (!footerMount) return;

  footerMount.outerHTML = `
    <footer>
      <div class="container">
        <strong>NUTRIFE</strong>
        Elaborado por estudiantes de 5to de Secundaria | Santa Rosa - Trujillo, Peru | 2026
        <p>Fuentes sugeridas: OMS, MINSA Peru, INS, UNICEF y Manual MSD.</p>
      </div>
    </footer>
  `;
}

renderNav();
renderHeader();
renderFooter();
