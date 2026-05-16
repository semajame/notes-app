"use client"

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
  const reversedTestimonials = [...testimonials].reverse()

  return (
    <section className="overflow-hidden bg-[#FAFAF8] py-20">
      <div className="w-full px-6">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="mb-3 text-[32px] font-bold text-[#1a1a1a]">
            Loved by note-takers everywhere.
          </h2>
          <p className="mb-12 text-[15px] text-[#777]">
            Join thousands of people who've made Notely their second brain.
          </p>
        </div>

        <div>
          <div className="relative w-full overflow-hidden py-6">
            <div className="scroll-track animate-scroll flex gap-4 px-6">
              {[...testimonials, ...testimonials].map((t, index) => (
                <article
                  key={`${t.handle}-${index}`}
                  className="max-w-[320px] min-w-[320px] flex-shrink-0 rounded-3xl bg-white p-5"
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
                      <p className="mt-0.5 text-[11px] text-[#999]">
                        {t.handle}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-[13px] leading-relaxed text-[#555]">
                    "{t.text}"
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="relative w-full overflow-hidden rounded-[28px] bg-white/8 py-6">
            <div className="scroll-track animate-scroll-reverse flex gap-4 px-6">
              {[...reversedTestimonials, ...reversedTestimonials].map(
                (t, index) => (
                  <article
                    key={`${t.handle}-reverse-${index}`}
                    className="max-w-[320px] min-w-[320px] flex-shrink-0 rounded-3xl bg-white p-5"
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
                        <p className="mt-0.5 text-[11px] text-[#999]">
                          {t.handle}
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 text-[13px] leading-relaxed text-[#555]">
                      "{t.text}"
                    </p>
                  </article>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scroll-track {
          min-width: 200%;
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        .animate-scroll-reverse {
          animation: scrollReverse 30s linear infinite;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scrollReverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  )
}
