"use client";

import Image from "next/image";
import type { FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";

const memberTypes = [
  "Football Fan",
  "Player",
  "Club or Academy",
  "Coach",
  "Scout",
  "Football Agent",
  "Media Professional",
  "Football Organisation",
  "Brand or Sponsor",
  "Technology Partner",
  "Other",
];

const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo, Democratic Republic of the",
  "Congo, Republic of the",
  "Costa Rica",
  "Côte d’Ivoire",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czechia",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Holy See (Vatican City)",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea, North",
  "Korea, South",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "São Tomé and Príncipe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Türkiye",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

type SelectFieldProps = {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  options: string[];
  autoComplete?: string;
};

function SelectField({
  id,
  name,
  label,
  placeholder,
  options,
  autoComplete,
}: SelectFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-white/78"
        style={{
          marginBottom: "10px",
          fontSize: "0.72rem",
          lineHeight: "1.4",
          letterSpacing: "0.16em",
        }}
      >
        {label}
      </label>

      <div className="relative">
        <select
          id={id}
          name={name}
          required
          defaultValue=""
          autoComplete={autoComplete}
          className="h-[54px] w-full appearance-none rounded-[8px] border border-[#9CE500]/70 bg-black/55 text-white outline-none transition duration-300 hover:border-[#9CE500] focus:border-[#9CE500] focus:ring-2 focus:ring-[#9CE500]/20"
          style={{
            paddingLeft: "22px",
            paddingRight: "64px",
          }}
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CE500]"
          style={{
            right: "22px",
          }}
        >
          <path
            d="m5 7.5 5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

export default function FoundingCommunity() {
  const reduceMotion = useReducedMotion();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <section
      id="founding-community"
      aria-labelledby="founding-community-heading"
      className="relative w-full overflow-hidden bg-black text-white"
      style={{
        paddingTop: "clamp(72px, 6vw, 108px)",
        paddingBottom: "clamp(72px, 6vw, 108px)",
      }}
    >
      <div
        className="relative w-full overflow-hidden bg-black"
        style={{
          minHeight: "clamp(1180px, 90vw, 1380px)",
        }}
      >
        <motion.div
          className="absolute inset-0"
          initial={reduceMotion ? false : { opacity: 0, scale: 1.015 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <Image
            src="/images/founding-community/founding-community-visual.png"
            alt="A global football community gathered beneath the connected SoccaR world"
            fill
            priority={false}
            sizes="100vw"
            className="object-cover object-center"
            style={{
              filter: "brightness(1.1) saturate(1.12) contrast(1.03)",
            }}
          />
        </motion.div>

        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.08) 28%, rgba(0,0,0,0.16) 68%, rgba(0,0,0,0.54) 100%)",
          }}
        />

        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 38%, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.16) 34%, rgba(0,0,0,0.38) 78%, rgba(0,0,0,0.58) 100%)",
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[14px] z-10"
          style={{
            border: "1px solid rgba(156,229,0,0.62)",
          }}
        />

        <div
          className="relative z-20 flex w-full flex-col items-center text-center"
          style={{
            minHeight: "clamp(1180px, 90vw, 1380px)",
            paddingTop: "clamp(72px, 7vw, 118px)",
            paddingRight: "clamp(24px, 5vw, 88px)",
            paddingBottom: "clamp(72px, 6vw, 104px)",
            paddingLeft: "clamp(24px, 5vw, 88px)",
          }}
        >
          <motion.header
            className="flex w-full flex-col items-center"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{
              duration: 0.85,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p
              className="font-semibold uppercase text-white/90"
              style={{
                fontSize: "clamp(0.62rem, 0.72vw, 0.76rem)",
                lineHeight: "1.4",
                letterSpacing: "0.28em",
              }}
            >
              Join the Founding Community
            </p>

            <h2
              id="founding-community-heading"
              className="font-serif text-white"
              style={{
                maxWidth: "1040px",
                marginTop: "clamp(52px, 5.5vw, 86px)",
                fontSize: "clamp(2.6rem, 5vw, 5.4rem)",
                lineHeight: "1.05",
                letterSpacing: "0.08em",
                textWrap: "balance",
              }}
            >
              The future of football
              <br />
              begins with you.
            </h2>
          </motion.header>

          <motion.p
            className="text-white/84"
            style={{
              maxWidth: "690px",
              marginTop: "clamp(34px, 3.5vw, 54px)",
              fontSize: "clamp(0.88rem, 1.05vw, 1.05rem)",
              lineHeight: "1.65",
              letterSpacing: "0.16em",
              textWrap: "balance",
            }}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.75,
              delay: 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            Join the founding community shaping the future of football.
            <br className="hidden sm:block" />
            Be among the first to experience SoccaR before its global launch
            <br className="hidden sm:block" />
            and help build the world&apos;s connected football ecosystem.
          </motion.p>

          <motion.div
            className="w-full"
            style={{
              maxWidth: "860px",
              marginTop: "clamp(48px, 5vw, 78px)",
            }}
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{
              duration: 0.9,
              delay: 0.16,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div
              className="relative overflow-hidden rounded-[22px]"
              style={{
                border: "1px solid rgba(255,255,255,0.18)",
                background:
                  "linear-gradient(180deg, rgba(3,7,3,0.72) 0%, rgba(0,0,0,0.82) 100%)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.06), 0 28px 80px rgba(0,0,0,0.34)",
                padding:
                  "clamp(34px, 4.2vw, 62px) clamp(24px, 4.5vw, 68px)",
              }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-x-12 top-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(156,229,0,0.62), transparent)",
                }}
              />

              <div className="relative z-10">
                <p
                  className="font-serif text-white"
                  style={{
                    fontSize: "clamp(1.05rem, 1.4vw, 1.35rem)",
                    lineHeight: "1.4",
                    letterSpacing: "0.12em",
                  }}
                >
                  Become a Founding Member
                </p>

                <p
                  className="text-white/78"
                  style={{
                    marginTop: "clamp(20px, 2vw, 28px)",
                    fontSize: "clamp(0.8rem, 0.95vw, 0.96rem)",
                    lineHeight: "1.65",
                    letterSpacing: "0.12em",
                  }}
                >
                  Be among the first to shape football&apos;s next generation.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="text-left"
                  style={{
                    marginTop: "clamp(34px, 3.5vw, 48px)",
                  }}
                >
                  <div className="grid grid-cols-1 gap-x-8 gap-y-7 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="founding-first-name"
                        className="block text-white/78"
                        style={{
                          marginBottom: "10px",
                          fontSize: "0.72rem",
                          lineHeight: "1.4",
                          letterSpacing: "0.16em",
                        }}
                      >
                        First Name
                      </label>

                      <input
                        id="founding-first-name"
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        required
                        className="h-[54px] w-full rounded-[8px] border border-[#9CE500]/70 bg-black/35 px-5 text-white outline-none transition duration-300 hover:border-[#9CE500] focus:border-[#9CE500] focus:ring-2 focus:ring-[#9CE500]/20"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="founding-last-name"
                        className="block text-white/78"
                        style={{
                          marginBottom: "10px",
                          fontSize: "0.72rem",
                          lineHeight: "1.4",
                          letterSpacing: "0.16em",
                        }}
                      >
                        Last Name
                      </label>

                      <input
                        id="founding-last-name"
                        name="lastName"
                        type="text"
                        autoComplete="family-name"
                        required
                        className="h-[54px] w-full rounded-[8px] border border-[#9CE500]/70 bg-black/35 px-5 text-white outline-none transition duration-300 hover:border-[#9CE500] focus:border-[#9CE500] focus:ring-2 focus:ring-[#9CE500]/20"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label
                        htmlFor="founding-email"
                        className="block text-white/78"
                        style={{
                          marginBottom: "10px",
                          fontSize: "0.72rem",
                          lineHeight: "1.4",
                          letterSpacing: "0.16em",
                        }}
                      >
                        Email
                      </label>

                      <input
                        id="founding-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="h-[54px] w-full rounded-[8px] border border-[#9CE500]/70 bg-black/35 px-5 text-white outline-none transition duration-300 hover:border-[#9CE500] focus:border-[#9CE500] focus:ring-2 focus:ring-[#9CE500]/20"
                      />
                    </div>

                    <SelectField
                      id="founding-country"
                      name="country"
                      label="Country"
                      placeholder="Select your country"
                      options={countries}
                      autoComplete="country-name"
                    />

                    <SelectField
                      id="founding-member-type"
                      name="memberType"
                      label="I am joining as"
                      placeholder="Select a category"
                      options={memberTypes}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    className="flex w-full items-center justify-center rounded-[10px] bg-[#9CE500] px-6 font-semibold text-black outline-none focus-visible:ring-2 focus-visible:ring-[#9CE500] focus-visible:ring-offset-4 focus-visible:ring-offset-black"
                    style={{
                      minHeight: "58px",
                      marginTop: "clamp(28px, 3vw, 38px)",
                      fontSize: "clamp(0.82rem, 1vw, 1rem)",
                      lineHeight: "1.3",
                      letterSpacing: "0.2em",
                      boxShadow: "0 14px 36px rgba(156,229,0,0.14)",
                    }}
                    whileHover={
                      reduceMotion
                        ? undefined
                        : {
                            y: -2,
                            scale: 1.005,
                            boxShadow:
                              "0 18px 42px rgba(156,229,0,0.22)",
                          }
                    }
                    whileTap={
                      reduceMotion ? undefined : { scale: 0.995 }
                    }
                    transition={{
                      duration: 0.25,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    Reserve My Founding Membership
                  </motion.button>

                  <p
                    className="text-center text-white/62"
                    style={{
                      marginTop: "clamp(22px, 2.5vw, 30px)",
                      fontSize: "clamp(0.68rem, 0.8vw, 0.78rem)",
                      lineHeight: "1.55",
                      letterSpacing: "0.12em",
                    }}
                  >
                    Joining the Founding Community is free. Early access only.
                    <br className="hidden sm:block" />
                    Founding Members receive exclusive launch privileges.
                  </p>
                </form>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex w-full flex-wrap items-center justify-center"
            style={{
              maxWidth: "1040px",
              marginTop: "clamp(30px, 3.5vw, 48px)",
              columnGap: "clamp(18px, 2.5vw, 34px)",
              rowGap: "14px",
            }}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.7,
              delay: 0.22,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {[
              "Founding Member Status",
              "Early Product Access",
              "Direct Product Updates",
              "Priority Community Invitations",
            ].map((benefit) => (
              <p
                key={benefit}
                className="flex items-center text-white/86"
                style={{
                  fontSize: "clamp(0.64rem, 0.76vw, 0.74rem)",
                  lineHeight: "1.4",
                  letterSpacing: "0.14em",
                }}
              >
                <span
                  aria-hidden="true"
                  className="mr-2 font-semibold text-[#9CE500]"
                >
                  ✓
                </span>
                {benefit}
              </p>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}