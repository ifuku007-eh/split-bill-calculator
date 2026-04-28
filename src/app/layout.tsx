"use client";

import "./globals.css";
import BackgroundFX from "@/components/BackgroundFX";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      setDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDark(true);
    }
  };

  return (
    <html lang="en">
      <body className="bg-white text-black dark:bg-gray-100 dark:bg-[#020617] dark:text-white transition-colors duration-300">
        {/* TOGGLE BUTTON GLOBAL */}
        <button
          onClick={toggleTheme}
          className="fixed top-4 right-4 z-50 px-3 py-2 rounded-lg bg-gray-200 dark:bg-[#1e293b]"
        >
          {dark ? "🌙 Dark" : "☀️ Light"}
        </button>

        <BackgroundFX />

        <main className="min-h-screen flex items-center justify-center px-4">
          <div className="w-full max-w-3xl">{children}</div>
        </main>
      </body>
    </html>
  );
}
