import React from "react"
import {
  FileText,
  CheckCircle2,
  Calendar,
  Layout,
  PenTool,
  ArrowRight,
} from "lucide-react"

const CraftLandingPage = () => {
  return (
    <div className="min-h-screen bg-[#fbfaf7] font-sans text-[#1a1a1a] selection:bg-purple-100">
      {/* Hero Section */}

      <hr className="mx-auto w-full max-w-5xl border-gray-200" />

      {/* Organization Section */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <span className="mb-6 block text-[10px] font-semibold tracking-[0.2em] text-gray-400 uppercase">
          Organize
        </span>
        <h2 className="mb-6 font-serif text-4xl md:text-5xl">
          Structure That Adapts to Your Thinking
        </h2>
        <p className="mx-auto mb-16 max-w-2xl text-gray-500">
          Choose any approach that fits your mind: organize with spaces, folders
          and tags, or build rich databases with collections.
        </p>

        {/* Feature Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Spaces */}
          <div className="flex flex-col items-center rounded-[32px] bg-[#e8e5f7] p-8 text-center">
            <h3 className="mb-2 font-serif text-2xl">Spaces</h3>
            <p className="mb-8 text-sm text-gray-600">
              Switch between work and personal mode
            </p>
            <div className="aspect-[4/5] w-full rounded-xl border border-white/50 bg-white p-4 text-left shadow-sm">
              <div className="mb-4 text-[10px] font-bold text-gray-400">
                PERSONAL SPACE
              </div>
              <div className="space-y-3">
                <div className="h-2 w-2/3 rounded bg-gray-100" />
                <div className="h-2 w-1/2 rounded bg-gray-100" />
                <div className="flex h-8 w-full items-center rounded-lg border border-purple-100 bg-purple-50 px-3 text-[10px] font-bold text-purple-600">
                  WORK SPACE
                </div>
              </div>
            </div>
          </div>

          {/* Folders & Tags */}
          <div className="flex flex-col items-center rounded-[32px] bg-[#d9f0f7] p-8 text-center">
            <h3 className="mb-2 font-serif text-2xl">Folders & Tags</h3>
            <p className="mb-8 text-sm text-gray-600">
              Classic structure for clear hierarchy
            </p>
            <div className="flex w-full flex-col gap-4">
              <div className="rounded-xl bg-white p-4 text-left shadow-sm">
                <div className="mb-2 h-2 w-1/2 rounded bg-blue-50" />
                <div className="h-2 w-1/3 rounded bg-blue-50" />
              </div>
              <div className="flex gap-2 rounded-xl bg-white p-4 shadow-sm">
                <span className="rounded-md bg-orange-50 px-2 py-1 text-[10px] font-bold text-orange-600">
                  #Ideas
                </span>
                <span className="rounded-md bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-600">
                  #Design
                </span>
              </div>
            </div>
          </div>

          {/* Collections */}
          <div className="flex flex-col items-center rounded-[32px] bg-[#def2e6] p-8 text-center">
            <h3 className="mb-2 font-serif text-2xl">Collections</h3>
            <p className="mb-8 text-sm text-gray-600">
              For structured thinking and rich data
            </p>
            <div className="aspect-[4/5] w-full overflow-hidden rounded-xl border border-white/50 bg-white shadow-sm">
              <div className="flex gap-2 border-b border-gray-50 p-3">
                <div className="h-2 w-8 rounded bg-green-50" />
                <div className="h-2 w-12 rounded bg-green-50" />
              </div>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-gray-50 p-3"
                >
                  <div className="h-2 w-16 rounded bg-gray-50" />
                  <div className="h-4 w-4 rounded-full bg-green-100" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="mx-auto w-full max-w-5xl border-gray-200" />

      {/* Daily Notes Section */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-16 text-center">
          <span className="mb-6 block text-[10px] font-semibold tracking-[0.2em] text-gray-400 uppercase">
            Write
          </span>
          <h2 className="mb-6 font-serif text-4xl md:text-5xl">
            A canvas for your thoughts
          </h2>
          <p className="mx-auto max-w-xl text-gray-500">
            Write freely, then shape it. Craft's editor gets out of the way and
            lets ideas come first.
          </p>
        </div>

        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="max-w-md">
            <span className="mb-4 block text-[10px] font-bold tracking-widest text-gray-400 uppercase">
              Daily Notes
            </span>
            <h3 className="mb-6 font-serif text-3xl">
              Your thinking, captured every day
            </h3>
            <p className="leading-relaxed text-gray-500">
              A fresh page greets you every morning. Write without pressure —
              daily notes link backward automatically, so nothing gets lost.
            </p>
          </div>
          <div className="rounded-[40px] bg-[#f0ece5] p-8">
            <div className="rounded-2xl bg-white p-8 shadow-xl">
              <div className="mb-4 font-serif text-lg">Monday, May 18</div>
              <p className="mb-4 text-sm leading-relaxed text-gray-600">
                Finished the Q2 revenue report. Need to follow up with Jesse on
                the campaign timeline — she mentioned moving the launch to
                Thursday.
              </p>
              <p className="mb-6 text-sm leading-relaxed text-gray-600">
                Reading: "Architecture of Ideas" by Anni Albers. Truly
                inspiring.
              </p>
              <div className="flex gap-2">
                <span className="rounded bg-gray-100 px-2 py-1 text-[10px] text-gray-500">
                  #work
                </span>
                <span className="rounded bg-gray-100 px-2 py-1 text-[10px] text-gray-500">
                  #reading
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#f7f4ef] px-6 py-32 text-center">
        <h2 className="mb-8 font-serif text-5xl italic">
          Start for free, today.
        </h2>
        <p className="mb-12 text-gray-500">
          Available on Mac, iPhone, iPad, and the web. Premium features
          optional.
        </p>
        <button className="mx-auto flex items-center gap-2 rounded-full border border-gray-100 bg-white px-8 py-4 font-medium text-gray-800 shadow-sm transition-all hover:shadow-md">
          Get Craft Free <ArrowRight size={18} />
        </button>
      </section>
    </div>
  )
}

export default CraftLandingPage
