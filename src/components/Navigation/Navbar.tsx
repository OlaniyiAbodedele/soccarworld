import Image from "next/image";

const navigationItems = [
  { label: "Vision", href: "#hero" },
  { label: "Communities", href: "#communities" },
  { label: "Technology", href: "#ecosystem" },
  { label: "About", href: "#why-soccar" },
];

export default function Navbar() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-black/55 backdrop-blur-[6px]"
      style={{
        boxShadow:
          "0 1px 0 rgba(156,229,0,0.025), 0 14px 40px rgba(0,0,0,0.18)",
      }}
    >
      <div
        className="grid w-full grid-cols-[1fr_auto] items-center lg:grid-cols-[1fr_auto_1fr]"
        style={{
          minHeight: "clamp(80px, 7vw, 96px)",
          paddingLeft: "clamp(32px, 6vw, 120px)",
          paddingRight: "clamp(32px, 6vw, 120px)",
        }}
      >
        {/* SoccaR logo */}
        <a
          href="#hero"
          aria-label="SoccaR home"
          className="group inline-flex justify-self-start rounded-sm outline-none transition duration-300 focus-visible:ring-2 focus-visible:ring-[#9CE500]/80 focus-visible:ring-offset-4 focus-visible:ring-offset-black"
          style={{
            transitionTimingFunction:
              "cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <Image
            src="/images/logo/soccar-gold.webp"
            alt="SoccaR"
            width={190}
            height={55}
            priority
            className="h-auto opacity-90 transition duration-300 group-hover:opacity-100"
            style={{
              width: "clamp(122px, 31vw, 185px)",
              maxWidth: "100%",
              transitionTimingFunction:
                "cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        </a>

        {/* Desktop navigation */}
        <nav
          aria-label="Primary navigation"
          className="hidden items-center lg:flex"
          style={{
            gap: "clamp(60px, 5vw, 88px)",
          }}
        >
          {navigationItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="whitespace-nowrap rounded-sm text-xs font-semibold uppercase tracking-[0.2em] text-white/72 outline-none transition duration-200 hover:-translate-y-px hover:text-[#9CE500] focus-visible:-translate-y-px focus-visible:text-[#9CE500] focus-visible:ring-2 focus-visible:ring-[#9CE500]/70 focus-visible:ring-offset-4 focus-visible:ring-offset-black"
              style={{
                transitionTimingFunction:
                  "cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Primary conversion action */}
        <a
          href="#founding-community"
          className="inline-flex items-center justify-center justify-self-end whitespace-nowrap border border-white/25 bg-black/30 font-semibold uppercase text-white outline-none transition duration-300 hover:-translate-y-px hover:border-[#9CE500] hover:text-[#9CE500] focus-visible:-translate-y-px focus-visible:border-[#9CE500] focus-visible:text-[#9CE500] focus-visible:ring-2 focus-visible:ring-[#9CE500]/60 focus-visible:ring-offset-4 focus-visible:ring-offset-black"
          style={{
            minWidth: "clamp(128px, 30vw, 190px)",
            minHeight: "clamp(46px, 4.2vw, 62px)",
            paddingLeft: "clamp(14px, 2vw, 32px)",
            paddingRight: "clamp(14px, 2vw, 32px)",
            fontSize: "clamp(0.62rem, 0.76vw, 0.86rem)",
            letterSpacing: "0.16em",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.03), 0 0 0 rgba(156,229,0,0)",
            transitionTimingFunction:
              "cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          Join Waitlist
        </a>
      </div>
    </header>
  );
}