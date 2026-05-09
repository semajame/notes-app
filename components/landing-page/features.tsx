import { ReactNode } from "react";

interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <EditIcon />,
    title: "Rich Note Editor",
    description:
      "Write notes with a clean, distraction-free editor. Support for markdown, math equations (LaTeX), and code blocks.",
  },
  {
    icon: <FileIcon />,
    title: "PDF & File Storage",
    description:
      "Upload and store PDFs, slides, images, and documents. Preview them inline — no need to leave the app.",
  },
  {
    icon: <FolderIcon />,
    title: "Subject Organization",
    description:
      "Organize everything by subject, semester, or custom folders. Tag and filter content in seconds.",
  },
  {
    icon: <SearchIcon />,
    title: "Powerful Search",
    description:
      "Find any note, file, or keyword instantly. Full-text search across your entire library — even inside PDFs.",
  },
  {
    icon: <CloudIcon />,
    title: "Cloud Sync",
    description:
      "Everything syncs automatically across all your devices. Work from your laptop at the library or phone on the go.",
  },
  {
    icon: <LockIcon />,
    title: "Private & Secure",
    description:
      "Your notes are yours alone. Powered by Supabase with row-level security — nobody else can access your data.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-6 bg-[var(--bg2)]">
      <div className="max-w-6xl mx-auto">
        <span className="inline-block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--amber)] mb-4">
          Everything you need
        </span>
        <h2 className="font-serif-display text-4xl md:text-5xl leading-tight tracking-tight mb-4">
          One workspace for all
          <br />
          your academic materials
        </h2>
        <p className="text-[var(--muted)] text-lg max-w-xl leading-relaxed">
          Stop juggling between Google Drive, Notion, and your Downloads folder.
          Notevo brings it all together.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description }: Feature) {
  return (
    <div className="bg-[var(--bg3)] border border-[var(--border)] rounded-2xl p-8 hover:border-[var(--amber)]/20 hover:-translate-y-1 transition-all duration-200">
      <div className="w-11 h-11 bg-[var(--amber)]/10 border border-[var(--amber)]/20 rounded-xl flex items-center justify-center mb-5">
        {icon}
      </div>
      <h3 className="font-serif-display text-xl mb-2.5">{title}</h3>
      <p className="text-[var(--muted)] text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}

/* ── Icons ── */
function EditIcon() {
  return (
    <svg
      className="w-5 h-5 stroke-[var(--amber)]"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"
      />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      className="w-5 h-5 stroke-[var(--amber)]"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
      />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg
      className="w-5 h-5 stroke-[var(--amber)]"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      className="w-5 h-5 stroke-[var(--amber)]"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg
      className="w-5 h-5 stroke-[var(--amber)]"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      className="w-5 h-5 stroke-[var(--amber)]"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
      />
    </svg>
  );
}
