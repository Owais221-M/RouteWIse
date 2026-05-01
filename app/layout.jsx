import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata = {
  title: "BuyTrip — Smarter European Travel",
  description: "A smarter way to compare and choose travel routes across Europe. Compare operators and booking platforms for trains, buses, and mixed routes."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="relative flex min-h-screen flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="fixed right-4 top-4 z-50">
            <ThemeToggle />
          </div>
          <main className="flex-1">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
