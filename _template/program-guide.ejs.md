```{=html}
<div class="card-grid">
<%
  for (const item of items) {
%>
    <div class="page-guides__card">
      <img src="<%- item.image %>" alt="<%- item.alt %>" loading="lazy">
      <div class="page-guides__card-body">
        <h3 class="page-guides__card-title"><%- item.title %></h3>
        <p class="page-guides__card-description"><%- item.description %></p>
        <p class="page-guides__card-credit"><%- item.credit %></p>
        <a href="<%- item.pdf %>" class="button__secondary" download>Download PDF <iconify-icon icon="lucide:download" style="color: currentColor;"></iconify-icon></a>
      </div>
    </div>
<%
  }
%>
</div>
```
