```{=html}
<div class="page-research__paper-list">
<%
  let currentYear = null;
  for (const item of items) {
    if (item.year !== currentYear) {
      currentYear = item.year;
%>
  <div class="page-research__year-label"><%- item.year %></div>
<%
    }
%>
  <div class="page-research__paper-row">
    <div class="page-research__title">
      <% if (item.link) { %>
      <a href="<%- item.link %>" target="_blank" rel="noopener noreferrer"><%- item.title %></a>
      <% } else { %>
      <%- item.title %>
      <% } %>
    </div>
    <div class="page-research__author"><%- item.author %></div>
    <% if (item.location) { %>
    <span class="page-research__paper-venue-badge"><%- item.location %></span>
    <% } %>
  </div>
<%
  }
%>
</div>
```
