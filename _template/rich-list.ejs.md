```{=html}
<div class="rich-list">
<%
  let number = 0;
  for (const item of items) {
    if (!item.title) continue;
    number++;
    const num = String(number).padStart(2, "0");
%>
  <div class="rich-list-item">
    <img src="<%- item.image %>" alt="<%- item.alt || '' %>" loading="lazy">
    <div>
      <div class="rich-list-item-meta">
        <span class="rich-list-item-number"><%- num %></span>
        <% if (item.tag) { %>
        <span class="rich-list-item-tag"><%- item.tag %></span>
        <% } %>
      </div>
      <h3><%- item.title %></h3>
      <% if (item.tagline) { %>
      <p class="rich-list-item-tagline"><%- item.tagline %></p>
      <% } %>
      <p class="rich-list-item-description"><%- item.description %></p>
    </div>
  </div>
<%
  }
%>
</div>
```
