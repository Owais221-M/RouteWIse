import { createItinerary } from "@/lib/itinerary";

export function getMockRoutes(origin, destination) {
  const from = origin.trim() || "Rome";
  const to = destination.trim() || "Paris";
  const date = arguments[2] ?? "Selected date";

  const routes = [
    {
      type: "train",
      route: `${from} → Milan → ${to}`,
      price: 120,
      duration: 10,
      transfers: 1
    },
    {
      type: "bus",
      route: `${from} → ${to}`,
      price: 60,
      duration: 18,
      transfers: 0
    },
    {
      type: "mixed",
      route: `${from} → Zurich → ${to}`,
      price: 90,
      duration: 12,
      transfers: 1
    }
  ];

  return routes.map((route) => ({
    ...route,
    itinerary: createItinerary(route, date)
  }));
}
