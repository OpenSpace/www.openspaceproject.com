// Embed mode (impact.html?embed): show only the map, filling the whole window to enable
// embedding of the map into another source. Set here, before the body renders, to avoid a
// flash of the full page. Combine with #orgs to show the Organizations layer instead of
// startups
if (new URLSearchParams(window.location.search).has('embed')) {
  document.documentElement.classList.add('impact-embed');
}

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

    // Leaflet is vendored under assets/vendor/leaflet (see the download instructions in
    // that folder) so the map doesn't depend on unpkg at runtime. Keep the lazy load:
    // only fetch it when the map nears the viewport
    const js = document.createElement('script');
    js.src = '/assets/vendor/leaflet/leaflet.js';
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
    // If the status data fails to load, don't hang forever waiting for it; init the map
    // anyway so layers that don't depend on it (e.g. Organizations) still work
    dataJs.onerror = () => {
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
