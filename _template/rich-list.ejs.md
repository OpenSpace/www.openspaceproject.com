```{=html}
<%
  let number = 0;
  for (const item of items) {
    if (!item.title) continue;
    number++;
    const num = String(number).padStart(2, "0");
%>
  <div class="rich-list__item">
    <img class="rich-list__image"src="<%- item.image %>" alt="<%- item.alt || '' %>" loading="lazy">
    <div>
      <div class="rich-list__meta">
        <span class="rich-list__number"><%- num %></span>
        <% if (item.tag) { %>
        <span class="rich-list__tag"><%- item.tag %></span>
        <% } %>
      </div>
      <h3 class="rich-list__title"><%- item.title %></h3>
      <% if (item.tagline) { %>
      <p class="rich-list__tagline"><%- item.tagline %></p>
      <% } %>
      <p><%- item.description %></p>
    </div>
  </div>
<%
  }
%>
```
