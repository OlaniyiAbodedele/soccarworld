"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

const PREMIUM_EASE = [0.22, 1, 0.36, 1] as const;

const stats = [
  { top: "10+", bottom: "Communities", accent: true },
  { top: "1", bottom: "Identity", accent: false },
  { top: "Global", bottom: "Connectivity", accent: true },
  { top: "Infinite", bottom: "Possibilities", accent: false },
];

export default function Ecosystem() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="ecosystem"
      aria-labelledby="ecosystem-heading"
      className="relative overflow-hidden bg-black text-white"
      style={{
        paddingTop: "clamp(72px, 7vw, 132px)",
        paddingBottom: "clamp(96px, 8vw, 150px)",
      }}
    >
      {/* MOBILE */}
      <div
        className="w-full md:hidden"
        style={{
          paddingLeft: "32px",
          paddingRight: "32px",
        }}
      >
        <div
          className="mx-auto w-full"
          style={{
            maxWidth: "520px",
          }}
        >
          {/* Mobile heading alignment rail */}
<motion.header
  className="w-full"
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 20,
                  }
            }
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.3,
            }}
            transition={{
              duration: 0.8,
              ease: PREMIUM_EASE,
            }}
          >
            <p
              className="font-semibold uppercase text-[#9CE500]"
              style={{
                fontSize: "0.64rem",
                lineHeight: "1.4",
                letterSpacing: "0.18em",
              }}
            >
              The SoccaR Ecosystem
            </p>

            <motion.div
              aria-hidden="true"
              className="origin-left bg-[#9CE500]"
              style={{
                width: "72px",
                height: "1px",
                marginTop: "18px",
                opacity: 0.86,
              }}
              initial={reduceMotion ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.55,
                delay: 0.1,
                ease: PREMIUM_EASE,
              }}
            />

            <h2
              id="ecosystem-heading"
              className="font-serif text-white"
              style={{
                width: "100%",
                maxWidth: "390px",
                marginTop: "34px",
                fontSize: "clamp(2rem, 8.2vw, 2.5rem)",
                lineHeight: "1.08",
                letterSpacing: "0.005em",
              }}
            >
              One Intelligent
              <br />
              Ecosystem Built
              <br />
              Around Football.
            </h2>
          </motion.header>

          {/* Mobile ecosystem artwork — centred independently */}
          <motion.div
            className="relative mx-auto w-full overflow-hidden bg-black"
            style={{
              marginTop: "clamp(42px, 10vw, 56px)",
              aspectRatio: "1 / 1.02",
            }}
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    scale: 0.96,
                  }
            }
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
              amount: 0.14,
            }}
            transition={{
              duration: 1,
              ease: PREMIUM_EASE,
            }}
          >
            <Image
              src="/images/ecosystem/ecosystem-visual.png"
              alt="The SoccaR global football ecosystem"
              fill
              sizes="calc(100vw - 64px)"
              className="object-contain object-center"
              style={{
                transform: "scale(1.16)",
                transformOrigin: "center center",
                filter:
                  "brightness(1.07) saturate(1.04) contrast(1.025)",
              }}
            />
          </motion.div>

          {/* Mobile lower-content alignment rail */}
<div className="w-full">
            {/* Mobile supporting copy */}
            <motion.p
              className="w-full text-white/84"
              style={{
                maxWidth: "360px",
                marginTop: "clamp(24px, 6vw, 34px)",
                fontSize: "0.82rem",
                lineHeight: "1.8",
                letterSpacing: "0.065em",
              }}
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 16,
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
                duration: 0.72,
                ease: PREMIUM_EASE,
              }}
            >
              SoccaR connects football&apos;s people, institutions and
              opportunities in one{" "}
              <span className="font-medium text-[#9CE500]">
                purpose-built digital home.
              </span>
            </motion.p>

            {/* Mobile divider */}
            <motion.div
              aria-hidden="true"
              className="origin-left"
              style={{
                width: "100%",
                height: "1px",
                marginTop: "38px",
                background: "rgba(255,255,255,0.26)",
              }}
              initial={reduceMotion ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{
                once: true,
                amount: 0.7,
              }}
              transition={{
                duration: 0.8,
                ease: PREMIUM_EASE,
              }}
            />

            {/* Mobile statistics */}
            <div
              className="grid grid-cols-2"
              style={{
                marginTop: "8px",
              }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={`${stat.top}-${stat.bottom}`}
                  className="relative flex min-h-[112px] flex-col justify-center"
                  style={{
                    paddingLeft: index % 2 === 0 ? "4px" : "24px",
                    paddingRight: "8px",
                    borderLeft:
                      index % 2 === 0
                        ? "none"
                        : "1px solid rgba(255,255,255,0.2)",
                    borderBottom:
                      index < 2
                        ? "1px solid rgba(255,255,255,0.16)"
                        : "none",
                  }}
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
                    amount: 0.45,
                  }}
                  transition={{
                    duration: 0.62,
                    delay: index * 0.07,
                    ease: PREMIUM_EASE,
                  }}
                >
                  <p
                    className={
                      stat.accent
                        ? "uppercase text-[#9CE500]"
                        : "uppercase text-white"
                    }
                    style={{
                      fontSize: "1rem",
                      lineHeight: "1.15",
                      letterSpacing: "0.11em",
                    }}
                  >
                    {stat.top}
                  </p>

                  <p
                    className={
                      stat.accent
                        ? "uppercase text-[#9CE500]/90"
                        : "uppercase text-white/88"
                    }
                    style={{
                      marginTop: "7px",
                      fontSize: "0.86rem",
                      lineHeight: "1.25",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {stat.bottom}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP / TABLET */}
      <div
        className="mx-auto hidden w-full md:block"
        style={{
          maxWidth: "1800px",
          paddingLeft: "clamp(18px, 3vw, 56px)",
          paddingRight: "clamp(18px, 3vw, 56px)",
        }}
      >
        <div
          className="relative mx-auto overflow-hidden bg-black"
          style={{
            width: "100%",
            maxWidth: "1680px",
            minHeight: "clamp(820px, 68vw, 1060px)",
          }}
        >
          <motion.div
            className="absolute inset-0"
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    scale: 0.985,
                  }
            }
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 1.1,
              ease: PREMIUM_EASE,
            }}
          >
            <Image
              src="/images/ecosystem/ecosystem-visual.png"
              alt="The SoccaR global football ecosystem"
              fill
              sizes="(max-width: 1024px) 96vw, 1680px"
              className="object-cover"
              style={{
                objectPosition: "center center",
                filter: "brightness(1.035) contrast(1.02)",
              }}
            />
          </motion.div>

          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 25%, rgba(0,0,0,0.02) 58%, rgba(0,0,0,0.14) 100%)",
            }}
          />

          <motion.header
            className="absolute z-20"
            style={{
              top: "clamp(34px, 4vw, 60px)",
              left: "clamp(28px, 4vw, 64px)",
              width: "min(470px, 35vw)",
            }}
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    x: -24,
                  }
            }
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.3,
            }}
            transition={{
              duration: 0.85,
              ease: PREMIUM_EASE,
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
                width: "100%",
                maxWidth: "470px",
                marginTop: "46px",
                fontSize: "clamp(1.5rem, 1.9vw, 2.3rem)",
                lineHeight: "1.1",
                letterSpacing: "0.005em",
              }}
            >
              One Intelligent Ecosystem
              <br />
              Built Around Football.
            </h2>
          </motion.header>

          <motion.p
            className="absolute z-20 text-white/82"
            style={{
              left: "clamp(28px, 4vw, 64px)",
              bottom: "clamp(122px, 13vw, 178px)",
              width: "min(460px, 38vw)",
              fontSize: "clamp(0.74rem, 0.9vw, 0.9rem)",
              lineHeight: "1.72",
              letterSpacing: "0.09em",
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
              delay: 0.15,
              ease: PREMIUM_EASE,
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
              background: "rgba(255,255,255,0.25)",
            }}
          />

          <div
            className="absolute inset-x-0 bottom-0 z-20 grid grid-cols-4"
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
                initial={
                  reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 16,
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
                  duration: 0.65,
                  delay: 0.15 + index * 0.08,
                  ease: PREMIUM_EASE,
                }}
              >
                {index > 0 && (
                  <div
                    aria-hidden="true"
                    className="absolute left-0 top-1/2 -translate-y-1/2"
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