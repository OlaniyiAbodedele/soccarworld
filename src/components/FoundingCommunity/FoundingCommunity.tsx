"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export default function FoundingCommunity() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="founding-community"
      aria-labelledby="founding-community-heading"
      className="relative w-full overflow-hidden bg-black text-white"
      style={{
        paddingTop: "clamp(72px, 6vw, 108px)",
        paddingBottom: "clamp(72px, 6vw, 108px)",
      }}
    >
      <div
        className="relative w-full overflow-hidden bg-black"
        style={{
          aspectRatio: "16 / 11",
          minHeight: "820px",
        }}
      >
        {/* Founding Community cinematic artwork */}
        <motion.div
          className="absolute inset-0"
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  scale: 1.015,
                }
          }
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{
            once: true,
            amount: 0.16,
          }}
          transition={{
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <Image
            src="/images/founding-community/founding-community-visual.png"
            alt="A global football community gathered beneath the connected SoccaR world"
            fill
            priority={false}
            sizes="100vw"
            className="object-cover object-center"
            style={{
              filter: "brightness(1.1) saturate(1.12) contrast(1.03)",
            }}
          />
        </motion.div>

        {/* Overall cinematic veil */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.08) 28%, rgba(0,0,0,0.16) 68%, rgba(0,0,0,0.5) 100%)",
          }}
        />

        {/* Central readability treatment */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 38%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.18) 34%, rgba(0,0,0,0.4) 78%, rgba(0,0,0,0.58) 100%)",
          }}
        />

        {/* Restrained SoccaR border */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[14px] z-10"
          style={{
            border: "1px solid rgba(156,229,0,0.62)",
          }}
        />

        {/* Editorial content */}
        <div
          className="relative z-20 flex min-h-[820px] w-full flex-col items-center text-center"
          style={{
            paddingTop: "clamp(72px, 7vw, 118px)",
            paddingRight: "clamp(24px, 5vw, 88px)",
            paddingBottom: "clamp(60px, 6vw, 96px)",
            paddingLeft: "clamp(24px, 5vw, 88px)",
          }}
        >
          <motion.header
            className="flex w-full flex-col items-center"
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 24,
                  }
            }
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.35,
            }}
            transition={{
              duration: 0.85,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p
              className="font-semibold uppercase text-white/90"
              style={{
                fontSize: "clamp(0.62rem, 0.72vw, 0.76rem)",
                lineHeight: "1.4",
                letterSpacing: "0.28em",
              }}
            >
              Join the Founding Community
            </p>

            <h2
              id="founding-community-heading"
              className="font-serif text-white"
              style={{
                maxWidth: "1040px",
                marginTop: "clamp(52px, 5.5vw, 86px)",
                fontSize: "clamp(2.6rem, 5vw, 5.4rem)",
                lineHeight: "1.05",
                letterSpacing: "0.08em",
                textWrap: "balance",
              }}
            >
              The future of football
              <br />
              begins with you.
            </h2>
          </motion.header>

          <motion.p
            className="text-white/84"
            style={{
              maxWidth: "690px",
              marginTop: "clamp(34px, 3.5vw, 54px)",
              fontSize: "clamp(0.88rem, 1.05vw, 1.05rem)",
              lineHeight: "1.65",
              letterSpacing: "0.16em",
              textWrap: "balance",
            }}
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 18,
                  }
            }
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.4,
            }}
            transition={{
              duration: 0.75,
              delay: 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            Join the founding community shaping the future of football.
            <br className="hidden sm:block" />
            Be among the first to experience SoccaR before its global launch
            <br className="hidden sm:block" />
            and help build the world&apos;s connected football ecosystem.
          </motion.p>
        </div>
      </div>
    </section>
  );
}