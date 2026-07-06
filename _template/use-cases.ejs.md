```{=html}
<div class="card-grid">
<%
  for (const item of items) {
%>
  <div
    class="page-use-cases__card"
    role="button"
    tabindex="0"
    data-case="<%- item.id %>"
    style="background-image:url('<%- item.image %>');"
    data-id="<%- item.id %>"
    data-image="<%- item.image %>"
    data-image_alt="<%- item.image_alt %>"
    data-institution="<%- item.institution %>"
    data-location="<%- item.location %>"
    data-title="<%- item.title %>"
    data-shorttitle="<%- item.shorttitle %>"
    data-body="<%- item.body %>"
    data-tags='<%- JSON.stringify(item.tags) %>'
  >
    <div class="page-use-cases__card-overlay"></div>
    <div class="page-use-cases__card-text">
      <p><%- item.institution %> <%- item.location ? `· ${item.location}` : "" %></p>
      <h3><%- item.shorttitle ? item.shorttitle : item.title %></h3>
    </div>
  </div>
<% } %>
</div>

<div class="page-use-cases__modal" id="ucModal" aria-modal="true" role="dialog" aria-label="Use case detail" aria-hidden="true">
  <div class="page-use-cases__modal-backdrop"></div>
  <div class="page-use-cases__modal-box">
    <button class="page-use-cases__modal-close" aria-label="Close">&times;</button>
    <img class="page-use-cases__modal-img" src="" alt="" />
    <div class="page-use-cases__modal-content">
      <p class="page-use-cases__modal-meta"></p>
      <h2 class="page-use-cases__modal-title"></h2>
      <p class="page-use-cases__modal-body"></p>
      <div class="page-use-cases__modal-tags"></div>
    </div>
  </div>
</div>

<script src="/assets/js/use-cases-modal.js"></script>
```
