"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

const stats = [
  {
    top: "10+",
    bottom: "Communities",
    accent: true,
  },
  {
    top: "1",
    bottom: "Identity",
    accent: false,
  },
  {
    top: "Global",
    bottom: "Connectivity",
    accent: true,
  },
  {
    top: "Infinite",
    bottom: "Possibilities",
    accent: false,
  },
];

export default function Ecosystem() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="ecosystem"
      className="relative overflow-hidden bg-black text-white"
      style={{
        paddingTop: "clamp(96px, 7vw, 132px)",
        paddingBottom: "clamp(96px, 8vw, 150px)",
      }}
    >
      <div
        className="w-full"
        style={{
          maxWidth: "1600px",
          marginInline: "auto",
          paddingLeft: "clamp(24px, 5vw, 88px)",
          paddingRight: "clamp(24px, 5vw, 88px)",
        }}
      >
        <div
          className="relative mx-auto overflow-hidden bg-black"
          style={{
            width: "100%",
            maxWidth: "1440px",
            minHeight: "clamp(820px, 76vw, 1060px)",
          }}
        >
          {/* Approved ecosystem artwork */}
          <motion.div
            className="absolute inset-0"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 1.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Image
              src="/images/ecosystem/ecosystem-visual.png"
              alt="The SoccaR global football ecosystem"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 96vw, 1440px"
              className="object-cover object-center"
            />
          </motion.div>

          {/* Gentle left overlay for heading readability */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 25%, rgba(0,0,0,0.02) 58%, rgba(0,0,0,0.14) 100%)",
            }}
          />

          {/* Heading block */}
          <motion.header
            className="absolute z-20"
            style={{
              top: "clamp(34px, 4vw, 60px)",
              left: "clamp(28px, 4vw, 64px)",
              width: "min(620px, 48vw)",
            }}
            initial={reduceMotion ? false : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.85,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p
              className="font-semibold uppercase text-[#9CE500]"
              style={{
                fontSize: "clamp(0.62rem, 0.72vw, 0.74rem)",
                lineHeight: "1.4",
                letterSpacing: "0.16em",
              }}
            >
              The SoccaR Ecosystem
            </p>

            <div
              aria-hidden="true"
              style={{
                width: "72px",
                height: "1px",
                marginTop: "16px",
                background: "rgba(156,229,0,0.8)",
              }}
            />

            <h2
              className="font-serif text-white"
              style={{
                marginTop: "46px",
                width: "100%",
                maxWidth: "620px",
                fontSize: "clamp(1.65rem, 2.2vw, 2.7rem)",
                lineHeight: "1.08",
                letterSpacing: "0.01em",
              }}
            >
              One Intelligent Ecosystem
              <br />
              Built Around Football.
            </h2>
          </motion.header>

          {/* Shorter, balanced supporting copy */}
          <motion.p
            className="absolute z-20 text-white/80"
            style={{
              left: "clamp(28px, 4vw, 64px)",
              bottom: "clamp(122px, 13vw, 178px)",
              width: "min(460px, 38vw)",
              fontSize: "clamp(0.74rem, 0.9vw, 0.9rem)",
              lineHeight: "1.72",
              letterSpacing: "0.1em",
            }}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.75,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            SoccaR connects football&apos;s people, institutions and
            opportunities in one{" "}
            <span className="text-[#9CE500]">
              purpose-built digital home.
            </span>
          </motion.p>

          <div
            aria-hidden="true"
            className="absolute z-20"
            style={{
              left: "clamp(24px, 3.5vw, 48px)",
              right: "clamp(24px, 3.5vw, 48px)",
              bottom: "104px",
              height: "1px",
              background: "rgba(255,255,255,0.23)",
            }}
          />

          {/* Statistics */}
          <div
            className="absolute inset-x-0 bottom-0 z-20 grid grid-cols-2 md:grid-cols-4"
            style={{
              minHeight: "104px",
              paddingLeft: "clamp(28px, 4vw, 72px)",
              paddingRight: "clamp(28px, 4vw, 72px)",
            }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={`${stat.top}-${stat.bottom}`}
                className="relative flex flex-col justify-center"
                style={{
                  paddingLeft:
                    index === 0 ? "0" : "clamp(22px, 3vw, 48px)",
                }}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.65,
                  delay: 0.15 + index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {index > 0 && (
                  <div
                    aria-hidden="true"
                    className="absolute left-0 top-1/2 hidden -translate-y-1/2 md:block"
                    style={{
                      width: "1px",
                      height: "62px",
                      background: "rgba(255,255,255,0.36)",
                    }}
                  />
                )}

                <p
                  className={
                    stat.accent
                      ? "uppercase text-[#9CE500]"
                      : "uppercase text-white"
                  }
                  style={{
                    fontSize: "clamp(0.98rem, 1.25vw, 1.3rem)",
                    lineHeight: "1.15",
                    letterSpacing: "0.12em",
                  }}
                >
                  {stat.top}
                </p>

                <p
                  className={
                    stat.accent
                      ? "uppercase text-[#9CE500]"
                      : "uppercase text-white"
                  }
                  style={{
                    marginTop: "4px",
                    fontSize: "clamp(0.92rem, 1.16vw, 1.18rem)",
                    lineHeight: "1.2",
                    letterSpacing: "0.12em",
                  }}
                >
                  {stat.bottom}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}