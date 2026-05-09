interface Testimonial {
  text: string;
  initials: string;
  name: string;
  role: string;
}

const testimonials: Testimonial[] = [
  {
    text: "I used to have notes scattered across five different apps. Notevo is the first tool that actually made me feel organized. The PDF viewer is a game-changer.",
    initials: "AK",
    name: "Aisha K.",
    role: "Medicine, Univ. of Melbourne",
  },
  {
    text: "Finally a notes app that doesn't feel like a project management tool. It's clean, fast, and the search function finds everything instantly. 10/10.",
    initials: "LP",
    name: "Luca P.",
    role: "Computer Science, ETH Zürich",
  },
  {
    text: "My professor uploads slides as PDFs and I can finally annotate and keep notes side-by-side. My GPA literally went up since I started using this.",
    initials: "SR",
    name: "Sofia R.",
    role: "Psychology, UCLA",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-6 bg-[var(--bg2)]">
      <div className="max-w-6xl mx-auto">
        <span className="inline-block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--amber)] mb-4">
          Student voices
        </span>
        <h2 className="font-serif-display text-4xl md:text-5xl leading-tight tracking-tight mb-4">
          Loved by students worldwide
        </h2>
        <p className="text-[var(--muted)] text-lg max-w-xl leading-relaxed">
          From undergrads to postgrad researchers — here's what they're saying.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ text, initials, name, role }: Testimonial) {
  return (
    <div className="bg-[var(--bg3)] border border-[var(--border)] rounded-2xl p-7">
      <div className="text-[var(--amber)] text-sm tracking-widest mb-4">
        ★★★★★
      </div>
      <p className="text-[var(--text)] text-sm leading-relaxed italic mb-5">
        &ldquo;{text}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center text-xs font-semibold text-[var(--amber)]">
          {initials}
        </div>
        <div>
          <p className="font-semibold text-sm text-[var(--text)]">{name}</p>
          <p className="text-[var(--muted)] text-xs">{role}</p>
        </div>
      </div>
    </div>
  );
}
