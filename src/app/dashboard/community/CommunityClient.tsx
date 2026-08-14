"use client";

import {
  ChangeEvent,
  FormEvent,
  useMemo,
  useState,
} from "react";
import {
  Bell,
  ChevronDown,
  CircleUserRound,
  Gift,
  Globe2,
  House,
  LogOut,
  MapPin,
  Megaphone,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  TicketCheck,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

import styles from "./CommunityClient.module.css";

type CommunityFounder = {
  founderNumber: string;
  firstName: string;
  lastName: string;
  username: string | null;
  memberType: string | null;
  countryOfResidence: string | null;
};

type CommunityClientProps = {
  currentFirstName: string;
  currentLastName: string;
  currentFounderNumber: string | null;
  founders: CommunityFounder[];
  founderCount: number;
  countriesRepresented: number;
  memberTypesRepresented: number;
};

type SignOutResponse = {
  success: boolean;
  message?: string;
};

export default function CommunityClient({
  currentFirstName,
  currentLastName,
  currentFounderNumber,
  founders,
  founderCount,
  countriesRepresented,
  memberTypesRepresented,
}: CommunityClientProps) {
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
  ] = useState<string | null>(null);

  const [searchInput, setSearchInput] =
    useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [countryFilter, setCountryFilter] =
    useState("ALL");

  const [memberTypeFilter, setMemberTypeFilter] =
    useState("ALL");

  const currentFullName =
    `${currentFirstName} ${currentLastName}`.trim() ||
    "SoccaR Member";

  const currentInitials =
    `${currentFirstName?.charAt(0) ?? ""}${currentLastName?.charAt(0) ?? ""}`
      .toUpperCase() || "SM";

  const countries = useMemo(() => {
    return Array.from(
      new Set(
        founders
          .map(
            (founder) =>
              founder.countryOfResidence
          )
          .filter(
            (
              country
            ): country is string =>
              Boolean(country)
          )
      )
    ).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [founders]);

  const memberTypes = useMemo(() => {
    return Array.from(
      new Set(
        founders
          .map(
            (founder) =>
              founder.memberType
          )
          .filter(
            (
              memberType
            ): memberType is string =>
              Boolean(memberType)
          )
      )
    ).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [founders]);

  const filteredFounders = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return founders.filter((founder) => {
      const fullName =
        `${founder.firstName} ${founder.lastName}`
          .trim()
          .toLowerCase();

      const username =
        founder.username?.toLowerCase() ??
        "";

      const matchesSearch =
        !normalizedSearch ||
        fullName.includes(normalizedSearch) ||
        username.includes(normalizedSearch);

      const matchesCountry =
        countryFilter === "ALL" ||
        founder.countryOfResidence ===
          countryFilter;

      const matchesMemberType =
        memberTypeFilter === "ALL" ||
        founder.memberType ===
          memberTypeFilter;

      return (
        matchesSearch &&
        matchesCountry &&
        matchesMemberType
      );
    });
  }, [
    founders,
    searchTerm,
    countryFilter,
    memberTypeFilter,
  ]);

  function navigateTo(path: string) {
    setMobileMenuOpen(false);
    setAccountMenuOpen(false);
    router.push(path);
  }

  function showComingSoon(feature: string) {
    setMobileMenuOpen(false);
    setAccountMenuOpen(false);

    window.alert(
      `${feature} is coming soon to the SoccaR Founding Community.`
    );
  }

  function handleSearch(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setSearchTerm(searchInput);
  }

  function handleCountryChange(
    event: ChangeEvent<HTMLSelectElement>
  ) {
    setCountryFilter(event.target.value);
  }

  function handleMemberTypeChange(
    event: ChangeEvent<HTMLSelectElement>
  ) {
    setMemberTypeFilter(event.target.value);
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

      router.replace("/sign-in");
      router.refresh();
    } catch (error) {
      console.error(
        "Founder Community sign-out error:",
        error
      );

      setSignOutError(
        "Something unexpected happened while signing you out."
      );
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div className={styles.dashboard}>
      <aside
        className={`${styles.sidebar} ${
          mobileMenuOpen
            ? styles.sidebarOpen
            : ""
        }`}
      >
        <div className={styles.sidebarTop}>
          <div className={styles.brandBlock}>
            <button
              type="button"
              className={
                styles.mobileCloseButton
              }
              aria-label="Close navigation"
              onClick={() =>
                setMobileMenuOpen(false)
              }
            >
              <X
                size={20}
                strokeWidth={1.8}
              />
            </button>

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
              className={styles.navItem}
              onClick={() =>
                navigateTo("/dashboard")
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
                navigateTo(
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
              className={`${styles.navItem} ${styles.navItemActive}`}
              onClick={() => {
                setMobileMenuOpen(false);
                setAccountMenuOpen(false);
              }}
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
                navigateTo(
                  "/dashboard/updates"
                )
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
                {currentFounderNumber
                  ? `#${currentFounderNumber}`
                  : "Membership Active"}
              </span>
            </div>
          </div>

          {signOutError && (
            <p
              style={{
                padding: "0 15px",
                color: "#ff6259",
                fontSize: "10px",
                lineHeight: 1.5,
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
            onClick={handleSignOut}
            disabled={signingOut}
            aria-busy={signingOut}
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

      <div className={styles.workspace}>
        <header className={styles.topbar}>
          <button
            type="button"
            className={
              styles.mobileMenuButton
            }
            aria-label="Open navigation"
            aria-expanded={mobileMenuOpen}
            onClick={() => {
              setAccountMenuOpen(false);

              setMobileMenuOpen(
                (current) => !current
              );
            }}
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
              Founder Community
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

          <div className={styles.accountArea}>
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
                  className={styles.avatar}
                >
                  {currentInitials}
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
                    {currentFullName}
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
                    disabled={signingOut}
                    onClick={handleSignOut}
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

        <main className={styles.page}>
          <section
            className={styles.shell}
          >
            <section
              className={styles.hero}
            >
              <div
                className={
                  styles.heroImage
                }
                aria-hidden="true"
              />

              <div
                className={
                  styles.heroOverlay
                }
              />

              <div
                className={styles.heroCopy}
              >
                <p
                  className={styles.eyebrow}
                >
                  The Founding Community
                </p>

                <h1
                  className={styles.title}
                >
                  The people who were
                  <br />
                  here at the beginning.
                </h1>

                <p
                  className={
                    styles.description
                  }
                >
                  Discover the Founding
                  Members helping shape the
                  earliest chapter of SoccaR.
                </p>
              </div>
            </section>

            <section
              className={styles.statsGrid}
            >
              <article
                className={styles.statCard}
              >
                <div
                  className={
                    styles.statIcon
                  }
                >
                  <UsersRound
                    size={25}
                    strokeWidth={1.6}
                  />
                </div>

                <div>
                  <strong
                    className={
                      styles.statValue
                    }
                  >
                    {founderCount}
                  </strong>

                  <span
                    className={
                      styles.statLabel
                    }
                  >
                    {founderCount === 1
                      ? "Founding Member"
                      : "Founding Members"}
                  </span>

                  <p
                    className={
                      styles.statCopy
                    }
                  >
                    Real people. Real beginning.
                  </p>
                </div>
              </article>

              <article
                className={styles.statCard}
              >
                <div
                  className={
                    styles.statIcon
                  }
                >
                  <Globe2
                    size={25}
                    strokeWidth={1.6}
                  />
                </div>

                <div>
                  <strong
                    className={
                      styles.statValue
                    }
                  >
                    {countriesRepresented}
                  </strong>

                  <span
                    className={
                      styles.statLabel
                    }
                  >
                    {countriesRepresented ===
                    1
                      ? "Country Represented"
                      : "Countries Represented"}
                  </span>

                  <p
                    className={
                      styles.statCopy
                    }
                  >
                    Our community spans the
                    globe.
                  </p>
                </div>
              </article>

              <article
                className={styles.statCard}
              >
                <div
                  className={
                    styles.statIcon
                  }
                >
                  <ShieldCheck
                    size={25}
                    strokeWidth={1.6}
                  />
                </div>

                <div>
                  <strong
                    className={
                      styles.statValue
                    }
                  >
                    {memberTypesRepresented}
                  </strong>

                  <span
                    className={
                      styles.statLabel
                    }
                  >
                    {memberTypesRepresented ===
                    1
                      ? "Member Type"
                      : "Member Types"}
                  </span>

                  <p
                    className={
                      styles.statCopy
                    }
                  >
                    Different roles. One
                    community.
                  </p>
                </div>
              </article>
            </section>

            <p
              className={styles.statsNote}
            >
              Stats are live and reflect verified
              Founding Members.
            </p>

            <section
              className={
                styles.discoveryPanel
              }
            >
              <form
                className={
                  styles.searchForm
                }
                onSubmit={handleSearch}
              >
                <label
                  htmlFor="founder-search"
                  className={
                    styles.controlLabel
                  }
                >
                  Search Founding Members
                </label>

                <div
                  className={
                    styles.searchControl
                  }
                >
                  <div
                    className={
                      styles.searchInputWrap
                    }
                  >
                    <Search
                      size={18}
                      strokeWidth={1.8}
                    />

                    <input
                      id="founder-search"
                      type="text"
                      value={searchInput}
                      onChange={(event) =>
                        setSearchInput(
                          event.target.value
                        )
                      }
                      className={
                        styles.searchInput
                      }
                      placeholder="Search by name or username..."
                    />
                  </div>

                  <button
                    type="submit"
                    className={
                      styles.searchButton
                    }
                  >
                    SEARCH
                  </button>
                </div>
              </form>

              <div
                className={
                  styles.filterControl
                }
              >
                <label
                  htmlFor="country-filter"
                  className={
                    styles.controlLabel
                  }
                >
                  Country
                </label>

                <select
                  id="country-filter"
                  value={countryFilter}
                  onChange={
                    handleCountryChange
                  }
                  className={styles.select}
                >
                  <option value="ALL">
                    All Countries
                  </option>

                  {countries.map(
                    (country) => (
                      <option
                        key={country}
                        value={country}
                      >
                        {country}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div
                className={
                  styles.filterControl
                }
              >
                <label
                  htmlFor="member-type-filter"
                  className={
                    styles.controlLabel
                  }
                >
                  Member Type
                </label>

                <select
                  id="member-type-filter"
                  value={memberTypeFilter}
                  onChange={
                    handleMemberTypeChange
                  }
                  className={styles.select}
                >
                  <option value="ALL">
                    All Member Types
                  </option>

                  {memberTypes.map(
                    (memberType) => (
                      <option
                        key={memberType}
                        value={memberType}
                      >
                        {memberType}
                      </option>
                    )
                  )}
                </select>
              </div>
            </section>

            <section
              className={
                styles.directorySection
              }
            >
              <div
                className={
                  styles.directoryHeader
                }
              >
                <div>
                  <p
                    className={
                      styles.directoryEyebrow
                    }
                  >
                    Founding Members
                  </p>

                  <h2
                    className={
                      styles.directoryTitle
                    }
                  >
                    Meet the Founding Members.
                  </h2>
                </div>

                <div
                  className={
                    styles.directoryMeta
                  }
                >
                  <span>
                    Founder Number
                    {" · "}
                    Ascending
                  </span>

                  <strong>
                    {filteredFounders.length}{" "}
                    {filteredFounders.length ===
                    1
                      ? "Founding Member"
                      : "Founding Members"}
                  </strong>
                </div>
              </div>

              {filteredFounders.length > 0 ? (
                <div
                  className={
                    styles.founderGrid
                  }
                >
                  {filteredFounders.map(
                    (founder) => {
                      const initials =
                        `${founder.firstName?.charAt(0) ?? ""}${founder.lastName?.charAt(0) ?? ""}`
                          .toUpperCase() ||
                        "SF";

                      const fullName =
                        `${founder.firstName} ${founder.lastName}`.trim() ||
                        "SoccaR Founding Member";

                      return (
                        <article
                          key={
                            founder.founderNumber
                          }
                          className={
                            styles.founderCard
                          }
                        >
                          <div
                            className={
                              styles.founderCardImage
                            }
                            aria-hidden="true"
                          />

                          <div
                            className={
                              styles.founderCardOverlay
                            }
                          />

                          <div
                            className={
                              styles.founderAvatar
                            }
                          >
                            {initials}

                            <span
                              className={
                                styles.verifiedShield
                              }
                            >
                              <ShieldCheck
                                size={14}
                                strokeWidth={2}
                              />
                            </span>
                          </div>

                          <div
                            className={
                              styles.founderContent
                            }
                          >
                            <p
                              className={
                                styles.founderNumber
                              }
                            >
                              Founder #
                              {
                                founder.founderNumber
                              }
                            </p>

                            <h3
                              className={
                                styles.founderName
                              }
                            >
                              {fullName}
                            </h3>

                            {founder.username && (
                              <p
                                className={
                                  styles.username
                                }
                              >
                                @
                                {
                                  founder.username
                                }
                              </p>
                            )}

                            <div
                              className={
                                styles.founderMeta
                              }
                            >
                              {founder.memberType && (
                                <span>
                                  <UserRound
                                    size={15}
                                    strokeWidth={
                                      1.8
                                    }
                                  />
                                  {
                                    founder.memberType
                                  }
                                </span>
                              )}

                              {founder.countryOfResidence && (
                                <span>
                                  <MapPin
                                    size={15}
                                    strokeWidth={
                                      1.8
                                    }
                                  />
                                  {
                                    founder.countryOfResidence
                                  }
                                </span>
                              )}
                            </div>
                          </div>
                        </article>
                      );
                    }
                  )}
                </div>
              ) : (
                <div
                  className={
                    styles.emptyState
                  }
                >
                  <Search
                    size={26}
                    strokeWidth={1.6}
                  />

                  <h3>
                    No Founding Members found.
                  </h3>

                  <p>
                    Try another name,
                    username, country or
                    member type.
                  </p>
                </div>
              )}
            </section>

            {founderCount === 1 && (
              <section
                className={
                  styles.firstFounder
                }
              >
                <div
                  className={
                    styles.storyImage
                  }
                  aria-hidden="true"
                />

                <div
                  className={
                    styles.storyOverlay
                  }
                />

                <div
                  className={
                    styles.storyIcon
                  }
                >
                  <ShieldCheck
                    size={29}
                    strokeWidth={1.5}
                  />
                </div>

                <div
                  className={
                    styles.storyContent
                  }
                >
                  <p
                    className={
                      styles.firstFounderEyebrow
                    }
                  >
                    The Beginning
                  </p>

                  <h2
                    className={
                      styles.firstFounderTitle
                    }
                  >
                    You are the first.
                  </h2>

                  <p
                    className={
                      styles.firstFounderCopy
                    }
                  >
                    The Founding Community
                    begins here. As new
                    Founding Members join
                    SoccaR, they will appear
                    alongside you.
                  </p>
                </div>
              </section>
            )}

            <section
              className={
                styles.closingPanel
              }
            >
              <div
                className={
                  styles.closingImage
                }
                aria-hidden="true"
              />

              <div
                className={
                  styles.closingOverlay
                }
              />

              <div
                className={
                  styles.closingIcon
                }
              >
                <Globe2
                  size={29}
                  strokeWidth={1.5}
                />
              </div>

              <div
                className={
                  styles.closingContent
                }
              >
                <p
                  className={
                    styles.closingEyebrow
                  }
                >
                  Origin Story
                </p>

                <h2
                  className={
                    styles.closingTitle
                  }
                >
                  Built one Founding Member
                  at a time.
                </h2>

                <p
                  className={
                    styles.closingCopy
                  }
                >
                  Every verified Founding
                  Member becomes a permanent
                  part of SoccaR&apos;s origin
                  story.
                </p>
              </div>
            </section>

            <footer
              className={
                styles.communityFooter
              }
            >
              <p>
                More Founding Members. More
                countries. One global
                community.
              </p>

              <strong>
                This is only the beginning.
              </strong>
            </footer>
          </section>
        </main>
      </div>
    </div>
  );
}