// app/(site)/layout.tsx
import React from "react";
import Header from "@/components/header/Header";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      <footer className="bg-gray-800 p-4 text-center text-sm text-white">
        <p>© 2025 SMB Suvanna Dipa. All rights reserved.</p>
      </footer>
    </div>
  );
}
