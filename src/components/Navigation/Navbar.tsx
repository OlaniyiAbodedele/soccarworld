import Image from "next/image";
const navigationItems = [
  { label: "Vision", href: "#vision" },
  { label: "Communities", href: "#communities" },
  { label: "Technology", href: "#technology" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-black/50 backdrop-blur-md">
      <div
        className="grid h-24 w-full grid-cols-[1fr_auto_1fr] items-center"
        style={{
          paddingLeft: "clamp(72px, 6vw, 120px)",
          paddingRight: "clamp(72px, 6vw, 120px)",
        }}
      >
        <a
  href="#home"
  aria-label="SoccaR home"
  className="justify-self-start"
>
  <Image
  src="/images/logo/soccar-gold.webp"
  alt="SoccaR"
  width={190}
  height={55}
  priority
  className="h-auto w-[170px] lg:w-[185px]"
  />
        </a>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-16 lg:flex"
        >
          {navigationItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="whitespace-nowrap text-xs font-semibold uppercase tracking-[0.2em] text-white/70 transition duration-300 hover:text-[#9CE500]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#founding-community"
          className="inline-flex items-center justify-center justify-self-end border border-white/25 bg-black/25 font-semibold uppercase text-white transition duration-300 hover:border-[#9CE500] hover:text-[#9CE500]"
          style={{
            minWidth: "190px",
            minHeight: "62px",
            paddingLeft: "32px",
            paddingRight: "32px",
            fontSize: "0.86rem",
            letterSpacing: "0.18em",
          }}
        >
          Join Waitlist
        </a>
      </div>
    </header>
  );
}