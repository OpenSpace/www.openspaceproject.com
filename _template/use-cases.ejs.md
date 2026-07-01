```{=html}
<div class="uc-grid">
<%
  for (const item of items) {
%>
  <div
    class="uc-card"
    role="button"
    tabindex="0"
    data-case="<%- item.id %>"
    style="background-image:url('<%- item.image %>'); background-position: center 50%"
    data-id="<%- item.id %>"
    data-image="<%- item.image %>"
    data-image_alt="<%- item.image_alt %>"
    data-institution="<%- item.institution %>"
    data-location="<%- item.location %>"
    data-title="<%- item.title %>"
    data-shorttitle="<%- item.shorttitle %>"
    data-body="<%- item.body %>"
    data-tags="<%- item.tags.join("|||||") %>"
  >
    <div class="uc-card-overlay"></div>
    <div class="uc-card-text">
      <p class="uc-card-meta"><%- item.institution %> <%- item.location ? `· ${item.location}` : "" %></p>
      <h3 class="uc-card-title"><%- item.shorttitle ? item.shorttitle : item.title %></h3>
    </div>
  </div>
<% } %>
</div>

<div class="uc-modal" id="ucModal" aria-modal="true" role="dialog" aria-label="Use case detail" aria-hidden="true">
  <div class="uc-modal-backdrop"></div>
  <div class="uc-modal-box">
    <button class="uc-modal-close" aria-label="Close">&times;</button>
    <div class="uc-modal-img-wrap">
      <img class="uc-modal-img" src="" alt="" />
    </div>
    <div class="uc-modal-content">
      <p class="uc-modal-meta"></p>
      <h2 class="uc-modal-title"></h2>
      <p class="uc-modal-body"></p>
      <div class="uc-modal-tags"></div>
    </div>
  </div>
</div>

<script>
(function () {
  let modal = document.getElementById('ucModal');
  let modalImg = modal.querySelector('.uc-modal-img');
  let modalMeta = modal.querySelector('.uc-modal-meta');
  let modalTitle = modal.querySelector('.uc-modal-title');
  let modalBody = modal.querySelector('.uc-modal-body');
  let modalTags = modal.querySelector('.uc-modal-tags');
  let closeBtn = modal.querySelector('.uc-modal-close');
  let backdrop = modal.querySelector('.uc-modal-backdrop');
  let lastFocused = null;

  function openModal(card) {
    modalImg.src = card.dataset.image;
    modalImg.alt = card.dataset.image_alt || card.dataset.title;
    let meta = card.dataset.institution + (card.dataset.location ? ' · ' + card.dataset.location : '');
    modalMeta.textContent = meta;
    modalTitle.textContent = card.dataset.title;
    modalBody.textContent = card.dataset.body;
    modalTags.innerHTML = card.dataset.tags.split("|||||").map(function (t) {
      return '<span class="uc-modal-tag">' + t + '</span>';
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

  document.querySelectorAll('.uc-card').forEach((card) => {
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
})();
</script>
```
