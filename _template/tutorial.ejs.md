```{=html}
<div class="page-tutorials__grid">
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
        <h4><%- item.header %></h4>
        <h3><%- item.title %></h3>
        <p><%- item.description %></p>
      </div>
    </div>
<%
  }
%>
</div>
```
