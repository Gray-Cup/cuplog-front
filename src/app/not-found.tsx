import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1 flex flex-col items-center justify-center bg-paper px-6 py-24">
        <p
          className="font-sans font-bold text-xs text-ink uppercase tracking-label mb-6"
          style={{ opacity: 0.4 }}
        >
          404
        </p>
        <h1
          className="font-serif text-ink text-center"
          style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", lineHeight: 0.95 }}
        >
          Page not found.
        </h1>
        <p
          className="font-sans text-base text-ink mt-6 text-center"
          style={{ maxWidth: "380px", opacity: 0.6 }}
        >
          This page doesn't exist. Head back and keep scoring.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-sans font-semibold text-sm text-white bg-ink px-8 py-4 border border-ink"
            style={{ borderRadius: 0 }}
          >
            ← Back to Home
          </Link>
          <a
            href="https://app.cuplog.app/sign-up"
            className="inline-flex items-center gap-2 font-sans font-semibold text-sm text-ink bg-white px-8 py-4 border border-ink"
            style={{ borderRadius: 0 }}
          >
            Start Cupping →
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
