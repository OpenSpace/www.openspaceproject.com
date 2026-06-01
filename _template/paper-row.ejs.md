```{=html}
<div class="paper-list">
<%
  let currentYear = null;
  for (const item of items) {
    if (!item.title) continue;
    if (item.year !== currentYear) {
      currentYear = item.year;
%>
  <div class="paper-year-label"><%- item.year %></div>
<%
    }
%>
  <div class="paper-row">
    <div class="paper-content">
      <div class="paper-title">
        <% if (item.link) { %>
        <a href="<%- item.link %>" target="_blank" rel="noopener noreferrer"><%- item.title %></a>
        <% } else { %>
        <%- item.title %>
        <% } %>
      </div>
      <div class="paper-author"><%- item.author %></div>
      <% if (item.location) { %>
      <span class="paper-venue-badge"><%- item.location %></span>
      <% } %>
    </div>
  </div>
<%
  }
%>
</div>
```
