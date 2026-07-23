(() => {
  // Newsletter signup (Mailchimp)
  const mailchimpUser = '4c1bf0cc740f267dc37ede3ff';
  const mailchimpId = '002e0deef0';

  let _email = '';

  function show(n) {
    for (let i = 1; i <= 3; i++) {
      const el = document.getElementById('newsletter-' + i);
      if (el) el.hidden = (i !== n);
    }
  }

  function setMsg(step, msg, isError) {
    const el = document.getElementById('newsletter__message-' + step);
    if (!el) return;
    el.textContent = msg;
    el.className = 'newsletter__message' + (isError ? ' newsletter__message newsletter__message--error' : '');
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

    data[`b_${mailchimpUser}_${mailchimpId}`] = '';
    const qs = Object.keys(data).map((k) => {
      return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
    }).join('&');

    const cb = `mcSub${Date.now()}`;
    const s = document.createElement('script');
    s.src = `https://amnh.us20.list-manage.com/subscribe/post-json?u=${mailchimpUser}&id=${mailchimpUser}&${qs}&c=${cb}`;

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

  const step1 = document.getElementById('newsletter-1');
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

  const step2 = document.getElementById('newsletter-2');
  if (step2) {
    step2.addEventListener('submit', (e) => {
      e.preventDefault();
      setMsg(2, '', false);
      const data = { EMAIL: _email };
      const fname = val('footer-newsletter-fname');
      if (fname) data.FNAME = fname;

      const lname = val('footer-newsletter-lname');
      if (lname) data.LNAME = lname;

      const affil = val('footer-newsletter-affil');
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

  // System status indicator (Uptime Kuma)

  const LABELS = {
    up: 'All Systems Operational',
    degraded: 'Partial Outage',
    down: 'Major Outage',
    unknown: 'Status unavailable'
  };

  function setStatus(key) {
    const dot = document.getElementById('status-dot');
    if (dot) {
      dot.className = `system-status__dot system-status__dot--${key}`;
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

  // Reveal-footer effect: the footer is fixed to the viewport bottom, sitting behind
  // #quarto-document-content. Keeping #quarto-content's padding-bottom (transparent —
  // it has no background of its own) equal to the footer's own (responsive,
  // variable-height) size means the footer only comes into view once the page is
  // scrolled all the way down, instead of scrolling up with the content. The padding
  // lives on #quarto-content rather than #quarto-document-content specifically so that
  // element's own opaque background (which paints straight through its own padding,
  // per background-clip's border-box default) can't cover the gutter back up.
  const footerEl = document.querySelector('.footer');
  const contentEl = document.getElementById('quarto-document-content');
  const gridEl = document.getElementById('quarto-content');
  if (footerEl && contentEl && gridEl) {
    const syncFooterGutter = () => {
      // #quarto-content is a Quarto-templated CSS grid with its own fixed row(s) below
      // the content row, which already read as extra (transparent) reveal gutter — so
      // only the shortfall needs to come from our own padding. Subtract out whatever
      // padding we previously applied so this stays correct across re-syncs.
      const currentPadding = parseFloat(getComputedStyle(gridEl).paddingBottom) || 0;
      const structuralGutter = gridEl.getBoundingClientRect().height - contentEl.getBoundingClientRect().height - currentPadding;
      // #quarto-document-content's rounded bottom corners need the footer sitting
      // behind them to actually show through the curve — otherwise the corner arc
      // only cuts into the (transparent, footer-less) gutter above the footer's fixed
      // top edge, revealing whatever's behind the page instead. Shrinking the gutter
      // by the corner radius makes the content box overlap that far into the footer's
      // territory, so the arc has the footer right there to reveal.
      const cornerRadius = parseFloat(getComputedStyle(contentEl).borderBottomLeftRadius) || 0;
      const needed = Math.max(0, footerEl.offsetHeight - structuralGutter - cornerRadius);
      gridEl.style.paddingBottom = needed + 'px';
    };
    syncFooterGutter();
    window.addEventListener('resize', syncFooterGutter);
    new ResizeObserver(syncFooterGutter).observe(footerEl);
  }
})();
