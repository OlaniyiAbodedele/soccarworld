import Image from "next/image";

const navigationItems = [
  { label: "Vision", href: "#vision" },
  { label: "Communities", href: "#communities" },
  { label: "Technology", href: "#technology" },
  { label: "About", href: "#about" },
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
        className="grid h-20 w-full grid-cols-[1fr_auto] items-center lg:h-24 lg:grid-cols-[1fr_auto_1fr]"
        style={{
          paddingLeft: "clamp(24px, 6vw, 120px)",
          paddingRight: "clamp(24px, 6vw, 120px)",
        }}
      >
        {/* SoccaR logo */}
        <a
          href="#home"
          aria-label="SoccaR home"
          className="group inline-flex justify-self-start rounded-sm outline-none transition duration-300 focus-visible:ring-2 focus-visible:ring-[#9CE500]/80 focus-visible:ring-offset-4 focus-visible:ring-offset-black"
          style={{
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <Image
            src="/images/logo/soccar-gold.webp"
            alt="SoccaR"
            width={190}
            height={55}
            priority
            className="h-auto w-[142px] opacity-90 transition duration-300 group-hover:opacity-100 sm:w-[154px] lg:w-[185px]"
            style={{
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
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
          className="inline-flex items-center justify-center justify-self-end border border-white/25 bg-black/30 font-semibold uppercase text-white outline-none transition duration-300 hover:-translate-y-px hover:border-[#9CE500] hover:text-[#9CE500] focus-visible:-translate-y-px focus-visible:border-[#9CE500] focus-visible:text-[#9CE500] focus-visible:ring-2 focus-visible:ring-[#9CE500]/60 focus-visible:ring-offset-4 focus-visible:ring-offset-black"
          style={{
            minWidth: "clamp(142px, 12vw, 190px)",
            minHeight: "clamp(48px, 4.2vw, 62px)",
            paddingLeft: "clamp(18px, 2vw, 32px)",
            paddingRight: "clamp(18px, 2vw, 32px)",
            fontSize: "clamp(0.68rem, 0.76vw, 0.86rem)",
            letterSpacing: "0.18em",
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