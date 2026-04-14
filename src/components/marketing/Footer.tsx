import Link from "next/link";

type FooterProps = {
  variant?: "light" | "dark";
};

const links = [
  { label: "About", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Contact", href: "#" },
];

export function Footer({ variant = "light" }: FooterProps) {
  const isDark = variant === "dark";

  const containerClass = isDark
    ? "border-t border-[#F8F7F3]/15"
    : "border-t border-[#D4CEBC]";

  const wordmarkClass = isDark
    ? "font-serif text-lg tracking-tight text-[#F8F7F3]"
    : "font-serif text-lg tracking-tight text-[#3D3C37]";

  const linkBaseClass = isDark
    ? "text-[#F8F7F3]/60 transition-colors hover:text-[#C9A961]"
    : "text-[#6B6559] transition-colors hover:text-[#1B4332]";

  const mutedClass = isDark ? "text-[#F8F7F3]/60" : "text-[#6B6559]";

  return (
    <footer className={containerClass}>
      <div className="mx-auto flex max-w-[1080px] flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <span className={wordmarkClass}>Bitburg</span>
        <nav className={`flex flex-wrap items-center gap-x-3 gap-y-2 text-sm ${mutedClass}`}>
          {links.map((link, i) => (
            <span key={link.label} className="flex items-center gap-3">
              <Link href={link.href} className={linkBaseClass}>
                {link.label}
              </Link>
              {i < links.length - 1 && (
                <span aria-hidden className="text-[#C9A961]">
                  ·
                </span>
              )}
            </span>
          ))}
        </nav>
      </div>
      <div className={`mx-auto max-w-[1080px] px-6 pb-8 text-xs ${mutedClass}`}>
        <span>© 2026 Bitburg</span>
        <span aria-hidden className="text-[#C9A961]">
          {" · "}
        </span>
        <span>DMV-based</span>
      </div>
    </footer>
  );
}
