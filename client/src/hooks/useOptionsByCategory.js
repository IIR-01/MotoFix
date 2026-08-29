import { useMemo } from 'react';

// Merges the shared bodyType option catalog with a specific vehicle's real
// photos and full category overrides. Used by both the Customizer (to drive
// the live preview) and the Review page (to label a saved/in-progress
// selection), so the merge rules only live in one place.
export function useOptionsByCategory(vehicle, allOptions) {
  return useMemo(() => {
    if (!vehicle) return {};
    const map = { paint_color: [] };
    allOptions.forEach((o) => {
      if (!map[o.category]) map[o.category] = [];
      map[o.category].push(o);
    });

    // paint_color has no generic bodyType data — it's always the vehicle's
    // own real photos, with the base photo as the implicit "stock" choice.
    map.paint_color = [
      { key: 'stock', label: 'Stock', imageUrl: vehicle.baseImageUrl },
      ...(vehicle.photoOptions?.paint_color || []),
    ];

    // For any other category where this vehicle has real photos for some of
    // its options, attach them — any option without a matching real photo
    // falls back to the base ("no change") photo instead.
    Object.entries(vehicle.photoOptions || {}).forEach(([category, photos]) => {
      if (category === 'paint_color' || !map[category]) return;
      map[category] = map[category].map((opt) => ({
        ...opt,
        imageUrl: photos.find((p) => p.key === opt.key)?.imageUrl || vehicle.baseImageUrl,
      }));
    });

    // Full override: replaces a category's option list entirely (e.g. only
    // "Black and White" rims instead of the shared stock/sport/alloy set),
    // instead of layering onto it.
    Object.entries(vehicle.optionOverrides || {}).forEach(([category, options]) => {
      map[category] = options;
    });

    return map;
  }, [allOptions, vehicle]);
}
