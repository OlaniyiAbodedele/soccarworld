"use client";

import { motion, useReducedMotion } from "framer-motion";

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
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function Problem() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="problem"
      className="relative overflow-hidden bg-black text-white"
      style={{
        paddingTop: "clamp(110px, 10vw, 160px)",
        paddingBottom: "clamp(120px, 11vw, 180px)",
      }}
    >
      <div
        className="mx-auto w-full"
        style={{
          maxWidth: "none",
          paddingLeft: "clamp(28px, 5vw, 100px)",
          paddingRight: "clamp(28px, 5vw, 100px)",
        }}
      >
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={headingVariants}
        >
          <h2
            className="font-serif text-white"
            style={{
              width: "100%",
              maxWidth: "none",
              fontSize: "clamp(2.2rem, 3.8vw, 4.15rem)",
              lineHeight: "1.18",
              letterSpacing: "0.01em",
              margin: 0,
            }}
          >
            <span className="mt-5 block xl:whitespace-nowrap">
              Football is the world&apos;s biggest community.
            </span>

            <span className="mt-3 block xl:whitespace-nowrap">
              Its digital experience remains fragmented.
            </span>
          </h2>
        </motion.div>

        <motion.div
  aria-hidden="true"
  className="bg-white/15"
  style={{
    height: "1px",
    width: "100%",
    marginTop: "clamp(66px, 6vw, 90px)",
  }}
          initial={reduceMotion ? false : { scaleX: 0, transformOrigin: "left" }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
        />

        <div
          className="grid grid-cols-1 gap-y-16 sm:grid-cols-2 xl:grid-cols-4"
          style={{
            marginTop: "clamp(72px, 7vw, 95px)",
            columnGap: "clamp(36px, 5vw, 76px)",
          }}
        >
          {problemItems.map((item, index) => (
            <motion.article
              key={item.number}
              className="group"
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 26,
                    }
              }
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                delay: index * 0.1,
                duration: 0.72,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <p
                className="font-semibold text-[#9CE500]"
                style={{
                  fontSize: "1.8rem",
                  lineHeight: 1,
                  letterSpacing: "0.08em",
                }}
              >
                {item.number}
              </p>

              <h3
                className="font-semibold text-[#9CE500]"
                style={{
                  marginTop: "12px",
                  fontSize: "0.88rem",
                  letterSpacing: "0.12em",
                }}
              >
                {item.title}
              </h3>

              <motion.div
                aria-hidden="true"
                className="bg-[#9CE500]"
                style={{
                  width: "38px",
                  height: "1px",
                  marginTop: "26px",
                  opacity: 0.65,
                }}
                initial={reduceMotion ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.25 + index * 0.1,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />

              <p
                className="text-white/58 transition-colors duration-300 group-hover:text-white/75"
                style={{
                  marginTop: "48px",
                  maxWidth: "290px",
                  fontSize: "0.96rem",
                  lineHeight: "1.9",
                  letterSpacing: "0.035em",
                }}
              >
                {item.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}