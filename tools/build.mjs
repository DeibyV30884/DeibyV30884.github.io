// Genera una página por proyecto en /proyectos. Uso: node tools/build.mjs
// Para agregar un proyecto: añade un bloque a `projects`, ejecuta el script y enlázalo desde index.html.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://deibyv30884.github.io';
const EMAIL = 'deibyvargaschaves@gmail.com';

const projects = [
  {
    slug: 'coraje-esperanza',
    title: 'Coraje y Esperanza',
    dek: 'Sistema de gestión para un centro diurno: recursos humanos, contabilidad, inventario, terapia ocupacional y portales para familias y beneficiarios.',
    status: 'En desarrollo, con cliente real',
    ficha: [
      ['Mi función', 'Busqué al cliente, gestiono las reuniones con él, definí los módulos, levanto requerimientos funcionales, no funcionales y de seguridad, escribo las historias de usuario y gestiono sprints y prioridades en YouTrack. También desarrollo el sistema y tengo a cargo las decisiones técnicas y de producto.'],
      ['Tecnologías', '.NET 10, React, PostgreSQL y SQL Server'],
      ['Seguridad', 'Autenticación JWT, doble factor (2FA) y rutas protegidas por rol'],
      ['Módulos', 'Recursos humanos, inventario y bodega, contabilidad, donaciones, patrocinadores, terapia ocupacional y portales'],
    ],
    video: { src: 'coraje-esperanza-demo.mp4', poster: 'coraje-esperanza-poster.jpg', dur: 'PT3M9S',
      chapters: [[0, 'Tutoriales, ayuda y usuarios'], [94, 'Contabilidad, donaciones e inventario'], [142, 'Terapia ocupacional']] },
    vistas: [
      '<strong>Tutoriales y ayuda:</strong> recorrido guiado paso a paso la primera vez que se entra a cada pantalla y centro de ayuda con buscador y la opción "Mostrarme cómo".',
      '<strong>Preferencias:</strong> tema claro u oscuro guardado en la cuenta de cada persona.',
      '<strong>Gestión de usuarios (RR. HH.):</strong> creación de una cuenta de prueba con rol y permisos; la contraseña temporal se muestra una sola vez.',
      '<strong>Contabilidad y donaciones:</strong> cuentas por fondo, movimientos, resumen económico, cuentas corrientes y recibos de donación.',
      '<strong>Inventario y bodega:</strong> alertas de stock bajo y trazabilidad.',
      '<strong>Terapia ocupacional:</strong> beneficiarios, intervenciones, indicadores por habilidad y asistencia diaria.',
      '<strong>Control de acceso por roles:</strong> cada rol (RR. HH., contador, terapeuta) ve solo los módulos que le corresponden.',
    ],
    tags: ['.NET 10', 'React', 'PostgreSQL', 'JWT', '2FA', 'YouTrack'],
    aviso: 'Todos los datos del video son <strong>datos de demostración (demo)</strong>: nombres de personas, usuarios, correos, cuentas, montos y registros son ficticios y no corresponden a información real del centro ni de sus beneficiarios.',
  },
  {
    slug: 'entregas',
    title: 'Plataforma Interna de Entregas',
    dek: 'Aplicación para una mensajería de restaurantes: pedidos con seguimiento en vivo, mapa en tiempo real y confirmación de la entrega con un código.',
    ficha: [
      ['Origen', 'Identifiqué la necesidad operativa y construí la aplicación de principio a fin.'],
      ['Tecnologías', '.NET 8 (API), React, Tailwind, Leaflet y SQL Server'],
      ['Seguridad', 'Autenticación JWT y rutas protegidas por rol'],
      ['Roles', 'Cliente, restaurante, repartidor y administrador'],
    ],
    video: { src: 'entregas-demo.mp4', poster: 'entregas-poster.jpg', dur: 'PT3M5S',
      chapters: [[0, 'Cliente: hacer el pedido'], [48, 'Restaurante: aceptar y asignar'], [84, 'Repartidor: la ruta'], [110, 'Cliente: seguimiento'], [126, 'Entrega con código'], [153, 'Administrador']] },
    vistas: [
      '<strong>Cliente:</strong> busca restaurantes, elige un producto, confirma el pedido con la dirección en el mapa, ve el costo de envío y el total, y sigue el pedido.',
      '<strong>Restaurante:</strong> recibe el pedido, lo acepta, asigna un repartidor disponible y consulta el mapa de repartidores y la gestión de productos.',
      '<strong>Repartidor:</strong> acepta el pedido, ve la ruta en el mapa con indicaciones y confirma la entrega con el código del cliente.',
      '<strong>Administrador:</strong> estadísticas por periodo, gestión de usuarios y recarga de saldo.',
    ],
    tags: ['.NET 8', 'React', 'Leaflet', 'SQL Server', 'JWT'],
    aviso: 'Usuarios, pedidos, restaurantes y montos del video son <strong>datos de demostración (demo)</strong>; no corresponden a personas ni negocios reales.',
  },
  {
    slug: 'citas-expedientes',
    title: 'Sistema de Citas y Expedientes Médicos',
    dek: 'Aplicación web con roles para programar citas, llevar los expedientes de los pacientes y registrar tratamientos y recetas.',
    ficha: [
      ['Mi función', 'Proyecto en equipo. Analicé los requerimientos, planteé qué se iba a hacer y dividí el trabajo en partes. Además desarrollé el mayor porcentaje del sistema.'],
      ['Roles', 'Administrador, secretaría, médico y paciente'],
      ['Tecnologías', 'Java, Spring Boot, Thymeleaf, Spring Security y MySQL'],
      ['Idiomas', 'Interfaz en español e inglés'],
      ['Alcance', 'Citas, expedientes, prescripciones y reportes de usuarios'],
    ],
    video: { src: 'citas-demo.mp4', poster: 'citas-poster.jpg', dur: 'PT2M14S',
      chapters: [[0, 'Secretaría'], [44, 'Médico'], [84, 'Paciente'], [115, 'Administrador']] },
    vistas: [
      '<strong>Secretaría:</strong> listado y búsqueda de pacientes, agenda de citas y registro de una nueva cita.',
      '<strong>Médico:</strong> resumen del día, atención de la cita con los antecedentes del paciente, observaciones, tratamiento y expedientes.',
      '<strong>Paciente:</strong> consulta de sus citas y agendamiento en línea.',
      '<strong>Administrador:</strong> reporte de usuarios por rol y gestión de usuarios.',
    ],
    tags: ['Java', 'Spring Boot', 'Thymeleaf', 'MySQL'],
    aviso: 'Pacientes, citas, expedientes y usuarios del video son <strong>datos de demostración (demo)</strong> y ficticios; no hay información médica ni personal real.',
  },
  {
    slug: 'alimentico',
    title: 'AlimenTICO · Donación de Comida',
    dek: 'Plataforma que conecta restaurantes con excedentes de comida con personas que la necesitan, para reducir el desperdicio y generar impacto social.',
    ficha: [
      ['Mi función', 'Proyecto en equipo. Analicé los requerimientos, planteé qué se iba a hacer y dividí el trabajo en partes. Además desarrollé el mayor porcentaje del sistema.'],
      ['Roles', 'Restaurante, beneficiario y administrador'],
      ['Tecnologías', 'PHP con patrón MVC, MySQL, Docker y PHPMailer'],
      ['Alcance', 'Donaciones, reservas con código de retiro, notificaciones y horarios de los restaurantes'],
    ],
    video: { src: 'alimentico-demo.mp4', poster: 'alimentico-poster.jpg', dur: 'PT1M40S',
      chapters: [[0, 'Restaurante'], [43, 'Beneficiario'], [76, 'Administrador']] },
    vistas: [
      '<strong>Restaurante:</strong> publica una donación de alimentos, revisa sus donaciones y administra el perfil con horarios y ubicación.',
      '<strong>Beneficiario:</strong> busca donaciones disponibles, ve el detalle, la reserva y consulta su código de retiro.',
      '<strong>Administrador:</strong> resumen general, gestión de beneficiarios y de restaurantes aliados.',
    ],
    tags: ['PHP', 'MVC', 'MySQL', 'Docker'],
    aviso: 'Restaurantes, beneficiarios, donaciones y correos del video son <strong>datos de demostración (demo)</strong>; no corresponden a negocios ni personas reales.',
  },
];

// Logo, cifras y componentes (contados del código real de cada proyecto).
const extra = {
  'coraje-esperanza': {
    logo: 'coraje-esperanza.jpg', logoAlt: 'Logo del Centro Diurno Asociación Coraje y Esperanza',
    nums: [['18', 'módulos funcionales'], ['47', 'controladores de API'], ['5', 'áreas del centro cubiertas']],
    grupos: [
      ['Personas', ['Usuarios y permisos', 'Recursos humanos', 'Beneficiarios', 'Familiares', 'Estudiantes de TCU']],
      ['Dinero', ['Contabilidad', 'Donaciones', 'Padrinos y patrocinadores']],
      ['Bodega y compras', ['Inventario y bodega', 'Proveedores y menú']],
      ['Atención', ['Terapia ocupacional', 'Bitácora del terapeuta', 'Calendario', 'Portal del beneficiario']],
      ['Administración', ['Activos fijos', 'Repositorio de documentos', 'Junta directiva', 'Solicitudes de cambio']],
    ],
    arq: 'Inicio, perfil y notificaciones son comunes a todos los roles. La API en .NET 10 está organizada por capas (API, Aplicación, Entidades e Infraestructura) y el frontend en React está dividido por módulos, con tutoriales guiados y centro de ayuda integrados.',
  },
  entregas: {
    logo: 'entregas.png', logoAlt: 'Logo de DeUna CR, plataforma de entregas',
    nums: [['4', 'portales por rol'], ['8', 'módulos de API'], ['10', 'tablas de base de datos']],
    grupos: [
      ['Cliente', ['Explorar restaurantes y productos', 'Confirmar pedido con mapa', 'Seguimiento en vivo', 'Historial y perfil']],
      ['Restaurante', ['Pedidos entrantes y asignación', 'Gestión de productos', 'Mapa de repartidores', 'Perfil']],
      ['Repartidor', ['Panel con pedidos asignados', 'Pedido activo con ruta', 'Historial y estadísticas', 'Perfil']],
      ['Administrador', ['Panel con estadísticas', 'Gestión de usuarios', 'Recarga de saldo', 'Perfil']],
      ['API', ['Administración', 'Clientes', 'Pedidos', 'Productos', 'Recargas de saldo', 'Repartidores', 'Restaurantes', 'Usuarios']],
    ],
    arq: 'API en .NET 8 y frontend en React con Tailwind. Los mapas usan Leaflet y las rutas del frontend están protegidas por rol con JWT.',
  },
  'citas-expedientes': {
    logo: 'citas.svg', logoAlt: 'Logo genérico del consultorio de demostración',
    nums: [['4', 'portales por rol'], ['7', 'controladores'], ['12', 'tablas de base de datos']],
    grupos: [
      ['Secretaría', ['Pacientes: listado, búsqueda y registro', 'Agenda de citas', 'Registro de citas', 'Perfil']],
      ['Médico', ['Resumen del día', 'Atención de la cita', 'Expedientes e historial', 'Prescripciones']],
      ['Paciente', ['Mis citas', 'Agendar y cancelar', 'Tratamientos', 'Perfil']],
      ['Administrador', ['Reportes de usuarios por rol', 'Gestión de usuarios y roles', 'Perfil']],
      ['Acceso', ['Inicio de sesión', 'Registro de pacientes', 'Recuperación de contraseña']],
    ],
    arq: 'Aplicación MVC en Spring Boot con vistas Thymeleaf, seguridad por rutas y roles con Spring Security, y base de datos MySQL. La interfaz se puede cambiar entre español e inglés.',
  },
  alimentico: {
    logo: 'alimentico.png', logoAlt: 'Logo de AlimenTICO',
    nums: [['3', 'portales por rol'], ['4', 'controladores'], ['8', 'tablas de base de datos'], ['21', 'vistas']],
    grupos: [
      ['Restaurante', ['Panel con resumen de donaciones', 'Publicar y editar donaciones', 'Detalle de cada donación', 'Perfil con horarios y ubicación']],
      ['Beneficiario', ['Donaciones disponibles con búsqueda y filtros', 'Detalle y reserva', 'Mis reservas con código de retiro', 'Perfil']],
      ['Administrador', ['Panel con estadísticas', 'Gestión de beneficiarios', 'Gestión de restaurantes', 'Perfil']],
      ['Acceso', ['Inicio de sesión', 'Registro de restaurantes y beneficiarios', 'Recuperación de contraseña por correo']],
    ],
    arq: 'PHP con patrón MVC (controladores, modelos y vistas), base de datos MySQL y envío de correos con PHPMailer. Corre en contenedores Docker.',
  },
};

const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const plain = (s) => s.replace(/<[^>]+>/g, '');

const head = (title, desc, url, extra = '') => `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="author" content="Deiby Vargas Chaves">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="#0A5C73">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Deiby Vargas Chaves">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${url}">
  <meta property="og:locale" content="es_CR">
  <meta name="twitter:card" content="summary">
${extra}  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=Public+Sans:wght@400;600&display=swap">
  <link rel="stylesheet" href="/style.css">
  <script src="/init.js"></script>
</head>`;

const header = (current) => `<a class="skip" href="#contenido">Saltar al contenido</a>
  <header class="top">
    <div class="wrap">
      <a class="brand" href="/">Deiby Vargas Chaves</a>
      <nav aria-label="Principal">
        <a href="/#proyectos"${current === 'proyectos' ? ' aria-current="page"' : ''}>Proyectos</a>
        <a href="/#experiencia">Experiencia</a>
        <a href="/#habilidades">Habilidades</a>
        <a href="mailto:${EMAIL}">Contacto</a>
      </nav>
      <div class="ajustes" id="ajustes"></div>
    </div>
  </header>`;

const footer = `<footer>
    <div class="wrap">© <span id="year">2026</span> Deiby Vargas Chaves · <a href="mailto:${EMAIL}">${EMAIL}</a> · Costa Rica ·
    <a href="https://github.com/DeibyV30884" target="_blank" rel="noopener">GitHub</a> ·
    <a href="https://www.linkedin.com/in/deiby-vargas-chaves-239839258/" target="_blank" rel="noopener">LinkedIn</a></div>
  </footer>
  <script src="/app.js"></script>`;

fs.mkdirSync(path.join(root, 'proyectos'), { recursive: true });

projects.forEach((p, i) => {
  const url = `${SITE}/proyectos/${p.slug}.html`;
  const prev = projects[i - 1], next = projects[i + 1];
  const x = extra[p.slug];
  const ld = {
    '@context': 'https://schema.org', '@type': 'VideoObject',
    name: `${p.title}: recorrido en video (datos de demostración)`,
    description: p.dek, thumbnailUrl: `${SITE}/assets/${p.video.poster}`,
    uploadDate: '2026-11-18', duration: p.video.dur, contentUrl: `${SITE}/assets/${p.video.src}`,
    author: { '@type': 'Person', name: 'Deiby Vargas Chaves', url: SITE + '/' },
  };
  const html = `${head(`${p.title} | Deiby Vargas Chaves`, p.dek, url, `  <script type="application/ld+json">${JSON.stringify(ld)}</script>\n`)}
<body>
  ${header('proyectos')}
  <main id="contenido" class="wrap">
    <p class="crumb"><a href="/#proyectos">Proyectos</a> / ${esc(p.title)}</p>
    <div class="phead">
      <div class="logo logo-sm"><img src="/assets/logos/${x.logo}" alt="${esc(x.logoAlt)}" width="160" height="160"></div>
      <div>
        ${p.status ? `<span class="chip">${esc(p.status)}</span>` : ''}
        <h1>${esc(p.title)}</h1>
        <p class="dek">${esc(p.dek)}</p>
      </div>
    </div>
    <dl class="facts">
${x.nums.map(([n, l]) => `      <div><dt>${n}</dt><dd>${esc(l)}</dd></div>`).join('\n')}
    </dl>
    <video class="player" controls preload="metadata" playsinline poster="/assets/${p.video.poster}" aria-label="${esc(`Recorrido en video por ${p.title}, con datos de demostración`)}">
      <source src="/assets/${p.video.src}" type="video/mp4">
      Tu navegador no puede reproducir este video.
    </video>
    <ul class="chapters" aria-label="Capítulos del video">
${p.video.chapters.map(([t, l]) => `      <li><button type="button" data-t="${t}"><time>${mmss(t)}</time>${esc(l)}</button></li>`).join('\n')}
    </ul>
    <p class="aviso"><strong>Aviso:</strong> ${p.aviso}</p>
    <h2 class="sec-h" style="margin-top:2.5rem">Mi participación y alcance</h2>
    <dl class="ficha">
${p.ficha.map(([k, v]) => `      <div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('\n')}
    </dl>
    <h2 class="sec-h">De qué se compone</h2>
    <div class="grupos">
${x.grupos.map(([g, items]) => `      <div><h3>${esc(g)}</h3><ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></div>`).join('\n')}
    </div>
    <p class="arq">${esc(x.arq)}</p>
    <div class="cols">
      <div>
        <h2>Qué se ve en el video</h2>
        <ul>
${p.vistas.map((v) => `          <li>${v}</li>`).join('\n')}
        </ul>
      </div>
      <div>
        <h2>Tecnologías</h2>
        <ul class="tags">
${p.tags.map((t) => `          <li>${esc(t)}</li>`).join('\n')}
        </ul>
        <p style="margin-top:1.25rem">¿Quieres ver más de cerca algún módulo o hablar de cómo se construyó? <a href="mailto:${EMAIL}?subject=${encodeURIComponent(p.title)}">Escríbeme</a>.</p>
      </div>
    </div>
    <nav class="pn" aria-label="Otros proyectos">
      ${prev ? `<a class="prev" href="/proyectos/${prev.slug}.html"><small>Proyecto anterior</small><strong>${esc(prev.title)}</strong></a>` : '<span></span>'}
      ${next ? `<a class="next" href="/proyectos/${next.slug}.html"><small>Proyecto siguiente</small><strong>${esc(next.title)}</strong></a>` : '<span></span>'}
    </nav>
  </main>
  ${footer}
</body>
</html>
`;
  fs.writeFileSync(path.join(root, 'proyectos', `${p.slug}.html`), html);
  console.log('escrito', `proyectos/${p.slug}.html`, plain(p.title));
});

// Sitemap
const urls = [`${SITE}/`, ...projects.map((p) => `${SITE}/proyectos/${p.slug}.html`)];
fs.writeFileSync(path.join(root, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc><lastmod>2026-11-18</lastmod></url>`).join('\n')}\n</urlset>\n`);
console.log('sitemap.xml actualizado');
