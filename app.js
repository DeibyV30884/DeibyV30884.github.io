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
    projects.forEach((p, i) => {
      const links = el('div', { class: 'links' });
      if (p.demo) links.append(el('a', { href: p.demo, text: (p.demoLabel || 'Demo') + ' →' }));
      if (p.repo) links.append(el('a', { href: p.repo, target: '_blank', rel: 'noopener', text: 'Código ↗' }));
      const tags = el('ul', { class: 'tags' }, ...(p.tags || []).map(t => el('li', { text: t })));
      const card = el('article', { class: 'card' + (i === 0 ? ' featured' : '') });
      if (p.badge) card.append(el('span', { class: 'badge', text: p.badge }));
      card.append(el('h3', { text: p.title }), el('p', { text: p.description }), tags, links);
      grid.append(card);
    });
  })
  .catch(() => { grid.textContent = 'No se pudieron cargar los proyectos.'; });
