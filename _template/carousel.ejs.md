```{=html}
<div class="carousel" delay="<%- templateParams.delay %>">
<% for (const item of items) { %>
  <div class="image-wrapper">
    <img src="<%- item.path %>" alt="<%- item.path %>">
  </div>
<% } %>
</div>
```
