"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftRight, Bus, CalendarDays, MapPin, Search, TrainFront } from "lucide-react";

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
    />
  );
}

function TripPill({ active, children, onClick }) {
  return (
    <button
      className={`inline-flex h-9 items-center rounded-full px-4 text-sm font-bold transition ${
        active ? "bg-white text-blue-600 shadow-sm" : "text-gray-600/90 hover:bg-white/10"
      }`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export default function SearchBar({
  initialOrigin = "Rome",
  initialDestination = "Paris",
  initialDate = "",
  compact = false
}) {
  const router = useRouter();
  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);
  const [date, setDate] = useState(initialDate);
  const [travelMode, setTravelMode] = useState("train");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Only auto-fill if we are on the homepage (not compact) and didn't receive initial props other than the defaults
    if (!compact) {
      try {
        const stored = localStorage.getItem("buytrip_search");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.origin) setOrigin(parsed.origin);
          if (parsed.destination) setDestination(parsed.destination);
          if (parsed.date) setDate(parsed.date);
        }
      } catch (e) {}
    }
  }, [compact]);

  useEffect(() => {
    setOrigin(initialOrigin);
    setDestination(initialDestination);
    setDate(initialDate);
  }, [initialDate, initialDestination, initialOrigin]);

  function handleSubmit(e) {
    e.preventDefault();

    if (origin.trim() && destination.trim() && date.trim()) {
      setIsSearching(true);
      
      try {
        localStorage.setItem("buytrip_search", JSON.stringify({ origin, destination, date }));
      } catch (e) {}

      const params = new URLSearchParams({
        origin: origin.trim(),
        destination: destination.trim(),
        date: date.trim(),
        mode: travelMode
      });

      router.push(`/results?${params.toString()}`);
    }
  }

  function swapRoute() {
    setOrigin(destination);
    setDestination(origin);
  }

  const inputClass =
    "h-16 w-full rounded-xl border-0 bg-white px-12 pt-5 text-base font-bold text-gray-900 outline-none ring-1 ring-gray-200 transition placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600";
  const labelClass = "absolute left-12 top-2 text-xs font-bold text-gray-500";

  return (
    <div className={compact ? "rounded-2xl bg-white p-3 shadow-lg" : "rounded-[28px] bg-white p-3 shadow-2xl sm:p-4"}>
      <div className="mb-3 flex flex-wrap items-center gap-2 px-1">
        <TripPill active={travelMode === "train"} onClick={() => setTravelMode("train")}>
          <TrainFront className="mr-2 h-4 w-4" />
          Trains
        </TripPill>
        <TripPill active={travelMode === "bus"} onClick={() => setTravelMode("bus")}>
          <Bus className="mr-2 h-4 w-4" />
          Buses
        </TripPill>
        <TripPill active={travelMode === "mixed"} onClick={() => setTravelMode("mixed")}>
          Mixed routes
        </TripPill>
      </div>

      <form
        className={
          compact
            ? "grid gap-2 lg:grid-cols-[1fr_auto_1fr_185px_210px] lg:items-center"
            : "grid gap-2 md:grid-cols-[1fr_auto_1fr] lg:grid-cols-[1fr_auto_1fr_190px] lg:items-center"
        }
        onSubmit={handleSubmit}
      >
        <label className="block">
          <span className="relative block">
            <span className={labelClass}>From</span>
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <MapPin className="h-5 w-5" />
            </span>
            <input
              autoFocus
              className={inputClass}
              onChange={(event) => setOrigin(event.target.value)}
              placeholder="Rome"
              required
              type="text"
              value={origin}
            />
          </span>
        </label>

        <div className="flex items-end justify-center md:pb-0 lg:pb-0">
          <button
            aria-label="Swap origin and destination"
            className="flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm transition hover:bg-blue-700 md:w-12"
            onClick={swapRoute}
            type="button"
          >
            <ArrowLeftRight className="h-5 w-5" />
          </button>
        </div>

        <label className="block">
          <span className="relative block">
            <span className={labelClass}>To</span>
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <MapPin className="h-5 w-5" />
            </span>
            <input
              className={inputClass}
              onChange={(event) => setDestination(event.target.value)}
              placeholder="Paris"
              required
              type="text"
              value={destination}
            />
          </span>
        </label>

        <label className="block md:col-span-3 lg:col-span-1">
          <span className="relative block">
            <span className={labelClass}>Depart</span>
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <CalendarDays className="h-5 w-5" />
            </span>
            <input
              className={inputClass}
              onChange={(event) => setDate(event.target.value)}
              required
              type="date"
              value={date}
            />
          </span>
        </label>

        <button
          className={`flex h-16 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-base font-black text-white shadow transition hover:opacity-95 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-300 ${
            compact ? "lg:col-span-1" : "md:col-span-3 lg:col-span-4"
          }`}
          disabled={isSearching}
          type="submit"
        >
          {isSearching ? (
            <>
              <Spinner />
              Searching
            </>
          ) : (
            <>
              <Search className="h-5 w-5" />
              Find optimal route
            </>
          )}
        </button>
      </form>
      {!compact ? (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-semibold text-gray-600">
          <span>No signup required • Instant results</span>
        </div>
      ) : null}
    </div>
  );
}
