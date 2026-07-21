document.addEventListener('DOMContentLoaded', () => {
  const words = Array.from(document.querySelectorAll('.hero-slot__word'));
  if (!words.length) {
    return;
  }

  const underline = document.querySelector('.hero-slot__underline');
  const setUnderlineWidth = (word) => {
    if (underline) {
      underline.style.width = `${word.offsetWidth}px`;
    }
  };

  setUnderlineWidth(words[0]);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => setUnderlineWidth(words[0]));
  }

  const shuffle = (arr) => {
    const shuffled = arr.slice();
    for (let k = shuffled.length - 1; k > 0; k--) {
      const j = Math.floor(Math.random() * (k + 1));
      [shuffled[k], shuffled[j]] = [shuffled[j], shuffled[k]];
    }
    return shuffled;
  };

  const indices = words.map((_, idx) => idx);
  let i = 0;
  let queue = shuffle(indices.filter((idx) => idx !== i));

  setInterval(() => {
    if (!queue.length) {
      queue = shuffle(indices.filter((idx) => idx !== i));
    }
    const prev = i;
    i = queue.shift();
    words[prev].classList.remove('is-active');
    words[prev].classList.add('is-exit');
    words[prev].setAttribute('aria-hidden', 'true');
    words[i].classList.add('is-active');
    words[i].removeAttribute('aria-hidden');
    setUnderlineWidth(words[i]);
    setTimeout(() => {
      words[prev].style.transition = 'none';
      words[prev].classList.remove('is-exit');
      words[prev].getBoundingClientRect(); // force reflow before re-enabling transition
      words[prev].style.transition = '';
    }, 500);
  }, 2000);
});
