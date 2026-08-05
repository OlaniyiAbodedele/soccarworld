"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

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
      className="relative overflow-hidden bg-black text-white"
      style={{
        paddingTop: "clamp(100px, 8vw, 145px)",
        paddingBottom: "clamp(110px, 9vw, 165px)",
      }}
    >
      {/*
        Master section container.

        The wider left padding moves the entire composition slightly right
        on desktop. The heading, cards and button remain aligned because
        they all sit inside this one container.
      */}
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
        {/* Heading */}
        <motion.header
          className="mx-auto flex w-full flex-col items-center text-center"
          style={{
            maxWidth: "1320px",
          }}
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{
            once: true,
            amount: 0.4,
          }}
          transition={{
            duration: 0.85,
            ease: [0.22, 1, 0.36, 1],
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
            className="mx-auto w-full text-center font-serif text-white"
            style={{
              maxWidth: "1040px",
              marginTop: "24px",
              fontSize: "clamp(2.5rem, 4vw, 4.25rem)",
              lineHeight: "1.13",
              letterSpacing: "0.02em",
            }}
          >
            <span className="block">One Platform.</span>

            <span
              className="block"
              style={{
                marginTop: "7px",
              }}
            >
              Every Football Community.
            </span>
          </h2>

          <p
            className="mx-auto w-full text-center text-white/55"
            style={{
              maxWidth: "760px",
              marginTop: "26px",
              fontSize: "clamp(0.8rem, 0.95vw, 0.94rem)",
              lineHeight: "1.7",
              letterSpacing: "0.11em",
            }}
          >
            Every role. Every level. One place built entirely for the game.
          </p>
        </motion.header>

        {/* Card grid */}
        <div
          className="mx-auto grid grid-cols-1 justify-items-center sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
          style={{
            width: "100%",
            maxWidth: "1320px",
            marginTop: "clamp(62px, 5.5vw, 84px)",
            columnGap: "clamp(18px, 1.6vw, 28px)",
            rowGap: "clamp(28px, 2.6vw, 42px)",
          }}
        >
          {communities.map((community, index) => (
            <motion.article
              key={community.title}
              className="group relative w-full overflow-hidden rounded-[22px]"
              style={{
                maxWidth: "238px",
                aspectRatio: "2 / 3",
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
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                delay: (index % 5) * 0.07,
                duration: 0.68,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={
                reduceMotion
                  ? undefined
                  : {
                      y: -8,
                      scale: 1.018,
                    }
              }
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
                className="object-contain transition-transform duration-700 group-hover:scale-[1.015]"
              />
            </motion.article>
          ))}
        </div>

        {/* Expansion message */}
        <motion.div
          className="flex w-full justify-center"
          style={{
            marginTop: "clamp(48px, 5vw, 70px)",
          }}
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.5,
          }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div
            className="inline-flex items-center justify-center border border-white/70 bg-black text-center font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:border-[#9CE500] hover:text-[#9CE500]"
            style={{
              minWidth: "clamp(280px, 24vw, 340px)",
              minHeight: "58px",
              borderRadius: "16px",
              padding: "15px 34px",
              fontSize: "0.86rem",
              letterSpacing: "0.16em",
            }}
          >
            More Communities Coming
          </div>
        </motion.div>
      </div>
    </section>
  );
}