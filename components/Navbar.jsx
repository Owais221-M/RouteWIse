"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm ring-1 ring-gray-100 transition-colors duration-300 dark:bg-gray-950 dark:ring-gray-800">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        <Link href="/" className="flex items-center transition hover:opacity-80">
          {!mounted ? (
            <div className="h-10 w-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
          ) : (
            <Image
              src={resolvedTheme === "dark" ? "/images/logo-dark.png" : "/images/logo-light.png"}
              alt="BuyTrip Logo"
              width={180}
              height={48}
              className="h-13 w-auto md:h-15"
              priority
            />
          )}
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link href="/how-it-works" className="text-sm font-semibold text-gray-600 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
            How it works
          </Link>
          <Link href="/about" className="text-sm font-semibold text-gray-600 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
            About
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
