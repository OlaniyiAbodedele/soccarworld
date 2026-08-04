import Container from "../Common/Container";

const navigationItems = [
  { label: "Home", href: "#home" },
  { label: "Why SoccaR", href: "#why-soccar" },
  { label: "Communities", href: "#communities" },
  { label: "Ecosystem", href: "#ecosystem" },
  { label: "Platform", href: "#platform" },
];

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-black/70 backdrop-blur-xl">
      <Container className="flex h-20 items-center justify-between">
        <a
          href="#home"
          aria-label="SoccaR home"
          className="text-xl font-bold tracking-[0.18em] text-white"
        >
          SoccaR
        </a>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-8 lg:flex"
        >
          {navigationItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60 transition duration-300 hover:text-[#9CE500]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#founding-community"
            className="hidden text-xs font-semibold uppercase tracking-[0.14em] text-white/60 transition hover:text-white sm:inline-flex"
          >
            Join
          </a>

          <a
            href="#founding-community"
            className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#9CE500] px-5 py-2 text-xs font-semibold tracking-[0.08em] text-black transition duration-300 hover:bg-[#B2FF1A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9CE500]"
          >
            Join Waitlist
          </a>
        </div>
      </Container>
    </header>
  );
}