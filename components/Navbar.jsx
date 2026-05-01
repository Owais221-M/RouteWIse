import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm ring-1 ring-gray-100">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-black tracking-normal text-gray-900 transition hover:opacity-80">
          RouteWise
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/how-it-works" className="text-sm font-semibold text-gray-600 transition hover:text-blue-600">
            How it works
          </Link>
          <Link href="/about" className="text-sm font-semibold text-gray-600 transition hover:text-blue-600">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
