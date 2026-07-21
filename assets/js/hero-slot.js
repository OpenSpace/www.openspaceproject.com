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

  let i = 0;
  setInterval(() => {
    const prev = i;
    let next;
    do {
      next = Math.floor(Math.random() * words.length);
    } while (next === prev);
    i = next;
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
