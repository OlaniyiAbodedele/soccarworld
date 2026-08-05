"use client";

import { motion, useReducedMotion } from "framer-motion";

const PREMIUM_EASE = [0.22, 1, 0.36, 1] as const;

const problemItems = [
  {
    number: "01",
    title: "Fans",
    description:
      "Football conversations are scattered across generic social platforms, making meaningful community difficult.",
  },
  {
    number: "02",
    title: "Players",
    description:
      "Talent, identity and opportunity remain difficult to showcase globally.",
  },
  {
    number: "03",
    title: "Clubs",
    description:
      "Communities, content and supporter engagement exist across disconnected platforms.",
  },
  {
    number: "04",
    title: "Professionals",
    description:
      "Coaches, scouts, academies, media and agents lack one dedicated digital ecosystem.",
  },
];

const headingVariants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: PREMIUM_EASE,
    },
  },
};

export default function Problem() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="problem"
      aria-labelledby="problem-heading"
      className="relative overflow-hidden bg-black text-white"
      style={{
        paddingTop: "clamp(124px, 10.5vw, 176px)",
        paddingBottom: "clamp(136px, 11.5vw, 196px)",
      }}
    >
      <div
        className="mx-auto w-full"
        style={{
          paddingLeft: "clamp(28px, 5vw, 100px)",
          paddingRight: "clamp(28px, 5vw, 100px)",
        }}
      >
        {/* Editorial headline */}
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.3,
          }}
          variants={headingVariants}
        >
          <h2
            id="problem-heading"
            className="font-serif text-white"
            style={{
              width: "100%",
              fontSize: "clamp(2.2rem, 3.8vw, 4.15rem)",
              lineHeight: "1.18",
              letterSpacing: "0.01em",
              margin: 0,
              textWrap: "balance",
            }}
          >
            <span className="block xl:whitespace-nowrap">
              Football is the world&apos;s biggest community.
            </span>

            <span
              className="block xl:whitespace-nowrap"
              style={{
                marginTop: "clamp(14px, 1.4vw, 22px)",
              }}
            >
              Its digital experience remains fragmented.
            </span>
          </h2>
        </motion.div>

        {/* Section divider */}
        <motion.div
          aria-hidden="true"
          className="bg-white/20"
          style={{
            height: "1px",
            width: "100%",
            marginTop: "clamp(78px, 6.5vw, 106px)",
          }}
          initial={
            reduceMotion
              ? false
              : {
                  scaleX: 0,
                  transformOrigin: "left",
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
            duration: 1,
            ease: PREMIUM_EASE,
          }}
        />

        {/* Problem categories */}
        <div
          className="grid grid-cols-1 gap-y-20 sm:grid-cols-2 xl:grid-cols-4"
          style={{
            marginTop: "clamp(86px, 7.5vw, 114px)",
            columnGap: "clamp(40px, 5vw, 82px)",
          }}
        >
          {problemItems.map((item, index) => (
            <motion.article
              key={item.number}
              className="group relative outline-none"
              tabIndex={0}
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
                delay: index * 0.1,
                duration: 0.72,
                ease: PREMIUM_EASE,
              }}
              style={{
                paddingTop: "4px",
                paddingBottom: "8px",
              }}
            >
              <p
                className="font-semibold text-[#9CE500] transition duration-300 group-hover:brightness-125 group-focus-visible:brightness-125"
                style={{
                  fontSize: "1.8rem",
                  lineHeight: 1,
                  letterSpacing: "0.08em",
                  transitionTimingFunction:
                    "cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                {item.number}
              </p>

              <h3
                className="font-semibold text-[#9CE500] transition duration-300 group-hover:brightness-125 group-focus-visible:brightness-125"
                style={{
                  marginTop: "14px",
                  fontSize: "0.88rem",
                  lineHeight: "1.4",
                  letterSpacing: "0.12em",
                  transitionTimingFunction:
                    "cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                {item.title}
              </h3>

              <motion.div
                aria-hidden="true"
                className="origin-left bg-[#9CE500] transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                style={{
                  width: "52px",
                  height: "1px",
                  marginTop: "30px",
                  opacity: 0.78,
                  transitionTimingFunction:
                    "cubic-bezier(0.22, 1, 0.36, 1)",
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
                  delay: 0.24 + index * 0.1,
                  duration: 0.55,
                  ease: PREMIUM_EASE,
                }}
              />

              <p
                className="text-white/68 transition duration-300 group-hover:text-white/84 group-focus-visible:text-white/84"
                style={{
                  marginTop: "clamp(50px, 4vw, 62px)",
                  maxWidth: "310px",
                  fontSize: "clamp(0.94rem, 0.95vw, 0.98rem)",
                  lineHeight: "1.88",
                  letterSpacing: "0.025em",
                  transitionTimingFunction:
                    "cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                {item.description}
              </p>

              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-x-5 -inset-y-6 -z-10 rounded-[18px] border border-white/0 bg-white/0 opacity-0 shadow-[0_24px_70px_rgba(0,0,0,0)] transition duration-300 group-hover:border-white/[0.06] group-hover:bg-white/[0.015] group-hover:opacity-100 group-hover:shadow-[0_24px_70px_rgba(0,0,0,0.22)] group-focus-visible:border-white/[0.06] group-focus-visible:bg-white/[0.015] group-focus-visible:opacity-100"
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