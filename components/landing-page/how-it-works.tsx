import { FileText, CheckCircle2, Layout, PenTool } from "lucide-react"

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#FAFAF8] py-20">
      <section className="bg-[#FAFAF8] px-6 pt-32 pb-20 text-center">
        <span className="mb-6 block text-[10px] font-semibold tracking-[0.2em] text-gray-400 uppercase">
          Features
        </span>
        <h1 className="mb-6 font-serif text-5xl leading-tight italic md:text-6xl">
          Everything you need, <br />
          <span className="not-italic">nothing you don't.</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-500 md:text-xl">
          Notelyyy brings together docs, and your tasks, into one calm,
          beautiful workspace — built around how you actually think.
        </p>

        {/* Feature Icons */}
        <div className="mt-20 flex flex-wrap justify-center gap-8 md:gap-16">
          {[
            { icon: <FileText size={20} />, label: "Docs" },
            { icon: <CheckCircle2 size={20} />, label: "Tasks" },
            // { icon: <Calendar size={20} />, label: "Calendar" },
            { icon: <Layout size={20} />, label: "Whiteboards" },
            { icon: <PenTool size={20} />, label: "Daily Notes" },
          ].map((item, i) => (
            <div
              key={i}
              className="group flex cursor-pointer flex-col items-center gap-3"
            >
              <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-shadow group-hover:shadow-md">
                {item.icon}
              </div>
              <span className="text-xs font-medium text-gray-600">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </section>
  )
}
