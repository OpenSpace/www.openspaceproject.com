```{=html}

<div class="page-impact__map-toggle">
  <button class="page-impact__toggle-btn is-active" data-layer="startups">Startup locations</button>
  <button class="page-impact__toggle-btn" data-layer="orgs">Organizations</button>
</div>

<div id="page-impact-startup-map" class="page-impact__map"></div>

<script>
function initImpactMap() {
  let mapEl = document.getElementById('page-impact-startup-map');
  if (!mapEl || typeof L === 'undefined') {
    return;
  }

  let leafletMap = L.map('page-impact-startup-map', {
    center: [20, 0],
    zoom: 2,
    scrollWheelZoom: false,
    zoomControl: true
  });

  // CARTO's free basemap tiles now require a registered API key (they started watermarking
  // unauthenticated requests), so we use Esri's no-signup dark canvas basemap instead.
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; <a href="https://www.esri.com">Esri</a>, HERE, Garmin, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 16
  }).addTo(leafletMap);

  let accent = '#a2e7fb';
  let orgAccent = '#d0f884';

  // Build startup layer
  let startupLayer = L.layerGroup();

  (hasStartupData ? data.places : []).forEach(place => {
    let r = Math.max(4, Math.min(14, Math.log2((place.total || 1) + 1) * 1.8));
    L.circleMarker([place.lat, place.lng], {
      radius: r,
      color: accent,
      fillColor: accent,
      fillOpacity: 0.45,
      weight: 1,
      opacity: 0.75
    }).addTo(startupLayer).bindPopup(
      '<strong style="color:#000">' + place.total + '</strong> launch' + (place.total !== 1 ? 'es' : '')
    );
  });

  // Build org layer
  let orgLayer = L.layerGroup();
<%
  for (const item of items) {
%>
    L.circleMarker([<%- item.lat %>, <%- item.lng %>], {
      radius: 7,
      color: orgAccent,
      fillColor: orgAccent,
      fillOpacity: 0.5,
      weight: 1.5,
      opacity: 0.9
    }).addTo(orgLayer).bindPopup(
      '<strong style="color:#000"><%- item.name %></strong><br><span style="color:#555;font-size:0.85em"><%- item.city %></span>'
    );
<%
  }

  // Computed at build time from the same data driving the markers above, so the org
  // count and country count in the footer text below can't drift out of sync with it.
  const orgCount = items.length;
  const orgCountries = new Set(items.map((item) => {
    const parts = item.city.split(',');
    return parts[parts.length - 1].trim();
  }));
%>

  // Toggle logic
  let footerText = document.getElementById('page-impact-map-footer-text');
  let toggleBtns = document.querySelectorAll('.page-impact__toggle-btn');

  if (!hasStartupData) {
    let startupBtn = document.querySelector('.page-impact__toggle-btn[data-layer="startups"]');
    if (startupBtn) {
      startupBtn.disabled = true;
      startupBtn.title = 'Startup location data is temporarily unavailable';
    }
  }

  function showLayer(layerName) {
    toggleBtns.forEach((b) => { b.classList.remove('is-active'); });
    document.querySelector('.page-impact__toggle-btn[data-layer="' + layerName + '"]').classList.add('is-active');
    if (layerName === 'startups') {
      leafletMap.removeLayer(orgLayer);
      startupLayer.addTo(leafletMap);
      if (footerText) {
        footerText.textContent = 'Each marker = a unique startup location · Circle size scales with launch count';
      }
    }
    else {
      leafletMap.removeLayer(startupLayer);
      orgLayer.addTo(leafletMap);
      if (footerText) {
        footerText.textContent = '<%= orgCount %> organizations across <%= orgCountries.size %> countries';
      }
    }
  }

  toggleBtns.forEach(function (btn) {
    btn.addEventListener('click', function () { showLayer(btn.dataset.layer); });
  });

  // Show orgs layer if linked directly via #orgs, or if there's no startup data to show
  if (window.location.hash === '#orgs' || !hasStartupData) {
    showLayer('orgs');
  } else {
    showLayer('startups');
  }

  setTimeout(() => { leafletMap.invalidateSize(); }, 200);
}
</script>
```
