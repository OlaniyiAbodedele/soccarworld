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
  const reduceMotion =
    useReducedMotion();

  return (
    <section
      id="why-soccar"
      className="
        relative overflow-hidden bg-black text-white
        pt-[74px] pb-[92px]
        md:pt-[clamp(100px,8vw,145px)]
        md:pb-[clamp(110px,9vw,165px)]
      "
    >
      <div
        className="w-full"
        style={{
          paddingLeft:
            "max(32px, calc((100vw - 1320px) / 2))",
          paddingRight:
            "max(32px, calc((100vw - 1320px) / 2))",
        }}
      >
        <div className="w-full">
          <motion.header
            className="flex w-full flex-col items-center text-center"
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
              duration: 0.85,
              ease: PREMIUM_EASE,
            }}
          >
            <div
              className="mx-auto flex w-full flex-col items-center text-center"
              style={{
                maxWidth: "1320px",
              }}
            >
              <p
                className="font-semibold uppercase text-[#9CE500]"
                style={{
                  width: "100%",
                  fontSize: "0.7rem",
                  lineHeight: "1.4",
                  letterSpacing: "0.2em",
                  textAlign: "center",
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
                  background:
                    "rgba(156,229,0,0.72)",
                }}
              />

              <h2
                className="w-full font-serif text-white"
                style={{
                  maxWidth: "1240px",
                  marginTop: "32px",
                  marginLeft: "auto",
                  marginRight: "auto",
                  fontSize:
                    "clamp(2.35rem, 3.6vw, 4.05rem)",
                  lineHeight: "1.12",
                  letterSpacing: "0.01em",
                  textAlign: "center",
                }}
              >
                <span className="hidden whitespace-nowrap lg:block">
                  Why another football platform?
                </span>

                <span className="block lg:hidden">
                  Why another football platform?
                </span>
              </h2>

              <p
                className="hidden whitespace-nowrap text-white/60 lg:block"
                style={{
                  width: "100%",
                  maxWidth: "1200px",
                  marginTop: "30px",
                  marginLeft: "auto",
                  marginRight: "auto",
                  fontSize:
                    "clamp(0.9rem, 1vw, 1.08rem)",
                  lineHeight: "1.75",
                  letterSpacing: "0.14em",
                  textAlign: "center",
                }}
              >
                Football doesn&apos;t need another social network.{" "}
                <span className="text-white/80">
                  It needs infrastructure.
                </span>
              </p>

              <p
                className="w-full text-white/60 lg:hidden"
                style={{
                  maxWidth: "760px",
                  marginTop: "30px",
                  marginLeft: "auto",
                  marginRight: "auto",
                  fontSize:
                    "clamp(0.9rem, 3.8vw, 1.05rem)",
                  lineHeight: "1.75",
                  letterSpacing: "0.13em",
                  textAlign: "center",
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
            </div>
          </motion.header>

          <motion.div
            className="relative w-full overflow-hidden bg-[#050806]"
            style={{
              marginTop:
                "clamp(34px, 4vw, 66px)",
              aspectRatio: "16 / 7.2",
            }}
            initial={false}
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
              sizes="(max-width: 640px) calc(100vw - 64px), (max-width: 1024px) calc(100vw - 80px), 1320px"
              className="object-cover object-center transition-transform duration-[1800ms] hover:scale-[1.018]"
            />

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

          <div
            aria-hidden="true"
            style={{
              width: "100%",
              height: "1px",
              marginTop:
                "clamp(46px, 5vw, 92px)",
              background:
                "rgba(255,255,255,0.13)",
            }}
          />

          <div
            className="grid w-full grid-cols-1 justify-items-center sm:grid-cols-2 xl:grid-cols-4"
            style={{
              marginTop:
                "clamp(46px, 5vw, 82px)",
              columnGap:
                "clamp(36px, 3.5vw, 64px)",
              rowGap:
                "clamp(68px, 8vw, 124px)",
            }}
          >
            {reasons.map(
              (
                reason,
                index
              ) => (
                <motion.article
                  key={
                    reason.number
                  }
                  className="w-full max-w-[320px] sm:max-w-[260px] xl:max-w-[240px]"
                  initial={false}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.25,
                  }}
                  transition={{
                    delay:
                      index *
                      0.09,
                    duration:
                      0.72,
                    ease:
                      PREMIUM_EASE,
                  }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      width: "100%",
                      height: "1px",
                      background:
                        "rgba(156,229,0,0.62)",
                    }}
                  />

                  <p
                    className="font-semibold text-white"
                    style={{
                      marginTop:
                        "28px",
                      fontSize:
                        "0.68rem",
                      lineHeight:
                        "1.4",
                      letterSpacing:
                        "0.18em",
                    }}
                  >
                    {
                      reason.number
                    }
                  </p>

                  <h3
                    className="whitespace-pre-line text-left text-white"
                    style={{
                      minHeight:
                        "148px",
                      marginTop:
                        "34px",
                      fontSize:
                        "clamp(1.4rem, 1.5vw, 1.85rem)",
                      lineHeight:
                        "1.2",
                      letterSpacing:
                        "-0.018em",
                    }}
                  >
                    {
                      reason.title
                    }
                  </h3>

                  <p
                    className="text-left text-white/55"
                    style={{
                      maxWidth:
                        "230px",
                      marginTop:
                        "clamp(32px, 3vw, 44px)",
                      fontSize:
                        "0.76rem",
                      lineHeight:
                        "1.9",
                      letterSpacing:
                        "0.12em",
                    }}
                  >
                    {
                      reason.description
                    }
                  </p>
                </motion.article>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}