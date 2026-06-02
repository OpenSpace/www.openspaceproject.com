```{=html}
<div class="thesis-list">
<%
  let currentYear = null;
  for (const item of items) {
    if (item.year !== currentYear) {
      currentYear = item.year;
%>
  <div class="thesis-year-group">
    <div class="thesis-year-label"><%- item.year %></div>
<%
    }
%>
    <div class="thesis-row">
      <div class="thesis-photos">
        <% if (item.image1) { %>
        <img
          src="/assets/team/<%- item.image1_dir || 'student' %>/<%- item.image1 %>"
          alt="<%- item.author %>"
          class="thesis-photo"
          loading="lazy"
        >
        <% } %>
        <% if (item.image2) { %>
        <img
          src="/assets/team/student/<%- item.image2 %>"
          alt=""
          class="thesis-photo"
          loading="lazy"
        >
        <% } %>
        <% if (!item.image1) { %>
        <div class="thesis-photo thesis-photo-placeholder"></div>
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
        <div class="thesis-author"><%- item.author %></div>
        <div class="thesis-partner-badge"><%- item.partner %></div>
      </div>
    </div>
<% } %>
  </div>
</div>
```
