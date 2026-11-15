const grid = document.getElementById('grid');
document.getElementById('year').textContent = new Date().getFullYear();

const el = (tag, attrs = {}, ...kids) => {
  const n = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => (k === 'text' ? (n.textContent = v) : n.setAttribute(k, v)));
  kids.forEach(k => n.append(k));
  return n;
};

fetch('projects.json')
  .then(r => r.json())
  .then(projects => {
    projects.forEach(p => {
      const links = el('div', { class: 'links' });
      if (p.repo) links.append(el('a', { href: p.repo, target: '_blank', rel: 'noopener', text: 'Código ↗' }));
      if (p.demo) links.append(el('a', { href: p.demo, target: '_blank', rel: 'noopener', text: 'Demo ↗' }));
      const tags = el('ul', { class: 'tags' }, ...(p.tags || []).map(t => el('li', { text: t })));
      grid.append(el('article', { class: 'card' },
        el('h3', { text: p.title }), el('p', { text: p.description }), tags, links));
    });
  })
  .catch(() => { grid.textContent = 'No se pudieron cargar los proyectos.'; });
