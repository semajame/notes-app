import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-[#E8E6DF] bg-[#FAFAF8] py-12">
      <div className="mx-auto max-w-5xl px-6">
        {/* CTA Block */}
        <div className="mb-12 flex flex-col items-center justify-between gap-6 rounded-3xl bg-[#1a1a1a] p-10 md:flex-row">
          <div>
            <h3 className="text-[24px] leading-tight font-bold text-white">
              Start taking better notes
              <br />
              today. It's free.
            </h3>
            <p className="mt-2 text-[14px] text-gray-400">
              No credit card required.
            </p>
          </div>
          <Link
            href="/login"
            className="flex flex-shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#1a1a1a] transition-colors hover:bg-[#f0ede4]"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.182 9.4c-.02 1.78.926 2.627 1.636 3.273.19.173.355.323.475.46-.494.99-1.64 2.867-3.092 2.867-.432 0-.73-.114-1.042-.233-.326-.124-.666-.253-1.195-.253-.552 0-.912.135-1.258.265-.3.116-.587.226-.993.226-1.566 0-3.164-2.1-3.164-5.023C3.549 7.65 5.08 5.5 6.98 5.5c.515 0 .929.172 1.29.323.303.127.567.237.855.237.268 0 .528-.109.824-.233.385-.163.822-.348 1.368-.348.535 0 1.06.152 1.487.46-.437.363-.622.888-.622 1.461zm-1.39-5.45C9.34 4.57 8.668 5.5 7.5 5.5c-.033-.466.115-.997.408-1.45.458-.7 1.227-1.25 1.836-1.3.065.494-.091.99-.372 1.35-.006.007-.008.014-.014.02z" />
            </svg>
            Start for free
          </Link>
        </div>

        {/* Footer links */}
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2 text-[15px] font-semibold text-[#1a1a1a]">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect width="20" height="20" rx="5" fill="#1a1a1a" />
              <rect x="4" y="5" width="8" height="1.5" rx="0.75" fill="white" />
              <rect
                x="4"
                y="9"
                width="12"
                height="1.5"
                rx="0.75"
                fill="white"
              />
              <rect
                x="4"
                y="13"
                width="6"
                height="1.5"
                rx="0.75"
                fill="white"
              />
            </svg>
            Notely
          </div>

          <div className="flex items-center gap-6 text-sm text-[#777]">
            <Link href="#" className="transition-colors hover:text-[#1a1a1a]">
              Privacy
            </Link>
            <Link href="#" className="transition-colors hover:text-[#1a1a1a]">
              Terms
            </Link>
            <Link href="#" className="transition-colors hover:text-[#1a1a1a]">
              Support
            </Link>
            <Link href="#" className="transition-colors hover:text-[#1a1a1a]">
              X (Twitter)
            </Link>
          </div>

          <p className="text-sm text-[#999]">
            © 2026 Notely. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
