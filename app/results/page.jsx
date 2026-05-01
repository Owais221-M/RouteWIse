"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { ArrowLeft, MapPinned, SlidersHorizontal, X, Clock } from "lucide-react";
import BookingRedirect from "@/components/BookingRedirect";
import ResultCard from "@/components/ResultCard";
import SearchBar from "@/components/SearchBar";

function LoadingPanel() {
  return (
    <div className="space-y-4">
      <p className="text-sm font-black uppercase tracking-[0.16em] text-blue-600">Finding smart routes...</p>
      <div className="grid gap-5 md:grid-cols-3">
        {[
          "route-skeleton-1",
          "route-skeleton-2",
          "route-skeleton-3"
        ].map((key) => (
          <article className="flex h-full flex-col gap-4 rounded-2xl bg-white p-6 shadow-md ring-1 ring-blue-50" key={key}>
            <div className="flex items-start justify-between gap-4">
              <div className="h-7 w-28 rounded-full bg-gray-100 animate-pulse" />
              <div className="h-7 w-20 rounded-full bg-gray-100 animate-pulse" />
            </div>
            <div className="h-6 w-3/4 rounded-lg bg-gray-100 animate-pulse" />
            <div className="space-y-3 border-t border-gray-100 pt-5">
              <div className="h-16 rounded-xl bg-gray-100 animate-pulse" />
              <div className="h-12 rounded-xl bg-gray-100 animate-pulse" />
              <div className="h-14 rounded-xl bg-gray-100 animate-pulse" />
            </div>
            <div className="h-6 w-full rounded-lg bg-gray-100 animate-pulse" />
            <div className="mt-auto flex flex-col gap-3 sm:flex-row">
              <div className="h-12 w-full rounded-xl bg-gray-100 animate-pulse" />
              <div className="h-12 w-full rounded-xl bg-gray-100 animate-pulse" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function useRouteSearch(origin, destination, date, canSearch, initialTypes = ["train", "bus", "mixed"]) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeSort, setActiveSort] = useState("Recommended");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState(initialTypes);
  const [selectedRoute, setSelectedRoute] = useState(null);

  useEffect(() => {
    if (!canSearch) {
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadResults() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ origin, destination, date }),
          signal: controller.signal
        });

        if (!response.ok) {
          let message = "Unable to fetch routes. Please try again.";
          try {
            const errBody = await response.json();
            if (errBody?.error) message = errBody.error;
          } catch {/* ignore parse errors */}
          throw new Error(message);
        }

        const payload = await response.json();
        setData(payload);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || "Unable to fetch routes. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadResults();

    return () => controller.abort();
  }, [canSearch, date, destination, origin]);

  function toggleRouteType(type) {
    setSelectedTypes((current) => {
      if (current.includes(type)) {
        const next = current.filter((item) => item !== type);
        return next.length ? next : current;
      }

      return [...current, type];
    });
  }

  return {
    activeSort,
    data,
    error,
    isLoading,
    selectedRoute,
    selectedTypes,
    setActiveSort,
    setSelectedRoute,
    setShowFilters,
    showFilters,
    toggleRouteType
  };
}

function getResultCards(data, activeSort, selectedTypes) {
  if (!data || !data.routes) {
    return [];
  }

  const filtered = data.routes.filter((option) => selectedTypes.includes(option.type));
  if (filtered.length === 0) return [];

  const isRecommended = (r) => r.route === data.recommended.route && r.price === data.recommended.price && r.duration === data.recommended.duration;
  const recommendedRoute = filtered.find(isRecommended) || filtered[0];
  const others = filtered.filter(r => r !== recommendedRoute);

  const sorters = {
    "Lowest cost": (a, b) => a.price - b.price,
    Fastest: (a, b) => a.duration - b.duration,
    Recommended: (a, b) => (a.price + a.duration * 1.5 + a.transfers * 15) - (b.price + b.duration * 1.5 + b.transfers * 15)
  };

  const sorter = sorters[activeSort] ?? sorters["Recommended"];
  const sortedOthers = others.sort(sorter);

  const finalSorted = [recommendedRoute, ...sortedOthers];

  return finalSorted.map((option, index) => {
    let title = "Standard option";
    if (index === 0) {
      title = "Recommended";
    } else if (index === 1 && activeSort === "Lowest cost") {
      title = "Best value";
    } else if (index === 1 && activeSort === "Fastest") {
      title = "Fastest";
    }
    return { title, option, isRecommended: index === 0 };
  });
}

function getInsight(data) {
  // Premium insight line (static, calm guidance)
  return "Combining transport types can significantly reduce cost while maintaining reasonable travel time.";
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  const origin = searchParams?.get("origin") ?? "";
  const destination = searchParams?.get("destination") ?? "";
  const date = searchParams?.get("date") ?? "";
  const modeParam = searchParams?.get("mode") ?? "";

  const canSearch = useMemo(
    () => Boolean(origin.trim() && destination.trim() && date.trim()),
    [origin, destination, date]
  );

  // Sync the selectedTypes filter with the mode param from the URL
  const modeToTypes = { train: ["train"], bus: ["bus"], mixed: ["mixed"] };
  const initialTypes = modeToTypes[modeParam] ?? ["train", "bus", "mixed"];

  const {
    activeSort,
    data,
    error,
    isLoading,
    selectedRoute,
    selectedTypes,
    setActiveSort,
    setSelectedRoute,
    setShowFilters,
    showFilters,
    toggleRouteType
  } = useRouteSearch(origin, destination, date, canSearch, initialTypes);

  const resultCards = useMemo(
    () => getResultCards(data, activeSort, selectedTypes),
    [activeSort, data, selectedTypes]
  );

  const insight = useMemo(() => getInsight(data), [data]);

  let resultsBlock = null;

  if (canSearch === false) {
    resultsBlock = (
      <div className="rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-blue-50">
        <p className="font-semibold text-gray-900">Missing search details.</p>
        <p className="mt-2 text-sm text-gray-600">Start again with an origin, destination, and date.</p>
      </div>
    );
  } else if (isLoading) {
    resultsBlock = <LoadingPanel />;
  } else if (error) {
    resultsBlock = (
      <div className="rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-blue-50">
        <p className="font-semibold text-red-700">{error}</p>
      </div>
    );
  } else if (data) {
    resultsBlock = resultCards.length ? (
      <div className="grid gap-5 md:grid-cols-3">
        {resultCards.map((card) => (
          <ResultCard
            key={`${card.title}-${card.option.route}`}
            onViewDetails={(option, title) => setSelectedRoute({ option, title })}
            option={card.option}
            title={card.title}
            isRecommended={card.isRecommended}
          />
        ))}
      </div>
    ) : (
      <div className="rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-blue-50">
        <p className="font-semibold text-gray-900">No routes found. Try adjusting your dates or route.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-gray-950">
      <div className="sticky top-0 z-10 bg-gray-50/80 px-4 py-4 shadow-sm backdrop-blur-md transition-colors duration-300 dark:bg-gray-950/80 dark:ring-1 dark:ring-gray-800">
        <section className="mx-auto w-full max-w-4xl">
          <div className="mb-3 flex items-center justify-between">
            <Link href="/" className="inline-flex items-center text-sm font-bold text-gray-900 dark:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Search
            </Link>
            <div className="flex h-6 items-center">
              {mounted ? (
                <Image
                  src={resolvedTheme === "dark" ? "/images/logo-dark.png" : "/images/logo-light.png"}
                  alt="BuyTrip Logo"
                  width={80}
                  height={20}
                  className="h-5 w-auto"
                />
              ) : (
                <div className="h-5 w-20 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
              )}
            </div>
          </div>

          <SearchBar compact initialDate={date} initialDestination={destination} initialOrigin={origin} />
        </section>
      </div>

      <section className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-10">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">Search results</p>
            <h1 className="mt-2 text-3xl font-black tracking-normal text-gray-900 sm:text-4xl dark:text-white">
              {origin || "Origin"} to {destination || "Destination"}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{date || "Choose a date to compare routes"}</p>
          </div>

          <button
            className="inline-flex h-11 items-center justify-center rounded-xl border border-blue-100 bg-white px-4 text-sm font-black text-gray-800 shadow-sm transition hover:opacity-95 hover:text-blue-600 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300 dark:hover:text-blue-400"
            onClick={() => setShowFilters((current) => !current)}
            type="button"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </button>
        </div>

        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {[{ key: "Recommended", label: "Recommended" }, { key: "Lowest cost", label: "Lowest cost" }, { key: "Fastest", label: "Fastest" }].map((item) => (
            <button
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-black transition ${
                activeSort === item.key
                  ? "bg-blue-600 text-white shadow-sm dark:bg-blue-500"
                  : "bg-white text-gray-700 ring-1 ring-blue-50 hover:text-blue-600 dark:bg-gray-900 dark:text-gray-400 dark:ring-gray-800 dark:hover:text-blue-400"
              }`}
              key={item.key}
              onClick={() => setActiveSort(item.key)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>

        {showFilters ? (
          <div className="mb-5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-blue-50 dark:bg-gray-900 dark:ring-gray-800">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-black text-gray-900 dark:text-white">Transport type</p>
              <div className="flex flex-wrap gap-2">
                {["train", "bus", "mixed"].map((type) => (
                  <button
                    className={`rounded-full px-4 py-2 text-sm font-black capitalize transition ${
                      selectedTypes.includes(type)
                        ? "bg-blue-600 text-white dark:bg-blue-500"
                        : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                    }`}
                    key={type}
                    onClick={() => toggleRouteType(type)}
                    type="button"
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {data ? (
          <div className="mb-6 rounded-2xl bg-white p-6 shadow-md dark:bg-gray-900 dark:shadow-none dark:ring-1 dark:ring-gray-800">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-blue-600 dark:text-blue-400">Recommended journey based on efficiency</p>
            <div className="mt-2 flex items-baseline gap-4">
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">€{data.recommended.price}</p>
              <p className="text-sm font-bold text-gray-900 dark:text-gray-300">{data.recommended.duration}h</p>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Balances time, cost, and convenience</p>
            <p className="mt-3 text-sm leading-6 text-gray-500 border-t border-gray-100 pt-3 dark:text-gray-400 dark:border-gray-800">This route is selected because it offers the best balance of time and cost compared to available alternatives.</p>
          </div>
        ) : null}

        {resultsBlock}

        {insight ? (
          <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-blue-50 dark:bg-gray-900 dark:ring-gray-800">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">Insight</p>
            <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">{insight}</p>
          </div>
        ) : null}

        <p className="mt-8 text-center text-xs font-medium text-gray-400 dark:text-gray-500">Schedules and prices may vary at booking.</p>
        {data ? (
          <div className="mt-4 rounded-2xl border border-blue-50 bg-blue-50 px-4 py-3 text-center dark:bg-blue-900/20 dark:border-blue-900/30">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              {data.recommended.transfers > 0
                ? "💡 Routes with transfers are often cheaper — compare all options above."
                : "💡 Booking earlier can significantly reduce prices. Lock in your rate today."}
            </p>
          </div>
        ) : null}
      </section>

      {selectedRoute ? (
        <div className="fixed inset-0 z-20 flex items-end bg-gray-950/50 p-4 sm:items-center sm:justify-center dark:bg-gray-950/80">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 dark:ring-1 dark:ring-gray-800">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black text-blue-600 dark:text-blue-400">{selectedRoute.title}</p>
                <h2 className="mt-2 text-2xl font-black text-gray-900 dark:text-white">{selectedRoute.option.route}</h2>
              </div>
              <button
                aria-label="Close route details"
                className="rounded-full bg-gray-100 p-2 text-gray-600 transition hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={() => setSelectedRoute(null)}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <dl className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
                <dt className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Price</dt>
                <dd className="mt-1 text-xl font-black text-[#007a7a] dark:text-[#00a3a3]">€{selectedRoute.option.price}</dd>
              </div>
              <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
                <dt className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Duration</dt>
                <dd className="mt-1 text-xl font-black text-gray-900 dark:text-white">{selectedRoute.option.duration}h</dd>
              </div>
              <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
                <dt className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Transfers</dt>
                <dd className="mt-1 text-xl font-black text-gray-900 dark:text-white">{selectedRoute.option.transfers}</dd>
              </div>
            </dl>

            <div className="mt-4 flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Departure</span>
                <span className="text-lg font-black text-gray-900 dark:text-white">{selectedRoute.option.departure_time || "--:--"}</span>
              </div>
              <Clock className="h-5 w-5 text-gray-300 dark:text-gray-600" />
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Arrival</span>
                <span className="text-lg font-black text-gray-900 dark:text-white">{selectedRoute.option.arrival_time || "--:--"}</span>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-blue-50 p-4 dark:bg-blue-900/20">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-blue-700 dark:text-blue-400">Efficiency vs fastest</p>
              <p className="mt-1 text-sm font-medium text-blue-600 dark:text-blue-300">
                {selectedRoute.option.savings_vs_fastest > 0
                  ? `€${selectedRoute.option.savings_vs_fastest} more efficient than fastest option`
                  : `Achieves similar travel for €${Math.max(0, Math.abs(selectedRoute.option.savings_vs_fastest ?? 0))} less`}
              </p>
              <p className="mt-1 text-xs font-semibold text-gray-600 dark:text-gray-400">
                {selectedRoute.option.time_difference_vs_fastest > 0
                  ? `+${selectedRoute.option.time_difference_vs_fastest}h vs fastest`
                  : "Same time as fastest"}
              </p>
            </div>

            <p className="mt-5 text-sm leading-6 text-gray-600 dark:text-gray-400">{selectedRoute.option.explanation}</p>
            {selectedRoute.option.itinerary ? (
              <div className="mt-5 rounded-2xl bg-[#f4faf8] p-4 dark:bg-gray-800/50">
                <p className="inline-flex items-center text-sm font-black text-blue-600 dark:text-blue-400">
                  <MapPinned className="mr-2 h-4 w-4" />
                  Checkout itinerary
                </p>
                <div className="mt-4 space-y-3">
                    {selectedRoute.option.itinerary.legs.map((leg, index) => (
                      <div className="rounded-xl bg-white p-3 ring-1 ring-blue-50 dark:bg-gray-900 dark:ring-gray-800" key={`${leg.from}-${leg.to}-${index}`}>
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-black text-gray-900 dark:text-white">
                          {leg.from} → {leg.to}
                        </p>
                        <p className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">{leg.transport}</p>
                      </div>
                      <p className="mt-1 text-sm font-semibold text-gray-600 dark:text-gray-400">
                        {leg.departTime} → {leg.arriveTime} · {leg.duration}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            <BookingRedirect option={selectedRoute.option} />
          </div>
        </div>
      ) : null}
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<LoadingPanel />}>
      <ResultsContent />
    </Suspense>
  );
}
