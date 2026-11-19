// Aplica los ajustes de lectura guardados antes de pintar la página (evita el parpadeo de tema).
(function () {
  var r = document.documentElement, s = {};
  try { s = JSON.parse(localStorage.getItem('ajustes') || '{}'); } catch (e) {}
  r.dataset.theme = s.theme || 'auto';
  r.dataset.size = s.size || 'm';
  if (s.contrast) r.dataset.contrast = 'high';
  if (s.font === 'system') r.dataset.font = 'system';
  if (s.spacing) r.dataset.spacing = 'wide';
  if (s.motion) r.dataset.motion = 'reduce';
})();
