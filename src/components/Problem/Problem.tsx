"use client";

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
  const reduceMotion =
    useReducedMotion();

  return (
    <section
      id="problem"
      aria-labelledby="problem-heading"
      className="
        relative overflow-hidden bg-black text-white
        pt-[84px] pb-[94px]
        md:pt-[clamp(124px,10.5vw,176px)]
        md:pb-[clamp(136px,11.5vw,196px)]
      "
    >
      {/* =========================================================
          MOBILE
      ========================================================== */}
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
          {/*
           * Mobile editorial rail.
           *
           * The previous additional 50px
           * left padding has been removed.
           * The outer 32px page padding now
           * establishes the mobile alignment.
           */}
          <div className="w-full">
            {/* Editorial headline */}
            <motion.div
              initial={
                reduceMotion
                  ? false
                  : "hidden"
              }
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.3,
              }}
              variants={
                headingVariants
              }
            >
              <h2
                id="problem-heading"
                className="font-serif text-white"
                style={{
                  width: "100%",
                  maxWidth:
                    "370px",
                  margin: 0,
                  fontSize:
                    "clamp(2rem, 8.2vw, 2.5rem)",
                  lineHeight:
                    "1.18",
                  letterSpacing:
                    "0.01em",
                }}
              >
                <span className="block">
                  Football is the
                  world&apos;s biggest
                  community.
                </span>

                <span
                  className="block"
                  style={{
                    marginTop:
                      "16px",
                  }}
                >
                  Its digital
                  experience remains
                  fragmented.
                </span>
              </h2>
            </motion.div>

            {/* Section divider */}
            <motion.div
              aria-hidden="true"
              className="origin-left"
              style={{
                width: "100%",
                height: "1px",

                /*
                 * Reduced from 78px.
                 */
                marginTop:
                  "54px",

                background:
                  "rgba(255,255,255,0.2)",
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
                duration: 1,
                ease: PREMIUM_EASE,
              }}
            />

            {/* Mobile problem categories */}
            <div
              className="grid grid-cols-1"
              style={{
                /*
                 * Reduced from 86px.
                 */
                marginTop:
                  "58px",

                /*
                 * Reduced from 104px.
                 * Still deliberately spacious,
                 * but no longer disconnected.
                 */
                rowGap:
                  "76px",
              }}
            >
              {problemItems.map(
                (
                  item,
                  index
                ) => (
                  <motion.article
                    key={
                      item.number
                    }
                    tabIndex={0}
                    className="group relative w-full outline-none"
                    style={{
                      maxWidth:
                        "320px",
                      paddingTop:
                        "4px",
                      paddingBottom:
                        "8px",
                    }}
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
                      delay:
                        index *
                        0.1,
                      duration:
                        0.72,
                      ease: PREMIUM_EASE,
                    }}
                  >
                    <p
                      className="font-semibold text-[#9CE500]"
                      style={{
                        fontSize:
                          "1.8rem",
                        lineHeight:
                          1,
                        letterSpacing:
                          "0.08em",
                      }}
                    >
                      {
                        item.number
                      }
                    </p>

                    <h3
                      className="font-semibold text-[#9CE500]"
                      style={{
                        marginTop:
                          "14px",
                        fontSize:
                          "0.88rem",
                        lineHeight:
                          "1.4",
                        letterSpacing:
                          "0.12em",
                      }}
                    >
                      {
                        item.title
                      }
                    </h3>

                    <motion.div
                      aria-hidden="true"
                      className="origin-left bg-[#9CE500]"
                      style={{
                        width:
                          "52px",
                        height:
                          "1px",
                        marginTop:
                          "28px",
                        opacity:
                          0.78,
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
                        delay:
                          0.24 +
                          index *
                            0.1,
                        duration:
                          0.55,
                        ease: PREMIUM_EASE,
                      }}
                    />

                    <p
                      className="text-white/68"
                      style={{
                        width: "100%",
                        maxWidth:
                          "310px",

                        /*
                         * Reduced from 50px.
                         */
                        marginTop:
                          "38px",

                        fontSize:
                          "0.9rem",
                        lineHeight:
                          "1.88",
                        letterSpacing:
                          "0.025em",
                      }}
                    >
                      {
                        item.description
                      }
                    </p>
                  </motion.article>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          DESKTOP / TABLET — ORIGINAL APPROVED LAYOUT
      ========================================================== */}
      <div
        className="mx-auto hidden w-full md:block"
        style={{
          maxWidth: "1800px",
          paddingLeft:
            "clamp(38px, 8vw, 100px)",
          paddingRight:
            "clamp(38px, 8vw, 100px)",
        }}
      >
        {/* Editorial headline */}
        <motion.div
          initial={
            reduceMotion
              ? false
              : "hidden"
          }
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.3,
          }}
          variants={
            headingVariants
          }
        >
          <h2
            className="font-serif text-white"
            style={{
              width: "100%",
              margin: 0,
              fontSize:
                "clamp(2.2rem, 3.8vw, 4.15rem)",
              lineHeight:
                "1.18",
              letterSpacing:
                "0.01em",
              textWrap:
                "balance",
            }}
          >
            <span className="block xl:whitespace-nowrap">
              Football is the
              world&apos;s biggest
              community.
            </span>

            <span
              className="block xl:whitespace-nowrap"
              style={{
                marginTop:
                  "clamp(14px, 1.4vw, 22px)",
              }}
            >
              Its digital
              experience remains
              fragmented.
            </span>
          </h2>
        </motion.div>

        {/* Section divider */}
        <motion.div
          aria-hidden="true"
          className="origin-left bg-white/20"
          style={{
            width: "100%",
            height: "1px",
            marginTop:
              "clamp(78px, 6.5vw, 106px)",
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
            duration: 1,
            ease: PREMIUM_EASE,
          }}
        />

        {/* Desktop problem categories */}
        <div
          className="grid grid-cols-2 xl:grid-cols-4"
          style={{
            marginTop:
              "clamp(86px, 7.5vw, 114px)",
            columnGap:
              "clamp(40px, 5vw, 82px)",
            rowGap:
              "clamp(86px, 8vw, 110px)",
          }}
        >
          {problemItems.map(
            (
              item,
              index
            ) => (
              <motion.article
                key={
                  item.number
                }
                tabIndex={0}
                className="group relative outline-none"
                style={{
                  paddingTop:
                    "4px",
                  paddingBottom:
                    "8px",
                }}
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
                  delay:
                    index *
                    0.1,
                  duration:
                    0.72,
                  ease: PREMIUM_EASE,
                }}
              >
                <p
                  className="font-semibold text-[#9CE500] transition duration-300 group-hover:brightness-125 group-focus-visible:brightness-125"
                  style={{
                    fontSize:
                      "1.8rem",
                    lineHeight:
                      1,
                    letterSpacing:
                      "0.08em",
                  }}
                >
                  {
                    item.number
                  }
                </p>

                <h3
                  className="font-semibold text-[#9CE500]"
                  style={{
                    marginTop:
                      "14px",
                    fontSize:
                      "0.88rem",
                    lineHeight:
                      "1.4",
                    letterSpacing:
                      "0.12em",
                  }}
                >
                  {
                    item.title
                  }
                </h3>

                <motion.div
                  aria-hidden="true"
                  className="origin-left bg-[#9CE500]"
                  style={{
                    width:
                      "52px",
                    height:
                      "1px",
                    marginTop:
                      "30px",
                    opacity:
                      0.78,
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
                    delay:
                      0.24 +
                      index *
                        0.1,
                    duration:
                      0.55,
                    ease: PREMIUM_EASE,
                  }}
                />

                <p
                  className="text-white/68"
                  style={{
                    maxWidth:
                      "310px",
                    marginTop:
                      "clamp(50px, 4vw, 62px)",
                    fontSize:
                      "clamp(0.94rem, 0.95vw, 0.98rem)",
                    lineHeight:
                      "1.88",
                    letterSpacing:
                      "0.025em",
                  }}
                >
                  {
                    item.description
                  }
                </p>
              </motion.article>
            )
          )}
        </div>
      </div>
    </section>
  );
}