import Link from "next/link";
import SearchBar from "@/components/SearchBar";

export default function BusesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-blue-600 px-4 py-8 text-white">
        <div className="mx-auto w-full max-w-3xl">
          <Link className="text-xl font-black" href="/">BuyTrip</Link>
          <div className="mx-auto mt-8">
            <h1 className="max-w-3xl text-4xl font-black sm:text-5xl">Coach and regional routes across Europe</h1>
            <p className="mt-4 max-w-2xl text-lg font-medium text-blue-100">
              Discover thoughtfully curated coach options and how they compare with rail alternatives.
            </p>
            <div className="mt-8">
              <SearchBar initialDestination="Paris" initialOrigin="Rome" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-3xl gap-4 px-4 py-8 md:grid-cols-3">
        {["Direct city links", "Comfortable overnight", "Balanced value"].map((item) => (
          <div className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-blue-50" key={item}>
            <p className="font-black text-gray-900">{item}</p>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Understand when a longer route still makes sense for your schedule.
            </p>
          </div>
        ))}
      </section>
    </main>
  );
}
