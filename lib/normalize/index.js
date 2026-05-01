export function normalizeRoutes(rawRoutes, providerName) {
  return rawRoutes.map((route) => {
    if (providerName === "flixbus") {
      const departureTime = route.departure_time;
      const arrivalTime = route.arrival_time;
      
      const depHour = parseInt(departureTime.split(":")[0], 10);
      
      const spansMidnight = (depHour + route.travel_time_hours) >= 24;
      const isOvernight = spansMidnight || (route.travel_time_hours > 8 && spansMidnight);

      const itinerary = {
        departureTime: departureTime,
        arrivalTime: arrivalTime,
        summary: `Direct route. Total duration: ${route.travel_time_hours}h.`,
        legs: [
          { from: route.departure_city, to: route.arrival_city, transport: "bus", duration: `${route.travel_time_hours}h`, departTime: departureTime, arriveTime: arrivalTime }
        ]
      };

      return {
        provider: "flixbus",
        type: "bus",
        route: `${route.departure_city} → ${route.arrival_city}`,
        price: route.ticket_price,
        duration: route.travel_time_hours,
        transfers: route.connection_count,
        departure_time: departureTime,
        arrival_time: arrivalTime,
        is_overnight: isOvernight,
        itinerary,
        booking_url: route.link
      };
    }
    
    // Fallback or other providers
    return route;
  });
}
