document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('ucModal');
  if (!modal) {
    return;
  }

  const modalImg = modal.querySelector('.page-use-cases__modal-img');
  const modalMeta = modal.querySelector('.page-use-cases__modal-meta');
  const modalTitle = modal.querySelector('.page-use-cases__modal-title');
  const modalBody = modal.querySelector('.page-use-cases__modal-body');
  const modalTags = modal.querySelector('.page-use-cases__modal-tags');
  const closeBtn = modal.querySelector('.page-use-cases__modal-close');
  const backdrop = modal.querySelector('.page-use-cases__modal-backdrop');
  let lastFocused = null;

  function openModal(card) {
    modalImg.src = card.dataset.image;
    modalImg.alt = card.dataset.image_alt || card.dataset.title;
    const meta = card.dataset.institution + (card.dataset.location ? ' · ' + card.dataset.location : '');
    modalMeta.textContent = meta;
    modalTitle.textContent = card.dataset.title;
    modalBody.textContent = card.dataset.body;
    modalTags.replaceChildren();
    JSON.parse(card.dataset.tags || '[]').forEach(function (t) {
      const span = document.createElement('span');
      span.className = 'page-use-cases__modal-tag';
      span.textContent = t;
      modalTags.appendChild(span);
    });
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) {
      lastFocused.focus();
    }
  }

  document.querySelectorAll('.page-use-cases__card').forEach((card) => {
    card.addEventListener('click', () => {
      lastFocused = card;
      openModal(card);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        lastFocused = card;
        openModal(card);
      }
    });
  });

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
});
