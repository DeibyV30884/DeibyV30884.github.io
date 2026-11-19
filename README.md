# Portafolio de Deiby Vargas Chaves

Sitio estático (HTML, CSS y un poco de JavaScript) publicado con GitHub Pages: https://deibyv30884.github.io/

## Estructura
- `index.html`: inicio (perfil, proyectos, experiencia, habilidades y resumen en inglés). El contenido está en el HTML para que lo lean también los rastreadores.
- `proyectos/*.html`: una página por proyecto, con video, capítulos, ficha técnica y aviso de datos de demostración. **Se generan** con `node tools/build.mjs`; no se editan a mano.
- `style.css`: estilos y temas. `init.js` aplica los ajustes de lectura antes de pintar. `app.js` construye el panel de ajustes y los capítulos del video.
- `assets/`: videos y pósters.

## Ajustes de lectura
Tema claro, oscuro o automático, cuatro tamaños de letra, contraste alto, letra del sistema, más espacio entre líneas y reducir animaciones. Se guardan en el navegador de cada visitante.

## Agregar un proyecto
1. Copia el video y el póster a `assets/`.
2. Agrega un bloque a `projects` en `tools/build.mjs` y ejecuta `node tools/build.mjs` (también actualiza `sitemap.xml`).
3. Agrega su fila en la sección `#proyectos` de `index.html`.
