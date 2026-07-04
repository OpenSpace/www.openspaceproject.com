```{=html}

<div class="page-research__thesis-partners">
  <button class="page-research__thesis-partner-tag" data-partner="AMNH" aria-pressed="false">American Museum of Natural History (AMNH)</button>
  <button class="page-research__thesis-partner-tag" data-partner="CCMC" aria-pressed="false">Community Coordinated Modeling Center (CCMC)</button>
  <button class="page-research__thesis-partner-tag" data-partner="SCI" aria-pressed="false">Scientific Computing and Imaging Institute (SCI)</button>
  <button class="page-research__thesis-partner-tag" data-partner="NYU" aria-pressed="false">New York University (NYU)</button>
  <button class="page-research__thesis-partner-tag" data-partner="LiU" aria-pressed="false">Linköping University (LiU)</button>
</div>

<div class="page-research__thesis-list">
<%
  let currentYear = null;
  for (const item of items) {
    if (item.year !== currentYear) {
      currentYear = item.year;
%>
    <div class="page-research__thesis-year-label" data-year="<%- item.year %>"><%- item.year %></div>
<%
    }
%>
    <div class="page-research__thesis-row" data-partner="<%- item.partner %>" data-year="<%- item.year %>">
      <div class="page-research__thesis-photos">
        <% for (const author of item.authors) { %>
          <img
            src="/assets/team/<%- author.image_dir || 'student' %>/<%- author.image %>"
            alt="<%- author.name %>"
            loading="lazy"
          >
        <% } %>
      </div>
      <div class="page-research__thesis-content">
        <div class="page-research__thesis-title">
          <% if (item.link) { %>
            <a href="<%- item.link %>" target="_blank" rel="noopener noreferrer"><%- item.title %></a>
          <% } else { %>
            <%- item.title %>
          <% } %>
          <% if (item.degree === 'phd') { %>
            <span class="page-research__thesis-degree-badge">PhD</span>
          <% } %>
        </div>
        <div class="page-research__thesis-author"><%- item.authors.map((a => a.name)).join(" & ") %></div>
        <div class="page-research__thesis-partner-badge"><%- item.partner %></div>
      </div>
    </div>
<% } %>
</div>

<script>
(() => {
  let active = null;

  function filter(partner) {
    active = partner;

    document.querySelectorAll('.page-research__thesis-partner-tag').forEach((btn) => {
      let isActive = btn.dataset.partner === partner;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });

    document.querySelectorAll('.page-research__thesis-row').forEach((row) => {
      row.classList.toggle('is-hidden', !!partner && row.dataset.partner !== partner);
    });

    document.querySelectorAll('.page-research__thesis-year-label').forEach((label) => {
      let year = label.dataset.year;
      let hasVisible = !!document.querySelector(
        '.page-research__thesis-row:not(.is-hidden)[data-year="' + year + '"]'
      );
      label.classList.toggle('is-hidden', !hasVisible);
    });
  }

  document.querySelectorAll('.page-research__thesis-partner-tag').forEach((btn) => {
    btn.addEventListener('click', () => {
      filter(active === btn.dataset.partner ? null : btn.dataset.partner);
    });
  });
})();
</script>
```
