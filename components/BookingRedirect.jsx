"use client";

import { ExternalLink } from "lucide-react";
import { useState } from "react";

export default function BookingRedirect({ option, compact, routeId }) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleBookingClick(e) {
    e.preventDefault();
    setIsRedirecting(true);
    setErrorMsg("");

    try {
      // Background analytics log
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "provider_click",
          data: { provider: option.provider, route_id: routeId ?? option.route, price: option.price }
        })
      }).catch(() => {});

      // Real-time validation
      const res = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ routeId: option.route, provider: option.provider })
      });
      
      const validationData = await res.json();
      
      if (!validationData.isValid) {
        setErrorMsg("Price or availability may have changed. Please confirm on provider site.");
        await new Promise(r => setTimeout(r, 1500));
      }

      if (option.booking_url) {
        window.open(option.booking_url, "_blank", "noopener,noreferrer");
      }
      
    } catch (err) {
      setErrorMsg("Price or availability may have changed. Please confirm on provider site.");
      await new Promise(r => setTimeout(r, 1500));
      if (option.booking_url) {
        window.open(option.booking_url, "_blank", "noopener,noreferrer");
      }
    } finally {
      // Reset state after a short delay
      setTimeout(() => setIsRedirecting(false), 1000);
    }
  }

  return (
    <div className={compact ? "flex flex-col items-end gap-1" : "mt-6 space-y-3"}>
      <button
        onClick={handleBookingClick}
        disabled={isRedirecting}
        type="button"
        className={`flex ${compact ? "h-9 text-xs px-3" : "h-12 px-5 text-sm"} w-full items-center justify-center rounded-xl bg-blue-600 font-black text-white transition hover:opacity-95 active:scale-95 ${isRedirecting ? "pointer-events-none opacity-70" : ""}`}
      >
        <ExternalLink className={`${compact ? "mr-1 h-3 w-3" : "mr-2 h-4 w-4"}`} />
        {isRedirecting
          ? (compact ? "..." : "Checking...")
          : (compact ? "↗ Book" : `↗ View on ${option.provider ? option.provider.charAt(0).toUpperCase() + option.provider.slice(1) : "Provider"}`)}
      </button>
      {errorMsg ? (
        <p className={compact ? "text-[10px] text-amber-500 font-medium text-right" : "text-center text-sm font-semibold text-amber-600"}>
          {compact ? "⚠️ Price may have changed" : errorMsg}
        </p>
      ) : null}
      {!compact && (
        <p className="text-center text-xs font-medium text-gray-500">
          Redirects to official provider
        </p>
      )}
    </div>
  );
}
