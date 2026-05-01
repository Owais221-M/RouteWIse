export const metadata = {
  title: "Contact | BuyTrip",
  description: "Get in touch with the BuyTrip team."
};

export default function ContactPage() {
  return (
    <main className="min-h-[70vh] bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100 fade-in">
        <h1 className="mb-6 text-3xl font-black text-gray-900">Contact Us</h1>
        <p className="text-lg leading-relaxed text-gray-700">
          Have questions or feedback about BuyTrip? We'd love to hear from you.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-gray-700">
          Reach out to us at <a href="mailto:support@buytrip.eu" className="font-medium text-blue-600 hover:underline">support@buytrip.eu</a>.
        </p>
      </div>
    </main>
  );
}
