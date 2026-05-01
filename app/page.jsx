import SearchBar from "@/components/SearchBar";

export default function HomePage() {
  return (
    <main className="bg-gray-50">
      <section className="px-4 pb-16 pt-16 text-gray-900">
        <div className="mx-auto w-full max-w-4xl text-center fade-in">
          <div className="mx-auto mb-8 max-w-2xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              Plan smarter journeys across Europe
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg font-medium leading-8 text-gray-600">
              A smarter way to compare and choose travel routes across Europe.
            </p>
            <p className="mx-auto mt-2 max-w-xl text-sm text-gray-400">
              Compare operators and booking platforms — and travel with clarity and confidence.
            </p>

            <div className="mt-8">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:flex-row">
        <div className="flex-1 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md">
          <p className="text-base font-bold text-gray-900">Refined recommendations</p>
          <p className="mt-2 text-sm leading-6 text-gray-600">Balanced choices optimized for time and value.</p>
        </div>
        <div className="flex-1 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md">
          <p className="text-base font-bold text-gray-900">Calm, confident decisions</p>
          <p className="mt-2 text-sm leading-6 text-gray-600">We present curated options so you can travel with clarity.</p>
        </div>
      </section>
    </main>
  );
}
