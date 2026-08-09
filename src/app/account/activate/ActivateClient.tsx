"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import styles from "./ActivateClient.module.css";

type ActivationResponse = {
  success: boolean;
  memberId?: string;
  code?: string;
  message?: string;
};

export default function ActivateClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = useMemo(
    () => String(searchParams.get("token") ?? "").trim(),
    [searchParams]
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [state, setState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const [message, setMessage] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (state === "loading") return;

    setMessage("");

    if (!token) {
      setState("error");
      setMessage(
        "This SoccaR account activation link is invalid."
      );
      return;
    }

    if (password.length < 8) {
      setState("error");
      setMessage(
        "Your password must contain at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setState("error");
      setMessage(
        "Your passwords do not match."
      );
      return;
    }

    setState("loading");

    try {
      const response = await fetch(
  "/api/founder/verify/activate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password,
          }),
        }
      );

      const result =
        (await response.json()) as ActivationResponse;

      if (!response.ok || !result.success) {
        setState("error");
        setMessage(
          result.message ||
            "We could not activate your SoccaR account."
        );
        return;
      }

      setState("success");
      setMessage(
        "Your SoccaR account has been activated successfully."
      );

      window.setTimeout(() => {
        router.push("/sign-in");
      }, 1400);
    } catch (error) {
      console.error(
        "SoccaR account activation error:",
        error
      );

      setState("error");
      setMessage(
        "Something unexpected happened while activating your SoccaR account."
      );
    }
  }

  return (
    <main className={styles.page}>
      <section>
        <div className={styles.shell}>
          {/* Masthead */}
          <div className={styles.masthead}>
            <div className={styles.brand}>
              SOCCAR
            </div>

            <div className={styles.community}>
              Founding Community
            </div>
          </div>

          {/* Main Card */}
          <div className={styles.card}>
            <div className={styles.greenRule} />

            <div className={styles.cardBody}>
              {/* Hero */}
              <div className={styles.hero}>
                <p className={styles.eyebrow}>
                  Account Activation
                </p>

                <h1 className={styles.title}>
                  Activate your{" "}
                  <span
                    className={styles.titleAccent}
                  >
                    SoccaR
                  </span>{" "}
                  account.
                </h1>

                <p className={styles.description}>
                  Your Founding Membership is confirmed.
                  Create your secure password to access
                  SoccaR and your Founder dashboard.
                </p>
              </div>

              {/* Founder Status */}
              <div className={styles.statusPanel}>
                <p className={styles.sectionLabel}>
                  Founder Status
                </p>

                <div className={styles.statusRow}>
                  <div
                    className={`${styles.statusIcon} ${styles.statusIconActive}`}
                  >
                    <ShieldCheck
                      size={21}
                      strokeWidth={1.7}
                    />
                  </div>

                  <div
                    className={styles.statusContent}
                  >
                    <span
                      className={styles.statusName}
                    >
                      Founding Membership
                    </span>

                    <span
                      className={`${styles.statusValue} ${styles.statusValueActive}`}
                    >
                      ACTIVE
                      <Check
                        size={16}
                        strokeWidth={2.3}
                      />
                    </span>
                  </div>
                </div>

                <div className={styles.statusRow}>
                  <div className={styles.statusIcon}>
                    <UserRound
                      size={20}
                      strokeWidth={1.6}
                    />
                  </div>

                  <div
                    className={styles.statusContent}
                  >
                    <span
                      className={styles.statusName}
                    >
                      Founder Identity
                    </span>

                    <span
                      className={styles.statusValue}
                    >
                      CONFIRMED
                    </span>
                  </div>
                </div>

                <div className={styles.statusRow}>
                  <div className={styles.statusIcon}>
                    <LockKeyhole
                      size={19}
                      strokeWidth={1.6}
                    />
                  </div>

                  <div
                    className={styles.statusContent}
                  >
                    <span
                      className={styles.statusName}
                    >
                      Account Access
                    </span>

                    <span
                      className={`${styles.statusValue} ${styles.statusValueMuted}`}
                    >
                      PENDING
                    </span>
                  </div>
                </div>
              </div>

              {/* Secure Access */}
              <div className={styles.accessSection}>
                <p className={styles.sectionLabel}>
                  Secure Access
                </p>

                <h2 className={styles.accessTitle}>
                  Create your password
                </h2>

                <p className={styles.accessCopy}>
                  Use at least 8 characters. Choose a
                  password you do not use elsewhere.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className={styles.form}
                >
                  {/* Password */}
                  <div className={styles.fieldGroup}>
                    <label
                      htmlFor="password"
                      className={styles.label}
                    >
                      Password
                    </label>

                    <div
                      className={styles.inputWrap}
                    >
                      <input
                        id="password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        autoComplete="new-password"
                        value={password}
                        onChange={(event) =>
                          setPassword(
                            event.target.value
                          )
                        }
                        className={styles.input}
                        placeholder="Minimum 8 characters"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (current) => !current
                          )
                        }
                        className={styles.eyeButton}
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff
                            size={20}
                            strokeWidth={1.7}
                          />
                        ) : (
                          <Eye
                            size={20}
                            strokeWidth={1.7}
                          />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className={styles.fieldGroup}>
                    <label
                      htmlFor="confirmPassword"
                      className={styles.label}
                    >
                      Confirm password
                    </label>

                    <div
                      className={styles.inputWrap}
                    >
                      <input
                        id="confirmPassword"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(
                            event.target.value
                          )
                        }
                        className={styles.input}
                        placeholder="Re-enter your password"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (current) => !current
                          )
                        }
                        className={styles.eyeButton}
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff
                            size={20}
                            strokeWidth={1.7}
                          />
                        ) : (
                          <Eye
                            size={20}
                            strokeWidth={1.7}
                          />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Feedback */}
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

                  {/* CTA */}
                  <div className={styles.ctaWrap}>
                    <button
                      type="submit"
                      disabled={state === "loading"}
                      className={styles.cta}
                    >
                      {state === "loading"
                        ? "ACTIVATING..."
                        : state === "success"
                          ? "ACCOUNT ACTIVATED"
                          : "ACTIVATE MY SOCCAR ACCOUNT"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Security Note */}
              <div className={styles.security}>
                <div
                  className={styles.securityInner}
                >
                  <div
                    className={styles.securityIcon}
                  >
                    <ShieldCheck
                      size={21}
                      strokeWidth={1.7}
                    />
                  </div>

                  <p
                    className={styles.securityText}
                  >
                    Your Founder Number and Founding
                    Membership are permanent. Activating
                    your account only creates secure
                    access to SoccaR.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}