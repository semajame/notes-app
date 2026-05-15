"use client"

import { useState } from "react"
import Link from "next/link"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 border-b border-[#E8E6DF] bg-[#FAFAF8]/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-[15px] font-semibold text-[#1a1a1a]"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect width="20" height="20" rx="5" fill="#1a1a1a" />
            <rect x="4" y="5" width="8" height="1.5" rx="0.75" fill="white" />
            <rect x="4" y="9" width="12" height="1.5" rx="0.75" fill="white" />
            <rect x="4" y="13" width="6" height="1.5" rx="0.75" fill="white" />
          </svg>
          Notely
        </Link>

        {/* Center nav */}
        <div className="hidden items-center gap-6 text-sm font-medium text-[#555] md:flex">
          <Link
            href="#features"
            className="transition-colors hover:text-[#1a1a1a]"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="transition-colors hover:text-[#1a1a1a]"
          >
            How it Works
          </Link>
          <Link href="#" className="transition-colors hover:text-[#1a1a1a]">
            Pricing
          </Link>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-[#1a1a1a] transition-opacity hover:opacity-70 md:block"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-[#1a1a1a] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#333]"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  )
}
