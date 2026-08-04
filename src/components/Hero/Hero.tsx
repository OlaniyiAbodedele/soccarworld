"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

const heroStatistics = [
  {
    value: "4B+",
    label: "Global Fans",
  },
  {
    value: "265M",
    label: "Active Players",
  },
  {
    value: "1",
    label: "Platform for All",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.14,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-black"
      style={{ paddingTop: "96px" }}
    >
      {/* Cinematic background */}
      <motion.div
        className="absolute inset-0"
        initial={
          reduceMotion
            ? false
            : {
                opacity: 0,
                scale: 1.035,
              }
        }
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 1.8,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <Image
          src="/images/hero/hero-globe.webp"
          alt="Football player standing inside a global stadium environment"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "84% center" }}
        />

        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.94) 28%, rgba(0,0,0,0.76) 51%, rgba(0,0,0,0.08) 100%)",
          }}
        />

        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.22) 100%)",
          }}
        />

        {/* Soft SoccaR glow */}
        <motion.div
          aria-hidden="true"
          className="absolute rounded-full bg-[#9CE500]/10 blur-[120px]"
          style={{
            width: "520px",
            height: "520px",
            right: "8%",
            top: "16%",
          }}
          animate={
            reduceMotion
              ? undefined
              : {
                  opacity: [0.32, 0.52, 0.32],
                  scale: [1, 1.05, 1],
                }
          }
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Hero content */}
      <div
        className="relative z-10 mx-auto flex w-full items-center"
        style={{
          maxWidth: "1800px",
          minHeight: "calc(100vh - 96px)",
          paddingLeft: "clamp(48px, 5vw, 96px)",
          paddingRight: "clamp(48px, 5vw, 96px)",
        }}
      >
        <motion.div
          className="w-full"
          style={{
            maxWidth: "740px",
            paddingTop: "92px",
            paddingBottom: "64px",
          }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={itemVariants}
            className="text-xs font-semibold uppercase text-[#B6FF2B] sm:text-sm"
            style={{
              marginBottom: "40px",
              letterSpacing: "0.22em",
            }}
          >
            The Global Football Community Platform
          </motion.p>

          <motion.h1
            variants={itemVariants}
            className="font-serif text-white"
            style={{
              maxWidth: "700px",
              fontSize: "clamp(2.85rem, 3.8vw, 4rem)",
              lineHeight: "1.08",
              letterSpacing: "0.01em",
              margin: 0,
            }}
          >
            <span className="block">Football has united</span>
            <span className="block">the world on the pitch.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-base font-medium text-[#9CE500] sm:text-lg"
            style={{ marginTop: "46px" }}
          >
            Now it&apos;s time to unite it off the pitch.
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-sm text-white/75 sm:text-base"
            style={{
              maxWidth: "580px",
              marginTop: "30px",
              lineHeight: "1.8",
            }}
          >
            SoccaR is building the world&apos;s premium football platform where
            fans, players, clubs and the global football industry connect, grow
            and shape the future of the game.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row"
            style={{
              marginTop: "52px",
              gap: "20px",
            }}
          >
            <motion.a
              href="#founding-community"
              className="inline-flex items-center justify-center rounded-xl bg-[#9CE500] font-bold uppercase transition-colors duration-300 hover:bg-[#B2FF1A]"
              style={{
                color: "#000000",
                minWidth: "320px",
                minHeight: "72px",
                padding: "20px 40px",
                fontSize: "0.86rem",
                letterSpacing: "0.08em",
                boxShadow: "0 12px 34px rgba(156,229,0,0.16)",
              }}
              whileHover={
                reduceMotion
                  ? undefined
                  : {
                      y: -3,
                      scale: 1.015,
                      boxShadow: "0 18px 46px rgba(156,229,0,0.28)",
                    }
              }
              whileTap={reduceMotion ? undefined : { scale: 0.985 }}
              transition={{ duration: 0.25 }}
            >
              Join the Founding Community
            </motion.a>

            <motion.a
              href="#vision"
              className="inline-flex items-center justify-center rounded-xl border border-white/70 bg-black/25 font-semibold uppercase text-white transition-colors duration-300 hover:border-[#9CE500] hover:text-[#9CE500]"
              style={{
                minWidth: "270px",
                minHeight: "72px",
                padding: "20px 40px",
                fontSize: "0.86rem",
                letterSpacing: "0.12em",
              }}
              whileHover={
                reduceMotion
                  ? undefined
                  : {
                      y: -3,
                      scale: 1.015,
                      backgroundColor: "rgba(255,255,255,0.06)",
                    }
              }
              whileTap={reduceMotion ? undefined : { scale: 0.985 }}
              transition={{ duration: 0.25 }}
            >
              Explore the Vision
            </motion.a>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 border-t border-white/10"
            style={{
              maxWidth: "700px",
              marginTop: "100px",
              paddingTop: "34px",
              columnGap: "56px",
            }}
          >
            {heroStatistics.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 1.15 + index * 0.12,
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <p
                  className="font-semibold text-white"
                  style={{
                    fontSize: "1.75rem",
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </p>

                <p
                  className="font-semibold uppercase text-white/65"
                  style={{
                    marginTop: "10px",
                    fontSize: "0.72rem",
                    letterSpacing: "0.16em",
                  }}
                >
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}