export async function fetchFlixbusRoutes(origin, destination, date) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return [
    {
      operator: "flixbus",
      mode: "bus",
      departure_city: origin,
      arrival_city: destination,
      ticket_price: 35.50,
      travel_time_hours: 14,
      connection_count: 0,
      departure_time: "08:00",
      arrival_time: "22:00",
      link: `https://global.flixbus.com/search?departureCity=${encodeURIComponent(origin)}&arrivalCity=${encodeURIComponent(destination)}&rideDate=${encodeURIComponent(date)}`
    },
    {
      operator: "flixbus",
      mode: "bus",
      departure_city: origin,
      arrival_city: destination,
      ticket_price: 25.00,
      travel_time_hours: 18,
      connection_count: 1,
      departure_time: "10:00",
      arrival_time: "04:00", // Next day
      link: `https://global.flixbus.com/search?departureCity=${encodeURIComponent(origin)}&arrivalCity=${encodeURIComponent(destination)}&rideDate=${encodeURIComponent(date)}`
    }
  ];
}
