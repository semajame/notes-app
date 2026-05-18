const features = [
  {
    icon: (
      <div className="w-full rounded-2xl bg-[#1a1a1a] p-4 text-white">
        <div className="flex flex-col gap-2">
          {[
            {
              color: "bg-[#5B9FE8]",
              label: "Write",
              desc: "Jot down anything, anywhere.",
            },
            {
              color: "bg-[#4CAF72]",
              label: "Organize",
              desc: "Sort notes into folders and tags.",
            },
            {
              color: "bg-[#FF9F43]",
              label: "Search",
              desc: "Find any note in an instant.",
            },
            {
              color: "bg-[#FF6B6B]",
              label: "Share",
              desc: "Share notes with anyone.",
            },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className={`h-5 w-5 ${item.color} flex-shrink-0 rounded-full`}
              />
              <div>
                <p className="text-xs leading-none font-semibold">
                  {item.label}
                </p>
                <p className="mt-0.5 text-[10px] text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    title: "Easy",
    desc: "Whether you're a beginner or a pro, Notely makes capturing ideas effortless.",
  },
  {
    icon: (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-[#E8E6DF] bg-white p-4">
        <div className="flex items-center gap-2 rounded-full bg-[#4CAF72] px-5 py-2 text-xs font-bold text-white">
          <div className="h-2 w-2 rounded-full bg-white" />
          Back Up Now
        </div>
        <p className="mt-1 text-center text-[11px] text-[#888]">
          Your notes are always safe.
        </p>
      </div>
    ),
    title: "Secure",
    desc: "Your notes, your control. End-to-end encryption at every stage.",
  },
  {
    icon: (
      <div className="rounded-2xl border border-[#E8E6DF] bg-white p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#5B9FE8]" />
            <span className="text-xs text-[#5B9FE8]">Saved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#D0CBBD]" />
            <span className="text-xs text-[#999]">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#4CAF72]" />
            <span className="text-xs text-[#4CAF72]">Synced</span>
          </div>
        </div>
      </div>
    ),
    title: "Fast",
    desc: "Uncompromising speed. Notes save and sync in milliseconds.",
  },
  {
    icon: (
      <div className="flex items-center justify-between rounded-2xl border border-[#E8E6DF] bg-white p-4">
        <div>
          <p className="text-xs font-semibold text-[#1a1a1a]">Normal</p>
          <p className="mt-0.5 text-[11px] text-[#888]">~0.5 Sec</p>
        </div>
        <div className="flex gap-1">
          <div className="h-2 w-2 rounded-full bg-[#4CAF72]" />
          <div className="h-2 w-2 rounded-full bg-[#F5C842]" />
          <div className="h-2 w-2 rounded-full bg-[#FF6B6B]" />
        </div>
      </div>
    ),
    title: "Powerful",
    desc: "Experience the full power of smart notes with advanced formatting features.",
  },
  {
    icon: (
      <div className="flex items-center gap-3 rounded-2xl border border-[#E8E6DF] bg-white p-4">
        {["😎", "🎨", "✨", "🌿"].map((e) => (
          <div
            key={e}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F2EC] text-lg"
          >
            {e}
          </div>
        ))}
      </div>
    ),
    title: "Fun",
    desc: "Notely takes joy seriously. Delightful interactions with every tap.",
  },
]

export default function Features() {
  return (
    <section id="features" className="bg-[#FAFAF8] py-20">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="mb-12 text-center font-serif text-[32px] text-[#1a1a1a] italic">
          Explore notes in a whole new way.
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col gap-3">
              {f.icon}
              <div>
                <p className="text-[14px] font-bold text-[#1a1a1a]">
                  {f.title}
                </p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-[#777]">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 pt-50 pb-30">
        <h2 className="mb-2 font-serif text-[32px] text-[#1a1a1a] italic">
          Write, share, search.
        </h2>
        <p className="mb-14 text-[16px] text-[#777]">All in one place.</p>

        <div className="flex flex-col items-center justify-center gap-10 md:flex-row">
          <PhoneMockup label="Write">
            <WriteScreen />
          </PhoneMockup>

          <PhoneMockup label="Share">
            <ReceiveScreen />
          </PhoneMockup>

          <PhoneMockup label="Search">
            <SearchScreen />
          </PhoneMockup>
        </div>
      </div>
    </section>
  )
}

// Phone mockup SVG screens
function PhoneMockup({
  children,
  label,
}: {
  children: React.ReactNode
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-[380px] w-[190px] overflow-hidden rounded-[36px] border-4 border-[#222] bg-[#1a1a1a] shadow-xl">
        {/* Notch */}
        <div className="absolute top-3 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-[#1a1a1a]" />
        {/* Screen content */}
        <div className="absolute inset-0 mt-10 overflow-hidden rounded-b-[32px] bg-[#FAFAF8]">
          {children}
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-sm font-semibold text-[#1a1a1a]">
        <div className="h-2 w-2 rounded-full bg-[#4CAF72]" />
        {label}
      </div>
    </div>
  )
}

function WriteScreen() {
  return (
    <div className="p-4 pt-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[11px] font-semibold text-[#1a1a1a]">My Notes</p>
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1a1a1a]">
          <span className="text-[10px] text-white">+</span>
        </div>
      </div>
      {[
        {
          title: "Meeting notes",
          time: "2m ago",
          lines: 3,
          color: "bg-[#5B9FE8]",
        },
        {
          title: "Shopping list",
          time: "1h ago",
          lines: 2,
          color: "bg-[#FF9F43]",
        },
        {
          title: "Book ideas",
          time: "Yesterday",
          lines: 4,
          color: "bg-[#4CAF72]",
        },
        { title: "Recipe draft", time: "Mon", lines: 2, color: "bg-[#FF6B6B]" },
      ].map((note) => (
        <div key={note.title} className="mb-3 flex items-start gap-2">
          <div
            className={`h-2 w-2 ${note.color} mt-1.5 flex-shrink-0 rounded-full`}
          />
          <div className="flex-1">
            <div className="flex justify-between">
              <p className="text-[10px] font-semibold text-[#1a1a1a]">
                {note.title}
              </p>
              <p className="text-[9px] text-[#999]">{note.time}</p>
            </div>
            <div className="mt-1 flex flex-col gap-0.5">
              {Array.from({ length: note.lines }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full bg-[#E8E6DF] ${i === note.lines - 1 ? "w-2/3" : "w-full"}`}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ReceiveScreen() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4CAF72]">
        <svg
          width="16"
          height="16"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path
            d="M20 6L9 17l-5-5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="text-[11px] font-semibold text-[#1a1a1a]">Share Note</p>
      {/* QR-like grid */}
      <div className="h-28 w-28 rounded-lg bg-[#1a1a1a] p-2">
        <div className="grid h-full grid-cols-7 gap-0.5">
          {Array.from({ length: 49 }).map((_, i) => (
            <div
              key={i}
              className={`rounded-[1px] ${Math.random() > 0.5 ? "bg-white" : "bg-transparent"}`}
            />
          ))}
        </div>
      </div>
      <p className="text-center text-[9px] text-[#888]">
        Share with anyone
        <br />
        via link or QR code
      </p>
    </div>
  )
}

function SearchScreen() {
  return (
    <div className="p-4 pt-6">
      <p className="mb-3 text-[11px] font-semibold text-[#1a1a1a]">Search</p>
      <div className="mb-4 flex items-center gap-2 rounded-xl bg-[#F0EDE4] px-3 py-2">
        <svg
          width="10"
          height="10"
          fill="none"
          stroke="#999"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
        </svg>
        <span className="text-[9px] text-[#999]">recipe ideas…</span>
      </div>
      <div className="mb-2 text-[9px] font-medium text-[#888]">3 results</div>
      {["Recipe draft", "Meal plan", "Grocery list"].map((r) => (
        <div
          key={r}
          className="mb-2 rounded-xl border border-[#E8E6DF] bg-white p-2"
        >
          <p className="text-[10px] font-semibold text-[#1a1a1a]">{r}</p>
          <div className="mt-1 h-1.5 w-3/4 rounded-full bg-[#E8E6DF]" />
        </div>
      ))}
      {/* large number display like Family's swap screen */}
      <div className="mt-4 text-center">
        <p className="text-[28px] font-bold tracking-tight text-[#1a1a1a]">
          24
        </p>
        <p className="text-[9px] text-[#888]">notes found</p>
      </div>
    </div>
  )
}
