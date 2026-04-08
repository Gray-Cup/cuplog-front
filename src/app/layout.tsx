import React from "react";
import type { Metadata } from "next";
import { Instrument_Serif, Instrument_Sans } from "next/font/google";
import "@/styles/globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cuplog.app"),
  title: {
    default: "CupLog — Score Every Sip",
    template: "%s — CupLog",
  },
  description:
    "The cupping log built for people who care what's in their cup. Track flavour, score sessions, and build your palate with SCA-standard scoring.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "CupLog — Score Every Sip",
    description:
      "The cupping log built for people who care what's in their cup. Track flavour, score sessions, and build your palate.",
    type: "website",
    url: "https://cuplog.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "CupLog — Score Every Sip",
    description:
      "The cupping log built for people who care what's in their cup.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${instrumentSans.variable}`}
    >
      <body className="min-h-screen bg-paper font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
