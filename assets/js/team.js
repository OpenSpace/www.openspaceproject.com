// The team template renders once per listing, so this script can be included multiple
// times on a page — only wire things up once via event delegation.
if (!window.__pageTeamInit) {
  window.__pageTeamInit = true;

  document.addEventListener('click', (e) => {
    const card = e.target.closest('.page-team__card');
    if (!card) return;
    const flipped = card.classList.toggle('is-active');
    card.setAttribute('aria-expanded', flipped);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.page-team__card');
    if (!card) return;
    e.preventDefault();
    const flipped = card.classList.toggle('is-active');
    card.setAttribute('aria-expanded', flipped);
  });
}
