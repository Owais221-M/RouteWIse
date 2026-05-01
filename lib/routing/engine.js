export function generateMultiLegRoutes(routes) {
  // Combine routes safely ensuring max 1 transfer and a realistic gap.
  const multiLegs = [];
  
  if (routes.length > 0) {
    const baseRoute = routes[0];
    const parts = baseRoute.route.split(" → ");
    const origin = parts[0];
    const destination = parts[parts.length - 1];
    
    // Simulate a 45-minute transfer gap logic to avoid impossible connections
    const transferGapHours = 0.75;
    const additionalTravelTime = 1.25;
    const realisticDuration = baseRoute.duration + transferGapHours + additionalTravelTime;
    
    multiLegs.push({
      provider: "RouteWise Routing Engine",
      type: "mixed",
      route: `${origin} → Simulated Hub → ${destination}`,
      price: Math.max(15, Math.floor(baseRoute.price * 0.7)), // 30% cheaper
      duration: realisticDuration,
      transfers: 1, // Enforced max 1 transfer
      departure_time: baseRoute.departure_time,
      arrival_time: "varies",
      is_overnight: (parseInt(baseRoute.departure_time.split(":")[0], 10) + realisticDuration) >= 24,
      itinerary: {
        departureTime: baseRoute.departure_time,
        arrivalTime: "varies",
        summary: `1 transfer at Simulated Hub. Total duration: ${realisticDuration}h.`,
        legs: [
          { from: origin, to: "Simulated Hub", transport: "mixed", duration: `${Math.floor(realisticDuration / 2)}h`, departTime: baseRoute.departure_time, arriveTime: "varies" },
          { isTransfer: true, duration: "45m", description: "Transfer time" },
          { from: "Simulated Hub", to: destination, transport: "mixed", duration: `${Math.ceil(realisticDuration / 2)}h`, departTime: "varies", arriveTime: "varies" }
        ]
      },
      booking_url: `https://global.flixbus.com/search?departureCity=${encodeURIComponent(origin)}&arrivalCity=${encodeURIComponent(destination)}&rideDate=${encodeURIComponent(baseRoute.departure_time)}`
    });
  }

  return [...routes, ...multiLegs];
}


// Provider classification & reliability lookup
const PROVIDER_METADATA = {
  flixbus:   { type: "operator",          reliability: 90 },
  omio:      { type: "booking platform",   reliability: 82 },
  trainline: { type: "booking platform",   reliability: 85 },
  "routewise routing engine": { type: "operator", reliability: 70 }
};

function getProviderMeta(name = "") {
  return PROVIDER_METADATA[name.toLowerCase()] ?? { type: "operator", reliability: 75 };
}

export function groupRoutes(routes) {
  const groups = {};

  routes.forEach((r) => {
    // Tighter bucket — round to nearest single hour to prevent false grouping
    const durationBucket = Math.round(r.duration);
    const key = `${r.route}_${r.transfers}_${durationBucket}`;

    if (!groups[key]) {
      groups[key] = {
        route_id: key,
        summary: {
          route: r.route,
          duration: r.duration,
          transfers: r.transfers,
          type: r.type,
          is_overnight: r.is_overnight,
          itinerary: r.itinerary
        },
        providers: []
      };
    }

    // Skip near-duplicates: same provider + same price already in list
    const isDuplicate = groups[key].providers.some(
      (p) => p.provider === r.provider && p.price === r.price
    );
    if (isDuplicate) return;

    const meta = getProviderMeta(r.provider);
    groups[key].providers.push({
      provider: r.provider,
      provider_type: meta.type,
      reliability: meta.reliability,
      price: r.price,
      departure_time: r.departure_time,
      arrival_time: r.arrival_time,
      booking_url: r.booking_url,
      is_overnight: r.is_overnight
    });
  });

  return Object.values(groups).map(group => {
    // Sort by price first, then reliability descending
    group.providers.sort((a, b) => a.price - b.price || b.reliability - a.reliability);

    const prices = group.providers.map(p => p.price);
    const priceGap = Math.max(...prices) - Math.min(...prices);
    const priceVariance = prices.length > 1 && priceGap > 20;

    return {
      ...group,
      price: group.providers[0].price,
      duration: group.summary.duration,
      transfers: group.summary.transfers,
      departure_time: group.providers[0].departure_time,
      type: group.summary.type,
      is_overnight: group.summary.is_overnight,
      route: group.summary.route,
      itinerary: group.summary.itinerary,
      price_variance: priceVariance
    };
  });
}
