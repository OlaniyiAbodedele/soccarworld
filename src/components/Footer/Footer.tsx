"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const PREMIUM_EASE = [0.22, 1, 0.36, 1] as const;

type FooterLink = {
  label: string;
  href: string;
};

type FooterColumn = {
  title: string;
  links: FooterLink[];
};

const footerColumns: FooterColumn[] = [
  {
    title: "Platform",
    links: [
      { label: "Vision", href: "#hero" },
      { label: "Communities", href: "#communities" },
      { label: "Platform", href: "#platform-features" },
      { label: "Technology", href: "#ecosystem" },
      { label: "About", href: "#why-soccar" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About SoccaR", href: "#why-soccar" },
      { label: "Our Mission", href: "#why-soccar" },
      { label: "Leadership", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press & Media", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "#" },
      { label: "Newsroom", href: "#" },
      { label: "Help Center", href: "#" },
      { label: "Guides", href: "#" },
      { label: "Support", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "Data Policy", href: "#" },
      { label: "Compliance", href: "#" },
    ],
  },
];

const socialLinks = [
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M6.5 8.5v9M6.5 5.5v.2M10.5 17.5v-5.1c0-2.2 1.2-3.9 3.5-3.9s3.5 1.5 3.5 4v5M10.5 9v8.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M14.5 5v8.1a4.1 4.1 0 1 1-3-3.9M14.5 5c.5 2.3 2.1 3.8 4.5 4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect
          x="4.5"
          y="4.5"
          width="15"
          height="15"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle
          cx="12"
          cy="12"
          r="3.4"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle cx="17.2" cy="6.9" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4.5 8.1c.2-1.4 1-2.2 2.4-2.4 3.4-.4 6.8-.4 10.2 0 1.4.2 2.2 1 2.4 2.4.3 2.6.3 5.2 0 7.8-.2 1.4-1 2.2-2.4 2.4-3.4.4-6.8.4-10.2 0-1.4-.2-2.2-1-2.4-2.4-.3-2.6-.3-5.2 0-7.8Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path d="m10 9 5 3-5 3V9Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="m6 5 12 14M18 5 6 19"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M13.5 19v-6h2.2l.4-2.5h-2.6V9c0-.8.4-1.5 1.6-1.5h1.2V5.2c-.6-.1-1.3-.2-2-.2-2 0-3.3 1.2-3.3 3.5v2H9v2.5h2V19"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

function FooterNavigationColumn({
  column,
}: {
  column: FooterColumn;
}) {
  return (
    <div>
      <h3
        className="font-semibold uppercase text-[#9CE500]"
        style={{
          fontSize: "0.7rem",
          lineHeight: "1.4",
          letterSpacing: "0.2em",
        }}
      >
        {column.title}
      </h3>

      <ul style={{ marginTop: "24px" }}>
        {column.links.map((link, index) => (
          <li
            key={link.label}
            style={{
              marginTop: index === 0 ? "0" : "17px",
            }}
          >
            <Link
              href={link.href}
              className="inline-flex text-white/74 outline-none transition duration-300 hover:translate-x-[3px] hover:text-[#9CE500] focus-visible:translate-x-[3px] focus-visible:text-[#9CE500]"
              style={{
                fontSize: "clamp(0.72rem, 0.78vw, 0.81rem)",
                lineHeight: "1.5",
                letterSpacing: "0.1em",
                transitionTimingFunction:
                  "cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLinks() {
  return (
    <div
      className="grid grid-cols-3"
      style={{
        width: "218px",
        columnGap: "22px",
        rowGap: "22px",
      }}
    >
      {socialLinks.map((social) => (
        <Link
          key={social.label}
          href={social.href}
          aria-label={social.label}
          className="flex h-[54px] w-[54px] items-center justify-center rounded-full border border-[#9CE500]/75 text-white outline-none transition duration-300 hover:-translate-y-1 hover:border-[#9CE500] hover:bg-[#9CE500] hover:text-black hover:shadow-[0_12px_30px_rgba(156,229,0,0.16)] focus-visible:-translate-y-1 focus-visible:border-[#9CE500] focus-visible:bg-[#9CE500] focus-visible:text-black focus-visible:ring-2 focus-visible:ring-[#9CE500]/55 focus-visible:ring-offset-4 focus-visible:ring-offset-black"
          style={{
            transitionTimingFunction:
              "cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <span className="h-6 w-6">{social.icon}</span>
        </Link>
      ))}
    </div>
  );
}

export default function Footer() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.footer
      className="relative overflow-hidden bg-[#050505] text-white"
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: 0.75,
        ease: PREMIUM_EASE,
      }}
    >
      {/* =========================================================
          MOBILE AND TABLET FOOTER
      ========================================================== */}
      <div className="lg:hidden">
        <div
          className="mx-auto w-full"
          style={{
            maxWidth: "760px",
            paddingTop: "80px",
            paddingRight: "32px",
            paddingBottom: "72px",
            paddingLeft: "32px",
          }}
        >
          {/* Mobile brand block */}
          <div className="flex flex-col items-center text-center">
            <Link
              href="#hero"
              aria-label="SoccaR home"
              className="inline-flex rounded-sm outline-none transition duration-300 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[#9CE500]/70 focus-visible:ring-offset-4 focus-visible:ring-offset-black"
            >
              <Image
                src="/images/logo/soccar-gold.webp"
                alt="SoccaR"
                width={190}
                height={76}
                className="h-auto w-[166px] object-contain"
              />
            </Link>

            <p
              className="text-white/74"
              style={{
                width: "100%",
                maxWidth: "320px",
                marginTop: "30px",
                fontSize: "0.78rem",
                lineHeight: "1.9",
                letterSpacing: "0.095em",
              }}
            >
              One global home for fans, players,
              <br />
              clubs and everyone shaping football.
            </p>

            <div
              aria-hidden="true"
              style={{
                width: "160px",
                height: "1px",
                marginTop: "34px",
                background:
                  "linear-gradient(90deg, transparent, rgba(156,229,0,0.82), transparent)",
              }}
            />
          </div>

          {/* Mobile navigation alignment rail */}
          <div
            className="w-full"
            style={{
              paddingLeft: "50px",
            }}
          >
            <div
              className="grid grid-cols-2"
              style={{
                marginTop: "76px",
                columnGap: "32px",
                rowGap: "62px",
              }}
            >
              {footerColumns.map((column) => (
                <FooterNavigationColumn
                  key={column.title}
                  column={column}
                />
              ))}
            </div>
          </div>

          {/* Mobile social section */}
          <div
            className="flex flex-col items-center border-t border-white/12 text-center"
            style={{
              marginTop: "76px",
              paddingTop: "58px",
            }}
          >
            <h3
              className="font-semibold uppercase text-[#9CE500]"
              style={{
                fontSize: "0.7rem",
                lineHeight: "1.4",
                letterSpacing: "0.2em",
              }}
            >
              Join the Conversation
            </h3>

            <div style={{ marginTop: "34px" }}>
              <SocialLinks />
            </div>
          </div>
        </div>

        {/* Mobile legal bar */}
        <div className="border-t border-white/12">
          <div
            className="mx-auto flex w-full flex-col items-center text-center"
            style={{
              maxWidth: "760px",
              paddingTop: "38px",
              paddingRight: "32px",
              paddingBottom: "40px",
              paddingLeft: "32px",
            }}
          >
            <p
              className="text-white/66"
              style={{
                width: "100%",
                maxWidth: "340px",
                fontSize: "0.67rem",
                lineHeight: "1.8",
                letterSpacing: "0.1em",
              }}
            >
              © 2026 SoccaR. All rights reserved.
              <br />
              SoccaR is a registered trademark.
            </p>

            <div
              className="flex flex-wrap items-center justify-center"
              style={{
                marginTop: "28px",
                columnGap: "0",
                rowGap: "14px",
              }}
            >
              {["Privacy", "Terms", "Contact"].map((item, index) => (
                <Link
                  key={item}
                  href="#"
                  className="text-white/72 outline-none transition duration-300 hover:text-[#9CE500] focus-visible:text-[#9CE500]"
                  style={{
                    paddingLeft: index === 0 ? "0" : "18px",
                    paddingRight: index === 2 ? "0" : "18px",
                    borderLeft:
                      index === 0
                        ? "none"
                        : "1px solid rgba(255,255,255,0.22)",
                    fontSize: "0.68rem",
                    lineHeight: "1.5",
                    letterSpacing: "0.11em",
                    transitionTimingFunction:
                      "cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          DESKTOP FOOTER
      ========================================================== */}
      <div className="hidden lg:block">
        <div
          className="mx-auto w-full"
          style={{
            maxWidth: "1800px",
            paddingTop: "clamp(72px, 6vw, 106px)",
            paddingRight: "clamp(32px, 4.5vw, 92px)",
            paddingBottom: "clamp(58px, 5vw, 84px)",
            paddingLeft: "clamp(32px, 4.5vw, 92px)",
          }}
        >
          <div
            className="grid items-start"
            style={{
              gridTemplateColumns:
                "minmax(230px, 1.35fr) repeat(4, minmax(125px, 0.85fr)) minmax(245px, 1.25fr)",
              columnGap: "clamp(44px, 4.2vw, 84px)",
            }}
          >
            {/* Desktop brand block */}
            <div
              className="flex flex-col items-center text-center xl:items-start xl:text-left"
              style={{
                maxWidth: "270px",
              }}
            >
              <Link
                href="#hero"
                aria-label="SoccaR home"
                className="inline-flex rounded-sm outline-none transition duration-300 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[#9CE500]/70 focus-visible:ring-offset-4 focus-visible:ring-offset-black"
                style={{
                  minHeight: "24px",
                  transform: "translateY(-8px)",
                }}
              >
                <Image
                  src="/images/logo/soccar-gold.webp"
                  alt="SoccaR"
                  width={170}
                  height={68}
                  className="h-auto w-[145px] object-contain xl:w-[158px]"
                />
              </Link>

              <p
                className="text-white/72"
                style={{
                  maxWidth: "250px",
                  marginTop: "12px",
                  fontSize: "clamp(0.72rem, 0.78vw, 0.8rem)",
                  lineHeight: "1.8",
                  letterSpacing: "0.11em",
                  textAlign: "center",
                }}
              >
                One global home for fans, players,
                <br />
                clubs and everyone shaping
                <br />
                football.
              </p>

              <div
                aria-hidden="true"
                style={{
                  width: "180px",
                  height: "1px",
                  marginTop: "24px",
                  marginInline: "auto",
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(156,229,0,0.82) 18%, rgba(156,229,0,0.82) 82%, transparent 100%)",
                }}
              />
            </div>

            {footerColumns.map((column) => (
              <FooterNavigationColumn
                key={column.title}
                column={column}
              />
            ))}

            {/* Desktop social section */}
            <div
              className="justify-self-end border-l border-white/12"
              style={{
                minWidth: "245px",
                paddingLeft: "clamp(34px, 3vw, 54px)",
              }}
            >
              <h3
                className="whitespace-nowrap font-semibold uppercase text-[#9CE500]"
                style={{
                  fontSize: "0.7rem",
                  lineHeight: "1.4",
                  letterSpacing: "0.2em",
                }}
              >
                Join the Conversation
              </h3>

              <div style={{ marginTop: "30px" }}>
                <SocialLinks />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop legal bar */}
        <div className="border-t border-white/12">
          <div
            className="mx-auto flex w-full items-center justify-between"
            style={{
              maxWidth: "1800px",
              paddingTop: "25px",
              paddingRight: "clamp(32px, 4.5vw, 92px)",
              paddingBottom: "25px",
              paddingLeft: "clamp(32px, 4.5vw, 92px)",
            }}
          >
            <p
              className="text-white/68"
              style={{
                fontSize: "clamp(0.65rem, 0.72vw, 0.75rem)",
                lineHeight: "1.5",
                letterSpacing: "0.12em",
              }}
            >
              © 2026 SoccaR. All rights reserved. SoccaR is a registered
              trademark.
            </p>

            <div className="flex items-center">
              {["Privacy", "Terms", "Contact"].map((item, index) => (
                <Link
                  key={item}
                  href="#"
                  className="text-white/72 outline-none transition duration-300 hover:text-[#9CE500] focus-visible:text-[#9CE500]"
                  style={{
                    paddingLeft: index === 0 ? "0" : "20px",
                    paddingRight: index === 2 ? "0" : "20px",
                    borderLeft:
                      index === 0
                        ? "none"
                        : "1px solid rgba(255,255,255,0.2)",
                    fontSize: "clamp(0.65rem, 0.72vw, 0.75rem)",
                    lineHeight: "1.5",
                    letterSpacing: "0.12em",
                    transitionTimingFunction:
                      "cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}