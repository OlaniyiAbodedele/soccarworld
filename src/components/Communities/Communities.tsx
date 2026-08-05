"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

const PREMIUM_EASE = [0.22, 1, 0.36, 1] as const;

type Community = {
  title: string;
  image: string;
};

const communities: Community[] = [
  {
    title: "Fans",
    image: "/images/communities/fans.webp",
  },
  {
    title: "Players",
    image: "/images/communities/players.webp",
  },
  {
    title: "Clubs",
    image: "/images/communities/clubs.webp",
  },
  {
    title: "Coaches",
    image: "/images/communities/coaches.webp",
  },
  {
    title: "Academies",
    image: "/images/communities/academies.webp",
  },
  {
    title: "Scouts",
    image: "/images/communities/scouts.webp",
  },
  {
    title: "Agents",
    image: "/images/communities/agents.webp",
  },
  {
    title: "Media",
    image: "/images/communities/media.webp",
  },
  {
    title: "Businesses",
    image: "/images/communities/businesses.webp",
  },
  {
    title: "Associations",
    image: "/images/communities/associations.webp",
  },
];

export default function Communities() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="communities"
      aria-labelledby="communities-heading"
      className="relative overflow-hidden bg-black text-white"
      style={{
        paddingTop: "clamp(116px, 9vw, 158px)",
        paddingBottom: "clamp(128px, 10vw, 182px)",
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
        {/* Editorial heading */}
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
            className="w-full text-center font-semibold uppercase text-[#9CE500]"
            style={{
              fontSize: "0.7rem",
              lineHeight: "1.4",
              letterSpacing: "0.2em",
            }}
          >
            Explore Communities
          </p>

          <h2
            id="communities-heading"
            className="mx-auto w-full text-center font-serif text-white"
            style={{
              maxWidth: "1040px",
              marginTop: "28px",
              fontSize: "clamp(2.5rem, 4vw, 4.25rem)",
              lineHeight: "1.13",
              letterSpacing: "0.02em",
              textWrap: "balance",
            }}
          >
            <span className="block">One Platform.</span>

            <span
              className="block"
              style={{
                marginTop: "10px",
              }}
            >
              Every Football Community.
            </span>
          </h2>

          <p
            className="mx-auto w-full text-center text-white/66"
            style={{
              maxWidth: "780px",
              marginTop: "32px",
              fontSize: "clamp(0.82rem, 0.95vw, 0.96rem)",
              lineHeight: "1.72",
              letterSpacing: "0.09em",
            }}
          >
            Every role. Every level. One place built entirely for the game.
          </p>
        </motion.header>

        {/* Community gallery */}
        <div
          className="mx-auto grid grid-cols-1 justify-items-center sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
          style={{
            width: "100%",
            maxWidth: "1320px",
            marginTop: "clamp(78px, 6.5vw, 102px)",
            columnGap: "clamp(20px, 1.8vw, 32px)",
            rowGap: "clamp(44px, 4vw, 64px)",
          }}
        >
          {communities.map((community, index) => (
            <motion.article
              key={community.title}
              aria-label={`${community.title} community`}
              tabIndex={0}
              className="group relative w-full overflow-hidden rounded-[22px] outline-none"
              style={{
                maxWidth: "238px",
                aspectRatio: "2 / 3",
                border: "1px solid rgba(255,255,255,0)",
                boxShadow: "0 24px 70px rgba(0,0,0,0)",
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
                      y: -6,
                      scale: 1.012,
                      borderColor: "rgba(156,229,0,0.28)",
                      boxShadow: "0 28px 78px rgba(0,0,0,0.42)",
                    }
              }
              whileFocus={
                reduceMotion
                  ? undefined
                  : {
                      y: -6,
                      scale: 1.012,
                      borderColor: "rgba(156,229,0,0.34)",
                      boxShadow: "0 28px 78px rgba(0,0,0,0.42)",
                    }
              }
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                delay: (index % 5) * 0.07,
                duration: 0.7,
                ease: PREMIUM_EASE,
              }}
            >
              <Image
                src={community.image}
                alt={`${community.title} — SoccaR Community`}
                fill
                sizes="
                  (max-width: 640px) 86vw,
                  (max-width: 1024px) 44vw,
                  (max-width: 1280px) 30vw,
                  238px
                "
                className="object-contain transition duration-700 group-hover:brightness-[1.04] group-hover:scale-[1.012] group-focus-visible:brightness-[1.04] group-focus-visible:scale-[1.012]"
                style={{
                  transitionTimingFunction:
                    "cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[22px] opacity-0 transition duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(156,229,0,0.025) 0%, rgba(0,0,0,0) 46%, rgba(156,229,0,0.04) 100%)",
                  transitionTimingFunction:
                    "cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              />
            </motion.article>
          ))}
        </div>

        {/* Expansion message */}
        <motion.div
          className="flex w-full justify-center"
          style={{
            marginTop: "clamp(64px, 5.5vw, 86px)",
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
            amount: 0.5,
          }}
          transition={{
            duration: 0.72,
            ease: PREMIUM_EASE,
          }}
        >
          <motion.div
            role="status"
            className="inline-flex items-center justify-center border border-white/65 bg-black text-center font-semibold text-white outline-none"
            style={{
              minWidth: "clamp(280px, 24vw, 340px)",
              minHeight: "58px",
              borderRadius: "16px",
              padding: "15px 34px",
              fontSize: "0.86rem",
              letterSpacing: "0.16em",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.025), 0 0 0 rgba(156,229,0,0)",
            }}
            whileHover={
              reduceMotion
                ? undefined
                : {
                    y: -2,
                    borderColor: "rgba(156,229,0,0.95)",
                    color: "#9CE500",
                    boxShadow: "0 14px 36px rgba(156,229,0,0.09)",
                  }
            }
            transition={{
              duration: 0.3,
              ease: PREMIUM_EASE,
            }}
          >
            More Communities Coming
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}