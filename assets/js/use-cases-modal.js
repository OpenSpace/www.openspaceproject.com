document.addEventListener('DOMContentLoaded', () => {
  let modal = document.getElementById('ucModal');
  if (!modal) {
    return;
  }

  let modalImg = modal.querySelector('.page-use-cases__modal-img');
  let modalMeta = modal.querySelector('.page-use-cases__modal-meta');
  let modalTitle = modal.querySelector('.page-use-cases__modal-title');
  let modalBody = modal.querySelector('.page-use-cases__modal-body');
  let modalTags = modal.querySelector('.page-use-cases__modal-tags');
  let closeBtn = modal.querySelector('.page-use-cases__modal-close');
  let backdrop = modal.querySelector('.page-use-cases__modal-backdrop');
  let lastFocused = null;

  function openModal(card) {
    modalImg.src = card.dataset.image;
    modalImg.alt = card.dataset.image_alt || card.dataset.title;
    let meta = card.dataset.institution + (card.dataset.location ? ' · ' + card.dataset.location : '');
    modalMeta.textContent = meta;
    modalTitle.textContent = card.dataset.title;
    modalBody.textContent = card.dataset.body;
    modalTags.innerHTML = card.dataset.tags.split('|||||').map(function (t) {
      return `<span class="page-use-cases__modal-tag">${t}</span>`;
    }).join('');
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
