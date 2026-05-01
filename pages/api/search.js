import { fetchFlixbusRoutes } from "@/lib/providers/flixbus";
import { normalizeRoutes } from "@/lib/normalize";
import { generateMultiLegRoutes, groupRoutes } from "@/lib/routing/engine";
import { rankRoutes } from "@/lib/ranking";
import { rateLimit, validateSearchInput, safeErrorResponse } from "@/lib/services/security";
import { analytics } from "@/lib/services/analytics";

const cache = new Map();
const CACHE_TTL = 3 * 60 * 1000; // 3 minutes

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    rateLimit(req, { limit: 60 });
    const { origin, destination, date } = validateSearchInput(req.body);
    
    analytics.logSearch({ origin, destination, date });
    
    const cacheKey = `${origin.toLowerCase()}-${destination.toLowerCase()}-${date}`;
    const cachedEntry = cache.get(cacheKey);
    
    if (cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_TTL) {
      return res.status(200).json({ cached: true, ...cachedEntry.data });
    }
    
    // 1. Fetch raw data from providers
    const rawFlixbusRoutes = await fetchFlixbusRoutes(origin, destination, date);
    
    // 2. Normalize
    const normalizedFlixbus = normalizeRoutes(rawFlixbusRoutes, "flixbus");
    
    // Simulate additional providers with real deep-link booking URLs
    const omioUrl = (r) =>
      `https://www.omio.com/search/r?origin=${encodeURIComponent(r.route.split(" → ")[0])}&destination=${encodeURIComponent(r.route.split(" → ").at(-1))}&outward=${encodeURIComponent(date)}&pax=1`;
    const trainlineUrl = (r) =>
      `https://www.thetrainline.com/book/results?origin=${encodeURIComponent(r.route.split(" → ")[0])}&destination=${encodeURIComponent(r.route.split(" → ").at(-1))}&outwardDate=${encodeURIComponent(date)}&adult=1`;

    const mockOmio = normalizedFlixbus.map(r => ({ ...r, provider: "omio", price: r.price + Math.floor(Math.random() * 10) + 2, booking_url: omioUrl(r) }));
    const mockTrainline = normalizedFlixbus.map(r => ({ ...r, provider: "trainline", price: r.price + Math.floor(Math.random() * 15) + 5, booking_url: trainlineUrl(r) }));
    
    // 3. Routing Engine (generate multi-leg options)
    const routeOptions = generateMultiLegRoutes([...normalizedFlixbus, ...mockOmio, ...mockTrainline]);
    
    const groupedRoutes = groupRoutes(routeOptions);
    
    // 4. Ranking
    const recommendation = rankRoutes(groupedRoutes, date);

    cache.set(cacheKey, { timestamp: Date.now(), data: recommendation });

    return res.status(200).json({ cached: false, ...recommendation });
  } catch (error) {
    analytics.logError(error);
    return safeErrorResponse(res, error);
  }
}
