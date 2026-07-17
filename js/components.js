// Lista de paginas del sitio.
// Cada objeto guarda el identificador interno, el texto del menu y la ruta.
const pages = [
  { id: 'inicio', label: 'Inicio', href: 'index.html' },
  { id: 'que-es', label: 'Que es?', href: 'pages/que-es.html' },
  { id: 'tipos', label: 'Tipos', href: 'pages/tipos.html' },
  { id: 'causas', label: 'Causas', href: 'pages/causas.html' },
  { id: 'diagnostico', label: 'Diagnostico', href: 'pages/diagnostico.html' },
  { id: 'alimentos', label: 'Alimentos', href: 'pages/alimentos.html' },
  { id: 'prevencion', label: 'Prevencion', href: 'pages/prevencion.html' },
  { id: 'datos', label: 'Datos', href: 'pages/datos.html' },
  { id: 'noticias', label: 'Noticias', href: 'pages/noticias.html' },
  { id: 'recetas', label: 'Recetas', href: 'pages/recetas.html' }
];

// Revisa si la pagina actual esta dentro de la carpeta "pages".
// Esto ayuda a construir rutas correctas desde index.html y desde paginas internas.
const isInsidePages = window.location.pathname.includes('/pages/');

// basePath es el prefijo que se agrega antes de rutas de imagenes, paginas y archivos.
const basePath = isInsidePages ? '../' : './';

// Funcion que crea el menu principal de navegacion.
function renderNav() {
  // current lee el valor de <body data-page="..."> para saber donde estamos.
  const current = document.body.dataset.page;

  // navMount busca el div vacio donde se insertara el menu.
  const navMount = document.querySelector('[data-nav]');

  // Si no existe ese div, se detiene la funcion para evitar errores.
  if (!navMount) return;

  // innerHTML escribe el HTML del menu dentro del div data-nav.
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

// Funcion que crea el encabezado visual de cada pagina.
function renderHeader() {
  // headerMount busca el div que tiene data-header en el HTML.
  const headerMount = document.querySelector('[data-header]');

  // Si no hay marcador de encabezado, no hace nada.
  if (!headerMount) return;

  // Estos datos salen de los atributos data-title, data-kicker y data-description.
  const title = headerMount.dataset.title || 'NUTRIFE';
  const kicker = headerMount.dataset.kicker || 'Salud';
  const description = headerMount.dataset.description || '';

  // La pagina de inicio usa una clase extra para tener un encabezado mas grande.
  const variant = headerMount.dataset.variant === 'home' ? 'page-header home-header' : 'page-header';

  // Si el titulo es NUTRIFE, se muestra el logo; si no, se muestra texto.
  const titleContent = title.trim().toUpperCase() === 'NUTRIFE'
    ? `<img class="hero-logo" src="${basePath}imagenes/LogoNutrife-cropped.png" alt="NUTRIFE" />`
    : title;

  // outerHTML reemplaza el div data-header por un header completo.
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

// Funcion que crea el pie de pagina compartido.
function renderFooter() {
  // footerMount busca el div vacio donde se insertara el footer.
  const footerMount = document.querySelector('[data-footer]');

  // Si no existe el marcador, se evita ejecutar codigo innecesario.
  if (!footerMount) return;

  // Se reemplaza el marcador por el contenido real del pie de pagina.
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

// Estas llamadas ejecutan las funciones cuando se carga components.js.
renderNav();
renderHeader();
renderFooter();
