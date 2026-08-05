"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

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
      className="relative overflow-hidden bg-black text-white"
      style={{
        paddingTop: "clamp(100px, 8vw, 145px)",
        paddingBottom: "clamp(110px, 9vw, 165px)",
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
            className="font-semibold uppercase text-[#9CE500]"
            style={{
              fontSize: "0.7rem",
              lineHeight: "1.4",
              letterSpacing: "0.2em",
            }}
          >
            Why SoccaR
          </p>

          <div
            aria-hidden="true"
            style={{
              width: "66px",
              height: "1px",
              marginTop: "18px",
              background: "rgba(156,229,0,0.72)",
            }}
          />

          <h2
            className="mx-auto w-full text-center font-serif text-white"
            style={{
              maxWidth: "1160px",
              marginTop: "32px",
              fontSize: "clamp(2.45rem, 4vw, 4.35rem)",
              lineHeight: "1.12",
              letterSpacing: "0.035em",
            }}
          >
            Why another football platform?
          </h2>

          <p
            className="mx-auto w-full text-center text-white/60"
            style={{
              maxWidth: "920px",
              marginTop: "30px",
              fontSize: "clamp(1rem, 1.35vw, 1.32rem)",
              lineHeight: "1.75",
              letterSpacing: "0.18em",
            }}
          >
            <span className="block">
              Football doesn&apos;t need another social network.
            </span>

            <span
              className="block text-white/80"
              style={{
                marginTop: "8px",
              }}
            >
              It needs infrastructure.
            </span>
          </p>
        </motion.header>

        {/* Cinematic image */}
        <motion.div
          className="relative mx-auto overflow-hidden bg-[#050806]"
          style={{
            width: "100%",
            maxWidth: "1320px",
            marginTop: "clamp(42px, 4.5vw, 66px)",
            aspectRatio: "16 / 7.2",
          }}
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
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
            className="object-cover object-center transition-transform duration-[1800ms] hover:scale-[1.018]"
          />

          {/* Subtle cinematic overlays */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.18) 100%)",
            }}
          />

          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0"
            style={{
              height: "35%",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.34), rgba(0,0,0,0))",
            }}
          />
        </motion.div>

        {/* Divider */}
        <div
          aria-hidden="true"
          className="mx-auto"
          style={{
            width: "100%",
            maxWidth: "1320px",
            height: "1px",
            marginTop: "clamp(64px, 6vw, 92px)",
            background: "rgba(255,255,255,0.13)",
          }}
        />

        {/* Four reasons */}
        <div
          className="mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
          style={{
            width: "100%",
            maxWidth: "1320px",
            marginTop: "clamp(56px, 5vw, 78px)",
            columnGap: "clamp(32px, 4vw, 76px)",
            rowGap: "56px",
          }}
        >
          {reasons.map((reason, index) => (
            <motion.article
              key={reason.number}
              className="relative"
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
              viewport={{
                once: true,
                amount: 0.25,
              }}
              transition={{
                delay: index * 0.09,
                duration: 0.72,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: "100%",
                  maxWidth: "168px",
                  height: "1px",
                  background: "rgba(156,229,0,0.62)",
                }}
              />

              <p
                className="font-semibold text-white"
                style={{
                  marginTop: "28px",
                  fontSize: "0.68rem",
                  letterSpacing: "0.18em",
                }}
              >
                {reason.number}
              </p>

              <h3
                className="text-white"
  style={{
    minHeight: "180px",      // Increase from the current value
    display: "flex",
    alignItems: "flex-start",
    fontSize: "clamp(26px, 2vw, 40px)",
    lineHeight: "1.18",
    letterSpacing: "-0.02em",
  }}
>
  {reason.title}
              </h3>

              <p
                className="text-white/55"
                style={{
                  maxWidth: "225px",
                  marginTop: "clamp(44px, 4vw, 62px)",
                  fontSize: "0.76rem",
                  lineHeight: "1.9",
                  letterSpacing: "0.13em",
                }}
              >
                {reason.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}