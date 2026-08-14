"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import {
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type ResetState =
  | "preparing"
  | "idle"
  | "loading"
  | "success"
  | "error";

type ResetResponse = {
  success?: boolean;
  message?: string;
};

const RECOVERY_INTENT_KEY =
  "soccar-password-recovery";

export default function ResetPasswordPage() {
  const router = useRouter();

  /*
   * Keep one browser Supabase client for
   * this page lifecycle.
   */
  const [supabase] =
    useState(() => createClient());

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [state, setState] =
    useState<ResetState>("preparing");

  const [message, setMessage] =
    useState(
      "Securing your password reset session..."
    );

  /*
   * Confirm that Supabase has finished
   * establishing the authenticated recovery
   * session.
   *
   * A short retry window prevents a genuine
   * recovery link from being incorrectly
   * declared invalid while the browser session
   * is still settling.
   */
  useEffect(() => {
    let cancelled = false;

    async function wait(
      milliseconds: number
    ) {
      await new Promise((resolve) =>
        window.setTimeout(
          resolve,
          milliseconds
        )
      );
    }

    async function confirmRecoveryUser() {
      /*
       * Give the auth client several short
       * opportunities to finish writing /
       * reading the recovery session.
       */
      for (
        let attempt = 0;
        attempt < 8;
        attempt += 1
      ) {
        if (cancelled) {
          return false;
        }

        const {
          data: { user },
          error,
        } =
          await supabase.auth.getUser();

        if (!error && user) {
          return true;
        }

        await wait(250);
      }

      return false;
    }

    async function prepareRecoverySession() {
      try {
        const currentUrl =
          new URL(
            window.location.href
          );

        const code =
          currentUrl.searchParams.get(
            "code"
          );

        /*
         * A fresh Supabase recovery link
         * carries a code. Store a temporary
         * browser marker so that refreshing
         * this page during the same recovery
         * journey does not destroy the intent.
         */
        if (code) {
          window.sessionStorage.setItem(
            RECOVERY_INTENT_KEY,
            "1"
          );
        }

        const hasRecoveryIntent =
          Boolean(code) ||
          window.sessionStorage.getItem(
            RECOVERY_INTENT_KEY
          ) === "1";

        if (!hasRecoveryIntent) {
          if (!cancelled) {
            setState("error");

            setMessage(
              "This password reset link is invalid or has expired. Please request a new reset link."
            );
          }

          return;
        }

        /*
         * Exchange the PKCE Auth Code when one
         * is present.
         *
         * If the browser/auth client has already
         * consumed the code, do not immediately
         * declare failure. We confirm whether a
         * valid recovery user exists below.
         */
        if (code) {
          const {
            error: exchangeError,
          } =
            await supabase.auth.exchangeCodeForSession(
              code
            );

          if (exchangeError) {
            console.warn(
              "SoccaR recovery code exchange did not complete immediately:",
              exchangeError
            );
          }

          /*
           * Remove the one-time code from the
           * visible URL once we have attempted
           * the exchange.
           */
          window.history.replaceState(
            {},
            "",
            "/reset-password"
          );
        }

        const recoveryUserReady =
          await confirmRecoveryUser();

        if (cancelled) {
          return;
        }

        if (!recoveryUserReady) {
          window.sessionStorage.removeItem(
            RECOVERY_INTENT_KEY
          );

          setState("error");

          setMessage(
            "This password reset link is invalid or has expired. Please request a new reset link."
          );

          return;
        }

        setState("idle");
        setMessage("");
      } catch (error) {
        console.error(
          "SoccaR recovery session preparation error:",
          error
        );

        if (!cancelled) {
          setState("error");

          setMessage(
            "We could not prepare your password reset session. Please request a new reset link."
          );
        }
      }
    }

    prepareRecoverySession();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      state === "loading" ||
      state === "preparing" ||
      state === "success"
    ) {
      return;
    }

    if (
      !password ||
      !confirmPassword
    ) {
      setState("error");

      setMessage(
        "Enter and confirm your new SoccaR password."
      );

      return;
    }

    if (password.length < 8) {
      setState("error");

      setMessage(
        "Your new password must contain at least 8 characters."
      );

      return;
    }

    if (
      password !== confirmPassword
    ) {
      setState("error");

      setMessage(
        "Your passwords do not match."
      );

      return;
    }

    setState("loading");
    setMessage("");

    try {
      const response =
        await fetch(
          "/api/auth/reset-password",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              password,
            }),
          }
        );

      const result =
        (await response.json()) as ResetResponse;

      if (
        !response.ok ||
        !result.success
      ) {
        setState("error");

        setMessage(
          result.message ||
            "We could not update your password."
        );

        return;
      }

      /*
       * Recovery has completed. Remove the
       * temporary browser recovery marker.
       */
      window.sessionStorage.removeItem(
        RECOVERY_INTENT_KEY
      );

      setState("success");

      setMessage(
        "Your SoccaR password has been updated successfully."
      );

      window.setTimeout(() => {
        router.replace("/sign-in");
        router.refresh();
      }, 1600);
    } catch (error) {
      console.error(
        "SoccaR password reset request failed:",
        error
      );

      setState("error");

      setMessage(
        "Something unexpected happened while updating your password."
      );
    }
  }

  function clearFormFeedback() {
    if (
      state === "error" &&
      !message
        .toLowerCase()
        .includes(
          "reset link"
        )
    ) {
      setState("idle");
      setMessage("");
    }
  }

  const recoveryReady =
    state === "idle" ||
    state === "loading" ||
    state === "success" ||
    (
      state === "error" &&
      !message
        .toLowerCase()
        .includes(
          "reset link"
        ) &&
      !message
        .toLowerCase()
        .includes(
          "prepare"
        )
    );

  return (
    <main className="fixed inset-0 overflow-x-hidden overflow-y-auto bg-[#050505] text-white">
      {/* Ambient atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 24% 24%, rgba(156,229,0,0.055) 0%, rgba(156,229,0,0) 31%), radial-gradient(circle at 82% 12%, rgba(156,229,0,0.035) 0%, rgba(156,229,0,0) 28%)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-190px] top-[-190px] h-[500px] w-[500px] rounded-full border border-[#9CE500]/[0.04]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-125px] top-[-125px] h-[370px] w-[370px] rounded-full border border-[#9CE500]/[0.035]"
      />

      <div
        className="relative z-10 flex min-h-screen w-full flex-col"
        style={{
          padding:
            "clamp(26px, 3vw, 42px) clamp(20px, 5vw, 68px) clamp(30px, 4vw, 56px)",
        }}
      >
        {/* Utility navigation */}
        <div>
          <button
            type="button"
            onClick={() =>
              router.push(
                "/sign-in"
              )
            }
            className="inline-flex items-center gap-2 text-[13px] text-white/42 transition hover:text-white"
          >
            <ArrowLeft
              size={17}
              strokeWidth={1.8}
            />

            Back to sign in
          </button>
        </div>

        {/* Brand */}
        <header
          className="text-center"
          style={{
            marginTop:
              "clamp(16px, 2vw, 28px)",
          }}
        >
          <div
            className="font-extrabold text-[#9CE500]"
            style={{
              fontSize:
                "clamp(0.82rem, 1vw, 0.96rem)",
              lineHeight: "1",
              letterSpacing:
                "0.48em",
            }}
          >
            SOCCAR
          </div>

          <div
            className="uppercase text-white/38"
            style={{
              marginTop: "10px",
              fontSize: "0.58rem",
              lineHeight: "1",
              fontWeight: 600,
              letterSpacing:
                "0.36em",
            }}
          >
            Secure Member Access
          </div>
        </header>

        {/* Main experience */}
        <section
  className="flex flex-1 items-center justify-center"
  style={{
    padding:
      "clamp(28px, 4vw, 52px) 0 clamp(22px, 3vw, 36px)",
  }}
>
          <div className="w-full max-w-[720px]">
            <section
              className="overflow-hidden rounded-[30px] border border-white/[0.09]"
              style={{
                background:
                  "linear-gradient(145deg, rgba(15,15,15,0.99) 0%, rgba(10,10,10,0.99) 100%)",
                boxShadow:
                  "0 34px 110px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.02)",
              }}
            >
              {/* Accent rule */}
              <div className="h-[3px] w-full bg-[#9CE500]" />

              <div
                style={{
                  padding:
                    "clamp(34px, 5vw, 58px) clamp(26px, 5vw, 58px) clamp(32px, 5vw, 50px)",
                }}
              >
                {/* Access identity */}
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#9CE500]/35 bg-[#9CE500]/[0.055] text-[#9CE500]">
                    <LockKeyhole
                      size={20}
                      strokeWidth={1.7}
                    />
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-[#9CE500]">
                      Create New Password
                    </p>

                    <p className="mt-2 text-[12px] text-white/32">
                      Secure account recovery
                    </p>
                  </div>
                </div>

                {/* Hero */}
                <div
                  style={{
                    marginTop:
                      "clamp(32px, 4vw, 44px)",
                  }}
                >
                  <h1
                    className="font-semibold text-white"
                    style={{
                      maxWidth: "590px",
                      fontSize:
                        "clamp(2.45rem, 5vw, 4.25rem)",
                      lineHeight: "1.02",
                      letterSpacing:
                        "-0.05em",
                      textWrap:
                        "balance",
                    }}
                  >
                    Secure your
                    <br />

                    <span className="text-[#9CE500]">
                      SoccaR account.
                    </span>
                  </h1>

                  <div
                    aria-hidden="true"
                    className="bg-[#9CE500]"
                    style={{
                      width: "70px",
                      height: "1px",
                      marginTop: "27px",
                    }}
                  />

                  <p
                    className="text-white/50"
                    style={{
                      maxWidth: "550px",
                      marginTop: "24px",
                      fontSize:
                        "clamp(0.91rem, 1.1vw, 1rem)",
                      lineHeight: "1.75",
                    }}
                  >
                    Create a new
                    password for your
                    SoccaR account.
                    Once updated,
                    you&apos;ll return
                    to sign in securely.
                  </p>
                </div>

                {/* Session preparation */}
                {state ===
                "preparing" ? (
                  <div
                    className="rounded-[18px] border border-[#9CE500]/20 bg-[#9CE500]/[0.045]"
                    style={{
                      marginTop: "36px",
                      padding:
                        "20px 22px",
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-[#9CE500]" />

                      <div>
                        <p className="text-[13px] font-semibold text-white/72">
                          Securing your
                          recovery session
                        </p>

                        <p className="mt-1 text-[12px] leading-5 text-white/38">
                          Please wait a
                          moment while we
                          verify your secure
                          password reset
                          request.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={
                      handleSubmit
                    }
                    style={{
                      marginTop:
                        "clamp(34px, 4vw, 44px)",
                    }}
                  >
                    {/* New password */}
                    <div>
                      <label
                        htmlFor="new-password"
                        className="block font-medium text-white/72"
                        style={{
                          fontSize:
                            "13px",
                          lineHeight:
                            "1.4",
                          marginLeft:
                            "2px",
                        }}
                      >
                        New password
                      </label>

                      <div
                        className="relative"
                        style={{
                          marginTop:
                            "11px",
                        }}
                      >
                        <input
                          id="new-password"
                          type={
                            showPassword
                              ? "text"
                              : "password"
                          }
                          value={
                            password
                          }
                          disabled={
                            !recoveryReady ||
                            state ===
                              "success"
                          }
                          onChange={(
                            event
                          ) => {
                            setPassword(
                              event.target
                                .value
                            );

                            clearFormFeedback();
                          }}
                          placeholder="Create a new password"
                          autoComplete="new-password"
                          className="w-full border border-white/10 bg-[#070707] text-[15px] text-white outline-none transition placeholder:text-white/22 focus:border-[#9CE500]/55 focus:shadow-[0_0_0_1px_rgba(156,229,0,0.13)] disabled:cursor-not-allowed disabled:opacity-45"
                          style={{
                            height:
                              "62px",
                            borderRadius:
                              "17px",

                            /*
                             * Explicit padding
                             * prevents password
                             * text from ever
                             * touching the field
                             * border.
                             */
                            paddingLeft:
                              "20px",
                            paddingRight:
                              "58px",
                          }}
                        />

                        <button
                          type="button"
                          disabled={
                            !recoveryReady ||
                            state ===
                              "success"
                          }
                          onClick={() =>
                            setShowPassword(
                              (
                                current
                              ) =>
                                !current
                            )
                          }
                          aria-label={
                            showPassword
                              ? "Hide password"
                              : "Show password"
                          }
                          className="absolute right-5 top-1/2 -translate-y-1/2 text-white/32 transition hover:text-white disabled:opacity-25"
                        >
                          {showPassword ? (
                            <EyeOff
                              size={20}
                              strokeWidth={
                                1.7
                              }
                            />
                          ) : (
                            <Eye
                              size={20}
                              strokeWidth={
                                1.7
                              }
                            />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm password */}
                    <div
                      style={{
                        marginTop:
                          "26px",
                      }}
                    >
                      <label
                        htmlFor="confirm-password"
                        className="block font-medium text-white/72"
                        style={{
                          fontSize:
                            "13px",
                          lineHeight:
                            "1.4",
                          marginLeft:
                            "2px",
                        }}
                      >
                        Confirm new
                        password
                      </label>

                      <div
                        className="relative"
                        style={{
                          marginTop:
                            "11px",
                        }}
                      >
                        <input
                          id="confirm-password"
                          type={
                            showConfirmPassword
                              ? "text"
                              : "password"
                          }
                          value={
                            confirmPassword
                          }
                          disabled={
                            !recoveryReady ||
                            state ===
                              "success"
                          }
                          onChange={(
                            event
                          ) => {
                            setConfirmPassword(
                              event.target
                                .value
                            );

                            clearFormFeedback();
                          }}
                          placeholder="Confirm your new password"
                          autoComplete="new-password"
                          className="w-full border border-white/10 bg-[#070707] text-[15px] text-white outline-none transition placeholder:text-white/22 focus:border-[#9CE500]/55 focus:shadow-[0_0_0_1px_rgba(156,229,0,0.13)] disabled:cursor-not-allowed disabled:opacity-45"
                          style={{
                            height:
                              "62px",
                            borderRadius:
                              "17px",
                            paddingLeft:
                              "20px",
                            paddingRight:
                              "58px",
                          }}
                        />

                        <button
                          type="button"
                          disabled={
                            !recoveryReady ||
                            state ===
                              "success"
                          }
                          onClick={() =>
                            setShowConfirmPassword(
                              (
                                current
                              ) =>
                                !current
                            )
                          }
                          aria-label={
                            showConfirmPassword
                              ? "Hide password"
                              : "Show password"
                          }
                          className="absolute right-5 top-1/2 -translate-y-1/2 text-white/32 transition hover:text-white disabled:opacity-25"
                        >
                          {showConfirmPassword ? (
                            <EyeOff
                              size={20}
                              strokeWidth={
                                1.7
                              }
                            />
                          ) : (
                            <Eye
                              size={20}
                              strokeWidth={
                                1.7
                              }
                            />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Feedback */}
                    {message && (
                      <div
                        className={`border ${
                          state ===
                          "success"
                            ? "border-[#9CE500]/25 bg-[#9CE500]/[0.055] text-[#c9ff69]"
                            : "border-red-400/20 bg-red-400/[0.055] text-red-200"
                        }`}
                        style={{
                          marginTop:
                            "24px",
                          padding:
                            "15px 17px",
                          borderRadius:
                            "14px",
                          fontSize:
                            "13px",
                          lineHeight:
                            "1.6",
                        }}
                      >
                        {message}
                      </div>
                    )}

                    {/* Action */}
                    <button
                      type="submit"
                      disabled={
                        state ===
                          "loading" ||
                        state ===
                          "success" ||
                        !recoveryReady
                      }
                      className="flex w-full items-center justify-center bg-[#9CE500] font-extrabold text-[#050505] transition hover:bg-[#a8f500] disabled:cursor-not-allowed disabled:opacity-50"
                      style={{
                        minHeight:
                          "60px",
                        marginTop:
                          "30px",
                        borderRadius:
                          "999px",
                        fontSize:
                          "13px",
                        letterSpacing:
                          "0.1em",
                      }}
                    >
                      {state ===
                      "loading"
                        ? "UPDATING PASSWORD..."
                        : state ===
                            "success"
                          ? "PASSWORD UPDATED"
                          : "UPDATE PASSWORD"}
                    </button>
                  </form>
                )}

                {/* Security footer */}
                <div
                  className="border-t border-white/[0.075]"
                  style={{
                    marginTop:
                      "clamp(34px, 4vw, 44px)",
                    paddingTop:
                      "24px",
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#9CE500]/20 bg-[#9CE500]/[0.035] text-[#9CE500]">
                      {state ===
                      "success" ? (
                        <Check
                          size={16}
                          strokeWidth={
                            2
                          }
                        />
                      ) : (
                        <ShieldCheck
                          size={17}
                          strokeWidth={
                            1.7
                          }
                        />
                      )}
                    </div>

                    <div>
                      <p className="text-[12px] font-semibold text-white/62">
                        Secure account
                        recovery
                      </p>

                      <p className="mt-1 max-w-[500px] text-[12px] leading-6 text-white/34">
                        Password
                        changes are
                        protected by
                        SoccaR secure
                        authentication.
                        A valid recovery
                        request is
                        required before
                        your password can
                        be changed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>

        {/* Footer */}
        <footer
  className="text-center"
  style={{
    marginTop: "-6px",
  }}
>
          <p
            className="font-semibold uppercase text-white/22"
            style={{
              fontSize: "0.58rem",
              lineHeight: "1.5",
              letterSpacing:
                "0.3em",
            }}
          >
            SoccaR · The Global Football
            Community Platform
          </p>
        </footer>
      </div>
    </main>
  );
}