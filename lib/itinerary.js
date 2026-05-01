const TRANSFER_BUFFER_HOURS = 0.5;

function pad(value) {
  return String(value).padStart(2, "0");
}

function formatTime(totalHours) {
  const wholeHours = Math.floor(totalHours) % 24;
  const minutes = Math.round((totalHours - Math.floor(totalHours)) * 60);
  return `${pad(wholeHours)}:${pad(minutes)}`;
}

function addHours(time, hours) {
  return formatTime(time + hours);
}

function splitRoute(route) {
  return route.split("→").map((city) => city.trim()).filter(Boolean);
}

export function createItinerary(routeOption, date) {
  const stops = splitRoute(routeOption.route);
  const segments = Math.max(stops.length - 1, 1);
  const transferTime = routeOption.transfers * TRANSFER_BUFFER_HOURS;
  const travelHours = Math.max(routeOption.duration - transferTime, segments);
  const segmentHours = travelHours / segments;
  const startHour = routeOption.type === "bus" ? 21 : routeOption.type === "mixed" ? 8.5 : 7.5;
  let cursor = startHour;

  const legs = stops.slice(0, -1).map((from, index) => {
    const to = stops[index + 1];
    const departTime = addHours(cursor, 0);
    cursor += segmentHours;
    const arriveTime = addHours(cursor, 0);

    if (index < stops.length - 2) {
      cursor += TRANSFER_BUFFER_HOURS;
    }

    return {
      from,
      to,
      transport: routeOption.type === "mixed" && index === 0 ? "train" : routeOption.type,
      departTime,
      arriveTime,
      duration: `${segmentHours.toFixed(segmentHours % 1 === 0 ? 0 : 1)}h`
    };
  });

  return {
    date,
    departureTime: legs[0]?.departTime ?? addHours(startHour, 0),
    arrivalTime: legs.at(-1)?.arriveTime ?? addHours(startHour + routeOption.duration, 0),
    totalDuration: `${routeOption.duration}h`,
    legs,
    summary: `${stops[0]} to ${stops.at(-1)} on ${date}, ${routeOption.duration}h with ${routeOption.transfers} transfer${
      routeOption.transfers === 1 ? "" : "s"
    }.`
  };
}

export function createItinerarySummary(route) {
  return route.itinerary?.summary ?? `${route.route} on ${route.date ?? "selected date"}`;
}
