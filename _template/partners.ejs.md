```{=html}

<div class="page-partners__grid">
<%
  for (const item of items) {
%>
    <a class="page-partners__card" href="https://liu.se/en" target="_blank" rel="noopener">
      <img src="<%- item.logo %>" alt="<%- item.name %>">
      <h3><%- item.name %></h3>
      <p><%- item.description %></p>
    </a>
<%
  }
%>
</div>
```
