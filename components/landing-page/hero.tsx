import Link from "next/link";
import DashboardPreview from "./dashboard-preview";

const avatarInitials = ["JD", "SK", "AL", "MR", "+"];

export default function Hero() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 pb-20">
        {/* Ambient glow */}
        <div
          className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(245,166,35,0.09) 0%, transparent 70%)",
          }}
        />

        {/* Badge */}
        <div className="animate-fade-up inline-flex items-center gap-2 bg-[var(--amber)]/10 border border-[var(--amber)]/25 text-[var(--amber)] px-4 py-1.5 rounded-full text-xs font-semibold mb-8">
          <GraduationCapIcon />
          Built for students, by students
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up-1 font-serif-display text-5xl md:text-7xl leading-[1.05] tracking-tight max-w-3xl mb-6">
          Your{" "}
          <em className="text-[var(--amber)] not-italic font-serif-display italic">
            academic
          </em>{" "}
          life,
          <br />
          beautifully organized
        </h1>

        {/* Subheadline */}
        <p className="animate-fade-up-2 text-[var(--muted)] text-lg md:text-xl max-w-lg leading-relaxed mb-11">
          Store notes, PDFs, files, and flashcards in one intelligent workspace.
          Stop losing work across scattered apps — keep everything that matters,
          forever.
        </p>

        {/* CTA buttons */}
        <div className="animate-fade-up-3 flex flex-wrap gap-4 justify-center">
          <Link
            href="/register"
            className="bg-[var(--amber)] text-[#0d0f14] font-semibold text-base px-8 py-3.5 rounded-xl hover:bg-[#f9bc55] hover:-translate-y-px transition-all duration-200"
          >
            Start for free →
          </Link>
          <a
            href="#how"
            className="border border-white/10 text-[var(--text)] text-base px-8 py-3.5 rounded-xl hover:border-white/25 hover:text-white transition-all duration-200"
          >
            See how it works
          </a>
        </div>

        {/* Social proof */}
        <div className="animate-fade-up-4 flex items-center gap-3 mt-16 text-sm text-[var(--muted)]">
          <div className="flex">
            {avatarInitials.map((init, i) => (
              <span
                key={i}
                className="w-8 h-8 rounded-full border-2 border-[var(--bg)] bg-[var(--bg3)] flex items-center justify-center text-xs text-[var(--muted)] font-medium"
                style={{ marginLeft: i === 0 ? 0 : "-8px" }}
              >
                {init}
              </span>
            ))}
          </div>
          Trusted by <strong className="text-[var(--text)]">2,400+</strong>{" "}
          students across 80+ universities
        </div>
      </section>

      {/* ── Dashboard preview ── */}
      <div className="animate-fade-up-5 flex justify-center px-6 pb-24">
        <DashboardPreview />
      </div>
    </>
  );
}

function GraduationCapIcon() {
  return (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
      />
    </svg>
  );
}
