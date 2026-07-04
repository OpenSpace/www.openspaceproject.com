(() => {
  const track = document.getElementById('carouselTrack');
  const dotsContainer = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  if (!track) return;

  const slides = track.querySelectorAll('.content-carousel__slide');
  const total = slides.length;
  let current = 0;

  for (let i = 0; i < total; i++) {
    const dot = document.createElement('button');
    dot.className = 'content-carousel__dot' + (i === 0 ? ' is-active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, total - 1));
    const slide = slides[0];
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const slideWidth = slide.offsetWidth + gap;
    track.style.transform = 'translateX(-' + (current * slideWidth) + 'px)';
    dotsContainer.querySelectorAll('.content-carousel__dot').forEach((d, i) => {
      d.classList.toggle('is-active', i === current);
    });
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
  goTo(0);
})();
