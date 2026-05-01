# BuyTrip Travel Platform

A smarter way to compare and choose travel across Europe.

BuyTrip is a production-ready travel comparison platform for trains, buses, and mixed routes across Europe. It integrates structured transport data from operators and booking platforms, normalizes it, provides intelligent multi-leg routing, and securely redirects users to official providers for booking.

The platform operates as a robust **multi-provider marketplace** (similar to Skyscanner), elegantly grouping identical routes sold by different providers and surfacing the best prices.

## Quick setup

1. Install dependencies:
```bash
npm install
```

2. Development server:
```bash
npm run dev
```

Open `http://localhost:3000`.

3. Build for production:
```bash
npm run build
npm run start
```

## Architecture

The project follows a clean architectural approach, with backend logic grouped into strict domains inside `/lib`:

- **app/**: Next.js App Router pages and layout (primary UI).
- **components/**: Reusable React components (SearchBar, ResultCard, BookingRedirect).
- **lib/providers/**: Data fetching logic for external transport operators (e.g., simulated `flixbus.js`).
- **lib/normalize/**: Schema validation and normalization layer to ensure all providers return a strict `{ provider, type, route, price, duration, transfers, departure_time, arrival_time, booking_url }` format, complete with strict math-based overnight tracking.
- **lib/routing/**: The routing engine for generating multi-leg alternatives. It dynamically **groups** similar routes from competing providers into unified marketplace blocks, deduplicates near-identical entries, and enriches each provider with type and reliability metadata.
- **lib/services/**: Cross-cutting utilities (structured JSON analytics logging, email scaffold, rate limiting & security boundaries).
- **pages/api/**: Next.js API routes for searching (`/api/search`) and real-time validation (`/api/validate`).

## Core Engine Flow & Intelligence

1. **Fetch**: `api/search` requests raw data from operators and booking platforms (e.g., FlixBus as operator; Omio, Trainline as booking platforms) and utilizes an **in-memory TTL cache** to serve repeated identical requests instantly.
2. **Normalize**: Responses are strictly mapped to the internal schema.
3. **Route & Group**: The engine generates multi-leg combinations, then maps all identical journeys (matching origin, destination, transfers, and duration) into unified **Route Groups**. Near-duplicate entries (same provider + same price) are automatically removed.
4. **Provider Enrichment**: Each provider within a group is enriched with:
   - `provider_type` — classified as either `"operator"` or `"booking platform"`.
   - `reliability` — a trust score used as a secondary sort key when prices are tied.
5. **Rank & Intelligence**: The ranking logic mathematically scores Route Groups anchored by the most affordable operator or platform in the group:
   ```text
   score = base_price + (duration * 1.5) + (transfers * 15) + (departure_penalty)
   ```
   Unrealistic departure times (1–4 AM) incur a heavy penalty. The engine also calculates a strict **Price Confidence Metric**, penalizing routes with multiple transfers, durations over 12h, or departures under 6h away.

## Result Cards & UI

Route cards visually present:
- A distinctly highlighted **Recommended** option, pinned at the top during all client-side sort changes.
- A **global explanation block** making the recommendation rationale transparent: *"This route is selected because it offers the best balance of time and cost compared to available alternatives."*
- **Provider Marketplace**: An internal list of **Booking Options** sorted by price, then by reliability.
- **Provider Classification**: A subtle type badge (`"operator"` or `"booking platform"`) next to each provider name.
- **Best Option Tag**: The most competitive option in the group receives a neutral `"Best option"` badge.
- **Price Variance Warning**: If providers differ by more than €20, the card shows `"Prices vary across providers"` in amber.
- Confidence warnings (`"Low confidence: Price may change"`) and `"Overnight journey"` pill badges.
- An expandable **Route Details** pane with leg-by-leg breakdown and `"Transfer time: 45m"` nodes.
- A compact `↗ View on {Provider}` button per row with non-blocking background validation and a 1.5s warning delay on failure.
- A **Smart Tip** dynamically driven by route context (e.g., *"Routes with transfers are often cheaper"* or *"Booking earlier can significantly reduce prices"*).

During search, the page shows stacked skeleton loaders and auto-fills the last search from `localStorage`.

## Analytics

All interactions emit structured `{ event, data, timestamp }` JSON logs via `/lib/services/analytics.js`:

| Event | Trigger |
|---|---|
| `search` | Every route search |
| `provider_click` | Booking button clicked — includes `provider`, `route_id`, `price` |
| `error` | Any backend failure |

Designed for ingestion by DataDog, Kibana, or any structured log pipeline.

## Security

The platform includes:
- Server-side input validation for city names, dates, and transport types.
- Centralized `safeErrorResponse` boundaries to prevent stack trace leaks.
- Basic per-route API rate limiting.
- Secure redirect handling via `_blank` + `noopener,noreferrer`.
