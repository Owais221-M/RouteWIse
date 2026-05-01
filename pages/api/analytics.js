import { analytics } from "@/lib/services/analytics";
import { rateLimit } from "@/lib/services/security";

const ALLOWED_EVENTS = new Set(["ROUTE_SELECT", "provider_click"]);
const MAX_STRING_LENGTH = 200;

function sanitizeData(data) {
  if (typeof data !== "object" || data === null || Array.isArray(data)) return {};
  // Strip to only known safe scalar values, no nested objects
  const safe = {};
  for (const [k, v] of Object.entries(data)) {
    if (typeof v === "string" || typeof v === "number") {
      safe[k] = typeof v === "string" ? v.slice(0, MAX_STRING_LENGTH) : v;
    }
  }
  return safe;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    rateLimit(req, { limit: 100 });

    const event = typeof req.body?.event === "string" ? req.body.event.slice(0, 50) : "";
    const data = sanitizeData(req.body?.data);

    if (!ALLOWED_EVENTS.has(event)) {
      return res.status(400).json({ error: "Unknown event type" });
    }

    if (event === "ROUTE_SELECT") {
      analytics.logRouteSelect(data);
    } else if (event === "provider_click") {
      analytics.logProviderClick(data);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    analytics.logError(error);
    return res.status(400).json({ error: "Analytics logging failed" });
  }
}
