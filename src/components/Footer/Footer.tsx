"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

const PREMIUM_EASE = [0.22, 1, 0.36, 1] as const;

export default function Footer() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.footer
      className="relative w-full bg-[#050505] text-white"
      initial={
        reduceMotion
          ? false
          : {
              opacity: 0,
              y: 14,
            }
      }
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.1,
      }}
      transition={{
        duration: 0.7,
        ease: PREMIUM_EASE,
      }}
    >
      {/* Top divider */}
      <div
        aria-hidden="true"
        className="absolute left-0 right-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(156,229,0,0.28) 50%, transparent 100%)",
        }}
      />

      {/* Main brand area */}
      <div
        className="flex w-full flex-col items-center justify-center text-center"
        style={{
          paddingTop: "52px",
          paddingRight: "24px",
          paddingBottom: "48px",
          paddingLeft: "24px",
        }}
      >
        {/* Logo */}
        <Image
          src="/images/logo/soccar-gold.webp"
          alt="SoccaR"
          width={190}
          height={76}
          priority={false}
          style={{
            width: "150px",
            height: "auto",
            objectFit: "contain",
          }}
        />

        {/* Brand statement */}
        <p
          className="text-white/70"
          style={{
            width: "100%",
            maxWidth: "620px",
            marginTop: "24px",
            marginRight: "auto",
            marginLeft: "auto",
            textAlign: "center",
            fontSize: "clamp(0.74rem, 0.85vw, 0.84rem)",
            lineHeight: "1.75",
            letterSpacing: "0.09em",
          }}
        >
          One global home for fans, players, clubs and everyone shaping
          football.
        </p>
      </div>

      {/* Copyright bar */}
      <div
        className="w-full border-t border-white/10"
        style={{
          paddingTop: "18px",
          paddingRight: "24px",
          paddingBottom: "18px",
          paddingLeft: "24px",
        }}
      >
        <p
          className="mx-auto text-center text-white/50"
          style={{
            width: "100%",
            fontSize: "clamp(0.61rem, 0.68vw, 0.69rem)",
            lineHeight: "1.5",
            letterSpacing: "0.1em",
          }}
        >
          © 2026 SoccaR. All rights reserved.
        </p>
      </div>
    </motion.footer>
  );
}