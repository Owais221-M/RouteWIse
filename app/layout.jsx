import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata = {
  title: "BuyTrip — Smarter European Travel",
  description: "A smarter way to compare and choose travel routes across Europe. Compare operators and booking platforms for trains, buses, and mixed routes."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-white text-gray-900 transition-colors duration-300 dark:bg-gray-950 dark:text-gray-100">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
