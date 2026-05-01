import Link from "next/link";

export default function PaymentSuccessPage({ searchParams }) {
  const provider = searchParams.provider === "coinbase" ? "Coinbase Business" : "Stripe";

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <section className="w-full max-w-xl rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-blue-50">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-blue-600">Payment started</p>
        <h1 className="mt-3 text-3xl font-black text-gray-900">Thanks, your checkout was accepted</h1>
        <p className="mt-4 text-sm leading-6 text-gray-600">
          {provider} redirected you back to RouteWise. In production, confirm final payment status with provider
          webhooks before issuing tickets.
        </p>
        {searchParams.session_id ? (
          <p className="mt-4 rounded-xl bg-gray-50 p-3 text-xs font-semibold text-gray-600">
            Stripe session: {searchParams.session_id}
          </p>
        ) : null}
        <Link
          className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-black text-white transition hover:opacity-95 active:scale-95"
          href="/"
        >
          Search another route
        </Link>
      </section>
    </main>
  );
}
