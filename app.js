// El contenido vive en el HTML (lo leen también rastreadores que no ejecutan JavaScript).
// Este archivo solo agrega comodidades: año del pie, panel de ajustes de lectura y capítulos del video.
(function () {
  var root = document.documentElement;
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // ---- Ajustes de lectura ----
  var KEY = 'ajustes';
  var st = {};
  try { st = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) {}
  st.theme = st.theme || 'auto'; st.size = st.size || 'm';

  function apply() {
    root.dataset.theme = st.theme;
    root.dataset.size = st.size;
    st.contrast ? root.dataset.contrast = 'high' : delete root.dataset.contrast;
    st.font === 'system' ? root.dataset.font = 'system' : delete root.dataset.font;
    st.spacing ? root.dataset.spacing = 'wide' : delete root.dataset.spacing;
    st.motion ? root.dataset.motion = 'reduce' : delete root.dataset.motion;
    try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {}
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
      '<span>Ajustes de lectura</span></button>' +
      '<div class="aj-panel" id="aj-panel" role="group" aria-label="Ajustes de lectura" hidden>' +
      seg('theme', 'Tema', [['light', 'Claro'], ['dark', 'Oscuro'], ['auto', 'Automático']]) +
      seg('size', 'Tamaño de letra', [['s', 'Pequeño'], ['m', 'Normal'], ['l', 'Grande'], ['xl', 'Muy grande']]) +
      chk('contrast', 'Contraste alto') +
      chk('font', 'Letra del sistema (más neutra y legible)') +
      chk('spacing', 'Más espacio entre líneas y letras') +
      chk('motion', 'Reducir animaciones') +
      '<button class="aj-reset" type="button">Restablecer ajustes</button></div>';

    var btn = host.querySelector('.aj-btn'), panel = host.querySelector('.aj-panel');
    var sync = function () {
      host.querySelectorAll('input[type=radio]').forEach(function (i) { i.checked = st[i.name] === i.value; });
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
      if (i.type === 'radio') st[i.name] = i.value;
      else if (i.name === 'font') st.font = i.checked ? 'system' : '';
      else st[i.name] = i.checked;
      apply();
    });
    panel.querySelector('.aj-reset').addEventListener('click', function () { st = { theme: 'auto', size: 'm' }; apply(); sync(); });
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
