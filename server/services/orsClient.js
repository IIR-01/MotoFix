// Wraps the OpenRouteService Matrix API (free tier, one API key from
// openrouteservice.org — no credit card) to get real driving distance and
// ETA from one customer location to several candidate mechanics in a
// single request. If the key is missing, or the call fails for any reason
// (rate limit, network blip, etc.), this falls back to a straight-line
// (haversine) estimate instead of breaking the feature outright.

const haversineDistance = ([lng1, lat1], [lng2, lat2]) => {
  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const AVERAGE_CITY_SPEED_MPS = 8.3; // ~30 km/h, a reasonable Dhaka estimate

const fallbackMatrix = (source, destinations) =>
  destinations.map((dest) => {
    const distance = haversineDistance(source, dest);
    return { distance, duration: distance / AVERAGE_CITY_SPEED_MPS, estimated: true };
  });

async function getDistanceMatrix(source, destinations) {
  if (!destinations.length) return [];
  if (!process.env.ORS_API_KEY) {
    return fallbackMatrix(source, destinations);
  }

  try {
    const res = await fetch('https://api.openrouteservice.org/v2/matrix/driving-car', {
      method: 'POST',
      headers: { Authorization: process.env.ORS_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        locations: [source, ...destinations],
        sources: [0],
        destinations: destinations.map((_, i) => i + 1),
        metrics: ['distance', 'duration'],
      }),
    });

    if (!res.ok) throw new Error(`ORS responded ${res.status}`);
    const data = await res.json();
    const distances = data.distances[0];
    const durations = data.durations[0];

    return destinations.map((_, i) => ({
      distance: distances[i],
      duration: durations[i],
      estimated: false,
    }));
  } catch (err) {
    console.error('ORS matrix call failed, falling back to estimate:', err.message);
    return fallbackMatrix(source, destinations);
  }
}
<<<<<<< HEAD
// Turn-by-turn route geometry between two points (for drawing an actual
// road-following line on a map), using ORS's Directions API. Same key,
// same graceful fallback philosophy as getDistanceMatrix above — if
// there's no key or the call fails, we fall back to a straight line
// between the two points instead of showing no line at all.
async function getRoute(source, destination) {
  if (!process.env.ORS_API_KEY) {
    return fallbackRoute(source, destination);
  }

  try {
    const res = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
      method: 'POST',
      headers: { Authorization: process.env.ORS_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ coordinates: [source, destination] }),
    });

    if (!res.ok) throw new Error(`ORS responded ${res.status}`);
    const data = await res.json();
    const feature = data.features[0];

    return {
      coordinates: feature.geometry.coordinates, // [ [lng,lat], [lng,lat], ... ]
      distance: feature.properties.summary.distance,
      duration: feature.properties.summary.duration,
      estimated: false,
    };
  } catch (err) {
    console.error('ORS directions call failed, falling back to a straight line:', err.message);
    return fallbackRoute(source, destination);
  }
}

function fallbackRoute(source, destination) {
  const distance = haversineDistance(source, destination);
  return {
    coordinates: [source, destination],
    distance,
    duration: distance / AVERAGE_CITY_SPEED_MPS,
    estimated: true,
  };
}
module.exports = { getDistanceMatrix, getRoute, haversineDistance };
=======

module.exports = { getDistanceMatrix, haversineDistance };
>>>>>>> 1ac65f253f4e61b550de509defdd255d6ba8b75f
