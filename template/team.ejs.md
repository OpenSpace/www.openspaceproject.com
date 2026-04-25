```{=html}
<div class="team-grid">
<% for (const item of items) { %>
  <div class="team">
    <div class="image"><img src="<%- item.image %>" style="width: 100%; height: auto; display: block;"></div>
    <div class="name"><%- item.name %></div>
    <div class="title"><%- item.title %></div>
    <div class="affliation"><%- item.affiliation %></div>
  </div>
<% } %>
</div>
```
