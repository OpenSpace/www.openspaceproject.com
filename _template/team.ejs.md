```{=html}
<div class="page-team-grid">
<% for (const item of items) { %>
  <div class="page-team-card" tabindex="0" aria-label="<%- item.name %>">
    <div class="page-team-card-inner">

      <div class="page-team-card-front">
        <img
          src="/assets/team/<%- item.type %>/<%- item.image %>"
          alt="<%- item.name %>"
        >
        <div class="page-team-card-info">
          <h3><%- item.name %></h3>
          <% if (item.title) { %>
          <span><%- item.title %></span>
          <% } %>
        </div>
      </div>

      <div class="page-team-card-back">
        <div class="page-team-card-back-inner">
          <h3><%- item.name %></h3>
          <% if (item.title) { %>
          <h4><%- item.title %></h4>
          <% } %>
          <span><%- item.affiliation %></span>
        </div>
      </div>

    </div>
  </div>
<% } %>
</div>
```
