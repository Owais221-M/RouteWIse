import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white py-12 text-center transition-colors duration-300 dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-4xl px-4">
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
