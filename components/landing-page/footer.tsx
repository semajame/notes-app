import Link from "next/link";

const footerLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Support", href: "/support" },
  { label: "GitHub", href: "https://github.com" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <Link
          href="/"
          className="font-serif-display text-2xl text-[var(--text)] tracking-tight"
        >
          Note<span className="text-[var(--amber)]">vo</span>
        </Link>

        <nav className="flex flex-wrap justify-center gap-7">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[var(--muted)] text-sm hover:text-[var(--text)] transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-[var(--muted)] text-xs">
          © {new Date().getFullYear()} Notevo. Built for students.
        </p>
      </div>
    </footer>
  );
}
