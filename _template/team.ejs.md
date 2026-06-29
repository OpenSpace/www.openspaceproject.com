```{=html}
<div class="team-grid">
<% for (const item of items) { %>
  <div class="team-card" tabindex="0" aria-label="<%- item.name %>">
    <div class="team-card-inner">

      <div class="team-card-front">
        <img
          src="/assets/team/<%- item.type %>/<%- item.image %>"
          alt="<%- item.name %>"
          class="team-card-photo"
        >
        <div class="team-card-info">
          <div class="team-card-name"><%- item.name %></div>
          <% if (item.title) { %>
          <div class="team-card-role"><%- item.title %></div>
          <% } %>
        </div>
      </div>

      <div class="team-card-back">
        <div class="team-card-back-inner">
          <div class="team-card-name"><%- item.name %></div>
          <% if (item.title) { %>
          <div class="team-card-role"><%- item.title %></div>
          <% } %>
          <div class="team-card-affil"><%- item.affiliation %></div>
        </div>
      </div>

    </div>
  </div>
<% } %>
</div>
```
