document.addEventListener('DOMContentLoaded', () => {
  const stack = document.getElementById('layer-stack');
  if (!stack) {
    return;
  }

  const cards = Array.from(stack.querySelectorAll('.image-stack__card'));
  const dots = Array.from(document.querySelectorAll('#layer-dots .image-stack__dot'));
  const total = cards.length;
  const current = 0;
  const states = ['image-stack__card--front', 'image-stack__card--mid', 'image-stack__card--back', 'image-stack__card--hidden'];

  function render() {
    cards.forEach((card, i) => {
      states.forEach((s) => { card.classList.remove(s); });
      const offset = (i - current + total) % total;
      card.classList.add(states[Math.min(offset, states.length - 1)]);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === current);
    });
  }

  stack.addEventListener('click', () => {
    current = (current + 1) % total;
    render();
  });

  stack.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
      e.preventDefault();
      current = (current + 1) % total;
      render();
    }
    else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      current = (current - 1 + total) % total;
      render();
    }
  });

  render();
});
