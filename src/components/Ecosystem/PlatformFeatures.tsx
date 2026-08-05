"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

type PlatformValue = {
  title: string;
  subtitle: string;
  icon: "platform" | "intelligence" | "scale";
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
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="platform-features"
      aria-labelledby="platform-features-heading"
      className="relative w-full overflow-hidden bg-black text-white"
      style={{
        paddingTop: "clamp(32px, 3vw, 56px)",
        paddingBottom: "clamp(72px, 6vw, 112px)",
      }}
    >
      <div
        className="relative w-full overflow-hidden bg-black"
        style={{
          aspectRatio: "3 / 2",
          minHeight: "760px",
        }}
      >
        {/* Cinematic platform artwork */}
        <motion.div
          className="absolute inset-0"
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  scale: 1.01,
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
            src="/images/platform-features/platform-features-visual.png"
            alt="SoccaR platform connecting football communities, talent and club operations around the world"
            fill
            priority={false}
            sizes="100vw"
            className="object-cover object-top"
            style={{
              filter: "brightness(1.3) saturate(1.22) contrast(1.04)",
            }}
          />
        </motion.div>

        {/* Lighter left-side readability overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.54) 0%, rgba(0,0,0,0.36) 24%, rgba(0,0,0,0.1) 47%, rgba(0,0,0,0.01) 72%, rgba(0,0,0,0.02) 100%)",
          }}
        />

        {/* Restrained bottom fade */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.01) 0%, rgba(0,0,0,0) 54%, rgba(0,0,0,0.04) 77%, rgba(0,0,0,0.22) 100%)",
          }}
        />

        {/* Main editorial content */}
        <div
          className="relative z-20 flex h-full min-h-[760px] flex-col"
          style={{
            paddingTop: "clamp(88px, 8vw, 142px)",
            paddingRight: "clamp(28px, 5vw, 92px)",
            paddingBottom: "clamp(30px, 3vw, 46px)",
            paddingLeft: "clamp(28px, 5.8vw, 112px)",
          }}
        >
          <motion.header
            style={{
              width: "min(620px, 45vw)",
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
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p
              className="font-semibold uppercase text-[#9CE500]"
              style={{
                fontSize: "clamp(0.68rem, 0.8vw, 0.82rem)",
                lineHeight: "1.4",
                letterSpacing: "0.22em",
              }}
            >
              Platform Features
            </p>

            <div
              aria-hidden="true"
              style={{
                width: "52px",
                height: "2px",
                marginTop: "18px",
                background: "#9CE500",
              }}
            />

            <h2
              id="platform-features-heading"
              className="font-serif"
              style={{
                marginTop: "clamp(68px, 6.8vw, 108px)",
                fontSize: "clamp(2.1rem, 3.25vw, 4rem)",
                lineHeight: "1.12",
                letterSpacing: "-0.025em",
              }}
            >
              <span className="block text-white">
                Everything
                <br />
                football needs.
              </span>

              <span
                className="mt-[0.42em] block text-[#9CE500]"
                style={{
                  maxWidth: "620px",
                }}
              >
                The operating system
                <br />
                for world football.
              </span>
            </h2>
          </motion.header>

          <motion.p
            className="text-white/90"
            style={{
              width: "min(535px, 43vw)",
              marginTop: "clamp(54px, 5vw, 82px)",
              fontSize: "clamp(0.86rem, 1vw, 1rem)",
              lineHeight: "1.72",
              letterSpacing: "-0.005em",
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
            From discovering talent to managing clubs, publishing media and
            connecting football communities, SoccaR brings every football
            workflow into one intelligent ecosystem.
          </motion.p>

          {/* Value pillars */}
          <div
            className="grid w-full grid-cols-1 gap-7 sm:grid-cols-3 sm:gap-5"
            style={{
              maxWidth: "690px",
              marginTop: "clamp(130px, 11vw, 190px)",
            }}
          >
            {platformValues.map((value, index) => (
              <motion.article
                key={value.title}
                className="relative flex items-center gap-4 border-t border-white/20 pt-5 sm:block sm:border-t-0 sm:pt-0"
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
                  amount: 0.5,
                }}
                transition={{
                  duration: 0.65,
                  delay: 0.18 + index * 0.09,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {index > 0 && (
                  <div
                    aria-hidden="true"
                    className="absolute -left-3 top-0 hidden h-full w-px bg-white/20 sm:block"
                  />
                )}

                <div className="h-14 w-14 shrink-0 text-[#9CE500] sm:h-[62px] sm:w-[62px]">
                  <PlatformValueIcon type={value.icon} />
                </div>

                <div className="sm:mt-4">
                  <p
                    className="font-medium text-white"
                    style={{
                      fontSize: "clamp(0.72rem, 0.78vw, 0.82rem)",
                      lineHeight: "1.5",
                    }}
                  >
                    {value.title}
                  </p>

                  <p
                    className="text-white/85"
                    style={{
                      fontSize: "clamp(0.72rem, 0.78vw, 0.82rem)",
                      lineHeight: "1.5",
                    }}
                  >
                    {value.subtitle}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}