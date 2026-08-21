"use client";

import {
  type ReactNode,
  useState,
} from "react";

import {
  Bell,
  Check,
  Eye,
  FileText,
  Heart,
  ChevronDown,
  CircleUserRound,
  Gift,
  House,
  LogOut,
  Mail,
  MapPin,
  Megaphone,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  TicketCheck,
  UserPlus,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";

import { useRouter } from "next/navigation";

import styles from "./DashboardShell.module.css";

export type DashboardSection =
  | "dashboard"
  | "profile"
  | "community"
  | "updates";

type FootballIdentitySummary = {
  status: string | null;
  isCompleted: boolean;
  footballWorld: string | null;
  nationalTeam: string | null;
  primaryClub: string | null;
  primaryRole: string | null;
  additionalRoles: string[];
  footballBio: string | null;
};

type DashboardShellProps = {
  firstName: string;
  lastName: string;
  founderNumber?: string | null;
  email?: string | null;
  memberType?: string | null;
  countryOfResidence?: string | null;
  countryOfOrigin?: string | null;
  cityOfResidence?: string | null;
  username?: string | null;
  footballIdentity?: FootballIdentitySummary | null;

  activeSection?: DashboardSection;
  unreadUpdates?: number;

  contentMode?: "default" | "editorial";

  children?: ReactNode;
};

type SignOutResponse = {
  success: boolean;
  message?: string;
};

export default function DashboardShell({
  firstName,
  lastName,
  founderNumber,
  email,
  memberType,
  countryOfResidence,
  countryOfOrigin,
  cityOfResidence,
  username,
  footballIdentity,

  activeSection = "dashboard",
  unreadUpdates = 3,
  contentMode = "default",

  children,
}: DashboardShellProps) {
  const router = useRouter();

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const [
  accountMenuOpen,
  setAccountMenuOpen,
] = useState(false);

  const [
    signingOut,
    setSigningOut,
  ] = useState(false);

  const [
    signOutError,
    setSignOutError,
  ] = useState<
    string | null
  >(null);

  const fullName =
    `${firstName} ${lastName}`.trim() ||
    "SoccaR Member";

  const initials =
    `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`
      .toUpperCase() || "SM";

  const profileFields = [
    firstName,
    lastName,
    email,
    memberType,
    countryOfResidence,
    countryOfOrigin,
    cityOfResidence,
    username,
  ];

  const completedFields =
    profileFields.filter(
      (value) =>
        typeof value === "string" &&
        value.trim().length > 0
    ).length;

  const profileCompletion =
    Math.round(
      (completedFields /
        profileFields.length) *
        100
    );

  function navigateTo(
  path: string
) {
  setMobileMenuOpen(false);
  setAccountMenuOpen(false);
  router.push(path);
}

  function showComingSoon(
    feature: string
  ) {
    setMobileMenuOpen(false);

    setAccountMenuOpen(false);

    window.alert(
      `${feature} is coming soon to the SoccaR Founding Community.`
    );
  }

  async function handleSignOut() {
    if (signingOut) {
      return;
    }

    try {
      setSignOutError(null);
      setSigningOut(true);
      setMobileMenuOpen(false);

      const response =
        await fetch(
          "/api/auth/sign-out",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );

      const result =
        (await response.json()) as SignOutResponse;

      if (
        !response.ok ||
        !result.success
      ) {
        setSignOutError(
          result.message ||
            "We could not sign you out right now."
        );

        return;
      }

      /*
       * Replace rather than push so
       * the current protected page is
       * not added back into navigation
       * history as the next destination.
       */
      router.replace(
        "/sign-in"
      );

      router.refresh();
    } catch (error) {
      console.error(
        "SoccaR Founder sign-out error:",
        error
      );

      setSignOutError(
        "Something unexpected happened while signing you out."
      );
    } finally {
      setSigningOut(false);
    }
  }

  function navClass(
    section: DashboardSection
  ) {
    return `${styles.navItem} ${
      activeSection === section
        ? styles.navItemActive
        : ""
    }`;
  }

  const dashboardContent =
    children ?? (
      <>
        {/* LOCKED DASHBOARD — FOOTBALL IDENTITY */}
        <section
          style={{
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: "18px",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.022), rgba(156,229,0,0.018))",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "18px 22px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "18px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "9px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#FFFFFF",
                  fontSize: "15px",
                  fontWeight: 850,
                  letterSpacing: "-0.01em",
                  textTransform: "uppercase",
                }}
              >
                Your Football Identity
              </p>

              <span
                aria-hidden="true"
                style={{
                  width: "18px",
                  height: "18px",
                  display: "grid",
                  placeItems: "center",
                  border: "1px solid rgba(255,255,255,0.35)",
                  borderRadius: "50%",
                  color: "rgba(255,255,255,0.72)",
                  fontSize: "11px",
                  fontWeight: 800,
                }}
              >
                i
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigateTo("/football-identity")}
              style={{
                minHeight: "32px",
                padding: "0 12px",
                border: "1px solid rgba(255,255,255,0.16)",
                borderRadius: "7px",
                background: "rgba(255,255,255,0.015)",
                color: "rgba(255,255,255,0.82)",
                fontSize: "10px",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              View / Edit
            </button>
          </div>

          <div
            style={{
              minHeight: "212px",
              display: "grid",
              gridTemplateColumns:
                "minmax(300px, 0.72fr) minmax(0, 1.58fr)",
              marginTop: "2px",
            }}
          >
            <div
              style={{
                padding: "18px 18px 18px 22px",
                borderRight: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "92px minmax(0, 1fr)",
                  gap: "18px",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "88px",
                    height: "88px",
                    display: "grid",
                    placeItems: "center",
                    border: "1px solid rgba(255,255,255,0.42)",
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle at 35% 30%, rgba(156,229,0,0.10), rgba(255,255,255,0.018) 58%, rgba(0,0,0,0.18))",
                    color: "#FFFFFF",
                    fontSize: "24px",
                    fontWeight: 900,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {initials}
                </div>

                <div style={{ minWidth: 0 }}>
                  <span
                    style={{
                      display: "inline-flex",
                      minHeight: "30px",
                      alignItems: "center",
                      padding: "0 12px",
                      border: "1px solid rgba(156,229,0,0.42)",
                      borderRadius: "7px",
                      background: "rgba(156,229,0,0.035)",
                      color: "#9CE500",
                      fontSize: "13px",
                      fontWeight: 900,
                    }}
                  >
                    Founder #{founderNumber ?? "------"}
                  </span>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      marginTop: "10px",
                    }}
                  >
                    <strong
                      style={{
                        color: "#FFFFFF",
                        fontSize: "13px",
                        fontWeight: 900,
                        textTransform: "uppercase",
                      }}
                    >
                      Founding Member
                    </strong>

                    {footballIdentity?.isCompleted && (
                      <span
                        title="Football Identity complete"
                        style={{
                          width: "17px",
                          height: "17px",
                          display: "grid",
                          placeItems: "center",
                          borderRadius: "50%",
                          background: "rgba(156,229,0,0.10)",
                          color: "#9CE500",
                        }}
                      >
                        <Check size={11} strokeWidth={2.5} />
                      </span>
                    )}
                  </div>

                  <p
                    style={{
                      maxWidth: "245px",
                      margin: "9px 0 0",
                      color: "rgba(255,255,255,0.58)",
                      fontSize: "11px",
                      lineHeight: 1.5,
                    }}
                  >
                    This is your football world.
                    <br />
                    Your team, club, role and location
                    <br />
                    are connected across SoccaR.
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                padding: "18px 18px 18px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                  gap: "10px",
                }}
              >
                {[
                  {
                    label: "National Team",
                    value: footballIdentity?.nationalTeam || "Add yours",
                    icon: <UsersRound size={19} strokeWidth={1.5} />,
                  },
                  {
                    label: "Club",
                    value: footballIdentity?.primaryClub || "Add yours",
                    icon: <ShieldCheck size={19} strokeWidth={1.5} />,
                  },
                  {
                    label: "Role",
                    value: footballIdentity?.primaryRole || "Add yours",
                    icon: <UserRound size={19} strokeWidth={1.5} />,
                  },
                  {
                    label: "Location",
                    value:
                      footballIdentity?.footballWorld ||
                      [cityOfResidence, countryOfResidence]
                        .filter(Boolean)
                        .join(", ") ||
                      "Add yours",
                    icon: <MapPin size={19} strokeWidth={1.5} />,
                  },
                ].map((item) => (
                  <div key={item.label} style={{ minWidth: 0 }}>
                    <span
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        color: "#9CE500",
                        fontSize: "9px",
                        fontWeight: 900,
                        letterSpacing: "0.045em",
                        textTransform: "uppercase",
                      }}
                    >
                      {item.label}
                    </span>

                    <div
                      style={{
                        minHeight: "82px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        padding: "9px 8px",
                        border: "1px solid rgba(255,255,255,0.13)",
                        borderRadius: "9px",
                        background: "rgba(255,255,255,0.015)",
                        textAlign: "center",
                      }}
                    >
                      <span
                        style={{
                          width: "32px",
                          height: "32px",
                          display: "grid",
                          placeItems: "center",
                          border: "1px dashed rgba(255,255,255,0.28)",
                          borderRadius: "7px",
                          color: "rgba(255,255,255,0.58)",
                        }}
                      >
                        {item.icon}
                      </span>

                      <strong
                        style={{
                          color:
                            item.value === "Add yours"
                              ? "rgba(255,255,255,0.35)"
                              : "#FFFFFF",
                          fontSize: "11px",
                          lineHeight: 1.25,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {item.value}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => navigateTo("/football-identity")}
                style={{
                  width: "100%",
                  minHeight: "36px",
                  marginTop: "12px",
                  border: "1px solid rgba(156,229,0,0.52)",
                  borderRadius: "7px",
                  background: "rgba(156,229,0,0.032)",
                  color: "#9CE500",
                  fontSize: "10px",
                  fontWeight: 900,
                  letterSpacing: "0.01em",
                  cursor: "pointer",
                }}
              >
                {footballIdentity?.isCompleted
                  ? "View Your Football Identity →"
                  : "Complete Your Football Identity →"}
              </button>
            </div>
          </div>
        </section>

        {/* LOCKED DASHBOARD — OVERVIEW + CERTIFICATE ROW */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.55fr) minmax(360px, 0.95fr)",
            gap: "14px",
            marginTop: "14px",
          }}
        >
          <section
            style={{
              minHeight: "224px",
              padding: "20px 22px",
              border: "1px solid rgba(255,255,255,0.11)",
              borderRadius: "16px",
              background: "rgba(255,255,255,0.012)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "9px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color: "#FFFFFF",
                  fontSize: "14px",
                  fontWeight: 850,
                  textTransform: "uppercase",
                }}
              >
                My Overview
              </h2>
              <span
                aria-hidden="true"
                style={{
                  width: "18px",
                  height: "18px",
                  display: "grid",
                  placeItems: "center",
                  border: "1px solid rgba(255,255,255,0.35)",
                  borderRadius: "50%",
                  color: "rgba(255,255,255,0.72)",
                  fontSize: "11px",
                  fontWeight: 800,
                }}
              >
                i
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
                marginTop: "20px",
              }}
            >
              {[
                {
                  label: "Posts",
                  value: "0",
                  icon: <FileText size={22} strokeWidth={1.55} />,
                },
                {
                  label: "Followers",
                  value: "0",
                  icon: <UsersRound size={23} strokeWidth={1.5} />,
                },
                {
                  label: "Following",
                  value: "0",
                  icon: <UserPlus size={23} strokeWidth={1.5} />,
                },
                {
                  label: "Likes",
                  value: "0",
                  icon: <Heart size={23} strokeWidth={1.5} />,
                },
                {
                  label: "Views",
                  value: "0",
                  icon: <Eye size={24} strokeWidth={1.5} />,
                },
                {
                  label: "Communities",
                  value: "0",
                  icon: <UsersRound size={23} strokeWidth={1.5} />,
                },
              ].map((item, index) => (
                <div
                  key={item.label}
                  style={{
                    minHeight: "112px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "7px",
                    padding: "8px 6px",
                    borderLeft:
                      index === 0
                        ? "none"
                        : "1px solid rgba(255,255,255,0.10)",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: "38px",
                      height: "32px",
                      display: "grid",
                      placeItems: "center",
                      color: "#9CE500",
                    }}
                  >
                    {item.icon}
                  </span>

                  <span
                    style={{
                      color: "#FFFFFF",
                      fontSize: "24px",
                      fontWeight: 760,
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                    }}
                  >
                    {item.value}
                  </span>

                  <span
                    style={{
                      color: "rgba(255,255,255,0.62)",
                      fontSize: "10px",
                      fontWeight: 650,
                      textAlign: "center",
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section
            style={{
              minHeight: "224px",
              padding: "20px 22px",
              border: "1px solid rgba(255,255,255,0.11)",
              borderRadius: "16px",
              background:
                "linear-gradient(135deg, rgba(156,229,0,0.022), rgba(255,255,255,0.012))",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "14px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color: "#FFFFFF",
                  fontSize: "14px",
                  fontWeight: 850,
                  textTransform: "uppercase",
                }}
              >
                Founding Member Certificate
              </h2>
              <TicketCheck size={18} color="#9CE500" strokeWidth={1.7} />
            </div>

            <div
              style={{
                minHeight: "116px",
                marginTop: "18px",
                padding: "16px 18px",
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: "16px",
                alignItems: "center",
                border: "1px solid rgba(156,229,0,0.38)",
                borderRadius: "10px",
                background:
                  "linear-gradient(135deg, rgba(156,229,0,0.055), rgba(0,0,0,0.10))",
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    color: "#9CE500",
                    fontSize: "12px",
                    fontWeight: 900,
                    letterSpacing: "0.18em",
                  }}
                >
                  SOCCAR
                </p>
                <p
                  style={{
                    margin: "8px 0 0",
                    color: "rgba(255,255,255,0.54)",
                    fontSize: "9px",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Founding Member
                </p>
                <strong
                  style={{
                    display: "block",
                    marginTop: "5px",
                    color: "#FFFFFF",
                    fontSize: "17px",
                    lineHeight: 1.2,
                  }}
                >
                  {firstName} {lastName}
                </strong>
                <span
                  style={{
                    display: "block",
                    marginTop: "5px",
                    color: "#9CE500",
                    fontSize: "10px",
                    fontWeight: 800,
                  }}
                >
                  Founder #{founderNumber ?? "------"}
                </span>
              </div>

              <div
                style={{
                  width: "54px",
                  height: "54px",
                  display: "grid",
                  placeItems: "center",
                  border: "1px solid rgba(156,229,0,0.35)",
                  borderRadius: "50%",
                  color: "#9CE500",
                }}
              >
                <TicketCheck size={26} strokeWidth={1.5} />
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigateTo("/dashboard")}
              style={{
                width: "100%",
                minHeight: "34px",
                marginTop: "12px",
                border: "1px solid rgba(156,229,0,0.42)",
                borderRadius: "7px",
                background: "rgba(156,229,0,0.025)",
                color: "#9CE500",
                fontSize: "10px",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              Certificate module — preview
            </button>
          </section>
        </div>
      </>
    );

  return (
    <div
      className={
        styles.dashboard
      }
    >
      <aside
        className={`${styles.sidebar} ${
          mobileMenuOpen
            ? styles.sidebarOpen
            : ""
        }`}
      >
        <div
          className={
            styles.sidebarTop
          }
        >
          <div
            className={
              styles.brandBlock
            }
          >
            <button
              type="button"
              className={
                styles.mobileCloseButton
              }
              aria-label="Close navigation"
              onClick={() =>
                setMobileMenuOpen(
                  false
                )
              }
            >
              <X
                size={20}
                strokeWidth={1.8}
              />
            </button>

            <div
              className={
                styles.brand
              }
            >
              SOCCAR
            </div>

            <div
              className={
                styles.brandDescriptor
              }
            >
              Founder Community
            </div>
          </div>

          <nav
            className={
              styles.navigation
            }
            aria-label="SoccaR dashboard navigation"
          >
            <div
              style={{
                margin: "2px 12px 8px",
                color: "rgba(255,255,255,0.30)",
                fontSize: "9px",
                fontWeight: 850,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Home
            </div>

            <button
              type="button"
              className={navClass("dashboard")}
              onClick={() =>
                navigateTo("/dashboard")
              }
            >
              <House size={19} strokeWidth={1.8} />
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              className={navClass("updates")}
              onClick={() =>
                navigateTo("/dashboard/updates")
              }
            >
              <Megaphone size={19} strokeWidth={1.8} />
              <span>Updates</span>

              {unreadUpdates > 0 && (
                <span
                  style={{
                    marginLeft: "auto",
                    minWidth: "22px",
                    height: "22px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 6px",
                    borderRadius: "999px",
                    background: "#FF3B30",
                    color: "#FFFFFF",
                    fontSize: "10px",
                    lineHeight: 1,
                    fontWeight: 800,
                    boxShadow:
                      "0 0 0 3px rgba(255,59,48,0.08)",
                  }}
                >
                  {unreadUpdates}
                </span>
              )}
            </button>

            <div
              style={{
                margin: "18px 12px 8px",
                color: "rgba(255,255,255,0.30)",
                fontSize: "9px",
                fontWeight: 850,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              My Football
            </div>

            <button
              type="button"
              className={styles.navItem}
              onClick={() =>
                navigateTo("/football-identity")
              }
            >
              <ShieldCheck size={19} strokeWidth={1.8} />
              <span>Football Identity</span>
            </button>

            <button
              type="button"
              className={styles.navItem}
              onClick={() =>
                showComingSoon("Feed")
              }
            >
              <UsersRound size={19} strokeWidth={1.8} />
              <span>Feed</span>
              <span
                style={{
                  marginLeft: "auto",
                  color: "rgba(156,229,0,0.58)",
                  fontSize: "8px",
                  fontWeight: 850,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Soon
              </span>
            </button>

            <button
              type="button"
              className={styles.navItem}
              onClick={() =>
                showComingSoon("My Activity")
              }
            >
              <UserRound size={19} strokeWidth={1.8} />
              <span>My Activity</span>
              <span
                style={{
                  marginLeft: "auto",
                  color: "rgba(255,255,255,0.28)",
                  fontSize: "8px",
                  fontWeight: 850,
                  textTransform: "uppercase",
                }}
              >
                Soon
              </span>
            </button>

            <div
              style={{
                margin: "18px 12px 8px",
                color: "rgba(255,255,255,0.30)",
                fontSize: "9px",
                fontWeight: 850,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Community
            </div>

            <button
              type="button"
              className={navClass("community")}
              onClick={() =>
                navigateTo("/dashboard/community")
              }
            >
              <UsersRound size={19} strokeWidth={1.8} />
              <span>Founder Community</span>
            </button>

            <button
              type="button"
              className={styles.navItem}
              onClick={() =>
                showComingSoon("Banter Room")
              }
            >
              <Megaphone size={19} strokeWidth={1.8} />
              <span>Banter Room</span>
              <span
                style={{
                  marginLeft: "auto",
                  color: "rgba(156,229,0,0.58)",
                  fontSize: "8px",
                  fontWeight: 850,
                  textTransform: "uppercase",
                }}
              >
                Soon
              </span>
            </button>

            <button
              type="button"
              className={styles.navItem}
              onClick={() =>
                showComingSoon("Communities")
              }
            >
              <UsersRound size={19} strokeWidth={1.8} />
              <span>Communities</span>
              <span
                style={{
                  marginLeft: "auto",
                  color: "rgba(255,255,255,0.28)",
                  fontSize: "8px",
                  fontWeight: 850,
                  textTransform: "uppercase",
                }}
              >
                Soon
              </span>
            </button>

            <button
              type="button"
              className={styles.navItem}
              onClick={() =>
                showComingSoon("Discover")
              }
            >
              <MapPin size={19} strokeWidth={1.8} />
              <span>Discover</span>
              <span
                style={{
                  marginLeft: "auto",
                  color: "rgba(255,255,255,0.28)",
                  fontSize: "8px",
                  fontWeight: 850,
                  textTransform: "uppercase",
                }}
              >
                Soon
              </span>
            </button>

            <div
              style={{
                margin: "18px 12px 8px",
                color: "rgba(255,255,255,0.30)",
                fontSize: "9px",
                fontWeight: 850,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Create & Share
            </div>

            <button
              type="button"
              className={styles.navItem}
              onClick={() =>
                showComingSoon("Create")
              }
            >
              <CircleUserRound size={19} strokeWidth={1.8} />
              <span>Create</span>
              <span
                style={{
                  marginLeft: "auto",
                  color: "rgba(255,255,255,0.28)",
                  fontSize: "8px",
                  fontWeight: 850,
                  textTransform: "uppercase",
                }}
              >
                Soon
              </span>
            </button>

            <div
              style={{
                margin: "18px 12px 8px",
                color: "rgba(255,255,255,0.30)",
                fontSize: "9px",
                fontWeight: 850,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Exclusive
            </div>

            <button
              type="button"
              className={styles.navItem}
              onClick={() =>
                showComingSoon("Early Access")
              }
            >
              <Gift size={19} strokeWidth={1.8} />
              <span>Early Access</span>
              <span
                style={{
                  marginLeft: "auto",
                  color: "rgba(255,255,255,0.28)",
                  fontSize: "8px",
                  fontWeight: 850,
                  textTransform: "uppercase",
                }}
              >
                Soon
              </span>
            </button>

            <button
              type="button"
              className={styles.navItem}
              onClick={() =>
                showComingSoon("Certificates")
              }
            >
              <TicketCheck size={19} strokeWidth={1.8} />
              <span>Certificates</span>
              <span
                style={{
                  marginLeft: "auto",
                  color: "rgba(255,255,255,0.28)",
                  fontSize: "8px",
                  fontWeight: 850,
                  textTransform: "uppercase",
                }}
              >
                Soon
              </span>
            </button>

            <div
              style={{
                margin: "18px 12px 8px",
                color: "rgba(255,255,255,0.30)",
                fontSize: "9px",
                fontWeight: 850,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Account
            </div>

            <button
              type="button"
              className={navClass("profile")}
              onClick={() =>
                navigateTo("/dashboard/profile")
              }
            >
              <CircleUserRound size={19} strokeWidth={1.8} />
              <span>Profile</span>
            </button>

            <button
              type="button"
              className={styles.navItem}
              onClick={() =>
                showComingSoon("Account Settings")
              }
            >
              <Settings size={19} strokeWidth={1.8} />
              <span>Account Settings</span>
            </button>
          </nav>
        </div>

        <div
          className={
            styles.sidebarBottom
          }
        >
          <div
            className={
              styles.founderBadge
            }
          >
            <ShieldCheck
              size={18}
              strokeWidth={1.8}
            />

            <div>
              <span
                className={
                  styles.founderBadgeLabel
                }
              >
                Founding Member
              </span>

              <span
                className={
                  styles.founderBadgeNumber
                }
              >
                {founderNumber
                  ? `#${founderNumber}`
                  : "Membership Active"}
              </span>
            </div>
          </div>

          {signOutError && (
            <p
              style={{
                padding:
                  "0 15px",
                color:
                  "#ff6259",
                fontSize:
                  "10px",
                lineHeight:
                  1.5,
              }}
            >
              {signOutError}
            </p>
          )}

          <button
            type="button"
            className={
              styles.signOutButton
            }
            onClick={
              handleSignOut
            }
            disabled={
              signingOut
            }
            aria-busy={
              signingOut
            }
            style={{
              opacity:
                signingOut
                  ? 0.55
                  : 1,
              cursor:
                signingOut
                  ? "wait"
                  : "pointer",
            }}
          >
            <LogOut
              size={18}
              strokeWidth={1.8}
            />

            <span>
              {signingOut
                ? "Signing Out…"
                : "Sign Out"}
            </span>
          </button>
        </div>
      </aside>

      <button
        type="button"
        aria-label="Close navigation"
        className={`${
          styles.mobileMenuOverlay
        } ${
          mobileMenuOpen
            ? styles.mobileMenuOverlayVisible
            : ""
        }`}
        onClick={() =>
          setMobileMenuOpen(false)
        }
      />

      <div
        className={
          styles.workspace
        }
      >
        <header
          className={
            styles.topbar
          }
          style={{
            paddingTop: "11px",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns:
                "minmax(230px, 0.72fr) minmax(320px, 1fr) minmax(360px, 0.9fr)",
              alignItems: "center",
              gap: "24px",
            }}
          >
            <div
              style={{
                minWidth: 0,
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <button
                type="button"
                className={
                  styles.mobileMenuButton
                }
                aria-label="Open navigation"
                aria-expanded={
                  mobileMenuOpen
                }
                onClick={() =>
                  setMobileMenuOpen(
                    (current) =>
                      !current
                  )
                }
              >
                <Menu
                  size={21}
                  strokeWidth={1.8}
                />
              </button>

              <div
                style={{
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    display: "block",
                    color:
                      "rgba(255,255,255,0.48)",
                    fontSize: "10px",
                    fontWeight: 650,
                    lineHeight: 1.2,
                  }}
                >
                  Welcome back,
                </span>

                <strong
                  style={{
                    display: "block",
                    marginTop: "3px",
                    color: "#FFFFFF",
                    fontSize: "17px",
                    fontWeight: 800,
                    lineHeight: 1.15,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {fullName}
                </strong>
              </div>
            </div>

            <div
              role="search"
              style={{
                minHeight: "40px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "0 13px",
                border:
                  "1px solid rgba(255,255,255,0.13)",
                borderRadius: "9px",
                background:
                  "rgba(255,255,255,0.018)",
              }}
            >
              <input
                type="search"
                placeholder="Search SoccaR..."
                aria-label="Search SoccaR"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    showComingSoon("Search");
                  }
                }}
                style={{
                  width: "100%",
                  minWidth: 0,
                  border: 0,
                  outline: 0,
                  background: "transparent",
                  color: "#FFFFFF",
                  font: "inherit",
                  fontSize: "12px",
                }}
              />

              <Search
                size={18}
                strokeWidth={1.7}
                color="rgba(255,255,255,0.62)"
              />
            </div>

            <div
              style={{
                minWidth: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "7px",
              }}
            >
              <button
                type="button"
                className={
                  styles.iconButton
                }
                aria-label="Notifications"
                title="Notifications — coming soon"
                onClick={() =>
                  showComingSoon(
                    "Notifications"
                  )
                }
              >
                <Bell
                  size={19}
                  strokeWidth={1.8}
                />
              </button>

              <button
                type="button"
                className={
                  styles.iconButton
                }
                aria-label="Messages"
                title="Messages — coming soon"
                onClick={() =>
                  showComingSoon(
                    "Messages"
                  )
                }
              >
                <Mail
                  size={19}
                  strokeWidth={1.8}
                />
              </button>

              <div
                className={
                  styles.accountDivider
                }
              />

              <div
                style={{
                  position: "relative",
                }}
              >
                <button
                  type="button"
                  className={
                    styles.accountButton
                  }
                  aria-haspopup="menu"
                  aria-expanded={
                    accountMenuOpen
                  }
                  onClick={() =>
                    setAccountMenuOpen(
                      (current) =>
                        !current
                    )
                  }
                >
                  <span
                    className={
                      styles.avatar
                    }
                  >
                    {initials}
                  </span>

                  <span
                    className={
                      styles.accountIdentity
                    }
                  >
                    <span
                      className={
                        styles.accountName
                      }
                    >
                      {fullName}
                    </span>

                    <span
                      className={
                        styles.accountRole
                      }
                    >
                      Founding Member
                    </span>
                  </span>

                  <ChevronDown
                    size={16}
                    strokeWidth={1.8}
                    className={
                      styles.chevron
                    }
                    style={{
                      transform:
                        accountMenuOpen
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      transition:
                        "transform 180ms ease",
                    }}
                  />
                </button>

                {accountMenuOpen && (
                  <div
                    role="menu"
                    style={{
                      position: "absolute",
                      top:
                        "calc(100% + 12px)",
                      right: 0,
                      width: "220px",
                      padding: "8px",
                      border:
                        "1px solid rgba(255,255,255,0.10)",
                      borderRadius:
                        "16px",
                      background:
                        "#0D0D0D",
                      boxShadow:
                        "0 24px 60px rgba(0,0,0,0.45)",
                      zIndex: 100,
                    }}
                  >
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() =>
                        navigateTo(
                          "/dashboard/profile"
                        )
                      }
                      style={{
                        width: "100%",
                        minHeight:
                          "46px",
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: "11px",
                        padding:
                          "0 13px",
                        border: 0,
                        borderRadius:
                          "11px",
                        background:
                          "transparent",
                        color:
                          "rgba(255,255,255,0.72)",
                        fontSize:
                          "13px",
                        cursor:
                          "pointer",
                        textAlign:
                          "left",
                      }}
                    >
                      <CircleUserRound
                        size={17}
                        strokeWidth={1.8}
                      />
                      Profile
                    </button>

                    <div
                      style={{
                        height: "1px",
                        margin:
                          "6px 4px",
                        background:
                          "rgba(255,255,255,0.08)",
                      }}
                    />

                    <button
                      type="button"
                      role="menuitem"
                      disabled={
                        signingOut
                      }
                      onClick={
                        handleSignOut
                      }
                      style={{
                        width: "100%",
                        minHeight:
                          "46px",
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: "11px",
                        padding:
                          "0 13px",
                        border: 0,
                        borderRadius:
                          "11px",
                        background:
                          "transparent",
                        color:
                          signingOut
                            ? "rgba(255,255,255,0.35)"
                            : "#FFFFFF",
                        fontSize:
                          "13px",
                        cursor:
                          signingOut
                            ? "wait"
                            : "pointer",
                        textAlign:
                          "left",
                      }}
                    >
                      <LogOut
                        size={17}
                        strokeWidth={1.8}
                      />

                      {signingOut
                        ? "Signing Out…"
                        : "Sign Out"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main
          className={`${styles.content} ${
            contentMode ===
            "editorial"
              ? styles.contentEditorial
              : ""
          }`}
        >
          {dashboardContent}
        </main>
      </div>
    </div>
  );
}