export const metadata = {
  title: "About | BuyTrip",
  description: "Learn more about BuyTrip, your travel decision platform."
};

export default function AboutPage() {
  return (
    <main className="min-h-[70vh] bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100 fade-in">
        <h1 className="mb-6 text-3xl font-black text-gray-900">About BuyTrip</h1>
        <p className="text-lg leading-relaxed text-gray-700">
          BuyTrip is a travel decision platform designed to simplify travel across Europe.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-gray-700">
          It identifies the most efficient routes based on time, cost, and convenience.
        </p>
      </div>
    </main>
  );
}
