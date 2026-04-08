import React from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
}
