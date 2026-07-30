```{=html}
<div class="card-grid">
<%
  for (const item of items) {
    const videoId = item.video.split('/').pop();
%>
    <div class="page-tutorials__card">
      <button type="button"
              class="page-tutorials__video"
              style="background-image:url('https://img.youtube.com/vi/<%- videoId %>/hqdefault.jpg')"
              data-video-embed="<%- item.video %>"
              aria-label="Play video: <%- item.alt %>">
        <span class="page-tutorials__play-icon"><iconify-icon icon="fa6-solid:play"></iconify-icon></span>
      </button>
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
<script src="/assets/js/tutorial-video.js"></script>
```
