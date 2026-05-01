"use client";
/* eslint-disable react/prop-types */

import { useRef, useState } from "react";
import { Bus, Clock3, MapPinned, TrainFront } from "lucide-react";
import BookingRedirect from "./BookingRedirect";

function ProviderRow({ provider, index, routeId, route }) {
  return (
    <div className={`flex items-center gap-4 px-4 py-3 ${index !== 0 ? "border-t border-gray-100" : ""}` }>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-baseline gap-2">
          <p className="text-sm font-semibold capitalize text-gray-900">{provider.provider}</p>
          {provider.provider_type ? (
            <span className="text-[10px] font-medium text-gray-400">{provider.provider_type}</span>
          ) : null}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-sm font-black text-gray-900">€{provider.price}</p>
          {index === 0 ? (
            <span className="rounded-full bg-blue-50 border border-blue-200 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-600">
              Best
            </span>
          ) : null}
        </div>
      </div>
      <div className="shrink-0">
        <BookingRedirect
          option={{ ...provider, route }}
          compact={true}
          routeId={routeId}
        />
      </div>
    </div>
  );
}
export default function ResultCard({ title, option, isRecommended, onViewDetails }) {
  const [copyStatus, setCopyStatus] = useState("");
  const clearStatusTimer = useRef(null);
  const TypeIcon = option.type === "bus" ? Bus : TrainFront;
  const savingsValue = Math.max(0, option.savings_vs_fastest ?? 0);
  const savingsComparison =
    option.time_difference_vs_fastest > 0
      ? `+${option.time_difference_vs_fastest}h vs fastest`
      : "Same time as fastest";

  function getSavingsText() {
    if ((option.savings_vs_fastest ?? 0) > 0) {
      return `€${option.savings_vs_fastest} more efficient than fastest option`;
    }

    if ((option.savings_vs_fastest ?? 0) === 0) {
      return "Matches fastest price";
    }

    return `Achieves similar travel for €${Math.abs(option.savings_vs_fastest ?? 0)} less`;
  }

  async function handleShare() {
    const shareText = `${option.route}\n€${option.price} • ${option.duration}h\n\nA more efficient route than standard options\n\nDiscovered via this travel platform`;

    try {
      await navigator.clipboard.writeText(shareText);
      setCopyStatus("Copied to clipboard");

      if (clearStatusTimer.current) {
        clearTimeout(clearStatusTimer.current);
      }

      clearStatusTimer.current = setTimeout(() => {
        setCopyStatus("");
      }, 2000);
    } catch {
      setCopyStatus("Copy failed");
    }
  }

  return (
    <article className={`flex h-full flex-col gap-3 rounded-2xl bg-white p-6 shadow-md transition duration-200 hover:scale-[1.02] fade-in ${isRecommended ? "ring-2 ring-blue-600 ring-offset-2" : "ring-1 ring-blue-50"}`}>
      <div className="flex items-start justify-between gap-4">
        <p className="rounded-full bg-blue-50 px-3 py-1 text-sm font-black text-blue-600">{title}</p>
        <div className="flex flex-wrap items-center gap-2 justify-end">
          {option.is_overnight ? (
            <p className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-indigo-700">
              Overnight journey
            </p>
          ) : null}
          <p className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-gray-600">
            <TypeIcon className="mr-1.5 h-3.5 w-3.5" />
            {option.type}
          </p>
        </div>
      </div>

      <div className="mt-1">
        <h2 className="text-lg font-black leading-7 tracking-normal text-gray-900">{option.route}</h2>
      </div>

      <dl className="grid gap-3 border-t border-gray-100 pt-5">
        <div className="space-y-1">
          <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Price</dt>
          <dd className="mt-1 text-5xl font-black tracking-normal text-gray-900">€{option.price}</dd>
          {option.confidence ? (
            <p className={`text-xs font-semibold ${option.confidence.includes("Low") ? "text-amber-600" : "text-green-600"}`}>
              {option.confidence}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-3 rounded-xl bg-gray-50 p-3">
          <div className="flex items-center justify-between">
            <dt className="inline-flex items-center text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
              <Clock3 className="mr-2 h-4 w-4" />
              Duration
            </dt>
            <dd className="text-base font-black text-gray-900">{option.duration}h</dd>
          </div>
          {option.departure_time && option.arrival_time ? (
            <div className="flex items-center justify-between border-t border-gray-200 pt-2">
              <dt className="text-xs font-bold uppercase tracking-[0.12em] text-gray-500">Times</dt>
              <dd className="text-sm font-black text-gray-900">{option.departure_time} → {option.arrival_time}</dd>
            </div>
          ) : null}
        </div>
        <div className="rounded-xl bg-blue-50 p-3">
          <dt className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">Efficiency vs fastest</dt>
          <dd className="mt-1 text-sm font-medium text-blue-600">{getSavingsText()}</dd>
          <p className="mt-1 text-xs font-semibold text-gray-600">{savingsComparison}</p>
        </div>
      </dl>

      <p className="text-sm leading-6 text-gray-600">
        {title.includes("Recommended")
          ? "Balanced for time and cost — selected as the most efficient overall route."
          : title.includes("Best value")
          ? "Most affordable option for this route, with a longer journey time."
          : title.includes("Fastest")
          ? "Shortest journey time available across all operators and booking platforms."
          : option.explanation}
      </p>
      {option.itinerary ? (
        <details className="group rounded-xl bg-gray-50 ring-1 ring-gray-100">
          <summary className="flex cursor-pointer items-center justify-between p-4 text-xs font-black uppercase tracking-[0.12em] text-blue-600">
            <span className="inline-flex items-center">
              <MapPinned className="mr-2 h-4 w-4" />
              Route Details
            </span>
            <span className="text-gray-400 group-open:hidden">Show</span>
            <span className="text-gray-400 hidden group-open:block">Hide</span>
          </summary>
          <div className="border-t border-gray-100 p-4">
            <p className="mb-3 text-xs leading-5 text-gray-600">{option.itinerary.summary}</p>
            <div className="space-y-3">
              {option.itinerary.legs.map((leg, index) => (
                leg.isTransfer ? (
                  <div key={index} className="flex items-center justify-center gap-2 py-1">
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-gray-400">{leg.duration} {leg.description}</p>
                  </div>
                ) : (
                  <div key={index} className="flex flex-col gap-1 rounded-lg bg-white p-3 ring-1 ring-gray-100">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-gray-900">{leg.from} → {leg.to}</p>
                      <p className="text-xs font-bold uppercase text-gray-500">{leg.transport}</p>
                    </div>
                    <p className="text-xs font-medium text-gray-600">{leg.departTime} → {leg.arriveTime} · {leg.duration}</p>
                  </div>
                )
              ))}
            </div>
          </div>
        </details>
      ) : null}
      <div className="mt-3 rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Book via</p>
          {option.price_variance ? (
            <p className="text-[10px] font-semibold text-amber-500 uppercase tracking-wide">Prices vary</p>
          ) : null}
        </div>
        {option.providers?.length ? (
          option.providers.map((provider, index) => (
            <ProviderRow
              key={index}
              provider={provider}
              index={index}
              routeId={option.route_id}
              route={option.route}
            />
          ))
        ) : (
          <p className="px-4 py-3 text-sm text-gray-400">No options available. Try a different route.</p>
        )}
      </div>
      <button
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-semibold text-gray-500 transition hover:border-gray-300 hover:text-gray-700"
        onClick={handleShare}
        type="button"
      >
        Share this route
      </button>
      {copyStatus ? <p className="text-center text-xs font-medium text-gray-400">{copyStatus}</p> : null}
    </article>
  );
}
