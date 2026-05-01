import Link from "next/link";
import SearchBar from "@/components/SearchBar";

const deals = [
  { route: "Rome to Paris", price: "from €60", note: "Best mock fare today" },
  { route: "Rome to Milan", price: "from €38", note: "Fast train-friendly route" },
  { route: "Paris to Zurich", price: "from €52", note: "Mixed route candidate" }
];

export default function DealsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-blue-600 px-4 py-8 text-white">
        <div className="mx-auto w-full max-w-3xl">
          <Link className="text-xl font-black" href="/">RouteWise</Link>
          <div className="mx-auto mt-8">
            <h1 className="max-w-3xl text-4xl font-black sm:text-5xl">Example route ideas</h1>
            <p className="mt-4 max-w-2xl text-lg font-medium text-blue-100">
              Browse curated route examples, then run a full comparison to refine your choice.
            </p>
            <div className="mt-8">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-3xl gap-4 px-4 py-8 md:grid-cols-3">
        {deals.map((deal) => (
          <Link
            className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-blue-50 transition hover:-translate-y-1 hover:shadow-xl"
            href={`/results?origin=${encodeURIComponent(deal.route.split(" to ")[0])}&destination=${encodeURIComponent(
              deal.route.split(" to ")[1]
            )}&date=2026-05-15&mode=mixed`}
            key={deal.route}
          >
            <p className="text-sm font-black text-gray-900">{deal.price}</p>
            <h2 className="mt-2 text-xl font-black text-gray-900">{deal.route}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">{deal.note}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
