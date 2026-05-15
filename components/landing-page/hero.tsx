import Link from "next/link"

// Playful SVG mascot characters — inspired by Family wallet's illustrated characters
function MascotLeft() {
  return (
    <svg
      width="320"
      height="320"
      viewBox="0 0 320 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[320px]"
    >
      {/* Floating decorative elements */}
      {/* Gold coin top-left */}
      <circle cx="38" cy="60" r="18" fill="#F5C842" />
      <circle cx="38" cy="60" r="13" fill="#E8B830" />
      <text
        x="38"
        y="65"
        textAnchor="middle"
        fontSize="11"
        fill="#C49A10"
        fontWeight="700"
      >
        $
      </text>

      {/* Green flower */}
      <circle cx="82" cy="38" r="9" fill="#4CAF72" />
      <circle cx="70" cy="45" r="9" fill="#4CAF72" />
      <circle cx="94" cy="45" r="9" fill="#4CAF72" />
      <circle cx="82" cy="55" r="9" fill="#4CAF72" />
      <circle cx="82" cy="46" r="7" fill="#2E8B50" />

      {/* Blue pencil */}
      <rect
        x="260"
        y="30"
        width="10"
        height="40"
        rx="3"
        fill="#5B9FE8"
        transform="rotate(20 260 30)"
      />
      <polygon
        points="258,68 268,68 263,80"
        fill="#FFD700"
        transform="rotate(20 263 68)"
      />

      {/* Red heart */}
      <path
        d="M240 90 C240 85 233 80 228 85 C223 80 216 85 216 90 C216 100 228 110 228 110 C228 110 240 100 240 90Z"
        fill="#FF6B6B"
      />

      {/* Star sparkles */}
      <path
        d="M200 50 L202 45 L204 50 L209 52 L204 54 L202 59 L200 54 L195 52Z"
        fill="#FFD700"
      />
      <path
        d="M150 30 L151 27 L152 30 L155 31 L152 32 L151 35 L150 32 L147 31Z"
        fill="#FFD700"
      />

      {/* Main mascot — a cute notebook character */}
      {/* Body (rounded notebook) */}
      <rect x="95" y="100" width="130" height="150" rx="20" fill="#5B9FE8" />
      {/* Spiral binding */}
      <rect x="85" y="115" width="18" height="120" rx="9" fill="#4A8FD8" />
      {/* Page lines on notebook */}
      <rect
        x="115"
        y="130"
        width="80"
        height="6"
        rx="3"
        fill="white"
        opacity="0.6"
      />
      <rect
        x="115"
        y="148"
        width="65"
        height="6"
        rx="3"
        fill="white"
        opacity="0.6"
      />
      <rect
        x="115"
        y="166"
        width="72"
        height="6"
        rx="3"
        fill="white"
        opacity="0.6"
      />
      <rect
        x="115"
        y="184"
        width="55"
        height="6"
        rx="3"
        fill="white"
        opacity="0.6"
      />
      {/* Eyes */}
      <circle cx="140" cy="215" r="8" fill="#1a1a1a" />
      <circle cx="180" cy="215" r="8" fill="#1a1a1a" />
      <circle cx="143" cy="212" r="3" fill="white" />
      <circle cx="183" cy="212" r="3" fill="white" />
      {/* Smile */}
      <path
        d="M150 228 Q160 236 172 228"
        stroke="#1a1a1a"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Little arms */}
      <rect
        x="66"
        y="185"
        width="30"
        height="12"
        rx="6"
        fill="#4A8FE8"
        transform="rotate(-15 66 185)"
      />
      <rect
        x="222"
        y="180"
        width="30"
        height="12"
        rx="6"
        fill="#4A8FE8"
        transform="rotate(15 222 180)"
      />
      {/* Little feet */}
      <ellipse cx="130" cy="258" rx="15" ry="8" fill="#3A7FD5" />
      <ellipse cx="190" cy="258" rx="15" ry="8" fill="#3A7FD5" />
      {/* Shoes */}
      <ellipse cx="130" cy="265" rx="16" ry="9" fill="#FFD166" />
      <ellipse cx="190" cy="265" rx="16" ry="9" fill="#FFD166" />

      {/* Floating elements around mascot */}
      {/* Blue cloud */}
      <ellipse cx="50" cy="180" rx="22" ry="14" fill="#A8CCEE" />
      <ellipse cx="38" cy="175" rx="16" ry="12" fill="#A8CCEE" />
      <ellipse cx="62" cy="174" rx="16" ry="12" fill="#A8CCEE" />

      {/* Small paper note */}
      <rect
        x="240"
        y="150"
        width="50"
        height="60"
        rx="4"
        fill="#FFFDE7"
        stroke="#E8E0C0"
        strokeWidth="1"
      />
      <rect x="248" y="162" width="34" height="3" rx="1.5" fill="#D4C870" />
      <rect x="248" y="172" width="28" height="3" rx="1.5" fill="#D4C870" />
      <rect x="248" y="182" width="32" height="3" rx="1.5" fill="#D4C870" />

      {/* Gear */}
      <circle cx="270" cy="80" r="14" fill="#D0CBBD" />
      <circle cx="270" cy="80" r="8" fill="#FAFAF8" />

      {/* Ethereum-like diamond */}
      <polygon
        points="170,270 180,280 190,270 180,260"
        fill="#627EEA"
        opacity="0.7"
      />

      {/* Orange dot accent */}
      <circle cx="260" cy="230" r="8" fill="#FF8C42" />
      <circle cx="50" cy="130" r="6" fill="#FF6B6B" />
    </svg>
  )
}

function MascotRight() {
  return (
    <svg
      width="300"
      height="300"
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[300px]"
    >
      {/* Gold coin */}
      <circle cx="250" cy="55" r="18" fill="#F5C842" />
      <circle cx="250" cy="55" r="13" fill="#E8B830" />

      {/* Red flower cloud mascot */}
      <circle cx="220" cy="80" r="22" fill="#FF7B7B" />
      <circle cx="200" cy="68" r="20" fill="#FF7B7B" />
      <circle cx="240" cy="65" r="20" fill="#FF7B7B" />
      <circle cx="210" cy="55" r="18" fill="#FF7B7B" />
      <circle cx="232" cy="52" r="18" fill="#FF7B7B" />
      {/* Cute face on red cloud */}
      <circle cx="210" cy="73" r="5" fill="#1a1a1a" />
      <circle cx="228" cy="73" r="5" fill="#1a1a1a" />
      <path
        d="M212 82 Q220 88 228 82"
        stroke="#1a1a1a"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Little legs */}
      <rect x="205" y="99" width="8" height="20" rx="4" fill="#FF6060" />
      <rect x="220" y="99" width="8" height="20" rx="4" fill="#FF6060" />

      {/* Green oval mascot */}
      <ellipse cx="80" cy="140" rx="38" ry="28" fill="#4CAF72" />
      {/* Eyes */}
      <circle cx="70" cy="138" r="5" fill="#1a1a1a" />
      <circle cx="90" cy="138" r="5" fill="#1a1a1a" />
      {/* Happy smile */}
      <path
        d="M68 148 Q80 156 92 148"
        stroke="#1a1a1a"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Little legs */}
      <rect x="65" y="167" width="8" height="18" rx="4" fill="#3A8F58" />
      <rect x="82" y="167" width="8" height="18" rx="4" fill="#3A8F58" />

      {/* Orange triangle mascot */}
      <polygon points="175,210 215,210 195,170" fill="#FF9F43" />
      {/* Face */}
      <circle cx="188" cy="200" r="4" fill="#1a1a1a" />
      <circle cx="202" cy="200" r="4" fill="#1a1a1a" />
      <path
        d="M187 207 Q195 213 203 207"
        stroke="#1a1a1a"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Legs */}
      <rect x="183" y="208" width="7" height="18" rx="3.5" fill="#E8902E" />
      <rect x="200" y="208" width="7" height="18" rx="3.5" fill="#E8902E" />

      {/* Gold padlock */}
      <rect x="128" y="95" width="32" height="28" rx="5" fill="#F5C842" />
      <path
        d="M134 95 C134 85 158 85 158 95"
        stroke="#D4A820"
        strokeWidth="5"
        fill="none"
      />
      <circle cx="144" cy="110" r="5" fill="#D4A820" />

      {/* Blue magnifier */}
      <circle
        cx="160"
        cy="180"
        r="18"
        fill="none"
        stroke="#5B9FE8"
        strokeWidth="4"
      />
      <line
        x1="173"
        y1="193"
        x2="185"
        y2="205"
        stroke="#5B9FE8"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Checkmark badge */}
      <circle cx="255" cy="145" r="18" fill="#4CAF72" />
      <path
        d="M245 145 L252 153 L266 137"
        stroke="white"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Chat bubble */}
      <rect x="30" y="70" width="45" height="32" rx="8" fill="#A8CCEE" />
      <circle cx="42" cy="86" r="3" fill="#5B9FE8" />
      <circle cx="52" cy="86" r="3" fill="#5B9FE8" />
      <circle cx="62" cy="86" r="3" fill="#5B9FE8" />
      <polygon points="40,102 50,102 40,112" fill="#A8CCEE" />

      {/* Star sparkles */}
      <path
        d="M120 55 L122 50 L124 55 L129 57 L124 59 L122 64 L120 59 L115 57Z"
        fill="#FFD700"
      />
      <path
        d="M48 180 L49 177 L50 180 L53 181 L50 182 L49 185 L48 182 L45 181Z"
        fill="#FFD700"
      />
      <path
        d="M270 190 L271 187 L272 190 L275 191 L272 192 L271 195 L270 192 L267 191Z"
        fill="#FFD700"
      />

      {/* Cat face emoji-like */}
      <rect
        x="90"
        y="215"
        width="50"
        height="50"
        rx="10"
        fill="#F4DEB8"
        stroke="#E8C990"
        strokeWidth="1"
      />
      <circle cx="108" cy="235" r="4" fill="#FF8C42" />
      <circle cx="122" cy="235" r="4" fill="#FF8C42" />
      <path
        d="M108 245 Q115 250 122 245"
        stroke="#FF8C42"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Small pill/capsule */}
      <rect x="240" y="200" width="40" height="16" rx="8" fill="#A8CCEE" />
      <rect x="240" y="200" width="20" height="16" rx="8" fill="#5B9FE8" />

      {/* Orange dot */}
      <circle cx="30" cy="230" r="7" fill="#FF8C42" />
      <circle cx="280" cy="250" r="5" fill="#FF6B6B" />
    </svg>
  )
}

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center overflow-hidden bg-[#FAFAF8] pt-30">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="flex items-center justify-between gap-4">
          {/* Left mascot */}
          <div className="hidden flex-1 justify-center lg:flex">
            <MascotLeft />
          </div>

          {/* Center text */}
          <div className="flex flex-1 flex-col items-center gap-5 py-12 text-center">
            <h1 className="text-[52px] leading-[1.08] font-bold tracking-tight text-[#1a1a1a] md:text-[64px]">
              Your favorite
              <br />
              notes app.
            </h1>
            <p className="max-w-[320px] text-[16px] leading-relaxed text-[#666]">
              Capture ideas with the best notes app for Web. Writing has never
              been so simple.
            </p>
            <div className="mt-2 flex items-center gap-3">
              <Link
                href="#"
                className="flex items-center gap-2 rounded-full bg-[#1a1a1a] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#333]"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M11.182 9.4c-.02 1.78.926 2.627 1.636 3.273.19.173.355.323.475.46-.494.99-1.64 2.867-3.092 2.867-.432 0-.73-.114-1.042-.233-.326-.124-.666-.253-1.195-.253-.552 0-.912.135-1.258.265-.3.116-.587.226-.993.226-1.566 0-3.164-2.1-3.164-5.023C3.549 7.65 5.08 5.5 6.98 5.5c.515 0 .929.172 1.29.323.303.127.567.237.855.237.268 0 .528-.109.824-.233.385-.163.822-.348 1.368-.348.535 0 1.06.152 1.487.46-.437.363-.622.888-.622 1.461zm-1.39-5.45C9.34 4.57 8.668 5.5 7.5 5.5c-.033-.466.115-.997.408-1.45.458-.7 1.227-1.25 1.836-1.3.065.494-.091.99-.372 1.35-.006.007-.008.014-.014.02z" />
                </svg>
                Start for free
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2 rounded-full border border-[#D0CBBD] px-5 py-3 text-sm font-semibold text-[#1a1a1a] transition-colors hover:bg-[#F0EDE4]"
              >
                <svg
                  width="12"
                  height="14"
                  viewBox="0 0 12 14"
                  fill="currentColor"
                >
                  <path d="M1 1l10 6L1 13V1z" />
                </svg>
                See how it works
              </Link>
            </div>
          </div>

          {/* Right mascot */}
          <div className="hidden flex-1 justify-center lg:flex">
            <MascotRight />
          </div>
        </div>

        {/* <div className="mt-8 pb-16 text-center">
          <h2 className="text-[28px] font-bold text-[#1a1a1a]">
            Take notes in a whole new way.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 pb-20 md:grid-cols-3">
          <div className="rounded-2xl bg-[#1a1a1a] p-5 text-white">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5B9FE8]">
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="text-sm font-semibold">Write</span>
            </div>
            <p className="text-xs text-gray-400">
              Jot down thoughts, ideas, or entire documents with ease.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#E8E6DF] bg-white p-5">
            <div className="flex items-center gap-2 rounded-full bg-[#4CAF72] px-4 py-2 text-xs font-semibold text-white">
              <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
              Syncing
            </div>
            <p className="text-center text-xs text-[#888]">
              Your notes, always backed up and in sync.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E8E6DF] bg-white p-5">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#5B9FE8]" />
                <span className="text-xs font-medium text-[#5B9FE8]">
                  Saved
                </span>
                <span className="ml-auto text-xs text-[#888]">Just now</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#D0CBBD]" />
                <span className="text-xs font-medium text-[#888]">
                  Syncing…
                </span>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  )
}
