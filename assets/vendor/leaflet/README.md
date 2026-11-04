# Vendored: Leaflet 1.9.4
leaflet.js and leaflet.css are a verbatim copy of Leaflet 1.9.4 (MIT license,
https://leafletjs.com), vendored so the Impact page map doesn't depend on
unpkg.com at runtime.

Used by:
  - about/impact.qmd (leaflet.css, via include-in-header)
  - assets/js/impact-map.js (leaflet.js, lazy-loaded when the map nears the
    viewport)

To upgrade:
  1. Download the new dist files from https://unpkg.com/leaflet@<version>/dist/
  2. Replace leaflet.js / leaflet.css here and update the version in this file
  3. No other references to the unpkg URL should remain (grep for "unpkg")

The dist `images/` folder (layer-control and default marker icons) is
intentionally omitted: the Impact page only uses L.circleMarker (pure SVG),
so those images are never requested. If you add L.marker or a layer control
to the map, copy `images/` from the dist folder as well.
