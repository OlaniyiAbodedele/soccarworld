"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
} from "framer-motion";

const PREMIUM_EASE = [
  0.22,
  1,
  0.36,
  1,
] as const;

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
    opacity: 1,
    y: 0,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: PREMIUM_EASE,
    },
  },
};

export default function Hero() {
  const reduceMotion =
    useReducedMotion();

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden bg-black"
      style={{
        paddingTop: "96px",
      }}
    >
      {/* Cinematic background */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 1.8,
          ease: PREMIUM_EASE,
        }}
      >
        <Image
          src="/images/hero/hero-globe.webp"
          alt="Football player standing inside a global stadium environment"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{
            objectPosition:
              "84% center",
          }}
        />

        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.91) 28%, rgba(0,0,0,0.69) 54%, rgba(0,0,0,0.08) 100%)",
          }}
        />

        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.08) 48%, rgba(0,0,0,0.2) 100%)",
          }}
        />

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
                  opacity: [
                    0.32,
                    0.52,
                    0.32,
                  ],
                  scale: [
                    1,
                    1.05,
                    1,
                  ],
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
          minHeight:
            "calc(100vh - 96px)",
          paddingLeft:
            "clamp(36px, 5vw, 96px)",
          paddingRight:
            "clamp(24px, 5vw, 96px)",
        }}
      >
        <motion.div
          className="w-full max-w-[410px] sm:max-w-[740px]"
          style={{
            paddingTop:
              "clamp(76px, 8vw, 92px)",
            paddingBottom:
              "64px",
          }}
          variants={
            containerVariants
          }
          initial={false}
          animate="visible"
        >
          <motion.p
            variants={
              itemVariants
            }
            className="font-semibold uppercase text-[#B6FF2B]"
            style={{
              maxWidth: "520px",
              marginBottom:
                "clamp(34px, 8vw, 40px)",
              fontSize:
                "clamp(0.68rem, 3vw, 0.86rem)",
              lineHeight: "1.45",
              letterSpacing:
                "0.2em",
            }}
          >
            The Global Football
            Community Platform
          </motion.p>

          <motion.h1
            variants={
              itemVariants
            }
            className="font-serif text-white"
            style={{
              maxWidth: "700px",
              margin: 0,
              fontSize:
                "clamp(2.55rem, 10vw, 4rem)",
              lineHeight: "1.08",
              letterSpacing:
                "0.005em",
            }}
          >
            <span className="block">
              Football has united
            </span>

            <span className="block">
              the world on the pitch.
            </span>
          </motion.h1>

          <motion.p
            variants={
              itemVariants
            }
            className="font-medium text-[#9CE500]"
            style={{
              marginTop:
                "clamp(40px, 9vw, 46px)",
              fontSize:
                "clamp(0.96rem, 4vw, 1.12rem)",
              lineHeight: "1.55",
            }}
          >
            Now it&apos;s time to unite
            it off the pitch.
          </motion.p>

          <motion.p
            variants={
              itemVariants
            }
            className="text-white/78"
            style={{
              maxWidth: "560px",
              marginTop: "28px",
              fontSize:
                "clamp(0.86rem, 3.6vw, 1rem)",
              lineHeight: "1.82",
            }}
          >
            SoccaR is building the
            world&apos;s premium
            football platform where
            fans, players, clubs and
            the global football
            industry connect, grow and
            shape the future of the
            game.
          </motion.p>

          {/* Hero actions */}
          <motion.div
            variants={
              itemVariants
            }
            className="flex w-full flex-col sm:w-auto sm:flex-row"
            style={{
              marginTop:
                "clamp(44px, 10vw, 52px)",
              gap: "20px",
            }}
          >
            <motion.a
              href="#founding-community"
              className="inline-flex w-full items-center justify-center rounded-xl bg-[#9CE500] font-bold uppercase outline-none transition-colors duration-300 hover:bg-[#B2FF1A] focus-visible:ring-2 focus-visible:ring-[#9CE500] focus-visible:ring-offset-4 focus-visible:ring-offset-black sm:w-auto"
              style={{
                minHeight: "72px",
                padding:
                  "20px clamp(22px, 5vw, 40px)",
                color:
                  "#000000",
                fontSize:
                  "clamp(0.76rem, 3.2vw, 0.86rem)",
                lineHeight:
                  "1.35",
                letterSpacing:
                  "0.08em",
                textAlign:
                  "center",
                boxShadow:
                  "0 12px 34px rgba(156,229,0,0.16)",
              }}
              whileHover={
                reduceMotion
                  ? undefined
                  : {
                      y: -3,
                      scale:
                        1.012,
                      color:
                        "#000000",
                      boxShadow:
                        "0 18px 46px rgba(156,229,0,0.28)",
                    }
              }
              whileTap={
                reduceMotion
                  ? undefined
                  : {
                      scale:
                        0.985,
                    }
              }
              transition={{
                duration:
                  0.25,
                ease:
                  PREMIUM_EASE,
              }}
            >
              Join the Founding
              Community
            </motion.a>

            <motion.a
              href="#why-soccar"
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/70 bg-black/25 font-semibold uppercase text-white outline-none transition-colors duration-300 hover:border-[#9CE500] hover:text-[#9CE500] focus-visible:border-[#9CE500] focus-visible:text-[#9CE500] focus-visible:ring-2 focus-visible:ring-[#9CE500]/55 focus-visible:ring-offset-4 focus-visible:ring-offset-black sm:w-auto"
              style={{
                minHeight: "72px",
                padding:
                  "20px clamp(22px, 5vw, 40px)",
                fontSize:
                  "clamp(0.76rem, 3.2vw, 0.86rem)",
                lineHeight:
                  "1.35",
                letterSpacing:
                  "0.12em",
                textAlign:
                  "center",
              }}
              whileHover={
                reduceMotion
                  ? undefined
                  : {
                      y: -3,
                      scale:
                        1.012,
                      backgroundColor:
                        "rgba(255,255,255,0.06)",
                    }
              }
              whileTap={
                reduceMotion
                  ? undefined
                  : {
                      scale:
                        0.985,
                    }
              }
              transition={{
                duration:
                  0.25,
                ease:
                  PREMIUM_EASE,
              }}
            >
              Explore the Vision
            </motion.a>
          </motion.div>

          {/* Statistics */}
          <motion.div
            variants={
              itemVariants
            }
            className="grid w-full max-w-[410px] grid-cols-3 border-t border-white/12 sm:max-w-[700px]"
            style={{
              marginTop:
                "clamp(78px, 19vw, 100px)",
              paddingTop:
                "34px",
              columnGap:
                "clamp(14px, 5vw, 56px)",
            }}
          >
            {heroStatistics.map(
              (
                stat,
                index
              ) => (
                <motion.div
                  key={
                    stat.label
                  }
                  className="text-center sm:text-left"
                  initial={
                    false
                  }
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay:
                      1.15 +
                      index *
                        0.12,
                    duration:
                      0.65,
                    ease:
                      PREMIUM_EASE,
                  }}
                >
                  <p
                    className="font-semibold text-white"
                    style={{
                      fontSize:
                        "clamp(1.45rem, 6vw, 1.75rem)",
                      lineHeight:
                        1,
                    }}
                  >
                    {
                      stat.value
                    }
                  </p>

                  <p
                    className="font-semibold uppercase text-white/66"
                    style={{
                      marginTop:
                        "10px",
                      fontSize:
                        "clamp(0.6rem, 2.6vw, 0.72rem)",
                      lineHeight:
                        "1.45",
                      letterSpacing:
                        "0.14em",
                    }}
                  >
                    {
                      stat.label
                    }
                  </p>
                </motion.div>
              )
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}