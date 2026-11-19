# Deiby Vargas Chaves · portfolio

Static site (HTML, CSS and a little JavaScript) published with GitHub Pages: https://deibyv30884.github.io/

## Languages
English is the default. Spanish lives under `/es/`. A language switch is in the "Reading settings" panel and remembers the choice. Both versions are real static pages (with `hreflang`), so search engines and ATS read both.

| | English | Español |
|---|---|---|
| Home | `/` | `/es/` |
| Project | `/projects/<slug>.html` | `/es/proyectos/<slug>.html` |

`/proyectos/*.html` are redirects from the first Spanish version.

## Everything is generated
`node tools/build.mjs` writes every page (home and projects, both languages) and `sitemap.xml`. **Do not edit the HTML by hand**; edit the texts in `tools/build.mjs` (`UI` for the home page, `projects` for each project, each text as `{en, es}`) and run it again.

## Other files
- `style.css`: styles and themes. `init.js` applies the reading settings (and the saved language) before paint. `app.js` builds the settings panel and the video chapters.
- `assets/`: videos, posters and logos.

## Reading settings
Language, light/dark/automatic theme, font size (slider), high contrast, system font, more text spacing and reduced motion. Saved in each visitor's browser.

## Add a project
1. Copy the video and poster to `assets/` and the logo to `assets/logos/`.
2. Add a block to `projects` in `tools/build.mjs` (with both languages) and run `node tools/build.mjs`.
