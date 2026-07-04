```{=html}

<div class="page-impact__map-toggle">
  <button class="page-impact__toggle-btn is-active" data-layer="startups">Startup locations</button>
  <button class="page-impact__toggle-btn" data-layer="orgs">Organizations</button>
</div>

<div id="page-impact-startup-map" class="page-impact__map"></div>

<script>
function initImpactMap() {
  let mapEl = document.getElementById('page-impact-startup-map');
  if (!mapEl || typeof L === 'undefined' || typeof data === 'undefined') {
    return;
  }

  let leafletMap = L.map('page-impact-startup-map', {
    center: [20, 0],
    zoom: 2,
    scrollWheelZoom: false,
    zoomControl: true
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(leafletMap);

  let accent = '#a2e7fb';
  let orgAccent = '#d0f884';

  // Build startup layer
  let startupLayer = L.layerGroup();

  (data.places || []).forEach(place => {
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
%>

  // Toggle logic
  let footerText = document.getElementById('page-impact-map-footer-text');
  let toggleBtns = document.querySelectorAll('.page-impact__toggle-btn');

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
        footerText.textContent = '103 organizations across 25+ countries';
      }
    }
  }

  toggleBtns.forEach(function (btn) {
    btn.addEventListener('click', function () { showLayer(btn.dataset.layer); });
  });

  // Show orgs layer if linked directly via #orgs
  if (window.location.hash === '#orgs') {
    showLayer('orgs');
  } else {
    showLayer('startups');
  }

  setTimeout(() => { leafletMap.invalidateSize(); }, 200);
}
</script>
```
