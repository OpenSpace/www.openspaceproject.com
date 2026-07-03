```{=html}
<div class="content-carousel" id="contentCarousel">
  <div class="content-carousel__track" id="carouselTrack">
    <% for (const item of items) { %>
      <% if (item.link) { %>
        <a class="content-carousel__slide" href="<%- item.link %>" style="background-image: url(<%- item.image %>);">
          <div class="content-carousel__overlay"></div>
          <div class="content-carousel__text">
            <p class="content-carousel__eyebrow"><%- item.eyebrow %></p>
            <h3 class="content-carousel__title"><%- item.title %></h3>
          </div>
        </a>
      <% } else { %>
        <div class="content-carousel__slide" style="background-image: url(<%- item.image %>);">
          <div class="content-carousel__overlay"></div>
          <div class="content-carousel__text">
            <p class="content-carousel__eyebrow"><%- item.eyebrow %></p>
            <h3 class="content-carousel__title"><%- item.title %></h3>
          </div>
        </div>
      <% } %>
    <% } %>
  </div>

  <div class="content-carousel__controls">
    <div class="content-carousel__dots" id="carouselDots"></div>
    <div class="content-carousel__buttons">
      <button class="content-carousel__button" id="carouselPrev" aria-label="Previous slide">&#8249;</button>
      <button class="content-carousel__button" id="carouselNext" aria-label="Next slide">&#8250;</button>
    </div>
  </div>
</div>

<script src="/assets/js/carousel.js"></script>
```
