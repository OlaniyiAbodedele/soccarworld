"use client";

import {
  type ReactNode,
  useState,
} from "react";

import {
  Bell,
  Check,
  ChevronDown,
  CircleUserRound,
  Gift,
  House,
  LogOut,
  MapPin,
  Megaphone,
  Menu,
  Settings,
  ShieldCheck,
  TicketCheck,
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
        <section
          className={
            styles.welcomeGrid
          }
        >
          <div
            className={
              styles.heroCard
            }
          >
            <div
              className={
                styles.heroGlow
              }
            />

            <div
              className={
                styles.heroContent
              }
            >
              <p
                className={
                  styles.welcomeEyebrow
                }
              >
                Welcome back,
              </p>

              <h1
                className={
                  styles.welcomeName
                }
              >
                {firstName}.
              </h1>

              <div
                className={
                  styles.founderIdentity
                }
              >
                <span
                  className={
                    styles.founderLabel
                  }
                >
                  Founding Member
                </span>

                <span
                  className={
                    styles.heroFounderNumber
                  }
                >
                  #
                  {founderNumber ??
                    "------"}
                </span>
              </div>

              <div
                className={
                  styles.heroRule
                }
              />

              <p
                className={
                  styles.heroStatement
                }
              >
                You were here at the
                beginning.
                <br />
                SoccaR is being built
                around you.
              </p>

              <div
                className={
                  styles.heroMeta
                }
              >
                {memberType && (
                  <span
                    className={
                      styles.metaItem
                    }
                  >
                    <UserRound
                      size={15}
                      strokeWidth={
                        1.8
                      }
                    />

                    {memberType}
                  </span>
                )}

                {countryOfResidence && (
                  <span
                    className={
                      styles.metaItem
                    }
                  >
                    <MapPin
                      size={15}
                      strokeWidth={
                        1.8
                      }
                    />

                    {
                      countryOfResidence
                    }
                  </span>
                )}
              </div>
            </div>
          </div>

          <aside
            className={
              styles.identityCard
            }
          >
            <div
              className={
                styles.identityHeader
              }
            >
              <div>
                <p
                  className={
                    styles.identityEyebrow
                  }
                >
                  Your SoccaR Identity
                </p>

                <h2
                  className={
                    styles.identityTitle
                  }
                >
                  Founder profile
                </h2>
              </div>

              <div
                className={
                  styles.activeBadge
                }
              >
                <Check
                  size={13}
                  strokeWidth={2.4}
                />
                Active
              </div>
            </div>

            <div
              className={
                styles.identityRows
              }
            >
              <div
                className={
                  styles.identityRow
                }
              >
                <span>
                  Member type
                </span>

                <strong>
                  {memberType ||
                    "Not provided"}
                </strong>
              </div>

              <div
                className={
                  styles.identityRow
                }
              >
                <span>
                  Location
                </span>

                <strong>
                  {countryOfResidence ||
                    "Not provided"}
                </strong>
              </div>

              <div
                className={
                  styles.identityRow
                }
              >
                <span>
                  Email status
                </span>

                <strong
                  className={
                    styles.verified
                  }
                >
                  Verified

                  <Check
                    size={13}
                    strokeWidth={2.4}
                  />
                </strong>
              </div>

              <div
                className={
                  styles.identityRow
                }
              >
                <span>
                  Founder Number
                </span>

                <strong
                  className={
                    styles.identityFounder
                  }
                >
                  #
                  {founderNumber ??
                    "------"}
                </strong>
              </div>
            </div>

            <div
              className={
                styles.profileProgress
              }
            >
              <div
                className={
                  styles.progressHeader
                }
              >
                <div>
                  <span
                    className={
                      styles.progressLabel
                    }
                  >
                    Founder profile
                  </span>

                  <span
                    className={
                      styles.progressCopy
                    }
                  >
                    Complete your
                    SoccaR identity.
                  </span>
                </div>

                <strong
                  className={
                    styles.progressValue
                  }
                >
                  {profileCompletion}%
                </strong>
              </div>

              <div
                className={
                  styles.progressTrack
                }
              >
                <div
                  className={
                    styles.progressBar
                  }
                  style={{
                    width: `${profileCompletion}%`,
                  }}
                />
              </div>

              <p
                className={
                  styles.progressHint
                }
              >
                Add your city,
                country of origin
                and username to
                strengthen your
                Founder profile.
              </p>

              <button
                type="button"
                className={
                  styles.completeProfileButton
                }
                onClick={() =>
                  navigateTo(
                    "/dashboard/profile"
                  )
                }
              >
                Complete my profile
              </button>
            </div>
          </aside>
        </section>

        <section
          className={
            styles.nextStage
          }
        >
          <div>
            <p
              className={
                styles.nextStageEyebrow
              }
            >
              Founder Dashboard V1
            </p>

            <h2
              className={
                styles.nextStageTitle
              }
            >
              Your Founding Community
              experience starts here.
            </h2>

            <p
              className={
                styles.nextStageCopy
              }
            >
              Community activity,
              SoccaR updates and
              Founder privileges
              will appear here as
              the platform grows.
            </p>
          </div>
        </section>
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
            aria-label="Founder dashboard navigation"
          >
            <button
              type="button"
              className={navClass(
                "dashboard"
              )}
              onClick={() =>
                navigateTo(
                  "/dashboard"
                )
              }
            >
              <House
                size={19}
                strokeWidth={1.8}
              />

              <span>
                Dashboard
              </span>
            </button>

            <button
              type="button"
              className={navClass(
                "profile"
              )}
              onClick={() =>
                navigateTo(
                  "/dashboard/profile"
                )
              }
            >
              <CircleUserRound
                size={19}
                strokeWidth={1.8}
              />

              <span>
                Profile
              </span>
            </button>

            <button
              type="button"
              className={navClass(
                "community"
              )}
              onClick={() =>
                navigateTo(
                  "/dashboard/community"
                )
              }
            >
              <UsersRound
                size={19}
                strokeWidth={1.8}
              />

              <span>
                Founder Community
              </span>
            </button>

            <button
              type="button"
              className={navClass(
                "updates"
              )}
              onClick={() =>
                navigateTo(
                  "/dashboard/updates"
                )
              }
            >
              <Megaphone
                size={19}
                strokeWidth={1.8}
              />

              <span>
                Updates
              </span>

              {unreadUpdates >
                0 && (
                <span
                  style={{
                    marginLeft:
                      "auto",
                    minWidth:
                      "22px",
                    height:
                      "22px",
                    display:
                      "inline-flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    padding:
                      "0 6px",
                    borderRadius:
                      "999px",
                    background:
                      "#FF3B30",
                    color:
                      "#FFFFFF",
                    fontSize:
                      "10px",
                    lineHeight: 1,
                    fontWeight:
                      800,
                    boxShadow:
                      "0 0 0 3px rgba(255,59,48,0.08)",
                  }}
                >
                  {
                    unreadUpdates
                  }
                </span>
              )}
            </button>

            <div
              className={
                styles.navigationDivider
              }
            />

            <button
              type="button"
              className={
                styles.navItem
              }
              onClick={() =>
                showComingSoon(
                  "Early Access"
                )
              }
            >
              <Gift
                size={19}
                strokeWidth={1.8}
              />

              <span>
                Early Access
              </span>
            </button>

            <button
              type="button"
              className={
                styles.navItem
              }
              onClick={() =>
                showComingSoon(
                  "Certificates"
                )
              }
            >
              <TicketCheck
                size={19}
                strokeWidth={1.8}
              />

              <span>
                Certificates
              </span>
            </button>

            <button
              type="button"
              className={
                styles.navItem
              }
              onClick={() =>
                showComingSoon(
                  "Account Settings"
                )
              }
            >
              <Settings
                size={19}
                strokeWidth={1.8}
              />

              <span>
                Account Settings
              </span>
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
            className={
              styles.topbarContext
            }
          >
            <span
              className={
                styles.contextEyebrow
              }
            >
              Founder Dashboard
            </span>

            <span
              className={
                styles.contextDivider
              }
            />

            <span
              className={
                styles.contextStatus
              }
            >
              Membership Active
            </span>
          </div>

          <div
            className={
              styles.accountArea
            }
          >
            <button
              type="button"
              className={
                styles.iconButton
              }
              aria-label="Notifications"
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
              aria-label="Settings"
              onClick={() =>
                showComingSoon(
                  "Account Settings"
                )
              }
            >
              <Settings
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
        position:
          "absolute",
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
          display: "flex",
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
          display: "flex",
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