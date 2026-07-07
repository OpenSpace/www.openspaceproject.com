```{=html}
<section class="content-section-narrow" data-ev-upcoming>
  <h2>Upcoming</h2>
  <p class="page-events__desc" data-ev-empty hidden>No upcoming events are scheduled right now — check back soon.</p>
</section>

<section class="content-section-narrow" data-ev-past hidden>
  <h2>Past events</h2>
</section>

<div data-ev-pool hidden>
<%
for (const item of items) {
  // Normalize the (UTC) YAML date into an ISO 8601 string for the browser
  let iso = item.datetime.trim().replace(" ", "T");
  if (!/[zZ]|[+-]\d{2}:?\d{2}$/.test(iso)) {
    if (/T\d{2}:\d{2}$/.test(iso)) { iso += ":00"; }
    iso += "Z";
  }

  // Compact UTC stamps for the Google Calendar link (default 1h duration)
  const dt = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  const compact = (d) =>
    d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) +
    "T" + pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + pad(d.getUTCSeconds()) + "Z";
  const gcalStart = compact(dt);
  const gcalEnd = compact(new Date(dt.getTime() + 3600000));

  const descPast = item.description_past
    ? String(item.description_past).replace(/"/g, "&quot;").trim()
    : "";
%>
  <div class="page-events__item" data-ev-item data-date="<%- iso %>"<% if (descPast) { %> data-desc-past="<%- descPast %>"<% } %>>
    <img class="page-events__img" src="<%- item.image %>" alt="<%- item.alt %>">

    <div class="page-events__body">
      <span class="page-events__tag"><%- item.type %></span>
      <h3 class="page-events__title">
        <%
          if (item.page) {
        %>
          <a href="<%- item.page %>"><%- item.title %></a>
        <%
          } else {
        %>
          <%- item.title %>
        <%
          }
        %>
      </h3>
      <span class="page-events__time"></span>
      <p class="page-events__desc"><%- item.description %></p>
      <div class="page-events__actions">
        <%
          if (item.generate_calendar) {
        %>
            <a class="button__primary external" data-ev-calendar href="http://www.google.com/calendar/event?action=TEMPLATE&text=<%- encodeURIComponent(item.title) %>&dates=<%- gcalStart %>/<%- gcalEnd %>" target="_blank" rel="noopener">Add to Calendar</a>
        <%
          }
        %>

        <%
          for (const cta of (item.cta || [])) {
        %>
            <a class="button__secondary" data-ev-cta data-show-when-passed="<%- cta.show_when_passed ? 'true' : 'false' %>" href="<%- cta.link %>" target="_blank" rel="noopener"><%- cta.text %></a>
        <%
          }
        %>
      </div>
    </div>
  </div>
<%
}
%>
</div>

<script>
(function () {
  let now = Date.now();
  let pool = document.querySelector('[data-ev-pool]');
  let upcomingSection = document.querySelector('[data-ev-upcoming]');
  let pastSection = document.querySelector('[data-ev-past]');
  let emptyMsg = document.querySelector('[data-ev-empty]');
  if (!pool || !upcomingSection || !pastSection) { return; }

  let upcoming = [];
  let past = [];

  Array.prototype.forEach.call(pool.querySelectorAll('[data-ev-item]'), function (el) {
    let ts = Date.parse(el.getAttribute('data-date'));
    el._ts = isNaN(ts) ? 0 : ts;
    (el._ts >= now ? upcoming : past).push(el);
  });

  upcoming.sort((a, b) => { return a._ts - b._ts; }); // soonest first
  past.sort((a, b) => { return b._ts - a._ts; }); // most recent first

  function makeZone(tz, hour12) {
    return new Intl.DateTimeFormat(undefined, {
      hour: hour12 === false ? '2-digit' : 'numeric', minute: '2-digit',
      hour12: hour12, timeZone: tz, timeZoneName: 'short'
    });
  }

  // The date is shown once (in UTC); each zone's time follows inline
  let dateFmt = new Intl.DateTimeFormat(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    timeZone: 'UTC'
  });

  let localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let zones = [
    makeZone('America/New_York', true), // Eastern, AM/PM clock
    makeZone('UTC', false)              // UTC, 24-hour clock
  ];
  // Add the visitor's own timezone (unless it duplicates one already shown)
  if (localTz !== 'America/New_York' && localTz !== 'UTC' && localTz !== 'Etc/UTC') {
    zones.push(makeZone(localTz, false));
  }

  function fillTime(el) {
    let timeEl = el.querySelector('.page-events__time');
    if (!timeEl || !el._ts) { return; }
    let d = new Date(el._ts);
    timeEl.textContent = '';
    let dateRow = document.createElement('span');
    dateRow.textContent = dateFmt.format(d);
    timeEl.appendChild(dateRow);
    zones.forEach(function (f) {
      timeEl.appendChild(document.createTextNode(' · '));
      let row = document.createElement('span');
      row.textContent = f.format(d);
      timeEl.appendChild(row);
    });
  }

  upcoming.forEach((el) => {
    fillTime(el);
    upcomingSection.appendChild(el);
  });

  past.forEach((el) => {
    el.classList.add('page-events__item--past');
    fillTime(el);

    // Swap to the "past" description when one is provided
    let descEl = el.querySelector('.page-events__desc');
    let descPast = el.getAttribute('data-desc-past');
    if (descEl && descPast) {
      descEl.textContent = descPast;
    }

    // The "Add to Calendar" button is meaningless once the event is over
    var cal = el.querySelector('[data-ev-calendar]');
    if (cal) { cal.parentNode.removeChild(cal); }

    // Hide CTAs unless they're explicitly flagged to show after the event
    Array.prototype.forEach.call(el.querySelectorAll('[data-ev-cta]'), (cta) => {
      if (cta.getAttribute('data-show-when-passed') !== 'true') {
        cta.parentNode.removeChild(cta);
      }
    });

    // Drop the actions row if nothing is left in it
    let actions = el.querySelector('.page-events__actions');
    if (actions && !actions.querySelector('a')) {
      actions.parentNode.removeChild(actions);
    }

    pastSection.appendChild(el);
  });

  if (emptyMsg) {
    emptyMsg.hidden = upcoming.length > 0;
  }
  pastSection.hidden = past.length === 0;

  pool.parentNode.removeChild(pool);
})();
</script>
```
