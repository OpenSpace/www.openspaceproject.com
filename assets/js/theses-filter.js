document.addEventListener('DOMContentLoaded', () => {
  let active = null;

  document.querySelectorAll('.page-research__thesis-partner-tag').forEach((btn) => {
    btn.addEventListener('click', () => {
      const partner = active === btn.dataset.partner ? null : btn.dataset.partner;

      active = partner;

      document.querySelectorAll('.page-research__thesis-partner-tag').forEach((btn) => {
        const isActive = btn.dataset.partner === partner;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-pressed', String(isActive));
      });

      document.querySelectorAll('.page-research__thesis-row').forEach((row) => {
        row.classList.toggle('is-hidden', partner && row.dataset.partner !== partner);
      });

      document.querySelectorAll('.page-research__year-label').forEach((label) => {
        const year = label.dataset.year;
        const hasVisible = !!document.querySelector(
          `.page-research__thesis-row:not(.is-hidden)[data-year="${year}"]`
        );
        label.classList.toggle('is-hidden', !hasVisible);
      });
    });
  });
});
