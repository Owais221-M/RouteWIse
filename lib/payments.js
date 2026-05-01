import { getMockRoutes } from "@/lib/mockData";
import { createItinerarySummary } from "@/lib/itinerary";
import { validateCheckoutInput } from "@/lib/security";

export function getBaseUrl(req) {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  const host = req.headers.host ?? "localhost:3000";
  const socket = req.socket;
  const protocol = process.env.NODE_ENV === "production" || socket?.encrypted ? "https" : "http";

  return `${protocol}://${host}`;
}

export function resolveCheckoutRoute(body) {
  const { origin, destination, date, route: requestedRoute, type } = validateCheckoutInput(body);

  const route = getMockRoutes(origin, destination, date).find(
    (item) => item.route === requestedRoute && item.type === type
  );

  if (!route) {
    throw new Error("Route is not available for checkout");
  }

  return {
    ...route,
    origin,
    destination,
    date,
    orderId: `rw_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
  };
}

export function buildOrderDescription(route) {
  return `BuyTrip ${route.type} ticket: ${createItinerarySummary(route)}`;
}

export function buildCheckoutMetadata(route) {
  return {
    orderId: route.orderId,
    origin: route.origin,
    destination: route.destination,
    date: route.date,
    route: route.route,
    type: route.type,
    departureTime: route.itinerary.departureTime,
    arrivalTime: route.itinerary.arrivalTime,
    duration: String(route.duration),
    transfers: String(route.transfers),
    itinerary: createItinerarySummary(route).slice(0, 500)
  };
}
