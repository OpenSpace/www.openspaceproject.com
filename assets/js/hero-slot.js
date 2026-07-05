document.addEventListener('DOMContentLoaded', () => {
  let words = Array.from(document.querySelectorAll('.hero-slot__word'));
  if (!words.length) {
    return;
  }

  let i = 0;
  setInterval(() => {
    let  prev = i;
    i = (i + 1) % words.length;
    words[prev].classList.remove('is-active');
    words[prev].classList.add('is-exit');
    words[prev].setAttribute('aria-hidden', 'true');
    words[i].classList.add('is-active');
    words[i].removeAttribute('aria-hidden');
    setTimeout(() => {
      words[prev].style.transition = 'none';
      words[prev].classList.remove('is-exit');
      words[prev].getBoundingClientRect(); // force reflow before re-enabling transition
      words[prev].style.transition = '';
    }, 500);
  }, 2000);
});
