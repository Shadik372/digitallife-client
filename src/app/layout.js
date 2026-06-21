import { Sora } from "next/font/google";
import { ThemeProvider } from "../context/ThemeContext";
import { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./globals.css";

// Configure heading font
const sora = Sora({ subsets: ["latin"] });

export const metadata = {
  title: "Digital Life Lessons",
  description: "Create, store, and share meaningful life lessons.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sora.className} min-h-screen flex flex-col bg-(--bg) text-(--text) transition-colors duration-300 antialiased`}>
        <ThemeProvider>
          <Navbar />

          <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {children}
          </main>

          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: 'bg-(--bg-secondary) text-(--text) border-2 border-(--border) rounded-none font-semibold',
              style: { background: 'var(--bg-secondary)', color: 'var(--text)' }
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
