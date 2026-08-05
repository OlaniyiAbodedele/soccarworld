"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

const PREMIUM_EASE = [0.22, 1, 0.36, 1] as const;

type Reason = {
  number: string;
  title: string;
  description: string;
};

const reasons: Reason[] = [
  {
    number: "01",
    title: "Purpose-built\nfor football.",
    description:
      "Every feature begins with the needs of the global game.",
  },
  {
    number: "02",
    title: "One identity.\nOne connected ecosystem.",
    description:
      "One trusted profile across every football community.",
  },
  {
    number: "03",
    title: "Every stakeholder.\nOne ecosystem.",
    description:
      "Fans, players, clubs, media, businesses and more.",
  },
  {
    number: "04",
    title: "Built for football’s\nnext century.",
    description:
      "Scalable technology for the world’s largest sport.",
  },
];

export default function WhySoccaR() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="why-soccar"
      aria-labelledby="why-soccar-heading"
      className="relative overflow-hidden bg-black text-white"
      style={{
        paddingTop: "clamp(116px, 9vw, 160px)",
        paddingBottom: "clamp(132px, 10vw, 188px)",
      }}
    >
      <div
        className="w-full"
        style={{
          maxWidth: "1600px",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "clamp(24px, 8vw, 165px)",
          paddingRight: "clamp(24px, 3vw, 56px)",
        }}
      >
        {/* Section introduction */}
        <motion.header
          className="mx-auto flex w-full flex-col items-center text-center"
          style={{
            maxWidth: "1320px",
          }}
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
            amount: 0.4,
          }}
          transition={{
            duration: 0.85,
            ease: PREMIUM_EASE,
          }}
        >
          <p
            className="font-semibold uppercase text-[#9CE500]"
            style={{
              fontSize: "0.7rem",
              lineHeight: "1.4",
              letterSpacing: "0.2em",
            }}
          >
            Why SoccaR
          </p>

          <motion.div
            aria-hidden="true"
            className="origin-center bg-[#9CE500]"
            style={{
              width: "72px",
              height: "1px",
              marginTop: "20px",
              opacity: 0.82,
            }}
            initial={
              reduceMotion
                ? false
                : {
                    scaleX: 0,
                  }
            }
            whileInView={{
              scaleX: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
              delay: 0.12,
              ease: PREMIUM_EASE,
            }}
          />

          <h2
            id="why-soccar-heading"
            className="mx-auto w-full text-center font-serif text-white"
            style={{
              maxWidth: "1200px",
              marginTop: "36px",
              fontSize: "clamp(2.45rem, 4vw, 4.35rem)",
              lineHeight: "1.12",
              letterSpacing: "0.03em",
              textWrap: "balance",
            }}
          >
            Why another football platform?
          </h2>

          <p
            className="mx-auto w-full text-center text-white/68"
            style={{
              maxWidth: "940px",
              marginTop: "34px",
              fontSize: "clamp(1rem, 1.35vw, 1.32rem)",
              lineHeight: "1.72",
              letterSpacing: "0.15em",
            }}
          >
            <span className="block">
              Football doesn&apos;t need another social network.
            </span>

            <span
              className="block text-white/88"
              style={{
                marginTop: "10px",
              }}
            >
              It needs infrastructure.
            </span>
          </p>
        </motion.header>

        {/* Cinematic image */}
        <motion.div
          className="group relative mx-auto overflow-hidden bg-[#050806]"
          style={{
            width: "100%",
            maxWidth: "1320px",
            marginTop: "clamp(52px, 5vw, 78px)",
            aspectRatio: "16 / 7.2",
          }}
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 30,
                }
          }
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 1,
            ease: PREMIUM_EASE,
          }}
        >
          <Image
            src="/images/why-soccar/why-soccar.webp"
            alt="A SoccaR footballer walking through a stadium tunnel towards the pitch"
            fill
            sizes="
              (max-width: 640px) 100vw,
              (max-width: 1024px) 94vw,
              1320px
            "
            className="object-cover object-center transition duration-[1800ms] group-hover:scale-[1.02]"
            style={{
              transitionTimingFunction:
                "cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />

          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.16) 100%)",
            }}
          />

          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0"
            style={{
              height: "36%",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.32), rgba(0,0,0,0))",
            }}
          />
        </motion.div>

        {/* Section divider */}
        <motion.div
          aria-hidden="true"
          className="mx-auto origin-left"
          style={{
            width: "100%",
            maxWidth: "1320px",
            height: "1px",
            marginTop: "clamp(86px, 7vw, 118px)",
            background: "rgba(255,255,255,0.18)",
          }}
          initial={
            reduceMotion
              ? false
              : {
                  scaleX: 0,
                }
          }
          whileInView={{
            scaleX: 1,
          }}
          viewport={{
            once: true,
            amount: 0.6,
          }}
          transition={{
            duration: 0.9,
            ease: PREMIUM_EASE,
          }}
        />

        {/* Four principles */}
        <div
          className="mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
          style={{
            width: "100%",
            maxWidth: "1320px",
            marginTop: "clamp(74px, 6vw, 102px)",
            columnGap: "clamp(36px, 4vw, 80px)",
            rowGap: "72px",
          }}
        >
          {reasons.map((reason, index) => (
            <motion.article
              key={reason.number}
              tabIndex={0}
              className="group relative outline-none"
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 28,
                    }
              }
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              whileHover={
                reduceMotion
                  ? undefined
                  : {
                      y: -4,
                    }
              }
              whileFocus={
                reduceMotion
                  ? undefined
                  : {
                      y: -4,
                    }
              }
              viewport={{
                once: true,
                amount: 0.25,
              }}
              transition={{
                delay: index * 0.09,
                duration: 0.72,
                ease: PREMIUM_EASE,
              }}
              style={{
                paddingTop: "2px",
                paddingBottom: "8px",
              }}
            >
              <div
                aria-hidden="true"
                className="origin-left bg-[#9CE500] transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                style={{
                  width: "100%",
                  maxWidth: "184px",
                  height: "1px",
                  opacity: 0.8,
                  transitionTimingFunction:
                    "cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              />

              <p
                className="font-semibold text-white/92 transition duration-300 group-hover:text-white group-focus-visible:text-white"
                style={{
                  marginTop: "30px",
                  fontSize: "0.68rem",
                  lineHeight: "1.4",
                  letterSpacing: "0.18em",
                  transitionTimingFunction:
                    "cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                {reason.number}
              </p>

              <h3
                className="whitespace-pre-line text-white transition duration-300 group-hover:text-white group-focus-visible:text-white"
                style={{
                  minHeight: "172px",
                  marginTop: "32px",
                  display: "flex",
                  alignItems: "flex-start",
                  fontSize: "clamp(1.65rem, 2vw, 2.5rem)",
                  lineHeight: "1.18",
                  letterSpacing: "-0.02em",
                  transitionTimingFunction:
                    "cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                {reason.title}
              </h3>

              <p
                className="text-white/66 transition duration-300 group-hover:text-white/82 group-focus-visible:text-white/82"
                style={{
                  maxWidth: "235px",
                  marginTop: "clamp(34px, 3vw, 48px)",
                  fontSize: "0.76rem",
                  lineHeight: "1.88",
                  letterSpacing: "0.11em",
                  transitionTimingFunction:
                    "cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                {reason.description}
              </p>

              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-x-5 -inset-y-6 -z-10 rounded-[18px] border border-white/0 bg-white/0 opacity-0 shadow-[0_24px_70px_rgba(0,0,0,0)] transition duration-300 group-hover:border-white/[0.05] group-hover:bg-white/[0.012] group-hover:opacity-100 group-hover:shadow-[0_24px_70px_rgba(0,0,0,0.2)] group-focus-visible:border-white/[0.05] group-focus-visible:bg-white/[0.012] group-focus-visible:opacity-100"
                style={{
                  transitionTimingFunction:
                    "cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}