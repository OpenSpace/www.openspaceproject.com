(() => {
  // ---------------------------------------------------------------------- //
  // Copyright year
  // ---------------------------------------------------------------------- //

  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ---------------------------------------------------------------------- //
  // Newsletter signup (Mailchimp)
  // ---------------------------------------------------------------------- //

  let _email = '';

  function show(n) {
    for (let i = 1; i <= 3; i++) {
      const el = document.getElementById('footer-newsletter-' + i);
      if (el) el.hidden = (i !== n);
    }
  }

  function setMsg(step, msg, isError) {
    const el = document.getElementById('footer-newsletter-msg-' + step);
    if (!el) return;
    el.textContent = msg;
    el.className = 'footer-newsletter-msg' + (isError ? ' footer-newsletter-msg--error' : '');
    el.hidden = !msg;
  }

  function val(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function submitToMailchimp(data) {
    const btn = document.getElementById('footer-newsletter-submit');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Subscribing...';
    }

    data['b_4c1bf0cc740f267dc37ede3ff_002e0deef0'] = '';
    const qs = Object.keys(data).map((k) => {
      return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
    }).join('&');

    const cb = `mcSub${Date.now()}`;
    const s = document.createElement('script');
    s.src = 'https://amnh.us20.list-manage.com/subscribe/post-json?u=4c1bf0cc740f267dc37ede3ff&id=002e0deef0&' + qs + '&c=' + cb;

    function cleanup() {
      clearTimeout(timer);
      delete window[cb];
      if (s.parentNode) s.parentNode.removeChild(s);
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Complete signup';
      }
    }

    // If the JSONP callback never fires, clean up and surface an error
    const timer = setTimeout(() => {
      // Swallow a late response instead of throwing on a missing callback
      window[cb] = function () { delete window[cb]; };
      if (s.parentNode) s.parentNode.removeChild(s);
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Complete signup';
      }
      setMsg(2, 'Connection error. Please try again.', true);
    }, 15000);

    window[cb] = function (r) {
      cleanup();
      if (r.result === 'success') {
        show(3);
      }
      else {
        const msg = (r.msg || 'Something went wrong. Please try again.').replace(/^\d+ - /, '');
        // Parse the Mailchimp HTML response into plain text to avoid HTML injection
        const tmp = document.createElement('div');
        tmp.innerHTML = msg;
        setMsg(2, tmp.textContent || msg, true);
      }
    };

    s.onerror = () => {
      cleanup();
      setMsg(2, 'Connection error. Please try again.', true);
    };

    document.head.appendChild(s);
  }

  const step1 = document.getElementById('footer-newsletter-1');
  if (step1) {
    step1.addEventListener('submit', (e) => {
      e.preventDefault();
      setMsg(1, '', false);
      const email = val('footer-newsletter-email');
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setMsg(1, 'Please enter a valid email address.', true);
        return;
      }
      _email = email;
      show(2);
    });
  }

  const step2 = document.getElementById('footer-newsletter-2');
  if (step2) {
    step2.addEventListener('submit', (e) => {
      e.preventDefault();
      setMsg(2, '', false);
      const data = { EMAIL: _email };
      const fname = val('footer-newsletter-fname');
      if (fname) data.FNAME = fname;

      const lname = val('footer-newsletter-lname');
      if (lname) data.LNAME = lname;

      const affil = val('footer-newsletter');
      if (affil) data.MMERGE6 = affil;

      const how = val('footer-newsletter-how');
      if (how) data.MMERGE7 = how;
      submitToMailchimp(data);
    });
  }

  const skipBtn = document.getElementById('footer-newsletter-skip');
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      setMsg(2, '', false);
      submitToMailchimp({ EMAIL: _email });
    });
  }

  // ---------------------------------------------------------------------- //
  // System status indicator (Uptime Kuma)
  // ---------------------------------------------------------------------- //

  const LABELS = {
    up: 'All Systems Operational',
    degraded: 'Partial Outage',
    down: 'Major Outage',
    unknown: 'Status unavailable'
  };

  function setStatus(key) {
    const dot = document.getElementById('status-dot');
    if (dot) {
      dot.className = `status-dot status--${key}`;
    }

    const text = document.getElementById('status-text');
    if (text) {
      text.textContent = LABELS[key] || LABELS.unknown;
    }
  }

  fetch('https://uptime.openspaceproject.com/api/status-page/heartbeat/all')
    .then((r) => { return r.json(); })
    .then((data) => {
      const beats = data.heartbeatList || {};
      const ids = Object.keys(beats);
      if (!ids.length) {
        setStatus('unknown');
        return;
      }

      let anyDown = false;
      let anyUp = false;
      ids.forEach((id) => {
        const list = beats[id];
        if (!list || !list.length) {
          return;
        }
        const latest = list[list.length - 1];
        if (latest.status === 1) {
          anyUp = true;
        }
        else {
          anyDown = true;
        }
      });
      if (anyDown && anyUp) {
        setStatus('degraded');
      }
      else if (anyDown) {
        setStatus('down');
      }
      else {
        setStatus('up');
      }
    })
    .catch(() => { setStatus('unknown'); });
})();
