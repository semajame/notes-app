type NoteTag = "amber" | "blue" | "green" | "purple";

interface NoteCard {
  tag: string;
  tagColor: NoteTag;
  title: string;
  preview: string;
  date: string;
  fileType: string;
}

const notes: NoteCard[] = [
  {
    tag: "Mathematics",
    tagColor: "amber",
    title: "Calculus — Limits",
    preview:
      "Review of ε-δ definition and squeeze theorem applications in single-variable…",
    date: "2 days ago",
    fileType: "📄 Note",
  },
  {
    tag: "CS 101",
    tagColor: "blue",
    title: "Big-O Notation",
    preview:
      "Time complexity analysis for sorting algorithms. Merge sort O(n log n)…",
    date: "4 days ago",
    fileType: "📑 PDF",
  },
  {
    tag: "Biology",
    tagColor: "green",
    title: "Cell Mitosis",
    preview:
      "Phases of mitosis: prophase, metaphase, anaphase, telophase. Diagrams…",
    date: "1 week ago",
    fileType: "🖼 Image",
  },
];

const tagStyles: Record<NoteTag, string> = {
  amber: "bg-[var(--amber)]/10 text-[var(--amber)]",
  blue: "bg-[#58a6ff]/10 text-[#58a6ff]",
  green: "bg-[#3fb950]/10 text-[#3fb950]",
  purple: "bg-[#bc82ff]/10 text-[#bc82ff]",
};

const sidebarNav = [
  { label: "Dashboard", active: true },
  { label: "All Notes", active: false },
  { label: "Files & PDFs", active: false },
  { label: "Bookmarks", active: false },
];

const sidebarSubjects = [
  "📐 Mathematics",
  "🔬 Biology",
  "💻 CS 101",
  "📖 Literature",
];

export default function DashboardPreview() {
  return (
    <div className="w-full max-w-4xl bg-[var(--bg2)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.04)] relative">
      {/* Fade out at bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg)] pointer-events-none z-10" />

      {/* Title bar */}
      <div className="bg-[var(--bg3)] flex items-center gap-2 px-5 py-3 border-b border-[var(--border)]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        <div className="flex-1 flex justify-center">
          <span className="bg-[var(--bg)] text-[var(--muted)] text-xs px-4 py-1 rounded-md max-w-xs w-full text-center">
            notevo.app/dashboard
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="grid md:grid-cols-[220px_1fr]" style={{ minHeight: 420 }}>
        {/* Sidebar */}
        <div className="hidden md:block bg-[var(--bg3)] border-r border-[var(--border)] p-5">
          <div className="mb-7">
            <p className="text-[0.68rem] font-semibold uppercase tracking-widest text-[var(--muted)] px-1.5 mb-2">
              Workspace
            </p>
            {sidebarNav.map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[0.83rem] mb-0.5 cursor-pointer transition-colors ${
                  item.active
                    ? "bg-[var(--amber)]/10 text-[var(--amber)]"
                    : "text-[var(--muted)] hover:bg-white/5 hover:text-[var(--text)]"
                }`}
              >
                {item.label}
              </div>
            ))}
          </div>
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-widest text-[var(--muted)] px-1.5 mb-2">
              Subjects
            </p>
            {sidebarSubjects.map((s) => (
              <div
                key={s}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[0.83rem] mb-0.5 text-[var(--muted)] hover:bg-white/5 hover:text-[var(--text)] cursor-pointer transition-colors"
              >
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Main */}
        <div className="p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-serif-display text-xl text-[var(--text)]">
              Recent Notes
            </h3>
            <div className="flex items-center gap-2 bg-[var(--bg3)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs text-[var(--muted)] w-44">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              Search notes…
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            {notes.map((note) => (
              <div
                key={note.title}
                className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-4 cursor-pointer hover:border-[var(--amber)]/30 transition-all duration-200 group"
              >
                <span
                  className={`inline-block text-[0.68rem] font-semibold px-2 py-0.5 rounded mb-2.5 ${tagStyles[note.tagColor]}`}
                >
                  {note.tag}
                </span>
                <p className="text-[0.85rem] font-semibold text-[var(--text)] mb-1.5">
                  {note.title}
                </p>
                <p className="text-[0.75rem] text-[var(--muted)] leading-relaxed">
                  {note.preview}
                </p>
                <div className="mt-3 pt-2.5 border-t border-[var(--border)] flex items-center justify-between text-[0.7rem] text-[var(--muted)]">
                  <span>{note.date}</span>
                  <span>{note.fileType}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
