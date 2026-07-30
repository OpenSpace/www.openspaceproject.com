document.querySelectorAll('.page-tutorials__video').forEach(function (button) {
  button.addEventListener('click', function () {
    var src = button.getAttribute('data-video-embed');
    if (!src) return;

    if (window.Cookiebot && Cookiebot.consent && Cookiebot.consent.marketing) {
      var iframe = document.createElement('iframe');
      iframe.src = src + (src.indexOf('?') === -1 ? '?' : '&') + 'autoplay=1';
      iframe.title = button.getAttribute('aria-label') || '';
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.allowFullscreen = true;
      button.replaceWith(iframe);
    } else if (window.Cookiebot) {
      Cookiebot.renew();
    }
  });
});
