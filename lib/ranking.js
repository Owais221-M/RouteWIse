export function getRouteScore(route) {
  let score = route.price + route.duration * 1.5 + route.transfers * 15;
  
  // Penalize unrealistic departure times (e.g. 01:00 to 04:00)
  const depHour = parseInt(route.departure_time?.split(":")[0] || "12", 10);
  if (depHour >= 1 && depHour <= 4) {
    score += 50; // Heavy penalty for middle-of-the-night departures
  }
  
  return score;
}

function withInsights(route, category, fastest, cheapest, searchDate) {
  const savings_vs_fastest = fastest.price - route.price;
  const time_difference_vs_fastest = route.duration - fastest.duration;

  let explanation = "";
  if (category === "recommended") {
    explanation = savings_vs_fastest > 0
      ? `Saves €${savings_vs_fastest} compared to the fastest route with only ${time_difference_vs_fastest}h additional travel time.`
      : "Best balance between time and cost.";
  } else if (category === "cheapest") {
    explanation = `Lowest cost option, but ${time_difference_vs_fastest}h longer than the fastest route.`;
  } else if (category === "fastest") {
    explanation = `Fastest option, costing €${Math.max(0, fastest.price - cheapest.price)} more than the lowest cost route.`;
  } else {
    explanation = savings_vs_fastest > 0
      ? `Saves €${savings_vs_fastest} compared to the fastest option.`
      : "Standard travel option.";
  }

  let confidence = "High confidence: Price likely stable";
  
  const timeStr = route.departure_time || "12:00";
  const dateStr = searchDate || new Date().toISOString().split("T")[0];
  const fullDepartureDate = new Date(`${dateStr}T${timeStr}:00`);
  const hoursUntilDeparture = (fullDepartureDate - new Date()) / (1000 * 60 * 60);

  if (hoursUntilDeparture < 6) {
    confidence = "Low confidence: Price may change";
  } else if (route.transfers > 1) {
    confidence = "Low confidence: Price may change";
  } else if (route.duration > 12) {
    confidence = "Low confidence: Price may change";
  }

  return {
    ...route,
    savings_vs_fastest,
    time_difference_vs_fastest,
    explanation,
    confidence
  };
}

export function rankRoutes(routes, searchDate) {
  const cheapest = [...routes].sort((a, b) => a.price - b.price)[0];
  const fastest = [...routes].sort((a, b) => a.duration - b.duration)[0];
  const recommended = [...routes].sort((a, b) => getRouteScore(a) - getRouteScore(b))[0];

  const options = routes.map((r) => withInsights(r, "", fastest, cheapest, searchDate));

  return {
    routes: options,
    recommended: withInsights(recommended, "recommended", fastest, cheapest, searchDate),
    cheapest: withInsights(cheapest, "cheapest", fastest, cheapest, searchDate),
    fastest: withInsights(fastest, "fastest", fastest, cheapest, searchDate)
  };
}
