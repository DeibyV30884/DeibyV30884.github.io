// Genera todo el sitio bilingüe. Uso: node tools/build.mjs
//   Inglés (por defecto):  /index.html        y  /projects/<slug>.html
//   Español:               /es/index.html     y  /es/proyectos/<slug>.html
//   Redirecciones de las URLs antiguas:  /proyectos/<slug>.html
// Para agregar un proyecto: añade un bloque a `projects`, ejecuta el script y listo (también actualiza sitemap.xml).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://deibyvargaschaves.com';
const EMAIL = 'deibyvargaschaves@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/deiby-vargas-chaves-239839258/';
const GITHUB = 'https://github.com/DeibyV30884';
const LANGS = ['en', 'es'];
const tx = (v, l) => (v && typeof v === 'object' && !Array.isArray(v) && 'en' in v ? v[l] : v);

// ------------------------------------------------------------------ rutas
const homePath = (l) => (l === 'en' ? '/' : '/es/');
const projPath = (l, p) => (l === 'en' ? `/projects/${p.slug.en}.html` : `/es/proyectos/${p.slug.es}.html`);
const other = (l) => (l === 'en' ? 'es' : 'en');

// ------------------------------------------------------------------ textos de la interfaz
const UI = {
  nav: { projects: { en: 'Projects', es: 'Proyectos' }, experience: { en: 'Experience', es: 'Experiencia' }, skills: { en: 'Skills', es: 'Habilidades' }, contact: { en: 'Contact', es: 'Contacto' } },
  ids: { profile: { en: 'profile', es: 'perfil' }, projects: { en: 'projects', es: 'proyectos' }, experience: { en: 'experience', es: 'experiencia' }, skills: { en: 'skills', es: 'habilidades' } },
  skip: { en: 'Skip to content', es: 'Saltar al contenido' },
  siteTitle: { en: 'Deiby Vargas Chaves | Project & Operations Management · Full-Stack Developer', es: 'Deiby Vargas Chaves | Gestión de Proyectos y Operaciones · Full-Stack' },
  siteDesc: { en: 'Advanced Systems Engineering student in Costa Rica: project and operations management, team leadership and full-stack development (.NET, Java, React). Remote.', es: 'Estudiante avanzado de Ingeniería en Sistemas en Costa Rica: gestión de proyectos y operaciones, liderazgo de equipos y desarrollo full-stack (.NET, Java, React). Remoto.' },
  ogDesc: { en: 'Project and operations management, team leadership and full-stack development (.NET, Java, React). Costa Rica, remote.', es: 'Gestión de proyectos y operaciones, liderazgo de equipos y desarrollo full-stack (.NET, Java, React). Costa Rica, remoto.' },
  h1role1: { en: 'Project and operations management, team leadership and process improvement.', es: 'Gestión de proyectos y operaciones, liderazgo de equipos y mejora de procesos.' },
  h1role2: { en: 'Systems Engineering student (≈70% completed) and full-stack developer in .NET, Java and React. Based in Costa Rica, available for remote work.', es: 'Estudiante de Ingeniería en Sistemas (≈70 % completado) y desarrollador full-stack en .NET, Java y React. Costa Rica, disponible para trabajo remoto.' },
  lead: { en: "I organize processes, lead teams and take projects from requirements gathering to delivery. With a solid technical foundation, I speak both the client's language and the technical team's.", es: 'Organizo procesos, lidero equipos y llevo proyectos desde el levantamiento de requerimientos hasta la entrega. Con una base técnica sólida, hablo el idioma del cliente y el del equipo técnico.' },
  ctaProjects: { en: 'See projects on video', es: 'Ver proyectos en video' },
  ctaMail: { en: 'Email me', es: 'Escribirme' },
  ctaCv: { en: 'Download CV (PDF)', es: 'Descargar CV (PDF)' },
  cvFile: { en: '/assets/cv/Deiby-Vargas-Chaves-CV-Project-Management-EN.pdf', es: '/assets/cv/Deiby-Vargas-Chaves-CV-Gestion-de-Proyectos-ES.pdf' },
  cvLabel: { en: 'CV', es: 'CV' },
  facts: [
    [{ en: '3', es: '3' }, { en: 'people led in operations', es: 'personas lideradas en operaciones' }],
    [{ en: '5–6×', es: '5–6×' }, { en: 'more output after redesigning the pay model', es: 'más producción tras rediseñar el modelo de pago' }],
    [{ en: '1,000+', es: '1,000+' }, { en: 'products in a store I manage', es: 'productos en una tienda que administro' }],
  ],
  profileH: { en: 'Professional profile', es: 'Perfil profesional' },
  profile: {
    en: [
      'Systems Engineering student (≈70% completed) based in Costa Rica and open to remote work, with hands-on experience in <strong>project and operations management</strong>: leading a small team, organizing processes, managing projects from requirements gathering to delivery, and handling clients directly. I also bring commercial experience: winning clients through cold outreach, setting prices, writing proposals and closing deals.',
      'Technical foundation as a <strong>full-stack developer</strong> in <strong>.NET (C#), Java (Spring Boot) and React</strong>, with <strong>PostgreSQL, SQL Server, MySQL and Oracle SQL</strong>; REST APIs, MVC, SOLID, JWT/2FA authentication and role-based access control. I currently own the technical and product decisions of a real multi-module management system and run agile sprints in YouTrack.',
    ],
    es: [
      'Profesional en Ingeniería en Sistemas con experiencia práctica liderando un equipo pequeño, organizando procesos y gestionando proyectos desde el levantamiento de requerimientos hasta la entrega. También tengo experiencia comercial: capté clientes desde cero con llamadas en frío, definí precios, preparé propuestas y cerré ventas. Asumo responsabilidad, le doy orden a la forma de trabajar y me comunico directamente con clientes y personas involucradas.',
      'Busco crecer hacia la <strong>gestión de proyectos y operaciones</strong>, con una base técnica sólida en desarrollo de software (<strong>.NET, Java, React</strong>) y bases de datos (<strong>SQL Server, MySQL, Oracle SQL, PostgreSQL</strong>).',
    ],
  },
  projectsH: { en: 'Projects', es: 'Proyectos' },
  projectsSub: { en: 'Each project has its own page with a video walkthrough of the working application. All data shown is demo data.', es: 'Cada proyecto tiene su propia página con un recorrido en video de la aplicación funcionando. Todos los datos que aparecen son de demostración.' },
  experienceH: { en: 'Experience', es: 'Experiencia' },
  jobs: [
    {
      title: { en: 'Operations Associate', es: 'Colaborador de Operaciones' },
      meta: { en: 'Defan S.A. (FVC Jasun) · 2021 – Present (part-time)', es: 'Defan S.A. (FVC Jasun) · 2021 – Actualidad (medio tiempo)' },
      items: {
        en: ['I lead and coordinate a team of up to 3 people: inventory, delivery logistics and daily operations.', 'I took over a low-performing process and redesigned the pay model from hourly to per-output, increasing output up to 5–6× in the same shift.', "I reorganized the production flow into specialized roles based on each person's speed and experience.", 'I negotiated supplier agreements: credit on raw materials and better prices for bulk purchases.'],
        es: ['Lidero y coordino un equipo de hasta 3 personas: inventario, logística de entregas y operaciones diarias.', 'Asumí la responsabilidad de un proceso con bajo rendimiento y rediseñé el modelo de pago de por hora a por producción, aumentando la producción hasta 5–6× en el mismo turno.', 'Reorganicé el flujo de producción en roles especializados según la velocidad y experiencia de cada persona.', 'Negocié acuerdos con proveedores: crédito en materia prima y mejores precios por compras al por mayor.'],
      },
    },
    {
      title: { en: 'Freelance Web Developer and Client Project Lead', es: 'Desarrollador Web Freelance y Responsable de Proyectos de Clientes' },
      meta: { en: 'Independent · 2021 – Present', es: 'Independiente · 2021 – Actualidad' },
      items: {
        en: ['I won clients from scratch through cold calls, set pricing, wrote proposals and closed sales. I manage the relationship from delivery through ongoing support of production sites (<a href="https://gaiatattoo.com" target="_blank" rel="noopener">gaiatattoo.com</a>, <a href="https://drluispicado.com" target="_blank" rel="noopener">drluispicado.com</a>).', 'I delivered and manage a WooCommerce store with over 1,000 products (<a href="https://ds-virtual.com" target="_blank" rel="noopener">ds-virtual.com</a>): site migration, performance and image optimization, and payment gateway integration.', 'I handle security incidents end to end (attack mitigation, backup recovery, Cloudflare configuration) with clear, transparent communication to the client.'],
        es: ['Capté clientes desde cero con llamadas en frío, definí precios, elaboré propuestas y cerré ventas. Gestiono la relación desde la entrega hasta el soporte continuo de sitios en producción (<a href="https://gaiatattoo.com" target="_blank" rel="noopener">gaiatattoo.com</a>, <a href="https://drluispicado.com" target="_blank" rel="noopener">drluispicado.com</a>).', 'Entregué y administro una tienda WooCommerce con más de 1,000 productos (<a href="https://ds-virtual.com" target="_blank" rel="noopener">ds-virtual.com</a>): migración del sitio, optimización de rendimiento e imágenes e integración de pasarela de pagos.', 'Atiendo incidentes de seguridad de principio a fin (mitigación de ataques, recuperación de respaldos, configuración de Cloudflare) con comunicación clara y transparente al cliente.'],
      },
    },
  ],
  skillsH: { en: 'Skills', es: 'Habilidades' },
  skills: [
    [{ en: 'Leadership and management', es: 'Liderazgo y gestión' }, { en: 'Project management · team coordination · process organization · process improvement · vendor negotiation · pricing · proposals and sales closing · requirements gathering · client communication · agile sprint management (YouTrack)', es: 'Gestión de proyectos · coordinación de equipos · organización de procesos · mejora de procesos · negociación con proveedores · fijación de precios · propuestas y cierre de ventas · levantamiento de requerimientos · comunicación con clientes · gestión ágil de sprints (YouTrack)' }],
    [{ en: 'Development', es: 'Desarrollo' }, { en: '.NET (C#) · Java / Spring Boot · React · JavaScript · PHP · REST APIs · MVC · SOLID · JWT and 2FA authentication · role-based access control · Git / GitHub', es: '.NET (C#) · Java / Spring Boot · React · JavaScript · PHP · APIs REST · MVC · SOLID · autenticación JWT y 2FA · control de acceso por roles · Git / GitHub' }],
    [{ en: 'Data and infrastructure', es: 'Datos e infraestructura' }, { en: 'SQL Server · MySQL · Oracle SQL · PostgreSQL · WordPress · WooCommerce · Cloudflare · DNS administration · site migration', es: 'SQL Server · MySQL · Oracle SQL · PostgreSQL · WordPress · WooCommerce · Cloudflare · administración de DNS · migración de sitios' }],
  ],
  edu: {
    en: "<strong>Education:</strong> Bachelor's degree in Systems Engineering, Universidad Fidélitas, Costa Rica (in progress, ~70% completed; expected graduation in 6 to 12 months). <strong>Languages:</strong> Spanish (native), English (intermediate; strongest in technical and business conversation).",
    es: '<strong>Educación:</strong> Bachillerato en Ingeniería en Sistemas, Universidad Fidélitas, Costa Rica (en curso, ~70 % completado; graduación esperada en 6 a 12 meses). <strong>Idiomas:</strong> español nativo · inglés intermedio.',
  },
  kwH: { en: 'Key skills', es: 'Competencias clave' },
  kw: ['Project management', 'Operations management', 'Team leadership', 'Process improvement', 'Requirements gathering', 'Stakeholder communication', 'Agile sprint management (YouTrack)', 'Vendor negotiation', '.NET / C#', 'Java / Spring Boot', 'React', 'REST APIs', 'PostgreSQL · SQL Server · MySQL · Oracle SQL', 'JWT · 2FA · RBAC', 'WordPress · WooCommerce · Cloudflare'],
  footer: { en: 'Costa Rica', es: 'Costa Rica' },
  // página de proyecto
  crumb: { en: 'Projects', es: 'Proyectos' },
  scopeH: { en: 'My role and scope', es: 'Mi participación y alcance' },
  composedH: { en: 'What it is made of', es: 'De qué se compone' },
  seenH: { en: 'What the video shows', es: 'Qué se ve en el video' },
  techH: { en: 'Technologies', es: 'Tecnologías' },
  notice: { en: 'Notice:', es: 'Aviso:' },
  chaptersLabel: { en: 'Video chapters', es: 'Capítulos del video' },
  videoFallback: { en: 'Your browser cannot play this video.', es: 'Tu navegador no puede reproducir este video.' },
  prev: { en: 'Previous project', es: 'Proyecto anterior' },
  next: { en: 'Next project', es: 'Proyecto siguiente' },
  otherNav: { en: 'Other projects', es: 'Otros proyectos' },
  contactLine: { en: ['Want a closer look at a module or to talk about how it was built?', 'Email me'], es: ['¿Quieres ver más de cerca algún módulo o hablar de cómo se construyó?', 'Escríbeme'] },
  videoAria: { en: (t) => `Video walkthrough of ${t}, with demo data`, es: (t) => `Recorrido en video por ${t}, con datos de demostración` },
  videoNote: { en: 'Note: the interface shown in the videos is in Spanish.', es: '' },
};

// ------------------------------------------------------------------ proyectos
const projects = [
  {
    slug: { en: 'coraje-esperanza', es: 'coraje-esperanza' },
    title: { en: 'Coraje y Esperanza', es: 'Coraje y Esperanza' },
    short: { en: 'Management system for a day center, with several modules (HR, inventory, accounting, sponsors and portals for families and beneficiaries). I found the client, run the meetings, defined the modules, write the user stories and manage sprints in YouTrack, in addition to developing the system and making the technical decisions. Security with JWT, 2FA and role-protected routes.', es: 'Sistema de gestión para un centro diurno, con varios módulos (RR. HH., inventario, contabilidad, patrocinadores y portales para familias y beneficiarios). Busqué al cliente, gestiono las reuniones, definí los módulos, escribo las historias de usuario y gestiono sprints en YouTrack, además de desarrollar el sistema y tomar las decisiones técnicas. Seguridad con JWT, 2FA y rutas protegidas por rol.' },
    dek: { en: 'Management system for a day center: human resources, accounting, inventory, occupational therapy and portals for families and beneficiaries.', es: 'Sistema de gestión para un centro diurno: recursos humanos, contabilidad, inventario, terapia ocupacional y portales para familias y beneficiarios.' },
    status: { en: 'In development, with a real client', es: 'En desarrollo, con cliente real' },
    logo: 'coraje-esperanza.jpg', logoAlt: { en: 'Logo of Centro Diurno Asociación Coraje y Esperanza', es: 'Logo del Centro Diurno Asociación Coraje y Esperanza' },
    nums: [[ '18', { en: 'functional modules', es: 'módulos funcionales' }], ['47', { en: 'API controllers', es: 'controladores de API' }], ['5', { en: 'areas of the center covered', es: 'áreas del centro cubiertas' }]],
    numsShort: [['18', { en: 'modules', es: 'módulos' }], ['47', { en: 'API controllers', es: 'controladores de API' }], ['5', { en: 'center areas', es: 'áreas del centro' }]],
    ficha: [
      [{ en: 'My role', es: 'Mi función' }, { en: 'I found the client, run the meetings with them, defined the modules, gather functional, non-functional and security requirements, write the user stories and manage sprints and priorities in YouTrack. I also develop the system and own the technical and product decisions.', es: 'Busqué al cliente, gestiono las reuniones con él, definí los módulos, levanto requerimientos funcionales, no funcionales y de seguridad, escribo las historias de usuario y gestiono sprints y prioridades en YouTrack. También desarrollo el sistema y tengo a cargo las decisiones técnicas y de producto.' }],
      [{ en: 'Technologies', es: 'Tecnologías' }, { en: '.NET 10, React, PostgreSQL and SQL Server', es: '.NET 10, React, PostgreSQL y SQL Server' }],
      [{ en: 'Security', es: 'Seguridad' }, { en: 'JWT authentication, two-factor authentication (2FA) and role-protected routes', es: 'Autenticación JWT, doble factor (2FA) y rutas protegidas por rol' }],
      [{ en: 'Modules', es: 'Módulos' }, { en: 'Human resources, inventory and warehouse, accounting, donations, sponsors, occupational therapy and portals', es: 'Recursos humanos, inventario y bodega, contabilidad, donaciones, patrocinadores, terapia ocupacional y portales' }],
    ],
    grupos: {
      en: [['People', ['Users and permissions', 'Human resources', 'Beneficiaries', 'Family members', 'TCU students']], ['Money', ['Accounting', 'Donations', 'Godparents and sponsors']], ['Warehouse and purchasing', ['Inventory and warehouse', 'Suppliers and menu']], ['Care', ['Occupational therapy', "Therapist's log", 'Calendar', 'Beneficiary portal']], ['Administration', ['Fixed assets', 'Document repository', 'Board of directors', 'Change requests']]],
      es: [['Personas', ['Usuarios y permisos', 'Recursos humanos', 'Beneficiarios', 'Familiares', 'Estudiantes de TCU']], ['Dinero', ['Contabilidad', 'Donaciones', 'Padrinos y patrocinadores']], ['Bodega y compras', ['Inventario y bodega', 'Proveedores y menú']], ['Atención', ['Terapia ocupacional', 'Bitácora del terapeuta', 'Calendario', 'Portal del beneficiario']], ['Administración', ['Activos fijos', 'Repositorio de documentos', 'Junta directiva', 'Solicitudes de cambio']]],
    },
    arq: { en: 'Home, profile and notifications are shared by all roles. The .NET 10 API is organized in layers (API, Application, Entities and Infrastructure) and the React frontend is split by module, with built-in guided tutorials and a help center.', es: 'Inicio, perfil y notificaciones son comunes a todos los roles. La API en .NET 10 está organizada por capas (API, Aplicación, Entidades e Infraestructura) y el frontend en React está dividido por módulos, con tutoriales guiados y centro de ayuda integrados.' },
    video: { src: 'coraje-esperanza-demo.mp4', poster: 'coraje-esperanza-poster.jpg', dur: 'PT3M9S',
      chapters: [[0, { en: 'Tutorials, help and users', es: 'Tutoriales, ayuda y usuarios' }], [94, { en: 'Accounting, donations and inventory', es: 'Contabilidad, donaciones e inventario' }], [142, { en: 'Occupational therapy', es: 'Terapia ocupacional' }]] },
    vistas: {
      en: ['<strong>Tutorials and help:</strong> step-by-step guided tour the first time each screen is opened, and a help center with search and a "Show me how" option.', '<strong>Preferences:</strong> light or dark theme saved in each person\'s account.', '<strong>User management (HR):</strong> creating a test account with a role and permissions; the temporary password is shown only once.', '<strong>Accounting and donations:</strong> accounts per fund, transactions, economic summary, current accounts and donation receipts.', '<strong>Inventory and warehouse:</strong> low-stock alerts and traceability.', '<strong>Occupational therapy:</strong> beneficiaries, interventions, indicators per skill and daily attendance.', '<strong>Role-based access:</strong> each role (HR, accountant, therapist) sees only the modules that apply to it.'],
      es: ['<strong>Tutoriales y ayuda:</strong> recorrido guiado paso a paso la primera vez que se entra a cada pantalla y centro de ayuda con buscador y la opción "Mostrarme cómo".', '<strong>Preferencias:</strong> tema claro u oscuro guardado en la cuenta de cada persona.', '<strong>Gestión de usuarios (RR. HH.):</strong> creación de una cuenta de prueba con rol y permisos; la contraseña temporal se muestra una sola vez.', '<strong>Contabilidad y donaciones:</strong> cuentas por fondo, movimientos, resumen económico, cuentas corrientes y recibos de donación.', '<strong>Inventario y bodega:</strong> alertas de stock bajo y trazabilidad.', '<strong>Terapia ocupacional:</strong> beneficiarios, intervenciones, indicadores por habilidad y asistencia diaria.', '<strong>Control de acceso por roles:</strong> cada rol (RR. HH., contador, terapeuta) ve solo los módulos que le corresponden.'],
    },
    tags: ['.NET 10', 'React', 'PostgreSQL', 'JWT', '2FA', 'YouTrack'],
    aviso: { en: 'All data in the video is <strong>demo data</strong>: names of people, users, emails, accounts, amounts and records are fictitious and do not correspond to real information of the center or its beneficiaries.', es: 'Todos los datos del video son <strong>datos de demostración (demo)</strong>: nombres de personas, usuarios, correos, cuentas, montos y registros son ficticios y no corresponden a información real del centro ni de sus beneficiarios.' },
  },
  {
    slug: { en: 'delivery-platform', es: 'entregas' },
    title: { en: 'Internal Delivery Platform', es: 'Plataforma Interna de Entregas' },
    short: { en: 'I identified an operational need of a restaurant courier service and built the application end to end: live order tracking, real-time map and delivery verification with a code. All routes protected with JWT.', es: 'Identifiqué una necesidad operativa de una mensajería para restaurantes y construí la aplicación de principio a fin: seguimiento de pedidos en vivo, mapa en tiempo real y verificación con código de entrega. Todas las rutas protegidas con JWT.' },
    dek: { en: 'Application for a restaurant courier service: orders with live tracking, a real-time map and delivery confirmation with a code.', es: 'Aplicación para una mensajería de restaurantes: pedidos con seguimiento en vivo, mapa en tiempo real y confirmación de la entrega con un código.' },
    logo: 'entregas.png', logoAlt: { en: 'DeUna CR logo, delivery platform', es: 'Logo de DeUna CR, plataforma de entregas' },
    nums: [['4', { en: 'role-based portals', es: 'portales por rol' }], ['8', { en: 'API modules', es: 'módulos de API' }], ['10', { en: 'database tables', es: 'tablas de base de datos' }]],
    numsShort: [['4', { en: 'role portals', es: 'portales por rol' }], ['8', { en: 'API modules', es: 'módulos de API' }], ['10', { en: 'tables', es: 'tablas' }]],
    ficha: [
      [{ en: 'Origin', es: 'Origen' }, { en: 'I identified the operational need and built the application end to end.', es: 'Identifiqué la necesidad operativa y construí la aplicación de principio a fin.' }],
      [{ en: 'Technologies', es: 'Tecnologías' }, { en: '.NET 8 (API), React, Tailwind, Leaflet and SQL Server', es: '.NET 8 (API), React, Tailwind, Leaflet y SQL Server' }],
      [{ en: 'Security', es: 'Seguridad' }, { en: 'JWT authentication and role-protected routes', es: 'Autenticación JWT y rutas protegidas por rol' }],
      [{ en: 'Roles', es: 'Roles' }, { en: 'Customer, restaurant, courier and administrator', es: 'Cliente, restaurante, repartidor y administrador' }],
    ],
    grupos: {
      en: [['Customer', ['Browse restaurants and products', 'Confirm order with map', 'Live tracking', 'History and profile']], ['Restaurant', ['Incoming orders and assignment', 'Product management', 'Courier map', 'Profile']], ['Courier', ['Dashboard with assigned orders', 'Active order with route', 'History and statistics', 'Profile']], ['Administrator', ['Dashboard with statistics', 'User management', 'Balance top-ups', 'Profile']], ['API', ['Administration', 'Customers', 'Orders', 'Products', 'Balance top-ups', 'Couriers', 'Restaurants', 'Users']]],
      es: [['Cliente', ['Explorar restaurantes y productos', 'Confirmar pedido con mapa', 'Seguimiento en vivo', 'Historial y perfil']], ['Restaurante', ['Pedidos entrantes y asignación', 'Gestión de productos', 'Mapa de repartidores', 'Perfil']], ['Repartidor', ['Panel con pedidos asignados', 'Pedido activo con ruta', 'Historial y estadísticas', 'Perfil']], ['Administrador', ['Panel con estadísticas', 'Gestión de usuarios', 'Recarga de saldo', 'Perfil']], ['API', ['Administración', 'Clientes', 'Pedidos', 'Productos', 'Recargas de saldo', 'Repartidores', 'Restaurantes', 'Usuarios']]],
    },
    arq: { en: '.NET 8 API and a React frontend with Tailwind. Maps use Leaflet and the frontend routes are protected by role with JWT.', es: 'API en .NET 8 y frontend en React con Tailwind. Los mapas usan Leaflet y las rutas del frontend están protegidas por rol con JWT.' },
    video: { src: 'entregas-demo.mp4', poster: 'entregas-poster.jpg', dur: 'PT3M5S',
      chapters: [[0, { en: 'Customer: placing the order', es: 'Cliente: hacer el pedido' }], [48, { en: 'Restaurant: accept and assign', es: 'Restaurante: aceptar y asignar' }], [84, { en: 'Courier: the route', es: 'Repartidor: la ruta' }], [110, { en: 'Customer: tracking', es: 'Cliente: seguimiento' }], [126, { en: 'Delivery with code', es: 'Entrega con código' }], [153, { en: 'Administrator', es: 'Administrador' }]] },
    vistas: {
      en: ['<strong>Customer:</strong> searches restaurants, picks a product, confirms the order with the address on a map, sees the shipping cost and total, and follows the order.', '<strong>Restaurant:</strong> receives the order, accepts it, assigns an available courier and checks the courier map and product management.', '<strong>Courier:</strong> accepts the order, sees the route on the map with directions and confirms delivery with the customer\'s code.', '<strong>Administrator:</strong> statistics by period, user management and balance top-ups.'],
      es: ['<strong>Cliente:</strong> busca restaurantes, elige un producto, confirma el pedido con la dirección en el mapa, ve el costo de envío y el total, y sigue el pedido.', '<strong>Restaurante:</strong> recibe el pedido, lo acepta, asigna un repartidor disponible y consulta el mapa de repartidores y la gestión de productos.', '<strong>Repartidor:</strong> acepta el pedido, ve la ruta en el mapa con indicaciones y confirma la entrega con el código del cliente.', '<strong>Administrador:</strong> estadísticas por periodo, gestión de usuarios y recarga de saldo.'],
    },
    tags: ['.NET 8', 'React', 'Leaflet', 'SQL Server', 'JWT'],
    aviso: { en: 'Users, orders, restaurants and amounts in the video are <strong>demo data</strong>; they do not correspond to real people or businesses.', es: 'Usuarios, pedidos, restaurantes y montos del video son <strong>datos de demostración (demo)</strong>; no corresponden a personas ni negocios reales.' },
  },
  {
    slug: { en: 'appointments-records', es: 'citas-expedientes' },
    title: { en: 'Appointments and Medical Records System', es: 'Sistema de Citas y Expedientes Médicos' },
    short: { en: 'Team project: I analyzed the requirements, proposed what would be built, split the work and developed the largest share of the system. A role-based web application (administrator, secretary, doctor and patient) to streamline appointments, medical records and prescriptions.', es: 'Proyecto en equipo: analicé los requerimientos, planteé qué se iba a hacer, dividí el trabajo y desarrollé el mayor porcentaje del sistema. Aplicación web con roles (administrador, secretaría, médico y paciente) para agilizar citas, expedientes médicos y recetas.' },
    dek: { en: 'Role-based web application to schedule appointments, keep patient records and register treatments and prescriptions.', es: 'Aplicación web con roles para programar citas, llevar los expedientes de los pacientes y registrar tratamientos y recetas.' },
    logo: 'citas.svg', logoAlt: { en: 'Generic logo of the demo clinic', es: 'Logo genérico del consultorio de demostración' },
    nums: [['4', { en: 'role-based portals', es: 'portales por rol' }], ['7', { en: 'controllers', es: 'controladores' }], ['12', { en: 'database tables', es: 'tablas de base de datos' }]],
    numsShort: [['4', { en: 'role portals', es: 'portales por rol' }], ['7', { en: 'controllers', es: 'controladores' }], ['12', { en: 'tables', es: 'tablas' }]],
    ficha: [
      [{ en: 'My role', es: 'Mi función' }, { en: 'Team project. I analyzed the requirements, proposed what would be built and split the work into parts. I also developed the largest share of the system.', es: 'Proyecto en equipo. Analicé los requerimientos, planteé qué se iba a hacer y dividí el trabajo en partes. Además desarrollé el mayor porcentaje del sistema.' }],
      [{ en: 'Roles', es: 'Roles' }, { en: 'Administrator, secretary, doctor and patient', es: 'Administrador, secretaría, médico y paciente' }],
      [{ en: 'Technologies', es: 'Tecnologías' }, { en: 'Java, Spring Boot, Thymeleaf, Spring Security and MySQL', es: 'Java, Spring Boot, Thymeleaf, Spring Security y MySQL' }],
      [{ en: 'Languages', es: 'Idiomas' }, { en: 'Interface in Spanish and English', es: 'Interfaz en español e inglés' }],
      [{ en: 'Scope', es: 'Alcance' }, { en: 'Appointments, medical records, prescriptions and user reports', es: 'Citas, expedientes, prescripciones y reportes de usuarios' }],
    ],
    grupos: {
      en: [['Secretary', ['Patients: list, search and registration', 'Appointment schedule', 'Appointment booking', 'Profile']], ['Doctor', ["Today's summary", 'Attending the appointment', 'Records and history', 'Prescriptions']], ['Patient', ['My appointments', 'Schedule and cancel', 'Treatments', 'Profile']], ['Administrator', ['User reports by role', 'User and role management', 'Profile']], ['Access', ['Sign in', 'Patient registration', 'Password recovery']]],
      es: [['Secretaría', ['Pacientes: listado, búsqueda y registro', 'Agenda de citas', 'Registro de citas', 'Perfil']], ['Médico', ['Resumen del día', 'Atención de la cita', 'Expedientes e historial', 'Prescripciones']], ['Paciente', ['Mis citas', 'Agendar y cancelar', 'Tratamientos', 'Perfil']], ['Administrador', ['Reportes de usuarios por rol', 'Gestión de usuarios y roles', 'Perfil']], ['Acceso', ['Inicio de sesión', 'Registro de pacientes', 'Recuperación de contraseña']]],
    },
    arq: { en: 'MVC application on Spring Boot with Thymeleaf views, route- and role-based security with Spring Security, and a MySQL database. The interface can be switched between Spanish and English.', es: 'Aplicación MVC en Spring Boot con vistas Thymeleaf, seguridad por rutas y roles con Spring Security, y base de datos MySQL. La interfaz se puede cambiar entre español e inglés.' },
    video: { src: 'citas-demo.mp4', poster: 'citas-poster.jpg', dur: 'PT2M14S',
      chapters: [[0, { en: 'Secretary', es: 'Secretaría' }], [44, { en: 'Doctor', es: 'Médico' }], [84, { en: 'Patient', es: 'Paciente' }], [115, { en: 'Administrator', es: 'Administrador' }]] },
    vistas: {
      en: ['<strong>Secretary:</strong> patient list and search, appointment schedule and booking a new appointment.', "<strong>Doctor:</strong> today's summary, attending the appointment with the patient's history, notes, treatment and records.", '<strong>Patient:</strong> checking their appointments and scheduling online.', '<strong>Administrator:</strong> user report by role and user management.'],
      es: ['<strong>Secretaría:</strong> listado y búsqueda de pacientes, agenda de citas y registro de una nueva cita.', '<strong>Médico:</strong> resumen del día, atención de la cita con los antecedentes del paciente, observaciones, tratamiento y expedientes.', '<strong>Paciente:</strong> consulta de sus citas y agendamiento en línea.', '<strong>Administrador:</strong> reporte de usuarios por rol y gestión de usuarios.'],
    },
    tags: ['Java', 'Spring Boot', 'Thymeleaf', 'MySQL'],
    aviso: { en: 'Patients, appointments, records and users in the video are <strong>demo data</strong> and fictitious; there is no real medical or personal information.', es: 'Pacientes, citas, expedientes y usuarios del video son <strong>datos de demostración (demo)</strong> y ficticios; no hay información médica ni personal real.' },
  },
  {
    slug: { en: 'alimentico', es: 'alimentico' },
    title: { en: 'AlimenTICO · Food Donation Platform', es: 'AlimenTICO · Donación de Comida' },
    short: { en: 'Team project: I analyzed the requirements, proposed what would be built, split the work and developed the largest share of the system. It connects restaurants with surplus food to people who need it, to reduce waste.', es: 'Proyecto en equipo: analicé los requerimientos, planteé qué se iba a hacer, dividí el trabajo y desarrollé el mayor porcentaje del sistema. Conecta restaurantes con excedentes de comida con personas que la necesitan, para reducir el desperdicio.' },
    dek: { en: 'Platform that connects restaurants with surplus food to people who need it, to reduce waste and create social impact.', es: 'Plataforma que conecta restaurantes con excedentes de comida con personas que la necesitan, para reducir el desperdicio y generar impacto social.' },
    logo: 'alimentico.png', logoAlt: { en: 'AlimenTICO logo', es: 'Logo de AlimenTICO' },
    nums: [['3', { en: 'role-based portals', es: 'portales por rol' }], ['4', { en: 'controllers', es: 'controladores' }], ['8', { en: 'database tables', es: 'tablas de base de datos' }], ['21', { en: 'views', es: 'vistas' }]],
    numsShort: [['3', { en: 'role portals', es: 'portales por rol' }], ['4', { en: 'controllers', es: 'controladores' }], ['8', { en: 'tables', es: 'tablas' }]],
    ficha: [
      [{ en: 'My role', es: 'Mi función' }, { en: 'Team project. I analyzed the requirements, proposed what would be built and split the work into parts. I also developed the largest share of the system.', es: 'Proyecto en equipo. Analicé los requerimientos, planteé qué se iba a hacer y dividí el trabajo en partes. Además desarrollé el mayor porcentaje del sistema.' }],
      [{ en: 'Roles', es: 'Roles' }, { en: 'Restaurant, beneficiary and administrator', es: 'Restaurante, beneficiario y administrador' }],
      [{ en: 'Technologies', es: 'Tecnologías' }, { en: 'PHP with MVC pattern, MySQL, Docker and PHPMailer', es: 'PHP con patrón MVC, MySQL, Docker y PHPMailer' }],
      [{ en: 'Scope', es: 'Alcance' }, { en: 'Donations, reservations with a pickup code, notifications and restaurant opening hours', es: 'Donaciones, reservas con código de retiro, notificaciones y horarios de los restaurantes' }],
    ],
    grupos: {
      en: [['Restaurant', ['Dashboard with donation summary', 'Publish and edit donations', 'Donation details', 'Profile with hours and location']], ['Beneficiary', ['Available donations with search and filters', 'Details and reservation', 'My reservations with pickup code', 'Profile']], ['Administrator', ['Dashboard with statistics', 'Beneficiary management', 'Restaurant management', 'Profile']], ['Access', ['Sign in', 'Restaurant and beneficiary registration', 'Password recovery by email']]],
      es: [['Restaurante', ['Panel con resumen de donaciones', 'Publicar y editar donaciones', 'Detalle de cada donación', 'Perfil con horarios y ubicación']], ['Beneficiario', ['Donaciones disponibles con búsqueda y filtros', 'Detalle y reserva', 'Mis reservas con código de retiro', 'Perfil']], ['Administrador', ['Panel con estadísticas', 'Gestión de beneficiarios', 'Gestión de restaurantes', 'Perfil']], ['Acceso', ['Inicio de sesión', 'Registro de restaurantes y beneficiarios', 'Recuperación de contraseña por correo']]],
    },
    arq: { en: 'PHP with the MVC pattern (controllers, models and views), a MySQL database and email sending with PHPMailer. It runs in Docker containers.', es: 'PHP con patrón MVC (controladores, modelos y vistas), base de datos MySQL y envío de correos con PHPMailer. Corre en contenedores Docker.' },
    video: { src: 'alimentico-demo.mp4', poster: 'alimentico-poster.jpg', dur: 'PT1M40S',
      chapters: [[0, { en: 'Restaurant', es: 'Restaurante' }], [43, { en: 'Beneficiary', es: 'Beneficiario' }], [76, { en: 'Administrator', es: 'Administrador' }]] },
    vistas: {
      en: ['<strong>Restaurant:</strong> publishes a food donation, reviews its donations and manages its profile with hours and location.', '<strong>Beneficiary:</strong> searches available donations, views the details, reserves one and checks the pickup code.', '<strong>Administrator:</strong> overall summary, management of beneficiaries and partner restaurants.'],
      es: ['<strong>Restaurante:</strong> publica una donación de alimentos, revisa sus donaciones y administra el perfil con horarios y ubicación.', '<strong>Beneficiario:</strong> busca donaciones disponibles, ve el detalle, la reserva y consulta su código de retiro.', '<strong>Administrador:</strong> resumen general, gestión de beneficiarios y de restaurantes aliados.'],
    },
    tags: ['PHP', 'MVC', 'MySQL', 'Docker'],
    aviso: { en: 'Restaurants, beneficiaries, donations and emails in the video are <strong>demo data</strong>; they do not correspond to real businesses or people.', es: 'Restaurantes, beneficiarios, donaciones y correos del video son <strong>datos de demostración (demo)</strong>; no corresponden a negocios ni personas reales.' },
  },
];

// ------------------------------------------------------------------ utilidades HTML
const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const personLd = (l) => ({
  '@context': 'https://schema.org', '@type': 'Person', name: 'Deiby Vargas Chaves', url: SITE + '/', email: `mailto:${EMAIL}`,
  jobTitle: 'Project & Operations Management / Full-Stack Developer',
  description: l === 'en'
    ? 'Advanced Systems Engineering student with experience leading teams, managing projects from requirements gathering to delivery and building full-stack systems in .NET, Java and React.'
    : 'Estudiante avanzado de Ingeniería en Sistemas con experiencia liderando equipos, gestionando proyectos desde el levantamiento de requerimientos hasta la entrega y desarrollando sistemas full-stack en .NET, Java y React.',
  address: { '@type': 'PostalAddress', addressCountry: 'CR' }, knowsLanguage: ['es', 'en'], sameAs: [GITHUB, LINKEDIN],
  knowsAbout: ['Project management', 'Project coordination', 'Operations management', 'Team leadership', 'Process improvement', 'Requirements gathering', 'Agile sprint management', 'YouTrack', 'Vendor negotiation', 'Proposals and sales closing', '.NET', 'C#', 'Java', 'Spring Boot', 'React', 'JavaScript', 'PHP', 'REST APIs', 'MVC', 'SOLID', 'JWT', 'Two-factor authentication (2FA)', 'Role-based access control', 'PostgreSQL', 'SQL Server', 'MySQL', 'Oracle SQL', 'Git', 'WordPress', 'WooCommerce', 'Cloudflare'],
});

function head({ l, title, desc, path: pth, altPath, ld }) {
  const url = SITE + pth, alt = SITE + altPath;
  const hre = (code, u) => `  <link rel="alternate" hreflang="${code}" href="${u}">\n`;
  const enUrl = l === 'en' ? url : alt, esUrl = l === 'es' ? url : alt;
  return `<!doctype html>
<html lang="${l}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="author" content="Deiby Vargas Chaves">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="#0A5C73">
  <link rel="canonical" href="${url}">
${hre('en', enUrl)}${hre('es', esUrl)}${hre('x-default', enUrl)}  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Deiby Vargas Chaves">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${url}">
  <meta property="og:locale" content="${l === 'en' ? 'en_US' : 'es_CR'}">
  <meta property="og:locale:alternate" content="${l === 'en' ? 'es_CR' : 'en_US'}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(desc)}">
  <script type="application/ld+json">${JSON.stringify(ld)}</script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=Public+Sans:wght@400;600&display=swap">
  <link rel="stylesheet" href="/style.css">
  <script src="/init.js"></script>
</head>`;
}

const header = (l, current) => {
  const home = homePath(l);
  const id = (k) => tx(UI.ids[k], l);
  return `<a class="skip" href="#contenido">${tx(UI.skip, l)}</a>
  <header class="top">
    <div class="wrap">
      <a class="brand" href="${home}">Deiby Vargas Chaves</a>
      <nav aria-label="${l === 'en' ? 'Main' : 'Principal'}">
        <a href="${home}#${id('projects')}"${current === 'projects' ? ' aria-current="page"' : ''}>${tx(UI.nav.projects, l)}</a>
        <a href="${home}#${id('experience')}">${tx(UI.nav.experience, l)}</a>
        <a href="${home}#${id('skills')}">${tx(UI.nav.skills, l)}</a>
        <a href="mailto:${EMAIL}">${tx(UI.nav.contact, l)}</a>
      </nav>
      <div class="ajustes" id="ajustes"></div>
    </div>
  </header>`;
};

const footer = (l) => `<footer>
    <div class="wrap">© <span id="year">2026</span> Deiby Vargas Chaves · <a href="mailto:${EMAIL}">${EMAIL}</a> · ${tx(UI.footer, l)} ·
    <a href="${tx(UI.cvFile, l)}" download>${tx(UI.cvLabel, l)} (PDF)</a> ·
    <a href="${GITHUB}" target="_blank" rel="noopener">GitHub</a> ·
    <a href="${LINKEDIN}" target="_blank" rel="noopener">LinkedIn</a></div>
  </footer>
  <script src="/app.js"></script>`;

const write = (rel, html) => {
  const f = path.join(root, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, html);
  console.log('escrito', rel);
};

// ------------------------------------------------------------------ inicio
function indexPage(l) {
  const id = (k) => tx(UI.ids[k], l);
  const rows = projects.map((p, i) => `        <li class="row${i === 0 ? ' lead-row' : ''}">
          <div class="logo"><img src="/assets/logos/${p.logo}" alt="${esc(tx(p.logoAlt, l))}" width="200" height="120" loading="lazy"></div>
          <div>
            ${p.status ? `<span class="chip">${esc(tx(p.status, l))}</span>\n            ` : ''}<h3><a href="${projPath(l, p)}">${esc(tx(p.title, l))}</a></h3>
            <p>${tx(p.short, l)}</p>
            <ul class="nums">${p.numsShort.map(([n, lab]) => `<li><strong>${n}</strong> ${esc(tx(lab, l))}</li>`).join('')}</ul>
            <ul class="tags">${p.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
          </div>
        </li>`).join('\n');
  const jobs = UI.jobs.map((j) => `      <div class="job">
        <h3>${tx(j.title, l)} <span>${tx(j.meta, l)}</span></h3>
        <ul>
${tx(j.items, l).map((i) => `          <li>${i}</li>`).join('\n')}
        </ul>
      </div>`).join('\n');
  const skills = UI.skills.map(([h, t]) => `        <div><h3>${tx(h, l)}</h3><p>${tx(t, l)}</p></div>`).join('\n');
  return `${head({ l, title: tx(UI.siteTitle, l), desc: tx(UI.siteDesc, l), path: homePath(l), altPath: homePath(other(l)), ld: personLd(l) })}
<body>
  ${header(l, null)}
  <main id="contenido" class="wrap">
    <div class="hero">
      <h1>Deiby Vargas Chaves</h1>
      <p class="role">${tx(UI.h1role1, l)}</p>
      <p class="role">${tx(UI.h1role2, l)}</p>
      <p class="lead">${tx(UI.lead, l)}</p>
      <div class="cta">
        <a class="btn solid" href="#${id('projects')}">${tx(UI.ctaProjects, l)}</a>
        <a class="btn" href="${tx(UI.cvFile, l)}" download>${tx(UI.ctaCv, l)}</a>
        <a class="btn" href="mailto:${EMAIL}">${tx(UI.ctaMail, l)}</a>
        <a class="btn" href="${LINKEDIN}" target="_blank" rel="noopener">LinkedIn</a>
        <a class="btn" href="${GITHUB}" target="_blank" rel="noopener">GitHub</a>
      </div>
      <dl class="facts">
${UI.facts.map(([n, lab]) => `        <div><dt>${tx(n, l)}</dt><dd>${tx(lab, l)}</dd></div>`).join('\n')}
      </dl>
    </div>

    <section id="${id('profile')}">
      <h2>${tx(UI.profileH, l)}</h2>
${tx(UI.profile, l).map((p) => `      <p class="prose">${p}</p>`).join('\n')}
    </section>

    <section id="${id('projects')}">
      <h2>${tx(UI.projectsH, l)}</h2>
      <p class="sub">${tx(UI.projectsSub, l)}</p>
      <ul class="rows">
${rows}
      </ul>
    </section>

    <section id="${id('experience')}">
      <h2>${tx(UI.experienceH, l)}</h2>
${jobs}
    </section>

    <section id="${id('skills')}">
      <h2>${tx(UI.skillsH, l)}</h2>
      <div class="skills">
${skills}
      </div>
      <p class="edu">${tx(UI.edu, l)}</p>${l === 'en' ? `
      <ul class="kw" aria-label="${UI.kwH.en}">
${UI.kw.map((k) => `        <li>${k}</li>`).join('\n')}
      </ul>` : ''}
    </section>
  </main>
  ${footer(l)}
</body>
</html>
`;
}

// ------------------------------------------------------------------ página de proyecto
function projectPage(l, p, i) {
  const prev = projects[i - 1], next = projects[i + 1];
  const title = tx(p.title, l);
  const ld = {
    '@context': 'https://schema.org', '@type': 'VideoObject',
    name: l === 'en' ? `${title}: video walkthrough (demo data)` : `${title}: recorrido en video (datos de demostración)`,
    description: tx(p.dek, l), thumbnailUrl: `${SITE}/assets/${p.video.poster}`, uploadDate: '2026-11-18', duration: p.video.dur,
    contentUrl: `${SITE}/assets/${p.video.src}`, inLanguage: 'es', author: { '@type': 'Person', name: 'Deiby Vargas Chaves', url: SITE + '/' },
  };
  const [cq, cl] = tx(UI.contactLine, l);
  const note = tx(UI.videoNote, l);
  return `${head({ l, title: `${title} | Deiby Vargas Chaves`, desc: tx(p.dek, l), path: projPath(l, p), altPath: projPath(other(l), p), ld })}
<body>
  ${header(l, 'projects')}
  <main id="contenido" class="wrap">
    <p class="crumb"><a href="${homePath(l)}#${tx(UI.ids.projects, l)}">${tx(UI.crumb, l)}</a> / ${esc(title)}</p>
    <div class="phead">
      <div class="logo logo-sm"><img src="/assets/logos/${p.logo}" alt="${esc(tx(p.logoAlt, l))}" width="160" height="160"></div>
      <div>
        ${p.status ? `<span class="chip">${esc(tx(p.status, l))}</span>` : ''}
        <h1>${esc(title)}</h1>
        <p class="dek">${esc(tx(p.dek, l))}</p>
      </div>
    </div>
    <dl class="facts">
${p.nums.map(([n, lab]) => `      <div><dt>${n}</dt><dd>${esc(tx(lab, l))}</dd></div>`).join('\n')}
    </dl>
    <video class="player" controls preload="metadata" playsinline poster="/assets/${p.video.poster}" aria-label="${esc(UI.videoAria[l](title))}">
      <source src="/assets/${p.video.src}" type="video/mp4">
      ${tx(UI.videoFallback, l)}
    </video>
    <ul class="chapters" aria-label="${tx(UI.chaptersLabel, l)}">
${p.video.chapters.map(([t, lab]) => `      <li><button type="button" data-t="${t}"><time>${mmss(t)}</time>${esc(tx(lab, l))}</button></li>`).join('\n')}
    </ul>
    <p class="aviso"><strong>${tx(UI.notice, l)}</strong> ${tx(p.aviso, l)}${note ? ' ' + note : ''}</p>
    <h2 class="sec-h" style="margin-top:2.5rem">${tx(UI.scopeH, l)}</h2>
    <dl class="ficha">
${p.ficha.map(([k, v]) => `      <div><dt>${esc(tx(k, l))}</dt><dd>${esc(tx(v, l))}</dd></div>`).join('\n')}
    </dl>
    <h2 class="sec-h">${tx(UI.composedH, l)}</h2>
    <div class="grupos">
${tx(p.grupos, l).map(([g, items]) => `      <div><h3>${esc(g)}</h3><ul>${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('\n')}
    </div>
    <p class="arq">${esc(tx(p.arq, l))}</p>
    <div class="cols">
      <div>
        <h2>${tx(UI.seenH, l)}</h2>
        <ul>
${tx(p.vistas, l).map((v) => `          <li>${v}</li>`).join('\n')}
        </ul>
      </div>
      <div>
        <h2>${tx(UI.techH, l)}</h2>
        <ul class="tags">
${p.tags.map((t) => `          <li>${esc(t)}</li>`).join('\n')}
        </ul>
        <p style="margin-top:1.25rem">${cq} <a href="mailto:${EMAIL}?subject=${encodeURIComponent(title)}">${cl}</a>.</p>
      </div>
    </div>
    <nav class="pn" aria-label="${tx(UI.otherNav, l)}">
      ${prev ? `<a class="prev" href="${projPath(l, prev)}"><small>${tx(UI.prev, l)}</small><strong>${esc(tx(prev.title, l))}</strong></a>` : '<span></span>'}
      ${next ? `<a class="next" href="${projPath(l, next)}"><small>${tx(UI.next, l)}</small><strong>${esc(tx(next.title, l))}</strong></a>` : '<span></span>'}
    </nav>
  </main>
  ${footer(l)}
</body>
</html>
`;
}

// ------------------------------------------------------------------ generar
for (const l of LANGS) {
  write(l === 'en' ? 'index.html' : 'es/index.html', indexPage(l));
  projects.forEach((p, i) => write(projPath(l, p).slice(1), projectPage(l, p, i)));
}

// Redirecciones de las URLs antiguas en español (/proyectos/<slug>.html)
const oldSlug = { 'coraje-esperanza': 'coraje-esperanza', entregas: 'entregas', 'citas-expedientes': 'citas-expedientes', alimentico: 'alimentico' };
for (const p of projects) {
  const to = SITE + projPath('es', p);
  write(`proyectos/${p.slug.es}.html`, `<!doctype html>\n<html lang="es"><head><meta charset="utf-8"><title>Redirigiendo…</title><meta name="robots" content="noindex"><link rel="canonical" href="${to}"><meta http-equiv="refresh" content="0;url=${projPath('es', p)}"></head><body><p><a href="${projPath('es', p)}">Ir al proyecto</a></p></body></html>\n`);
}

// Sitemap
const urls = [];
for (const l of LANGS) { urls.push(SITE + homePath(l)); projects.forEach((p) => urls.push(SITE + projPath(l, p))); }
fs.writeFileSync(path.join(root, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc><lastmod>2026-11-18</lastmod></url>`).join('\n')}\n</urlset>\n`);
console.log('sitemap.xml actualizado');
