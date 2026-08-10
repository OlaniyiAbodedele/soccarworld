"use client";

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
  Settings,
  ShieldCheck,
  TicketCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useRouter } from "next/navigation";

import styles from "./DashboardShell.module.css";

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
}: DashboardShellProps) {
  const router = useRouter();

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

  const completedFields = profileFields.filter(
    (value) =>
      typeof value === "string" &&
      value.trim().length > 0
  ).length;

  const profileCompletion = Math.round(
    (completedFields / profileFields.length) * 100
  );

  function showComingSoon(feature: string) {
    window.alert(
      `${feature} is coming soon to the SoccaR Founding Community.`
    );
  }

  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.brandBlock}>
            <div className={styles.brand}>
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
            className={styles.navigation}
            aria-label="Founder dashboard navigation"
          >
            <button
              type="button"
              className={`${styles.navItem} ${styles.navItemActive}`}
              onClick={() =>
                router.push("/dashboard")
              }
            >
              <House
                size={19}
                strokeWidth={1.8}
              />
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              className={styles.navItem}
              onClick={() =>
                router.push(
                  "/dashboard/profile"
                )
              }
            >
              <CircleUserRound
                size={19}
                strokeWidth={1.8}
              />
              <span>Profile</span>
            </button>

            <button
              type="button"
              className={styles.navItem}
              onClick={() =>
                router.push(
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
              className={styles.navItem}
              onClick={() =>
                showComingSoon("Updates")
              }
            >
              <Megaphone
                size={19}
                strokeWidth={1.8}
              />
              <span>Updates</span>
            </button>

            <div
              className={
                styles.navigationDivider
              }
            />

            <button
              type="button"
              className={styles.navItem}
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
              <span>Early Access</span>
            </button>

            <button
              type="button"
              className={styles.navItem}
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
              <span>Certificates</span>
            </button>

            <button
              type="button"
              className={styles.navItem}
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
          className={styles.sidebarBottom}
        >
          <div
            className={styles.founderBadge}
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

          <button
            type="button"
            className={
              styles.signOutButton
            }
          >
            <LogOut
              size={18}
              strokeWidth={1.8}
            />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <div className={styles.workspace}>
        <header className={styles.topbar}>
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
            className={styles.accountArea}
          >
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Notifications"
            >
              <Bell
                size={19}
                strokeWidth={1.8}
              />
            </button>

            <button
              type="button"
              className={styles.iconButton}
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

            <button
              type="button"
              className={
                styles.accountButton
              }
            >
              <span
                className={styles.avatar}
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
                className={styles.chevron}
              />
            </button>
          </div>
        </header>

        <main className={styles.content}>
          <section
            className={styles.welcomeGrid}
          >
            <div className={styles.heroCard}>
              <div
                className={styles.heroGlow}
              />

              <div
                className={styles.heroContent}
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
                  className={styles.heroRule}
                />

                <p
                  className={
                    styles.heroStatement
                  }
                >
                  You were here at the
                  beginning.
                  <br />
                  SoccaR is being built around
                  you.
                </p>

                <div
                  className={styles.heroMeta}
                >
                  {memberType && (
                    <span
                      className={
                        styles.metaItem
                      }
                    >
                      <UserRound
                        size={15}
                        strokeWidth={1.8}
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
                        strokeWidth={1.8}
                      />
                      {countryOfResidence}
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
                  <span>Member type</span>

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
                  <span>Location</span>

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
                  <span>Email status</span>

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
                      Complete your SoccaR
                      identity.
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
                  Add your city, country of
                  origin and username to
                  strengthen your Founder
                  profile.
                </p>

                <button
                  type="button"
                  className={
                    styles.completeProfileButton
                  }
                  onClick={() =>
                    router.push(
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
            className={styles.nextStage}
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
                Community activity, SoccaR
                updates and Founder privileges
                will appear here as the platform
                grows.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}