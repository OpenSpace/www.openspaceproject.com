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

<script>
(() => {
  let stack = document.getElementById('layer-stack');
  if (!stack) return;
  let cards = Array.from(stack.querySelectorAll('.image-stack__card'));
  let dots = Array.from(document.querySelectorAll('#layer-dots .image-stack__dot'));
  let total = cards.length;
  let current = 0;
  let states = [ 'image-stack__card--front', 'image-stack__card--mid', 'image-stack__card--back', 'image-stack__card--hidden' ];

  function render() {
    cards.forEach((card, i) => {
      states.forEach((s) => { card.classList.remove(s); });
      let offset = (i - current + total) % total;
      card.classList.add(states[Math.min(offset, states.length - 1)]);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
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
})();
</script>
```
