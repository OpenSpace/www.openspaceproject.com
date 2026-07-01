```{=html}
<div class="thesis-list">
<%
  let currentYear = null;
  for (const item of items) {
    if (item.year !== currentYear) {
      currentYear = item.year;
%>
  <div class="thesis-year-group">
    <div class="thesis-year-label" data-year="<%- item.year %>"><%- item.year %></div>
<%
    }
%>
    <div class="thesis-row" data-partner="<%- item.partner %>" data-year="<%- item.year %>">
      <div class="thesis-photos">
        <% for (const author of item.authors) { %>
          <% if (author.image) { %>
          <img
            src="/assets/team/<%- author.image_dir || 'student' %>/<%- author.image %>"
            alt="<%- author.name %>"
            class="thesis-photo"
            loading="lazy"
          >
          <% } else { %>
            <div class="thesis-photo thesis-photo-placeholder"></div>
          <% } %>
        <% } %>
      </div>
      <div class="thesis-content">
        <div class="thesis-title">
          <% if (item.link) { %>
            <a href="<%- item.link %>" target="_blank" rel="noopener noreferrer"><%- item.title %></a>
          <% } else { %>
            <%- item.title %>
          <% } %>
          <% if (item.degree === 'phd') { %>
            <span class="thesis-degree-badge">PhD</span>
          <% } %>
        </div>
        <div class="thesis-author"><%- item.authors.map((a => a.name)).join(" & ") %></div>
        <div class="thesis-partner-badge"><%- item.partner %></div>
      </div>
    </div>
<% } %>
  </div>
</div>
```
