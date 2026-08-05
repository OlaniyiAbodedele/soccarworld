"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

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
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Main footer */}
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
          {/* Brand block */}
          <div
            className="flex flex-col items-center text-center lg:items-start lg:text-left"
            style={{
              maxWidth: "270px",
            }}
          >
            <Link
              href="#hero"
              aria-label="SoccaR home"
              className="inline-flex items-center"
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
                className="h-auto w-[145px] object-contain sm:w-[158px]"
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

          {/* Navigation columns */}
          {footerColumns.map((column) => (
            <div key={column.title}>
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

              <ul
                style={{
                  marginTop: "26px",
                }}
              >
                {column.links.map((link, index) => (
                  <li
                    key={link.label}
                    style={{
                      marginTop: index === 0 ? "0" : "18px",
                    }}
                  >
                    <Link
                      href={link.href}
                      className="text-white/74 transition-colors duration-300 hover:text-[#9CE500] focus-visible:text-[#9CE500] focus-visible:outline-none"
                      style={{
                        fontSize: "clamp(0.71rem, 0.78vw, 0.81rem)",
                        lineHeight: "1.5",
                        letterSpacing: "0.11em",
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social block */}
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

            <div
              className="grid grid-cols-3"
              style={{
                width: "210px",
                marginTop: "30px",
                columnGap: "18px",
                rowGap: "18px",
              }}
            >
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-[54px] w-[54px] items-center justify-center rounded-full border border-[#9CE500]/80 text-white transition duration-300 hover:-translate-y-1 hover:border-[#9CE500] hover:bg-[#9CE500] hover:text-black focus-visible:bg-[#9CE500] focus-visible:text-black focus-visible:outline-none"
                >
                  <span className="h-6 w-6">{social.icon}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom legal bar */}
      <div className="border-t border-white/12">
        <div
          className="mx-auto flex w-full flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
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
                className="text-white/72 transition-colors duration-300 hover:text-[#9CE500] focus-visible:text-[#9CE500] focus-visible:outline-none"
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
                }}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
}