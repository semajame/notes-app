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
        <h2 className="mb-12 text-center text-[32px] font-bold text-[#1a1a1a]">
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
    </section>
  )
}
