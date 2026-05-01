"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import SearchBar from "@/components/SearchBar";

export default function HomePage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-gray-900">
      <section className="px-4 pb-16 pt-12 text-gray-900 dark:text-white">
        <div className="mx-auto w-full max-w-4xl text-center fade-in">
          <div className="mb-12 flex justify-center">
            {mounted ? (
              <Image
                src={resolvedTheme === "dark" ? "/images/logo-dark.png" : "/images/logo-light.png"}
                alt="BuyTrip Logo"
                width={240}
                height={64}
                className="h-16 w-auto md:h-20"
                priority
              />
            ) : (
              <div className="h-16 w-48 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
            )}
          </div>
          <div className="mx-auto mb-8 max-w-2xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
              Plan smarter journeys across Europe
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg font-medium leading-8 text-gray-600 dark:text-gray-400">
              A smarter way to compare and choose travel routes across Europe.
            </p>
            <p className="mx-auto mt-2 max-w-xl text-sm text-gray-400 dark:text-gray-500">
              Compare operators and booking platforms — and travel with clarity and confidence.
            </p>

            <div className="mt-8">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:flex-row">
        <div className="flex-1 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md dark:bg-gray-800 dark:ring-gray-700">
          <p className="text-base font-bold text-gray-900 dark:text-white">Refined recommendations</p>
          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">Balanced choices optimized for time and value.</p>
        </div>
        <div className="flex-1 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md dark:bg-gray-800 dark:ring-gray-700">
          <p className="text-base font-bold text-gray-900 dark:text-white">Calm, confident decisions</p>
          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">We present curated options so you can travel with clarity.</p>
        </div>
      </section>
    </main>
  );
}
