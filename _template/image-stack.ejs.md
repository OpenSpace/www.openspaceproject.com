```{=html}
<div class="image-stack__container" id="layer-stack" role="button" tabindex="0" aria-label="Click to cycle through images">
<%
  for (const item of items) {
%>
    <div class="image-stack__card" style="background-image:url('<%- item.image %>')"></div>
<%
  }
%>
</div>
<div class="image-stack__footer">
  <div class="image-stack__dots" id="layer-dots">
<%
    for (const _dot of items) {
%>
      <span class="image-stack__dot"></span>
<%
    }
%>
  </div>
  <span class="image-stack__hint">Click to cycle layers</span>
</div>

<script src="/assets/js/image-stack.js"></script>
```
