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

type PlatformValue = {
  title: string;
  subtitle: string;
  icon:
    | "platform"
    | "intelligence"
    | "scale";
};

const platformValues: PlatformValue[] = [
  {
    title: "One Platform.",
    subtitle: "All of Football.",
    icon: "platform",
  },
  {
    title: "Smart by Design.",
    subtitle: "Secure by Default.",
    icon: "intelligence",
  },
  {
    title: "Built for Scale.",
    subtitle: "Ready for the World.",
    icon: "scale",
  },
];

function PlatformValueIcon({
  type,
}: {
  type: PlatformValue["icon"];
}) {
  if (type === "platform") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 48 48"
        className="h-full w-full"
        fill="none"
      >
        <path
          d="M24 4.5 41 11v12.2c0 9.9-6.9 17.2-17 20.3C13.9 40.4 7 33.1 7 23.2V11l17-6.5Z"
          stroke="currentColor"
          strokeWidth="1.4"
        />

        <circle
          cx="24"
          cy="22"
          r="8.5"
          stroke="currentColor"
          strokeWidth="1.4"
        />

        <path
          d="m24 13.5 3.6 2.7-1.4 4.3h-4.4l-1.4-4.3 3.6-2.7Zm-8.1 8.3 4.2-1.3 2.6 3.6-2.6 3.5-4.2-1.3v-4.5Zm16.2 0v4.5l-4.2 1.3-2.6-3.5 2.6-3.6 4.2 1.3ZM20.4 29l3.6-2.6 3.6 2.6-1.4 4.2h-4.4L20.4 29Z"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "intelligence") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 48 48"
        className="h-full w-full"
        fill="none"
      >
        <path
          d="M24 4.5 41 11v12.2c0 9.9-6.9 17.2-17 20.3C13.9 40.4 7 33.1 7 23.2V11l17-6.5Z"
          stroke="currentColor"
          strokeWidth="1.4"
        />

        <circle
          cx="24"
          cy="21"
          r="7"
          stroke="currentColor"
          strokeWidth="1.4"
        />

        <path
          d="M17 34c1.4-4.3 3.7-6.4 7-6.4s5.6 2.1 7 6.4M24 17v8M20 21h8"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      className="h-full w-full"
      fill="none"
    >
      <path
        d="M24 4.5 41 11v12.2c0 9.9-6.9 17.2-17 20.3C13.9 40.4 7 33.1 7 23.2V11l17-6.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />

      <path
        d="M15.5 31.5h17M18 31.5V25h4v6.5M22 31.5V20h4v11.5M26 31.5V15h4v16.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />

      <path
        d="m17 18 5-4 4 2 6-5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PlatformFeatures() {
  const reduceMotion =
    useReducedMotion();

  return (
    <section
      id="platform-features"
      aria-labelledby="platform-features-heading"
      className="
        relative w-full overflow-hidden bg-black text-white
        pt-[48px] pb-[64px]
        md:pt-[clamp(48px,4vw,72px)]
        md:pb-[clamp(88px,7vw,128px)]
      "
    >
      {/* =========================================================
          MOBILE LAYOUT
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
          {/* Mobile upper-content alignment rail */}
          <div className="w-full">
            <motion.header
              initial={false}
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
                  fontSize:
                    "0.66rem",
                  lineHeight:
                    "1.4",
                  letterSpacing:
                    "0.2em",
                }}
              >
                Platform Features
              </p>

              <motion.div
                aria-hidden="true"
                className="origin-left bg-[#9CE500]"
                style={{
                  width: "54px",
                  height: "1px",
                  marginTop: "18px",
                  opacity: 0.88,
                }}
                initial={false}
                whileInView={{
                  scaleX: 1,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.55,
                  delay: 0.1,
                  ease: PREMIUM_EASE,
                }}
              />

              <h2
                id="platform-features-heading"
                className="font-serif"
                style={{
                  width: "100%",
                  maxWidth:
                    "390px",
                  marginTop:
                    "40px",
                  fontSize:
                    "clamp(2rem, 9vw, 2.65rem)",
                  lineHeight:
                    "1.08",
                  letterSpacing:
                    "-0.02em",
                }}
              >
                <span className="block text-white">
                  Everything
                  <br />
                  football needs.
                </span>

                <span
                  className="block text-[#9CE500]"
                  style={{
                    marginTop:
                      "20px",
                  }}
                >
                  The operating system
                  <br />
                  for world football.
                </span>
              </h2>
            </motion.header>

            <motion.p
              className="text-white/82"
              style={{
                width: "100%",
                maxWidth:
                  "370px",
                marginTop:
                  "38px",
                fontSize:
                  "0.86rem",
                lineHeight:
                  "1.82",
                letterSpacing:
                  "0.005em",
              }}
              initial={false}
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
                delay: 0.1,
                ease: PREMIUM_EASE,
              }}
            >
              From discovering talent to
              managing clubs, publishing
              media and connecting football
              communities, SoccaR brings
              every football workflow into
              one intelligent ecosystem.
            </motion.p>
          </div>

          {/* Mobile artwork centred independently */}
          <motion.div
            className="relative w-full overflow-hidden bg-black"
            style={{
              minHeight: "520px",
              marginTop: "48px",
            }}
            initial={false}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
              amount: 0.12,
            }}
            transition={{
              duration: 1.1,
              ease: PREMIUM_EASE,
            }}
          >
            <Image
              src="/images/platform-features/platform-features-visual.png"
              alt="SoccaR platform connecting football communities, talent and club operations around the world"
              fill
              sizes="calc(100vw - 64px)"
              className="object-cover"
              style={{
                objectPosition:
                  "64% center",
                filter:
                  "brightness(1.22) saturate(1.16) contrast(1.03)",
              }}
            />

            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.4) 100%)",
              }}
            />
          </motion.div>

          {/* Mobile lower-content alignment rail */}
          <div
            className="w-full"
            style={{
              paddingLeft:
                "50px",
              marginTop:
                "44px",
            }}
          >
            <div
              className="grid w-full grid-cols-1"
              style={{
                rowGap:
                  "18px",
              }}
            >
              {platformValues.map(
                (
                  value,
                  index
                ) => (
                  <motion.article
                    key={
                      value.title
                    }
                    tabIndex={0}
                    className="group flex items-center gap-5 border-t border-white/18 py-6 outline-none"
                    initial={false}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    whileHover={
                      reduceMotion
                        ? undefined
                        : {
                            y: -3,
                          }
                    }
                    whileFocus={
                      reduceMotion
                        ? undefined
                        : {
                            y: -3,
                          }
                    }
                    viewport={{
                      once: true,
                      amount: 0.45,
                    }}
                    transition={{
                      duration:
                        0.65,
                      delay:
                        index *
                        0.08,
                      ease:
                        PREMIUM_EASE,
                    }}
                  >
                    <div className="h-[58px] w-[58px] shrink-0 text-[#9CE500] transition duration-300 group-hover:brightness-125 group-focus-visible:brightness-125">
                      <PlatformValueIcon
                        type={
                          value.icon
                        }
                      />
                    </div>

                    <div>
                      <p
                        className="font-medium text-white"
                        style={{
                          fontSize:
                            "0.82rem",
                          lineHeight:
                            "1.55",
                        }}
                      >
                        {
                          value.title
                        }
                      </p>

                      <p
                        className="text-white/72"
                        style={{
                          fontSize:
                            "0.8rem",
                          lineHeight:
                            "1.55",
                        }}
                      >
                        {
                          value.subtitle
                        }
                      </p>
                    </div>
                  </motion.article>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          DESKTOP / TABLET LAYOUT
      ========================================================== */}
      <div
        className="relative hidden w-full overflow-hidden bg-black md:block"
        style={{
          aspectRatio: "3 / 2",
          minHeight: "780px",
        }}
      >
        <motion.div
          className="absolute inset-0"
          initial={false}
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
            ease: PREMIUM_EASE,
          }}
        >
          <Image
            src="/images/platform-features/platform-features-visual.png"
            alt="SoccaR platform connecting football communities, talent and club operations around the world"
            fill
            sizes="100vw"
            className="object-cover object-top"
            style={{
              filter:
                "brightness(1.3) saturate(1.22) contrast(1.04)",
            }}
          />
        </motion.div>

        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.34) 24%, rgba(0,0,0,0.09) 48%, rgba(0,0,0,0.01) 72%, rgba(0,0,0,0.02) 100%)",
          }}
        />

        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.01) 0%, rgba(0,0,0,0) 54%, rgba(0,0,0,0.04) 77%, rgba(0,0,0,0.24) 100%)",
          }}
        />

        <div
          className="relative z-20 flex h-full min-h-[780px] flex-col"
          style={{
            paddingTop:
              "clamp(94px, 8vw, 148px)",
            paddingRight:
              "clamp(32px, 5vw, 96px)",
            paddingBottom:
              "clamp(34px, 3vw, 50px)",
            paddingLeft:
              "clamp(48px, 7vw, 136px)",
          }}
        >
          <motion.header
            style={{
              width:
                "min(610px, 43vw)",
            }}
            initial={false}
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
                fontSize:
                  "clamp(0.68rem, 0.8vw, 0.82rem)",
                lineHeight:
                  "1.4",
                letterSpacing:
                  "0.22em",
              }}
            >
              Platform Features
            </p>

            <motion.div
              aria-hidden="true"
              className="origin-left bg-[#9CE500]"
              style={{
                width: "56px",
                height: "1px",
                marginTop: "18px",
                opacity: 0.9,
              }}
              initial={false}
              whileInView={{
                scaleX: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.55,
                delay: 0.1,
                ease: PREMIUM_EASE,
              }}
            />

            <h2
              className="font-serif"
              style={{
                marginTop:
                  "clamp(68px, 6.8vw, 108px)",
                fontSize:
                  "clamp(2.1rem, 3.15vw, 3.9rem)",
                lineHeight:
                  "1.1",
                letterSpacing:
                  "-0.025em",
              }}
            >
              <span className="block text-white">
                Everything
                <br />
                football needs.
              </span>

              <span
                className="block text-[#9CE500]"
                style={{
                  maxWidth:
                    "610px",
                  marginTop:
                    "20px",
                }}
              >
                The operating system
                <br />
                for world football.
              </span>
            </h2>
          </motion.header>

          <motion.p
            className="text-white/88"
            style={{
              width:
                "min(510px, 40vw)",
              marginTop:
                "clamp(54px, 5vw, 82px)",
              fontSize:
                "clamp(0.86rem, 1vw, 1rem)",
              lineHeight:
                "1.82",
              letterSpacing:
                "-0.002em",
            }}
            initial={false}
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
              ease: PREMIUM_EASE,
            }}
          >
            From discovering talent to
            managing clubs, publishing
            media and connecting football
            communities, SoccaR brings
            every football workflow into
            one intelligent ecosystem.
          </motion.p>

          <div
            className="grid w-full grid-cols-3"
            style={{
              maxWidth: "760px",
              marginTop:
                "clamp(136px, 11vw, 198px)",
              columnGap:
                "clamp(34px, 4vw, 68px)",
            }}
          >
            {platformValues.map(
              (
                value,
                index
              ) => (
                <motion.article
                  key={
                    value.title
                  }
                  tabIndex={0}
                  className="group relative outline-none"
                  initial={false}
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
                    amount: 0.5,
                  }}
                  transition={{
                    duration:
                      0.65,
                    delay:
                      0.18 +
                      index *
                        0.09,
                    ease:
                      PREMIUM_EASE,
                  }}
                >
                  {index > 0 && (
                    <div
                      aria-hidden="true"
                      className="absolute top-0 h-full w-px bg-white/20"
                      style={{
                        left:
                          "clamp(-34px, -2vw, -18px)",
                      }}
                    />
                  )}

                  <div className="h-[64px] w-[64px] text-[#9CE500] transition duration-300 group-hover:brightness-125 group-focus-visible:brightness-125">
                    <PlatformValueIcon
                      type={
                        value.icon
                      }
                    />
                  </div>

                  <div
                    style={{
                      marginTop:
                        "20px",
                    }}
                  >
                    <p
                      className="font-medium text-white"
                      style={{
                        fontSize:
                          "clamp(0.74rem, 0.8vw, 0.84rem)",
                        lineHeight:
                          "1.55",
                      }}
                    >
                      {
                        value.title
                      }
                    </p>

                    <p
                      className="text-white/78"
                      style={{
                        marginTop:
                          "2px",
                        fontSize:
                          "clamp(0.72rem, 0.78vw, 0.82rem)",
                        lineHeight:
                          "1.55",
                      }}
                    >
                      {
                        value.subtitle
                      }
                    </p>
                  </div>
                </motion.article>
              )
            )}
          </div>
        </div>
      </div>

      {/* Approved mobile section separation */}
      <div
        aria-hidden="true"
        className="h-[56px] md:hidden"
      />
    </section>
  );
}