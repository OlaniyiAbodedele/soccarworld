"use client";

import { FormEvent, useState } from "react";
import { Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

import styles from "./SignInClient.module.css";

type SignInResponse = {
  success: boolean;
  message?: string;
};

export default function SignInClient() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setState("error");
      setMessage(
        "Enter your SoccaR email address and password."
      );
      return;
    }

    setState("loading");

    try {
      const response = await fetch(
        "/api/auth/sign-in",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: normalizedEmail,
            password,
          }),
        }
      );

      const result =
        (await response.json()) as SignInResponse;

      if (!response.ok || !result.success) {
        setState("error");
        setMessage(
          result.message ||
            "We could not sign you in. Check your details and try again."
        );
        return;
      }

      setState("success");
      setMessage("Welcome back to SoccaR.");

      window.setTimeout(() => {
        router.push("/dashboard");
      }, 650);
    } catch (error) {
      console.error(
        "SoccaR sign-in request failed:",
        error
      );

      setState("error");
      setMessage(
        "Something unexpected happened while signing you in."
      );
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.ambient} />

      <section className={styles.shell}>
        <div className={styles.masthead}>
          <div className={styles.brand}>
            SOCCAR
          </div>

          <div className={styles.tagline}>
            The Global Football Community
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.greenRule} />

          <div className={styles.cardBody}>
            <div className={styles.memberAccess}>
              <div className={styles.memberAccessIcon}>
                <LockKeyhole
                  size={18}
                  strokeWidth={1.7}
                />
              </div>

              <span>Member Access</span>
            </div>

            <div className={styles.hero}>
              <h1 className={styles.title}>
                Welcome back to{" "}
                <span className={styles.titleAccent}>
                  SoccaR.
                </span>
              </h1>

              <p className={styles.description}>
                Sign in to continue to your secure SoccaR
                account and member experience.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className={styles.form}
            >
              <div className={styles.fieldGroup}>
                <label
                  htmlFor="email"
                  className={styles.label}
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  className={styles.input}
                  placeholder="Enter your email address"
                />
              </div>

              <div className={styles.fieldGroup}>
                <div className={styles.passwordHeader}>
                  <label
                    htmlFor="password"
                    className={styles.label}
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className={styles.forgotButton}
                    onClick={() =>
                      router.push("/forgot-password")
                    }
                  >
                    Forgot password?
                  </button>
                </div>

                <div className={styles.inputWrap}>
                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    className={styles.input}
                    placeholder="Enter your password"
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

              <div className={styles.ctaWrap}>
                <button
                  type="submit"
                  disabled={state === "loading"}
                  className={styles.cta}
                >
                  {state === "loading"
                    ? "SIGNING IN..."
                    : state === "success"
                      ? "SIGNED IN"
                      : "SIGN IN TO SOCCAR"}
                </button>
              </div>
            </form>

            <div className={styles.security}>
              <ShieldCheck
                size={19}
                strokeWidth={1.7}
              />

              <p>
                Secure access is available only to
                authorised SoccaR members.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <span>SoccaR</span>
          <span className={styles.footerDot}>•</span>
          <span>Private Member Access</span>
        </div>
      </section>
    </main>
  );
}