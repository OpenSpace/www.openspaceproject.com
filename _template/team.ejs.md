```{=html}
<div class="page-team__grid">
<% for (const item of items) { %>
  <div class="page-team__card" role="button" tabindex="0" aria-expanded="false">
    <div class="page-team__card-inner">

      <div class="page-team__card-front">
        <img
          src="/assets/team/<%- item.type %>/<%- item.image %>"
          alt=""
        >
        <div class="page-team__card-info" aria-hidden="true">
          <h3><%- item.name %></h3>
          <% if (item.title) { %>
          <span><%- item.title %></span>
          <% } %>
        </div>
      </div>

      <div class="page-team__card-back">
        <div class="page-team__card-back-inner">
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
<script src="/assets/js/team.js"></script>
```
