import Link from "next/link";

export default function PaymentCancelPage({ searchParams }) {
  const provider = searchParams.provider === "coinbase" ? "crypto" : "card";

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <section className="w-full max-w-xl rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-blue-50">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-blue-600">Checkout cancelled</p>
        <h1 className="mt-3 text-3xl font-black text-gray-900">No payment was completed</h1>
        <p className="mt-4 text-sm leading-6 text-gray-600">
          Your {provider} checkout was cancelled or failed. You can return to the route search and try again.
        </p>
        <Link
          className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-black text-white transition hover:opacity-95 active:scale-95"
          href="/"
        >
          Back to search
        </Link>
      </section>
    </main>
  );
}
