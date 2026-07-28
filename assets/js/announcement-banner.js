(() => {
  // Supports multiple banners per page in principle, though in practice there's
  // only ever one. Each reads its own target date from its own data-date attribute
  // (set by the announcement-banner shortcode from the `announcement.date`
  // frontmatter) rather than anything hardcoded here.
  document.querySelectorAll('.announcement-banner[data-date]').forEach((el) => {
    const target = new Date(el.dataset.date).getTime();
    if (Number.isNaN(target)) {
      return;
    }

    const timerEl = el.querySelector('.announcement-banner__timer');
    const labelEl = el.querySelector('.announcement-banner__label');
    const daysEl = el.querySelector('[data-unit="days"]');
    const hoursEl = el.querySelector('[data-unit="hours"]');
    const minutesEl = el.querySelector('[data-unit="minutes"]');

    function pad(n) {
      return String(n).padStart(2, '0');
    }

    let interval;

    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) {
        if (timerEl) {
          timerEl.hidden = true;
        }
        if (labelEl) {
          labelEl.textContent = "It's happening now!";
        }
        clearInterval(interval);
        return;
      }

      daysEl.textContent = pad(Math.floor(diff / 86400000));
      hoursEl.textContent = pad(Math.floor((diff % 86400000) / 3600000));
      minutesEl.textContent = pad(Math.floor((diff % 3600000) / 60000));
    }

    tick();
    interval = setInterval(tick, 30000);
  });
})();
