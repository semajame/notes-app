const testimonials = [
  {
    name: "Maria Santos",
    handle: "@mariasantos",
    avatar: "MS",
    color: "bg-[#5B9FE8]",
    text: "Notely completely changed how I capture ideas. It's the one app I open every single day.",
  },
  {
    name: "James Reyes",
    handle: "@jreyes_dev",
    avatar: "JR",
    color: "bg-[#4CAF72]",
    text: "The speed is insane. Notes save instantly and sync across all my devices without a hitch.",
  },
  {
    name: "Anika Cruz",
    handle: "@anikacruz",
    avatar: "AC",
    color: "bg-[#FF9F43]",
    text: "I've tried every notes app out there. Notely is the only one that actually feels fun to use.",
  },
  {
    name: "Luca Ferreira",
    handle: "@lucaf",
    avatar: "LF",
    color: "bg-[#FF6B6B]",
    text: "The search is lightning fast. I can find any note I've ever written in under a second.",
  },
  {
    name: "Sophie Tan",
    handle: "@sophietan",
    avatar: "ST",
    color: "bg-[#9B59B6]",
    text: "Sharing notes with my team has never been easier. The QR share feature is so clever.",
  },
  {
    name: "Marco Delgado",
    handle: "@marcod",
    avatar: "MD",
    color: "bg-[#1ABC9C]",
    text: "Finally a notes app that doesn't get in the way. Clean, fast, and absolutely delightful.",
  },
]

export default function Testimonials() {
  return (
    <section className="bg-[#FAFAF8] py-20">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="mb-3 text-center text-[32px] font-bold text-[#1a1a1a]">
          Loved by note-takers everywhere.
        </h2>
        <p className="mb-12 text-center text-[15px] text-[#777]">
          Join thousands of people who've made Notely their second brain.
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.handle}
              className="flex flex-col gap-3 rounded-2xl border border-[#E8E6DF] bg-white p-5 transition-colors hover:border-[#C8C4BC]"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-9 w-9 ${t.color} flex items-center justify-center rounded-full text-xs font-bold text-white`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-[13px] leading-none font-semibold text-[#1a1a1a]">
                    {t.name}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#999]">{t.handle}</p>
                </div>
              </div>
              <p className="text-[13px] leading-relaxed text-[#555]">
                "{t.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
