"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  MapPin,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";

import styles from "./ProfileClient.module.css";

type ProfileClientProps = {
  memberId: string;
  firstName: string;
  lastName: string;
  email: string;
  memberType?: string | null;
  countryOfResidence?: string | null;
  countryOfOrigin?: string | null;
  cityOfResidence?: string | null;
  username?: string | null;
};

type SaveState =
  | "idle"
  | "saving"
  | "success"
  | "error";

type ProfileSaveResponse = {
  success?: boolean;
  message?: string;
};

export default function ProfileClient({
  firstName,
  lastName,
  email,
  memberType,
  countryOfResidence,
  countryOfOrigin,
  cityOfResidence,
  username,
}: ProfileClientProps) {
  const router = useRouter();

  const [formUsername, setFormUsername] = useState(
    username ?? ""
  );

  const [formCountryOfOrigin, setFormCountryOfOrigin] =
    useState(countryOfOrigin ?? "");

  const [formCityOfResidence, setFormCityOfResidence] =
    useState(cityOfResidence ?? "");

  const [state, setState] =
    useState<SaveState>("idle");

  const [message, setMessage] = useState("");

  const profileCompletion = useMemo(() => {
    const fields = [
      firstName,
      lastName,
      email,
      memberType,
      countryOfResidence,
      formCountryOfOrigin,
      formCityOfResidence,
      formUsername,
    ];

    const complete = fields.filter(
      (value) =>
        typeof value === "string" &&
        value.trim().length > 0
    ).length;

    return Math.round(
      (complete / fields.length) * 100
    );
  }, [
    firstName,
    lastName,
    email,
    memberType,
    countryOfResidence,
    formCountryOfOrigin,
    formCityOfResidence,
    formUsername,
  ]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (state === "saving") {
      return;
    }

    const cleanUsername =
      formUsername.trim();

    const cleanCountryOfOrigin =
      formCountryOfOrigin.trim();

    const cleanCityOfResidence =
      formCityOfResidence.trim();

    if (
      !cleanUsername ||
      !cleanCountryOfOrigin ||
      !cleanCityOfResidence
    ) {
      setState("error");
      setMessage(
        "Please complete your username, country of origin and city of residence."
      );
      return;
    }

    if (cleanUsername.length < 3) {
      setState("error");
      setMessage(
        "Your SoccaR username must contain at least 3 characters."
      );
      return;
    }

    setState("saving");
    setMessage("");

    try {
      const response = await fetch(
        "/api/account/profile",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: cleanUsername,
            countryOfOrigin:
              cleanCountryOfOrigin,
            cityOfResidence:
              cleanCityOfResidence,
          }),
        }
      );

      const result =
        (await response.json()) as ProfileSaveResponse;

      if (!response.ok || !result.success) {
        setState("error");
        setMessage(
          result.message ||
            "We could not update your Founder profile."
        );
        return;
      }

      setState("success");
      setMessage(
        "Your Founder profile has been updated successfully."
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Founder profile update error:",
        error
      );

      setState("error");
      setMessage(
        "Something unexpected happened while updating your profile."
      );
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() =>
            router.push("/dashboard")
          }
        >
          <ArrowLeft
            size={17}
            strokeWidth={1.8}
          />
          Back to dashboard
        </button>

        <div className={styles.masthead}>
          <p className={styles.eyebrow}>
            Founder Profile
          </p>

          <h1 className={styles.title}>
            Complete your SoccaR identity.
          </h1>

          <p className={styles.description}>
            Your Founder profile shapes how you appear
            inside the SoccaR community. Complete the
            remaining details below.
          </p>
        </div>

        <div className={styles.layout}>
          <section className={styles.formCard}>
            <div className={styles.cardHeader}>
              <div>
                <p className={styles.cardEyebrow}>
                  Profile Details
                </p>

                <h2 className={styles.cardTitle}>
                  Founder information
                </h2>
              </div>

              <div
                className={styles.completionBadge}
              >
                {profileCompletion}%
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className={styles.form}
            >
              <div
                className={styles.readOnlyGrid}
              >
                <div
                  className={styles.readOnlyItem}
                >
                  <span>Full name</span>

                  <strong>
                    {firstName} {lastName}
                  </strong>
                </div>

                <div
                  className={styles.readOnlyItem}
                >
                  <span>Email</span>
                  <strong>{email}</strong>
                </div>

                <div
                  className={styles.readOnlyItem}
                >
                  <span>Member type</span>

                  <strong>
                    {memberType ||
                      "Not provided"}
                  </strong>
                </div>

                <div
                  className={styles.readOnlyItem}
                >
                  <span>Residence</span>

                  <strong>
                    {countryOfResidence ||
                      "Not provided"}
                  </strong>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label
                  htmlFor="username"
                  className={styles.label}
                >
                  Username
                </label>

                <input
                  id="username"
                  type="text"
                  value={formUsername}
                  onChange={(event) => {
                    setFormUsername(
                      event.target.value
                    );

                    if (state !== "idle") {
                      setState("idle");
                      setMessage("");
                    }
                  }}
                  className={styles.input}
                  placeholder="Choose your SoccaR username"
                  autoComplete="username"
                  maxLength={30}
                />
              </div>

              <div className={styles.fieldGrid}>
                <div
                  className={styles.fieldGroup}
                >
                  <label
                    htmlFor="countryOfOrigin"
                    className={styles.label}
                  >
                    Country of origin
                  </label>

                  <input
                    id="countryOfOrigin"
                    type="text"
                    value={formCountryOfOrigin}
                    onChange={(event) => {
                      setFormCountryOfOrigin(
                        event.target.value
                      );

                      if (state !== "idle") {
                        setState("idle");
                        setMessage("");
                      }
                    }}
                    className={styles.input}
                    placeholder="Enter country of origin"
                    maxLength={80}
                  />
                </div>

                <div
                  className={styles.fieldGroup}
                >
                  <label
                    htmlFor="cityOfResidence"
                    className={styles.label}
                  >
                    City of residence
                  </label>

                  <input
                    id="cityOfResidence"
                    type="text"
                    value={formCityOfResidence}
                    onChange={(event) => {
                      setFormCityOfResidence(
                        event.target.value
                      );

                      if (state !== "idle") {
                        setState("idle");
                        setMessage("");
                      }
                    }}
                    className={styles.input}
                    placeholder="Enter your city"
                    maxLength={80}
                  />
                </div>
              </div>

              {message && (
                <div
                  className={`${styles.feedback} ${
                    state === "success"
                      ? styles.feedbackSuccess
                      : styles.feedbackError
                  }`}
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={state === "saving"}
                className={styles.saveButton}
              >
                {state === "saving"
                  ? "SAVING..."
                  : state === "success"
                    ? "PROFILE SAVED"
                    : "SAVE FOUNDER PROFILE"}
              </button>
            </form>
          </section>

          <aside className={styles.identityCard}>
            <div className={styles.identityIcon}>
              <ShieldCheck
                size={24}
                strokeWidth={1.7}
              />
            </div>

            <p
              className={styles.identityEyebrow}
            >
              Your SoccaR Identity
            </p>

            <h2
              className={styles.identityTitle}
            >
              Founding Member
            </h2>

            <p className={styles.identityCopy}>
              Your Founder identity remains permanent.
              Profile updates improve how you appear
              inside SoccaR without changing your
              Founding Membership.
            </p>

            <div className={styles.identityMeta}>
              <div>
                <UserRound
                  size={16}
                  strokeWidth={1.8}
                />

                <span>
                  {memberType ||
                    "SoccaR Member"}
                </span>
              </div>

              <div>
                <MapPin
                  size={16}
                  strokeWidth={1.8}
                />

                <span>
                  {countryOfResidence ||
                    "Location pending"}
                </span>
              </div>
            </div>

            <div className={styles.statusRow}>
              <span>Membership status</span>

              <strong>
                Active
                <Check
                  size={13}
                  strokeWidth={2.4}
                />
              </strong>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}