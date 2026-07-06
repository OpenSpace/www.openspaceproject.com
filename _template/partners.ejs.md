```{=html}

<div class="card-grid">
<%
  for (const item of items) {
%>
    <a class="page-partners__card" href="<%- item.link %>" target="_blank" rel="noopener">
      <img class="page-partners__logo" src="<%- item.logo %>" alt="">
      <h3 class="page-partners__name"><%- item.name %></h3>
      <p class="page-partners__desc"><%- item.description %></p>
    </a>
<%
  }
%>
</div>
```
