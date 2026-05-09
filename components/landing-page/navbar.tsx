"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-12 py-5 transition-all duration-300 ${
        scrolled
          ? "bg-[#0d0f14]/80 backdrop-blur-lg border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      {/* Logo */}
      <Link
        href="/"
        className="font-serif-display text-2xl text-[var(--text)] tracking-tight"
      >
        Note<span className="text-[var(--amber)]">vo</span>
      </Link>

      {/* Nav links */}
      <ul className="hidden md:flex gap-9 list-none">
        {[
          { label: "Features", href: "#features" },
          { label: "How it works", href: "#how" },
          { label: "Reviews", href: "#testimonials" },
        ].map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-[var(--muted)] text-sm font-medium hover:text-[var(--text)] transition-colors duration-200"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      {/* CTA buttons */}
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="hidden sm:inline-flex border border-white/10 text-[var(--text)] text-sm px-5 py-2 rounded-lg hover:border-white/25 hover:text-white transition-all duration-200"
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className="bg-[var(--amber)] text-[#0d0f14] text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#f9bc55] hover:-translate-y-px transition-all duration-200"
        >
          Get started free
        </Link>
      </div>
    </nav>
  );
}
