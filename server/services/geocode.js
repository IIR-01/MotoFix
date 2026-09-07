// Turns a lat/lng pair into a short, human-readable place name — e.g. so
// the UI can show "Road 27, Dhanmondi" instead of "23.7461, 90.3742".
//
// Uses Nominatim (OpenStreetMap's own geocoder): free, no API key, same
// data source the map tiles already come from. Nominatim's usage policy
// asks for a real User-Agent identifying the app and roughly 1
// request/second max — both trivially satisfied here, since this only
// runs once per location-share, not in a loop. A browser's fetch() can't
// set a custom User-Agent (browsers override it), which is one reason
// this lives on the server instead of being called from the frontend.
async function reverseGeocode(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'MotoFix-StudentProject/1.0' },
    });
    if (!res.ok) throw new Error(`Nominatim responded ${res.status}`);
    const data = await res.json();
    const a = data.address || {};

    const place = a.road || a.suburb || a.neighbourhood || a.city_district || null;
    const area = a.suburb || a.city || a.town || a.village || a.state || null;
    const short = [place, area].filter((v, i, arr) => v && arr.indexOf(v) === i).join(', ');

    return { name: short || data.display_name || null };
  } catch (err) {
    console.error('Reverse geocoding failed, caller should fall back to coordinates:', err.message);
    return { name: null };
  }
}

module.exports = { reverseGeocode };