import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const selfIcon = L.divIcon({
  className: '',
  html: '<div style="width:18px;height:18px;background:#D62839;border:3px solid white;border-radius:50%;box-shadow:0 0 6px rgba(0,0,0,0.5);"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

// A proper pin shape at a real size for "the other party" — the old 14px
// flat dot was easy to lose against the map tiles.
const otherIcon = L.divIcon({
  className: '',
  html: `<svg width="26" height="34" viewBox="0 0 26 34" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 0C5.8 0 0 5.8 0 13c0 9.75 13 21 13 21s13-11.25 13-21C26 5.8 20.2 0 13 0z" fill="#1A1414" stroke="white" stroke-width="2"/>
    <circle cx="13" cy="13" r="5" fill="white"/>
  </svg>`,
  iconSize: [26, 34],
  iconAnchor: [13, 34],
  popupAnchor: [0, -30],
});

// react-leaflet only sets the map's view once, on first mount — this
// re-centers/re-fits it whenever the set of points actually changes.
function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 14);
    } else {
      map.fitBounds(points, { padding: [30, 30] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(points)]);
  return null;
}

/**
 * self    — { lat, lng, label } — whoever is viewing the map.
 * markers — [{ id, lat, lng, label }] — one marker, or several for an overview.
 * route   — optional [[lat,lng], ...] polyline. Only really makes sense with one marker.
 * height  — pixel height of the map container.
 */
export default function RequestMap({ self, markers = [], route = null, height = 280 }) {
  if (self == null || typeof self.lat !== 'number' || typeof self.lng !== 'number') return null;

  const validMarkers = markers.filter((m) => typeof m.lat === 'number' && typeof m.lng === 'number');
  const allPoints = [[self.lat, self.lng], ...validMarkers.map((m) => [m.lat, m.lng])];

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height }}>
      <MapContainer center={[self.lat, self.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitBounds points={allPoints} />

        <Marker position={[self.lat, self.lng]} icon={selfIcon}>
          <Popup>{self.label || 'You'}</Popup>
        </Marker>

        {validMarkers.map((m) => (
          <Marker key={m.id ?? `${m.lat},${m.lng}`} position={[m.lat, m.lng]} icon={otherIcon}>
            <Popup>{m.label}</Popup>
          </Marker>
        ))}

        {route && route.length > 1 && (
          <Polyline positions={route} pathOptions={{ color: '#D62839', weight: 4, opacity: 0.8 }} />
        )}
      </MapContainer>
    </div>
  );
}