```{=html}
<div class="card-grid">
<%
  for (const item of items) {
%>
    <div class="page-tutorials__card">
      <iframe src="<%- item.video %>"
              title="<%- item.alt %>"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              loading="lazy">
      </iframe>
      <div class="page-tutorials__card-body">
        <p class="page-tutorials__card-eyebrow"><%- item.header %></p>
        <h3 class="page-tutorials__card-title"><%- item.title %></h3>
        <p class="page-tutorials__card-description"><%- item.description %></p>
      </div>
    </div>
<%
  }
%>
</div>
```
