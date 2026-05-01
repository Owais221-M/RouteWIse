import { rateLimit, safeErrorResponse } from "@/lib/services/security";
import { analytics } from "@/lib/services/analytics";

const MAX_LEN = 200;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    rateLimit(req, { limit: 120 });

    // Sanitize inputs — both are informational only; reject unexpected types
    const routeId = typeof req.body?.routeId === "string" ? req.body.routeId.slice(0, MAX_LEN) : "";
    const provider = typeof req.body?.provider === "string" ? req.body.provider.slice(0, 60) : "";

    if (!routeId || !provider) {
      return res.status(400).json({ error: "Missing routeId or provider" });
    }

    // Simulate real-time check delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // 5% chance of simulated availability change for realism
    const isValid = Math.random() > 0.05;

    if (!isValid) {
      analytics.logError(new Error(`Validation failed: provider=${provider}`));
      return res.status(200).json({ isValid: false });
    }

    return res.status(200).json({ isValid: true });
  } catch (error) {
    analytics.logError(error);
    return safeErrorResponse(res, error);
  }
}
