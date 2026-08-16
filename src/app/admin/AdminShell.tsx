"use client";

import {
  type ReactNode,
  useState,
} from "react";

import {
  Bell,
  ChevronDown,
  CircleUserRound,
  Gauge,
  LogOut,
  Menu,
  Megaphone,
  Settings,
  ShieldCheck,
  UsersRound,
  UserRoundSearch,
  X,
} from "lucide-react";

import { useRouter } from "next/navigation";

import styles from "./AdminShell.module.css";

export type AdminSection =
  | "overview"
  | "members"
  | "reservations"
  | "communications"
  | "community"
  | "system";

type AdminShellProps = {
  firstName: string;
  lastName: string;
  role: string;

  activeSection?: AdminSection;

  children: ReactNode;
};

type SignOutResponse = {
  success: boolean;
  message?: string;
};

export default function AdminShell({
  firstName,
  lastName,
  role,
  activeSection = "overview",
  children,
}: AdminShellProps) {
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
  ] = useState<string | null>(
    null
  );

  const fullName =
    `${firstName} ${lastName}`.trim() ||
    "SoccaR Administrator";

  const initials =
    `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`
      .toUpperCase() || "SA";

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
      `${feature} is being prepared for the SoccaR Admin Console.`
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
      setAccountMenuOpen(false);

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

      router.replace(
        "/sign-in"
      );

      router.refresh();
    } catch (error) {
      console.error(
        "SoccaR Admin sign-out error:",
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
    section: AdminSection
  ) {
    return `${styles.navItem} ${
      activeSection === section
        ? styles.navItemActive
        : ""
    }`;
  }

  return (
    <div
      className={
        styles.adminConsole
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
              Administration
            </div>
          </div>

          <div
            className={
              styles.environmentBadge
            }
          >
            <span
              className={
                styles.environmentDot
              }
            />

            Production Console
          </div>

          <nav
            className={
              styles.navigation
            }
            aria-label="SoccaR Admin navigation"
          >
            <button
              type="button"
              className={navClass(
                "overview"
              )}
              onClick={() =>
                navigateTo(
                  "/admin"
                )
              }
            >
              <Gauge
                size={18}
                strokeWidth={1.8}
              />

              <span>
                Overview
              </span>
            </button>

            <button
              type="button"
              className={navClass(
                "members"
              )}
              onClick={() =>
  navigateTo("/admin/members")
}
            >
              <UsersRound
                size={18}
                strokeWidth={1.8}
              />

              <span>
                Founding Members
              </span>
            </button>

            <button
              type="button"
              className={navClass(
                "reservations"
              )}
              onClick={() =>
  navigateTo("/admin/reservations")
}
  
            >
              <UserRoundSearch
                size={18}
                strokeWidth={1.8}
              />

              <span>
                Reservations
              </span>
            </button>

            <div
              className={
                styles.navigationDivider
              }
            />

            <button
              type="button"
              className={navClass(
                "communications"
              )}
              onClick={() =>
  navigateTo("/admin/communications")
}
            >
              <Megaphone
                size={18}
                strokeWidth={1.8}
              />

              <span>
                Communications
              </span>
            </button>

            <button
              type="button"
              className={navClass(
                "community"
              )}
              onClick={() =>
                showComingSoon(
                  "Community"
                )
              }
            >
              <CircleUserRound
                size={18}
                strokeWidth={1.8}
              />

              <span>
                Community
              </span>
            </button>

            <button
              type="button"
              className={navClass(
                "system"
              )}
              onClick={() =>
                showComingSoon(
                  "System"
                )
              }
            >
              <Settings
                size={18}
                strokeWidth={1.8}
              />

              <span>
                System
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
              styles.adminBadge
            }
          >
            <ShieldCheck
              size={18}
              strokeWidth={1.8}
            />

            <div>
              <span
                className={
                  styles.adminBadgeLabel
                }
              >
                Administrative Access
              </span>

              <span
                className={
                  styles.adminBadgeRole
                }
              >
                {role.replace(
                  "_",
                  " "
                )}
              </span>
            </div>
          </div>

          {signOutError && (
            <p
              className={
                styles.signOutError
              }
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
          >
            <LogOut
              size={17}
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
          <div
            className={
              styles.topbarLeft
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
                Admin Console
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
                Production
              </span>
            </div>
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
                size={18}
                strokeWidth={1.8}
              />
            </button>

            <div
              className={
                styles.accountDivider
              }
            />

            <div
              className={
                styles.accountMenuWrapper
              }
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
                    {role.replace(
                      "_",
                      " "
                    )}
                  </span>
                </span>

                <ChevronDown
                  size={15}
                  strokeWidth={1.8}
                  className={
                    styles.chevron
                  }
                  style={{
                    transform:
                      accountMenuOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                  }}
                />
              </button>

              {accountMenuOpen && (
                <div
                  role="menu"
                  className={
                    styles.accountMenu
                  }
                >
                  <button
                    type="button"
                    role="menuitem"
                    className={
                      styles.accountMenuItem
                    }
                    onClick={() =>
                      navigateTo(
                        "/dashboard"
                      )
                    }
                  >
                    <CircleUserRound
                      size={17}
                      strokeWidth={1.8}
                    />

                    Member Dashboard
                  </button>

                  <div
                    className={
                      styles.accountMenuDivider
                    }
                  />

                  <button
                    type="button"
                    role="menuitem"
                    className={
                      styles.accountMenuItem
                    }
                    disabled={
                      signingOut
                    }
                    onClick={
                      handleSignOut
                    }
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
          className={
            styles.content
          }
        >
          {children}
        </main>
      </div>
    </div>
  );
}