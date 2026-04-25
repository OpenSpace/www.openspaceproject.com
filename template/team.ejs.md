```{=html}
<div class="team-grid">
<% for (const item of items) { %>
  <div class="team">
    <div class="image">
      <img
        src="/assets/team/<%- item.type %>/<%- item.image %>"
        alt="<%- item.name %>"
        style="width: 100%; height: auto; display: block;"
      >
    </div>
    <div class="name"><%- item.name %></div>
    <div class="title"><%- item.title %></div>
    <div class="affiliation">
      <%- item.affiliation %>
      <% if (item.thesis_affiliation) { %>
        <br />
        <%- item.thesis_affiliation %>
      <% } %>
    </div>
  </div>
<% } %>
</div>
```
