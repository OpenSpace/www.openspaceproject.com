```{=html}

<div class="page-research__thesis-partners">
  <button class="page-research__thesis-partner-tag" data-partner="AMNH">American Museum of Natural History (AMNH)</button>
  <button class="page-research__thesis-partner-tag" data-partner="CCMC">Community Coordinated Modeling Center (CCMC)</button>
  <button class="page-research__thesis-partner-tag" data-partner="SCI">Scientific Computing and Imaging Institute (SCI)</button>
  <button class="page-research__thesis-partner-tag" data-partner="NYU">New York University (NYU)</button>
  <button class="page-research__thesis-partner-tag" data-partner="LiU">Linköping University (LiU)</button>
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
      btn.classList.toggle('is-active', btn.dataset.partner === partner);
    });

    document.querySelectorAll('.page-research__thesis-row').forEach((row) => {
      row.classList.toggle('page-research__thesis-hidden', !!partner && row.dataset.partner !== partner);
    });

    document.querySelectorAll('.page-research__thesis-year-label').forEach((label) => {
      let year = label.dataset.year;
      let hasVisible = !!document.querySelector(
        '.page-research__thesis-row:not(.page-research__thesis-hidden)[data-year="' + year + '"]'
      );
      label.classList.toggle('page-research__thesis-hidden', !hasVisible);
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
