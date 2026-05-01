import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm ring-1 ring-gray-100 transition-colors duration-300 dark:bg-gray-950 dark:ring-gray-800">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-black tracking-normal text-gray-900 transition hover:opacity-80 dark:text-white">
          BuyTrip
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
