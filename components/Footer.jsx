"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function Footer() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer className="border-t border-gray-100 bg-white py-12 text-center transition-colors duration-300 dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-6 flex justify-center">
          {mounted ? (
            <Image
              src={resolvedTheme === "dark" ? "/images/logo-dark.png" : "/images/logo-light.png"}
              alt="BuyTrip Logo"
              width={200}
              height={56}
              className="h-14 w-auto md:h-16 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
            />
          ) : (
            <div className="h-6 w-24 bg-gray-100 dark:bg-gray-800 animate-pulse rounded opacity-50" />
          )}
        </div>
        <nav className="mb-6 flex items-center justify-center gap-6">
          <Link href="/about" className="text-sm font-medium text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            Contact
          </Link>
        </nav>
        <p className="text-sm text-gray-400 dark:text-gray-500">A smarter way to compare and choose travel routes across Europe.</p>
      </div>
    </footer>
  );
}
