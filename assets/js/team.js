// The team template renders once per listing, so this script can be included multiple
// times on a page — only wire things up once.
if (!window.__pageTeamInit) {
  window.__pageTeamInit = true;

  document.querySelectorAll('.page-team__card').forEach((card) => {
    function toggle() {
      const flipped = card.classList.toggle('is-active');
      card.setAttribute('aria-expanded', flipped);
    }

    card.addEventListener('click', toggle);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });
}
