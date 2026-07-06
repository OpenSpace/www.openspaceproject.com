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

    const js = document.createElement('script');
    js.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    js.onload = () => {
      leafletReady = true;
      tryInit();
    };
    document.head.appendChild(js);

    const dataJs = document.createElement('script');
    dataJs.src = 'https://status.openspaceproject.com/data.js';
    dataJs.onload = () => {
      dataReady = true;
      tryInit();
    };
    document.head.appendChild(dataJs);
  }

  const mapEl = document.getElementById('page-impact-startup-map');
  if ('IntersectionObserver' in window && mapEl) {
    const obs = new IntersectionObserver((entries) => {
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
