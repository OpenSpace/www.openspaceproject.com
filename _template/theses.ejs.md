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
    <div class="page-research__year-label" data-year="<%- item.year %>"><%- item.year %></div>
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
        <div class="page-research__title">
          <% if (item.link) { %>
            <a href="<%- item.link %>" target="_blank" rel="noopener noreferrer"><%- item.title %></a>
          <% } else { %>
            <%- item.title %>
          <% } %>
        </div>
        <div class="page-research__author"><%- item.authors.map((a => a.name)).join(" & ") %></div>
        <div class="page-research__thesis-partner-badge"><%- item.partner %></div>
      </div>
    </div>
<% } %>
</div>

<script src="/assets/js/theses-filter.js"></script>
```
