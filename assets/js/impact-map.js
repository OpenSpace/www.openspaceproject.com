document.addEventListener('DOMContentLoaded', () => {
  let loaded = false;
  function loadMapAssets() {
    if (loaded) {
      return;
    }
    loaded = true;

    let leafletReady = false;
    let dataReady = false;
    function tryInit() {
      if (leafletReady && dataReady) {
        initImpactMap();
      }
    }

    let css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(css);

    let js = document.createElement('script');
    js.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    js.onload = () => {
      leafletReady = true;
      tryInit();
    };
    document.head.appendChild(js);

    let dataJs = document.createElement('script');
    dataJs.src = 'https://status.openspaceproject.com/data.js';
    dataJs.onload = () => {
      dataReady = true;
      tryInit();
    };
    document.head.appendChild(dataJs);
  }

  let mapEl = document.getElementById('page-impact-startup-map');
  if ('IntersectionObserver' in window && mapEl) {
    let obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        obs.disconnect();
        loadMapAssets();
      }
    }, { rootMargin: '300px' });
    obs.observe(mapEl);
  }
  else {
    loadMapAssets();
  }
});
