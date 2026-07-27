(() => {
  const el = document.getElementById('userMeetingCountdown');
  if (!el) {
    return;
  }

  // Kickoff time from the 2026 agenda (Wednesday, August 26, 09:30 local),
  // in Norrköping's summer offset (CEST, UTC+2).
  const target = new Date('2026-08-26T09:30:00+02:00').getTime();

  const timerEl = el.querySelector('.page-index__meeting-banner-timer');
  const labelEl = el.querySelector('.page-index__meeting-banner-label');
  const daysEl = document.getElementById('cdDays');
  const hoursEl = document.getElementById('cdHours');
  const minutesEl = document.getElementById('cdMinutes');

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
        labelEl.textContent = 'The 2026 OpenSpace User Meeting is happening now in Norrköping, Sweden!';
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
})();
