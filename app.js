// El contenido vive en el HTML (lo leen también rastreadores que no ejecutan JavaScript).
// Este archivo solo agrega comodidades: año del pie, panel de ajustes de lectura (con idioma) y capítulos del video.
(function () {
  var root = document.documentElement;
  var lang = root.lang === 'es' ? 'es' : 'en';
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  var T = {
    en: { btn: 'Reading settings', group: 'Reading settings', theme: 'Theme', light: 'Light', dark: 'Dark', auto: 'Automatic', size: 'Font size',
      contrast: 'High contrast', font: 'System font (more neutral and legible)', spacing: 'More space between lines and letters', motion: 'Reduce animations',
      lang: 'Language', reset: 'Reset settings', close: 'Close settings' },
    es: { btn: 'Ajustes de lectura', group: 'Ajustes de lectura', theme: 'Tema', light: 'Claro', dark: 'Oscuro', auto: 'Automático', size: 'Tamaño de letra',
      contrast: 'Contraste alto', font: 'Letra del sistema (más neutra y legible)', spacing: 'Más espacio entre líneas y letras', motion: 'Reducir animaciones',
      lang: 'Idioma', reset: 'Restablecer ajustes', close: 'Cerrar ajustes' },
  }[lang];

  // ---- Ajustes de lectura ----
  var KEY = 'ajustes';
  var st = {};
  try { st = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) {}
  st.theme = st.theme || 'auto'; st.fs = Number(st.fs) || 100;

  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function apply() {
    root.dataset.theme = st.theme;
    root.style.setProperty('--fs', st.fs + '%');
    st.contrast ? root.dataset.contrast = 'high' : delete root.dataset.contrast;
    st.font === 'system' ? root.dataset.font = 'system' : delete root.dataset.font;
    st.spacing ? root.dataset.spacing = 'wide' : delete root.dataset.spacing;
    st.motion ? root.dataset.motion = 'reduce' : delete root.dataset.motion;
    save();
  }

  function goLang(code) {
    st.lang = code; save();
    if (code === lang) return;
    var alt = document.querySelector('link[rel="alternate"][hreflang="' + code + '"]');
    if (alt) location.href = new URL(alt.href).pathname + location.hash;
  }

  var host = document.getElementById('ajustes');
  if (host) {
    var seg = function (name, legend, opts) {
      return '<fieldset><legend>' + legend + '</legend><div class="seg">' + opts.map(function (o) {
        return '<label><input type="radio" name="' + name + '" value="' + o[0] + '"><span>' + o[1] + '</span></label>';
      }).join('') + '</div></fieldset>';
    };
    var chk = function (name, text) {
      return '<label class="opt"><input type="checkbox" name="' + name + '"><span>' + text + '</span></label>';
    };
    host.innerHTML =
      '<button class="aj-btn" type="button" aria-expanded="false" aria-controls="aj-panel">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 19 9 5l6 14M5.2 14h7.6M16 19l2.5-6 2.5 6M17 17.5h3"/></svg>' +
      '<span>' + T.btn + '</span></button>' +
      '<div class="aj-panel" id="aj-panel" role="group" aria-label="' + T.group + '" hidden>' +
      '<div class="aj-head"><strong>' + T.group + '</strong>' +
      '<button class="aj-close" type="button" aria-label="' + T.close + '">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>' +
      seg('lang', T.lang, [['en', 'English'], ['es', 'Español']]) +
      seg('theme', T.theme, [['light', T.light], ['dark', T.dark], ['auto', T.auto]]) +
      '<fieldset><legend><label for="aj-fs">' + T.size + '</label></legend><div class="range"><span class="a-s" aria-hidden="true">A</span>' +
      '<input id="aj-fs" type="range" min="85" max="150" step="5" value="100" aria-valuetext="100 %"><span class="a-l" aria-hidden="true">A</span><output for="aj-fs">100 %</output></div></fieldset>' +
      chk('contrast', T.contrast) + chk('font', T.font) + chk('spacing', T.spacing) + chk('motion', T.motion) +
      '<button class="aj-reset" type="button">' + T.reset + '</button></div>';

    var btn = host.querySelector('.aj-btn'), panel = host.querySelector('.aj-panel');
    var fsIn = host.querySelector('#aj-fs'), fsOut = host.querySelector('output');
    var showFs = function () { fsIn.value = st.fs; fsOut.textContent = st.fs + ' %'; fsIn.setAttribute('aria-valuetext', st.fs + ' %'); };
    fsIn.addEventListener('input', function () { st.fs = Number(fsIn.value); showFs(); apply(); });
    var sync = function () {
      showFs();
      host.querySelector('[name=lang][value=' + lang + ']').checked = true;
      host.querySelector('[name=theme][value=' + st.theme + ']').checked = true;
      host.querySelector('[name=contrast]').checked = !!st.contrast;
      host.querySelector('[name=font]').checked = st.font === 'system';
      host.querySelector('[name=spacing]').checked = !!st.spacing;
      host.querySelector('[name=motion]').checked = !!st.motion;
    };
    var close = function (focus) { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); if (focus) btn.focus(); };
    btn.addEventListener('click', function () {
      var open = panel.hidden;
      panel.hidden = !open; btn.setAttribute('aria-expanded', String(open));
      if (open) { sync(); var f = panel.querySelector('input:checked') || panel.querySelector('input'); f && f.focus(); }
    });
    panel.addEventListener('change', function (e) {
      var i = e.target;
      if (i.name === 'lang') { goLang(i.value); return; }
      if (i.name === 'theme') st.theme = i.value;
      else if (i.name === 'font') st.font = i.checked ? 'system' : '';
      else st[i.name] = i.checked;
      apply();
    });
    panel.querySelector('.aj-close').addEventListener('click', function () { close(true); });
    panel.querySelector('.aj-reset').addEventListener('click', function () { st = { theme: 'auto', fs: 100, lang: st.lang }; apply(); sync(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) close(true); });
    document.addEventListener('click', function (e) { if (!panel.hidden && !host.contains(e.target)) close(false); });
    apply();
  }

  // ---- Capítulos del video: saltar a un momento ----
  document.querySelectorAll('.chapters button[data-t]').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = document.querySelector('video.player');
      if (!v) return;
      v.currentTime = Number(b.dataset.t);
      v.play().catch(function () {});
      v.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });
  });
})();
