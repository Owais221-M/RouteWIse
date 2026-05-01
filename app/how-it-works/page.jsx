export const metadata = {
  title: "How It Works | BuyTrip",
  description: "Discover how BuyTrip finds the best travel routes for you."
};

export default function HowItWorksPage() {
  return (
    <main className="min-h-[70vh] bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100 fade-in">
        <h1 className="mb-6 text-3xl font-black text-gray-900">How It Works</h1>
        <p className="text-lg leading-relaxed text-gray-700">
          We analyze routes using price, duration, and transfers to recommend the best journey.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-gray-700">
          Instead of showing dozens of options, we present the most relevant choices.
        </p>
      </div>
    </main>
  );
}
