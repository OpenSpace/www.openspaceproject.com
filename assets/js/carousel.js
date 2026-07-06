(() => {
  const track = document.getElementById('carouselTrack');
  const dotsContainer = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  if (!track) {
    return;
  }

  const carousel = document.getElementById('contentCarousel');
  if (carousel) {
    carousel.setAttribute('role', 'region');
    carousel.setAttribute('aria-label', 'Content carousel');
  }

  const slides = track.querySelectorAll('.content-carousel__slide');
  const total = slides.length;
  let current = 0;

  slides.forEach((slide, i) => {
    slide.setAttribute('aria-label', `Slide ${i + 1} of ${total}`);
    slide.setAttribute('aria-hidden', i !== 0 ? 'true' : 'false');
  });

  for (let i = 0; i < total; i++) {
    const dot = document.createElement('button');
    dot.className = 'content-carousel__dot' + (i === 0 ? ' is-active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.setAttribute('aria-current', i === 0 ? 'true' : 'false');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, total - 1));
    const slide = slides[0];
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const slideWidth = slide.offsetWidth + gap;
    track.style.transform = `translateX(-${current * slideWidth}px)`;

    slides.forEach((s, i) => {
      s.setAttribute('aria-hidden', i !== current ? 'true' : 'false');
    });

    dotsContainer.querySelectorAll('.content-carousel__dot').forEach((d, i) => {
      d.classList.toggle('is-active', i === current);
      d.setAttribute('aria-current', i === current ? 'true' : 'false');
    });

    if (prevBtn) {
      prevBtn.disabled = current === 0;
    }
    if (nextBtn) {
      nextBtn.disabled = current === total - 1;
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => goTo(current - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => goTo(current + 1));
  }
  goTo(0);
})();
