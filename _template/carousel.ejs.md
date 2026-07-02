```{=html}
<div class="content-carousel" id="contentCarousel">
  <div class="content-carousel-track" id="carouselTrack">
    <% for (const item of items) { %>
      <% if (item.link) { %>
        <a class="content-slide" href="<%- item.link %>" style="background-image: url(<%- item.image %>);">
          <div class="content-slide-overlay"></div>
          <div class="content-slide-text">
            <p class="content-slide-eyebrow"><%- item.eyebrow %></p>
            <h3 class="content-slide-title"><%- item.title %></h3>
          </div>
        </a>
      <% } else { %>
        <div class="content-slide" style="background-image: url(<%- item.image %>);">
          <div class="content-slide-overlay"></div>
          <div class="content-slide-text">
            <p class="content-slide-eyebrow"><%- item.eyebrow %></p>
            <h3 class="content-slide-title"><%- item.title %></h3>
          </div>
        </div>
      <% } %>
    <% } %>
  </div>
</div>

<div class="carousel-controls">
  <div class="carousel-dots" id="carouselDots"></div>
  <div class="carousel-buttons">
    <button class="carousel-btn" id="carouselPrev" aria-label="Previous slide">&#8249;</button>
    <button class="carousel-btn" id="carouselNext" aria-label="Next slide">&#8250;</button>
  </div>
</div>

<script>
(() => {
  const track = document.getElementById('carouselTrack');
  const dotsContainer = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  if (!track) return;

  const slides = track.querySelectorAll('.content-slide');
  const total = slides.length;
  let current = 0;

  for (let i = 0; i < total; i++) {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, total - 1));
    const slide = slides[0];
    const slideWidth = slide.offsetWidth + 14;
    track.style.transform = 'translateX(-' + (current * slideWidth) + 'px)';
    dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
  goTo(0);
})();
</script>
```
