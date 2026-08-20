"use client";

import {
  Check,
  ChevronRight,
  Flag,
  Globe2,
  MapPin,
  Search,
  Shield,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import styles from "./FootballIdentityShell.module.css";

type MemberData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  countryOfResidence?: string | null;
  countryOfOrigin?: string | null;
  cityOfResidence?: string | null;
  memberType?: string | null;
  username?: string | null;
  founderNumber?: string | null;
};

type FootballIdentityData = {
  id: string;
  identityStatus: string;
  currentStep: string;
  nationalTeamStatus: string;
  nationalTeamId?: string | null;
  primaryClubStatus: string;
  primaryClubId?: string | null;
  footballBio?: string | null;
  profilePhotoPath?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
};

type NationalTeam = {
  id: string;
  name: string;
  country_code?: string | null;
  country_name?: string | null;
  nickname?: string | null;
  confederation?: string | null;
};

type FootballClub = {
  id: string;
  name: string;
  short_name?: string | null;
  country_code?: string | null;
  country_name: string;
  city?: string | null;
  gender_category?: string | null;
  club_type?: string | null;
};

type FootballRoleFamily = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
};

type FootballRole = {
  id: string;
  family_id: string;
  name: string;
  slug: string;
  sort_order: number;
};

type MemberFootballRole = {
  role_id: string;
  role_type: string;
};

type FootballIdentityShellProps = {
  member: MemberData;
  footballIdentity: FootballIdentityData;
  nationalTeams: NationalTeam[];
  footballClubs: FootballClub[];
  footballRoleFamilies: FootballRoleFamily[];
  footballRoles: FootballRole[];
  memberFootballRoles: MemberFootballRole[];
};

const STEP_META: Record<
  string,
  {
    number: string;
    label: string;
    progress: number;
  }
> = {
  WELCOME: {
    number: "01",
    label: "Welcome",
    progress: 1,
  },

  FOOTBALL_WORLD: {
    number: "02",
    label: "Your Football World",
    progress: 2,
  },

  NATIONAL_TEAM: {
    number: "03",
    label: "National Team",
    progress: 3,
  },

  PRIMARY_CLUB: {
    number: "04",
    label: "Primary Club",
    progress: 4,
  },

  FOOTBALL_ROLE: {
    number: "05",
    label: "Your Role",
    progress: 5,
  },

  FOOTBALL_BIO: {
    number: "06",
    label: "Football Bio",
    progress: 6,
  },

  REVEAL: {
    number: "07",
    label: "Reveal",
    progress: 7,
  },
};

export default function FootballIdentityShell({
  member,
  footballIdentity,
  nationalTeams,
  footballClubs,
  footballRoleFamilies,
  footballRoles,
  memberFootballRoles,
}: FootballIdentityShellProps) {
  const router = useRouter();

  const [working, setWorking] =
    useState(false);

  const [message, setMessage] =
    useState<string | null>(null);

  /*
   * National Team state.
   */
  const [teamSearch, setTeamSearch] =
    useState("");

  const [
    selectedNationalTeamId,
    setSelectedNationalTeamId,
  ] = useState<string | null>(
    footballIdentity.nationalTeamId ??
      null
  );

  const [
    noNationalTeam,
    setNoNationalTeam,
  ] = useState(
    footballIdentity.nationalTeamStatus ===
      "NO_AFFILIATION"
  );

  /*
   * Primary Club state.
   */
  const [clubSearch, setClubSearch] =
    useState("");

  const [
    selectedPrimaryClubId,
    setSelectedPrimaryClubId,
  ] = useState<string | null>(
    footballIdentity.primaryClubId ??
      null
  );

  const [
    noPrimaryClub,
    setNoPrimaryClub,
  ] = useState(
    footballIdentity.primaryClubStatus ===
      "NO_AFFILIATION"
  );

  const [
    requestClubOpen,
    setRequestClubOpen,
  ] = useState(false);

  const [
    requestClubName,
    setRequestClubName,
  ] = useState("");

  const [
    requestClubCountry,
    setRequestClubCountry,
  ] = useState("");

  const [
    requestClubCity,
    setRequestClubCity,
  ] = useState("");

  const [
    requestClubNotes,
    setRequestClubNotes,
  ] = useState("");

  const [
    requestClubMessage,
    setRequestClubMessage,
  ] = useState<string | null>(null);

  /*
   * Football Role state.
   */
  const existingPrimaryRole =
    memberFootballRoles.find(
      (role) =>
        role.role_type === "PRIMARY"
    );

  const existingAdditionalRoles =
    memberFootballRoles
      .filter(
        (role) =>
          role.role_type ===
          "ADDITIONAL"
      )
      .map(
        (role) =>
          role.role_id
      );

  const [
    selectedPrimaryRoleId,
    setSelectedPrimaryRoleId,
  ] = useState<string | null>(
    existingPrimaryRole?.role_id ??
      null
  );

  const [
    selectedAdditionalRoleIds,
    setSelectedAdditionalRoleIds,
  ] = useState<string[]>(
    existingAdditionalRoles
  );

  const [
    activeRoleFamilyId,
    setActiveRoleFamilyId,
  ] = useState<string | null>(
    footballRoleFamilies[0]?.id ??
      null
  );

  const [
    roleSearch,
    setRoleSearch,
  ] = useState("");

  /*
   * Football Bio state.
   */
  const [
    footballBio,
    setFootballBio,
  ] = useState(
    footballIdentity.footballBio ?? ""
  );

  const fullName =
    `${member.firstName} ${member.lastName}`.trim();

  const step =
    STEP_META[
      footballIdentity.currentStep
    ] ?? STEP_META.WELCOME;

  const progressWidth =
    (step.progress / 7) * 100;

  const filteredNationalTeams =
    useMemo(() => {
      const query =
        teamSearch
          .trim()
          .toLowerCase();

      if (!query) {
        return nationalTeams.slice(
          0,
          14
        );
      }

      return nationalTeams
        .filter((team) => {
          const searchable = [
            team.name,
            team.country_name,
            team.country_code,
            team.nickname,
            team.confederation,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return searchable.includes(
            query
          );
        })
        .slice(0, 20);
    }, [
      teamSearch,
      nationalTeams,
    ]);

  const filteredFootballClubs =
    useMemo(() => {
      const query =
        clubSearch
          .trim()
          .toLowerCase();

      if (!query) {
        return footballClubs.slice(
          0,
          12
        );
      }

      return footballClubs
        .filter((club) => {
          const searchable = [
            club.name,
            club.short_name,
            club.country_name,
            club.country_code,
            club.city,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return searchable.includes(
            query
          );
        })
        .slice(0, 20);
    }, [
      clubSearch,
      footballClubs,
    ]);

  const visibleFootballRoles =
    useMemo(() => {
      const query =
        roleSearch
          .trim()
          .toLowerCase();

      if (query) {
        return footballRoles.filter(
          (role) =>
            role.name
              .toLowerCase()
              .includes(query)
        );
      }

      if (!activeRoleFamilyId) {
        return footballRoles;
      }

      return footballRoles.filter(
        (role) =>
          role.family_id ===
          activeRoleFamilyId
      );
    }, [
      roleSearch,
      activeRoleFamilyId,
      footballRoles,
    ]);

  const primaryRole =
    footballRoles.find(
      (role) =>
        role.id ===
        selectedPrimaryRoleId
    ) ?? null;

  const additionalRoles =
    selectedAdditionalRoleIds
      .map(
        (roleId) =>
          footballRoles.find(
            (role) =>
              role.id === roleId
          )
      )
      .filter(
        (
          role
        ): role is FootballRole =>
          Boolean(role)
      );

  async function handleStartIdentity() {
    if (working) {
      return;
    }

    try {
      setWorking(true);
      setMessage(null);

      const response =
        await fetch(
          "/api/football-identity/start",
          {
            method: "POST",
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        setMessage(
          result.message ||
            "We could not start your Football Identity."
        );

        return;
      }

      router.refresh();
    } catch (error) {
      console.error(
        "Start Football Identity error:",
        error
      );

      setMessage(
        "Something unexpected happened."
      );
    } finally {
      setWorking(false);
    }
  }

  async function handleConfirmFootballWorld() {
    if (working) {
      return;
    }

    try {
      setWorking(true);
      setMessage(null);

      const response =
        await fetch(
          "/api/football-identity/football-world",
          {
            method: "POST",
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        setMessage(
          result.message ||
            "We could not confirm your Football World."
        );

        return;
      }

      router.refresh();
    } catch (error) {
      console.error(
        "Football World confirmation error:",
        error
      );

      setMessage(
        "Something unexpected happened."
      );
    } finally {
      setWorking(false);
    }
  }

  async function handleSaveNationalTeam() {
    if (working) {
      return;
    }

    if (
      !noNationalTeam &&
      !selectedNationalTeamId
    ) {
      setMessage(
        "Please choose a national team or select that you do not follow one."
      );

      return;
    }

    try {
      setWorking(true);
      setMessage(null);

      const response =
        await fetch(
          "/api/football-identity/national-team",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              nationalTeamId:
                noNationalTeam
                  ? null
                  : selectedNationalTeamId,

              noAffiliation:
                noNationalTeam,
            }),
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        setMessage(
          result.message ||
            "We could not save your National Team selection."
        );

        return;
      }

      router.refresh();
    } catch (error) {
      console.error(
        "National Team save error:",
        error
      );

      setMessage(
        "Something unexpected happened."
      );
    } finally {
      setWorking(false);
    }
  }

  async function handleSavePrimaryClub() {
    if (working) {
      return;
    }

    if (
      !noPrimaryClub &&
      !selectedPrimaryClubId
    ) {
      setMessage(
        "Please choose your Primary Club or select that you do not follow one."
      );

      return;
    }

    try {
      setWorking(true);
      setMessage(null);

      const response =
        await fetch(
          "/api/football-identity/primary-club",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              primaryClubId:
                noPrimaryClub
                  ? null
                  : selectedPrimaryClubId,

              noAffiliation:
                noPrimaryClub,
            }),
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        setMessage(
          result.message ||
            "We could not save your Primary Club."
        );

        return;
      }

      router.refresh();
    } catch (error) {
      console.error(
        "Primary Club save error:",
        error
      );

      setMessage(
        "Something unexpected happened."
      );
    } finally {
      setWorking(false);
    }
  }

  async function handleSubmitClubRequest() {
    if (working) {
      return;
    }

    if (!requestClubName.trim()) {
      setRequestClubMessage(
        "Please enter the club name."
      );

      return;
    }

    try {
      setWorking(true);
      setRequestClubMessage(null);

      const response =
        await fetch(
          "/api/football-identity/club-request",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              requestedName:
                requestClubName,

              countryName:
                requestClubCountry,

              city:
                requestClubCity,

              notes:
                requestClubNotes,
            }),
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        setRequestClubMessage(
          result.message ||
            "We could not submit your club request."
        );

        return;
      }

      setRequestClubMessage(
        result.message ||
          "Your club has been submitted for review."
      );

      setRequestClubName("");
      setRequestClubCountry("");
      setRequestClubCity("");
      setRequestClubNotes("");
    } catch (error) {
      console.error(
        "Club request error:",
        error
      );

      setRequestClubMessage(
        "Something unexpected happened."
      );
    } finally {
      setWorking(false);
    }
  }

  function handleChoosePrimaryRole(
    roleId: string
  ) {
    setSelectedPrimaryRoleId(
      roleId
    );

    setSelectedAdditionalRoleIds(
      (current) =>
        current.filter(
          (id) =>
            id !== roleId
        )
    );

    setMessage(null);
  }

  function handleToggleAdditionalRole(
    roleId: string
  ) {
    if (
      roleId ===
      selectedPrimaryRoleId
    ) {
      return;
    }

    setSelectedAdditionalRoleIds(
      (current) => {
        if (
          current.includes(roleId)
        ) {
          return current.filter(
            (id) =>
              id !== roleId
          );
        }

        if (
          current.length >= 5
        ) {
          setMessage(
            "You may choose up to five additional Football Roles."
          );

          return current;
        }

        setMessage(null);

        return [
          ...current,
          roleId,
        ];
      }
    );
  }

  async function handleSaveFootballRoles() {
    if (working) {
      return;
    }

    if (!selectedPrimaryRoleId) {
      setMessage(
        "Please choose your Primary Football Role."
      );

      return;
    }

    try {
      setWorking(true);
      setMessage(null);

      const response =
        await fetch(
          "/api/football-identity/role",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              primaryRoleId:
                selectedPrimaryRoleId,

              additionalRoleIds:
                selectedAdditionalRoleIds,
            }),
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        setMessage(
          result.message ||
            "We could not save your Football Roles."
        );

        return;
      }

      router.refresh();
    } catch (error) {
      console.error(
        "Football Role save error:",
        error
      );

      setMessage(
        "Something unexpected happened while saving your Football Roles."
      );
    } finally {
      setWorking(false);
    }
  }

  async function handleSaveFootballBio() {
    if (working) {
      return;
    }

    const cleanBio =
      footballBio.trim();

    if (!cleanBio) {
      setMessage(
        "Please write a short Football Bio before continuing."
      );

      return;
    }

    if (cleanBio.length > 1500) {
      setMessage(
        "Your Football Bio cannot exceed 1,500 characters."
      );

      return;
    }

    try {
      setWorking(true);
      setMessage(null);

      const response =
        await fetch(
          "/api/football-identity/bio",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              footballBio:
                cleanBio,
            }),
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        setMessage(
          result.message ||
            "We could not save your Football Bio."
        );

        return;
      }

      router.refresh();
    } catch (error) {
      console.error(
        "Football Bio save error:",
        error
      );

      setMessage(
        "Something unexpected happened while saving your Football Bio."
      );
    } finally {
      setWorking(false);
    }
  }


  async function handleCompleteFootballIdentity() {
    if (working) {
      return;
    }

    try {
      setWorking(true);
      setMessage(null);

      const response =
        await fetch(
          "/api/football-identity/complete",
          {
            method: "POST",
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        setMessage(
          result.message ||
            "We could not complete your Football Identity."
        );

        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(
        "Football Identity completion error:",
        error
      );

      setMessage(
        "Something unexpected happened while completing your Football Identity."
      );
    } finally {
      setWorking(false);
    }
  }

  function renderWelcome() {
    return (
      <section
        className={
          styles.welcomeStage
        }
      >
        <p className={styles.eyebrow}>
          SoccaR Football Identity
        </p>

        <h1
          className={
            styles.welcomeTitle
          }
        >
          Football is part of who you
          are.
        </h1>

        <p
          className={
            styles.description
          }
        >
          Let&apos;s build the identity
          that represents you across
          SoccaR.
        </p>

        <div
          className={
            styles.memberMeta
          }
        >
          <span>{fullName}</span>

          <span>
            Founder #
            {member.founderNumber ??
              "------"}
          </span>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={
              styles.primaryButton
            }
            onClick={
              handleStartIdentity
            }
            disabled={working}
          >
            {working
              ? "Starting..."
              : "Build My Football Identity"}
          </button>

          <button
            type="button"
            className={
              styles.secondaryButton
            }
            onClick={() =>
              router.push(
                "/dashboard"
              )
            }
          >
            Return to Dashboard
          </button>
        </div>
      </section>
    );
  }

  function renderFootballWorld() {
    return (
      <section
        className={
          styles.worldLayout
        }
      >
        <div
          className={
            styles.worldNarrative
          }
        >
          <p className={styles.eyebrow}>
            Your Football World
          </p>

          <h1
            className={
              styles.worldTitle
            }
          >
            Your football world{" "}
            <span>starts here.</span>
          </h1>

          <p
            className={
              styles.description
            }
          >
            These details help SoccaR
            understand your football
            context and connect you with
            the right communities,
            content and opportunities.
          </p>

          <p
            className={
              styles.worldInstruction
            }
          >
            Please confirm that your
            information is correct before
            continuing.
          </p>
        </div>

        <div
          className={
            styles.worldCard
          }
        >
          <div
            className={
              styles.cardHeader
            }
          >
            <div>
              <p
                className={
                  styles.cardEyebrow
                }
              >
                Confirm your Football
                World
              </p>

              <h2
                className={
                  styles.cardTitle
                }
              >
                Your current details
              </h2>
            </div>

            <div
              className={
                styles.confirmedBadge
              }
            >
              <Check
                size={14}
                strokeWidth={2.4}
              />
              Profile
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
              <div
                className={
                  styles.rowIcon
                }
              >
                <Globe2
                  size={21}
                  strokeWidth={1.7}
                />
              </div>

              <div
                className={
                  styles.rowContent
                }
              >
                <span>
                  Country of origin
                </span>

                <strong>
                  {member.countryOfOrigin ||
                    "Not provided"}
                </strong>
              </div>

              {member.countryOfOrigin && (
                <Check
                  className={
                    styles.rowCheck
                  }
                  size={18}
                  strokeWidth={2.3}
                />
              )}
            </div>

            <div
              className={
                styles.identityRow
              }
            >
              <div
                className={
                  styles.rowIcon
                }
              >
                <Flag
                  size={21}
                  strokeWidth={1.7}
                />
              </div>

              <div
                className={
                  styles.rowContent
                }
              >
                <span>
                  Country of residence
                </span>

                <strong>
                  {member.countryOfResidence ||
                    "Not provided"}
                </strong>
              </div>

              {member.countryOfResidence && (
                <Check
                  className={
                    styles.rowCheck
                  }
                  size={18}
                  strokeWidth={2.3}
                />
              )}
            </div>

            <div
              className={
                styles.identityRow
              }
            >
              <div
                className={
                  styles.rowIcon
                }
              >
                <MapPin
                  size={21}
                  strokeWidth={1.7}
                />
              </div>

              <div
                className={
                  styles.rowContent
                }
              >
                <span>
                  City of residence
                </span>

                <strong>
                  {member.cityOfResidence ||
                    "Not provided"}
                </strong>
              </div>

              {member.cityOfResidence && (
                <Check
                  className={
                    styles.rowCheck
                  }
                  size={18}
                  strokeWidth={2.3}
                />
              )}
            </div>
          </div>

          <div
            className={
              styles.worldFooter
            }
          >
            <p>
              Everything correct?
            </p>

            <div
              className={
                styles.worldActions
              }
            >
              <button
                type="button"
                className={
                  styles.editButton
                }
                onClick={() =>
                  router.push(
                    "/dashboard/profile"
                  )
                }
              >
                Edit details
              </button>

              <button
                type="button"
                className={
                  styles.continueButton
                }
                onClick={
                  handleConfirmFootballWorld
                }
                disabled={working}
              >
                {working
                  ? "Confirming..."
                  : "Continue →"}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  function renderNationalTeam() {
    const selectedTeam =
      nationalTeams.find(
        (team) =>
          team.id ===
          selectedNationalTeamId
      ) ?? null;

    return (
      <section
        className={
          styles.nationalTeamLayout
        }
      >
        <div
          className={
            styles.nationalTeamNarrative
          }
        >
          <p className={styles.eyebrow}>
            National Team
          </p>

          <h1
            className={
              styles.nationalTeamTitle
            }
          >
            Who do you stand behind on
            the{" "}
            <span>
              international stage?
            </span>
          </h1>

          <p
            className={
              styles.description
            }
          >
            Your national-team
            allegiance becomes part of
            your Football Identity
            across SoccaR.
          </p>

          <div
            className={
              styles.allegianceNote
            }
          >
            Nationality does not
            determine allegiance. Choose
            the team that represents
            your football identity.
          </div>
        </div>

        <div
          className={
            styles.nationalTeamPanel
          }
        >
          <div
            className={
              styles.searchBlock
            }
          >
            <label
              htmlFor="nationalTeamSearch"
              className={
                styles.searchLabel
              }
            >
              Search national teams
            </label>

            <div
              className={
                styles.searchField
              }
            >
              <Search
                size={18}
                strokeWidth={1.8}
              />

              <input
                id="nationalTeamSearch"
                type="text"
                value={teamSearch}
                onChange={(event) =>
                  setTeamSearch(
                    event.target.value
                  )
                }
                placeholder="Search by team, country or confederation"
                disabled={
                  noNationalTeam
                }
              />
            </div>
          </div>

          {!noNationalTeam && (
            <div
              className={
                styles.teamResults
              }
            >
              {filteredNationalTeams.length >
              0 ? (
                filteredNationalTeams.map(
                  (team) => {
                    const selected =
                      selectedNationalTeamId ===
                      team.id;

                    return (
                      <button
                        key={team.id}
                        type="button"
                        className={`${styles.teamResult} ${
                          selected
                            ? styles.teamResultSelected
                            : ""
                        }`}
                        onClick={() => {
                          setSelectedNationalTeamId(
                            team.id
                          );

                          setNoNationalTeam(
                            false
                          );

                          setMessage(null);
                        }}
                      >
                        <div
                          className={
                            styles.teamMonogram
                          }
                        >
                          {(
                            team.country_code ??
                            team.name
                          )
                            .slice(0, 3)
                            .toUpperCase()}
                        </div>

                        <div
                          className={
                            styles.teamResultIdentity
                          }
                        >
                          <strong>
                            {team.name}
                          </strong>

                          <span>
                            {team.confederation ||
                              "International"}
                          </span>
                        </div>

                        {selected ? (
                          <Check
                            size={18}
                            strokeWidth={2.4}
                          />
                        ) : (
                          <ChevronRight
                            size={17}
                            strokeWidth={1.7}
                          />
                        )}
                      </button>
                    );
                  }
                )
              ) : (
                <div
                  className={
                    styles.noResults
                  }
                >
                  No national teams found.
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            className={`${styles.noAffiliationButton} ${
              noNationalTeam
                ? styles.noAffiliationButtonSelected
                : ""
            }`}
            onClick={() => {
              const next =
                !noNationalTeam;

              setNoNationalTeam(
                next
              );

              if (next) {
                setSelectedNationalTeamId(
                  null
                );
              }

              setMessage(null);
            }}
          >
            <div>
              <strong>
                I don&apos;t follow a
                national team
              </strong>

              <span>
                Continue without a
                national-team affiliation.
              </span>
            </div>

            {noNationalTeam && (
              <Check
                size={18}
                strokeWidth={2.4}
              />
            )}
          </button>

          {selectedTeam &&
            !noNationalTeam && (
              <div
                className={
                  styles.selectedTeam
                }
              >
                <span>
                  Your National Team
                </span>

                <strong>
                  {selectedTeam.name}
                </strong>

                <small>
                  {
                    selectedTeam.confederation
                  }
                </small>
              </div>
            )}

          <div
            className={
              styles.nationalTeamActions
            }
          >
            <button
              type="button"
              className={
                styles.continueButton
              }
              onClick={
                handleSaveNationalTeam
              }
              disabled={working}
            >
              {working
                ? "Saving..."
                : "Continue →"}
            </button>
          </div>
        </div>
      </section>
    );
  }

  function renderPrimaryClub() {
    const selectedClub =
      footballClubs.find(
        (club) =>
          club.id ===
          selectedPrimaryClubId
      ) ?? null;

    return (
      <section
        className={
          styles.primaryClubLayout
        }
      >
        <div
          className={
            styles.primaryClubNarrative
          }
        >
          <p className={styles.eyebrow}>
            Primary Club
          </p>

          <h1
            className={
              styles.primaryClubTitle
            }
          >
            Which club sits closest to
            your{" "}
            <span>football heart?</span>
          </h1>

          <p
            className={
              styles.description
            }
          >
            Choose the club you identify
            with most strongly. This
            becomes your Primary Club
            across SoccaR.
          </p>

          <div
            className={
              styles.allegianceNote
            }
          >
            You can support many clubs,
            but your Primary Club is the
            one that represents you first
            across your Football Identity.
          </div>
        </div>

        <div
          className={
            styles.primaryClubPanel
          }
        >
          <div
            className={
              styles.searchBlock
            }
          >
            <label
              htmlFor="clubSearch"
              className={
                styles.searchLabel
              }
            >
              Search football clubs
            </label>

            <div
              className={
                styles.searchField
              }
            >
              <Search
                size={18}
                strokeWidth={1.8}
              />

              <input
                id="clubSearch"
                type="text"
                value={clubSearch}
                onChange={(event) =>
                  setClubSearch(
                    event.target.value
                  )
                }
                placeholder="Search by club, city or country"
                disabled={
                  noPrimaryClub
                }
              />
            </div>
          </div>

          {!noPrimaryClub && (
            <div
              className={
                styles.clubResults
              }
            >
              {filteredFootballClubs.length >
              0 ? (
                filteredFootballClubs.map(
                  (club) => {
                    const selected =
                      selectedPrimaryClubId ===
                      club.id;

                    const monogram =
                      (
                        club.short_name ??
                        club.name
                      )
                        .split(" ")
                        .map(
                          (part) =>
                            part.charAt(0)
                        )
                        .join("")
                        .slice(0, 3)
                        .toUpperCase();

                    return (
                      <button
                        key={club.id}
                        type="button"
                        className={`${styles.clubResult} ${
                          selected
                            ? styles.clubResultSelected
                            : ""
                        }`}
                        onClick={() => {
                          setSelectedPrimaryClubId(
                            club.id
                          );

                          setNoPrimaryClub(
                            false
                          );

                          setMessage(null);
                        }}
                      >
                        <div
                          className={
                            styles.clubMonogram
                          }
                        >
                          {monogram}
                        </div>

                        <div
                          className={
                            styles.clubResultIdentity
                          }
                        >
                          <strong>
                            {club.short_name ||
                              club.name}
                          </strong>

                          <span>
                            {[
                              club.city,
                              club.country_name,
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </span>
                        </div>

                        {selected ? (
                          <Check
                            size={18}
                            strokeWidth={2.4}
                          />
                        ) : (
                          <ChevronRight
                            size={17}
                            strokeWidth={1.7}
                          />
                        )}
                      </button>
                    );
                  }
                )
              ) : (
                <div
                  className={
                    styles.noResults
                  }
                >
                  No clubs found in the
                  current SoccaR club
                  directory.
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            className={`${styles.noAffiliationButton} ${
              noPrimaryClub
                ? styles.noAffiliationButtonSelected
                : ""
            }`}
            onClick={() => {
              const next =
                !noPrimaryClub;

              setNoPrimaryClub(
                next
              );

              if (next) {
                setSelectedPrimaryClubId(
                  null
                );
              }

              setMessage(null);
            }}
          >
            <div>
              <strong>
                I don&apos;t follow a club
              </strong>

              <span>
                Continue without a Primary
                Club affiliation.
              </span>
            </div>

            {noPrimaryClub && (
              <Check
                size={18}
                strokeWidth={2.4}
              />
            )}
          </button>

          <button
            type="button"
            className={
              styles.missingClubButton
            }
            onClick={() => {
              setRequestClubOpen(
                (current) =>
                  !current
              );

              setRequestClubMessage(
                null
              );
            }}
          >
            <div>
              <strong>
                My club isn&apos;t listed
              </strong>

              <span>
                Submit it to SoccaR for
                review and inclusion.
              </span>
            </div>

            <ChevronRight
              size={17}
              strokeWidth={1.7}
            />
          </button>

          {requestClubOpen && (
            <div
              className={
                styles.clubRequestPanel
              }
            >
              <div
                className={
                  styles.clubRequestHeader
                }
              >
                <Shield
                  size={20}
                  strokeWidth={1.7}
                />

                <div>
                  <strong>
                    Request a club
                  </strong>

                  <span>
                    SoccaR reviews requested
                    clubs before adding them
                    to the canonical directory.
                  </span>
                </div>
              </div>

              <div
                className={
                  styles.clubRequestFields
                }
              >
                <input
                  type="text"
                  value={
                    requestClubName
                  }
                  onChange={(event) =>
                    setRequestClubName(
                      event.target.value
                    )
                  }
                  placeholder="Club name *"
                  maxLength={180}
                />

                <input
                  type="text"
                  value={
                    requestClubCountry
                  }
                  onChange={(event) =>
                    setRequestClubCountry(
                      event.target.value
                    )
                  }
                  placeholder="Country"
                  maxLength={100}
                />

                <input
                  type="text"
                  value={
                    requestClubCity
                  }
                  onChange={(event) =>
                    setRequestClubCity(
                      event.target.value
                    )
                  }
                  placeholder="City"
                  maxLength={120}
                />

                <textarea
                  value={
                    requestClubNotes
                  }
                  onChange={(event) =>
                    setRequestClubNotes(
                      event.target.value
                    )
                  }
                  placeholder="Optional additional information"
                  maxLength={1000}
                />
              </div>

              {requestClubMessage && (
                <p
                  className={
                    styles.clubRequestMessage
                  }
                >
                  {
                    requestClubMessage
                  }
                </p>
              )}

              <button
                type="button"
                className={
                  styles.requestSubmitButton
                }
                onClick={
                  handleSubmitClubRequest
                }
                disabled={working}
              >
                {working
                  ? "Submitting..."
                  : "Submit Club Request"}
              </button>
            </div>
          )}

          {selectedClub &&
            !noPrimaryClub && (
              <div
                className={
                  styles.selectedClub
                }
              >
                <span>
                  Your Primary Club
                </span>

                <strong>
                  {selectedClub.short_name ||
                    selectedClub.name}
                </strong>

                <small>
                  {[
                    selectedClub.city,
                    selectedClub.country_name,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </small>
              </div>
            )}

          <div
            className={
              styles.primaryClubActions
            }
          >
            <button
              type="button"
              className={
                styles.continueButton
              }
              onClick={
                handleSavePrimaryClub
              }
              disabled={working}
            >
              {working
                ? "Saving..."
                : "Continue →"}
            </button>
          </div>
        </div>
      </section>
    );
  }

  function renderFootballRole() {
    return (
      <section
        className={
          styles.roleLayout
        }
      >
        <div
          className={
            styles.roleNarrative
          }
        >
          <p className={styles.eyebrow}>
            Your Football Role
          </p>

          <h1
            className={
              styles.roleTitle
            }
          >
            Where do you belong in the{" "}
            <span>football world?</span>
          </h1>

          <p
            className={
              styles.description
            }
          >
            Choose the role that defines
            you most strongly, then add
            other roles that reflect how
            you participate in football.
          </p>

          <div
            className={
              styles.roleRule
            }
          >
            <UserRound
              size={18}
              strokeWidth={1.8}
            />

            <div>
              <strong>
                One Primary Role
              </strong>

              <span>
                This becomes the main role
                attached to your Football
                Identity.
              </span>
            </div>
          </div>

          <div
            className={
              styles.roleRule
            }
          >
            <UsersRound
              size={18}
              strokeWidth={1.8}
            />

            <div>
              <strong>
                Up to five Additional Roles
              </strong>

              <span>
                Football identities are
                multidimensional. Add the
                other roles that genuinely
                represent you.
              </span>
            </div>
          </div>
        </div>

        <div
          className={
            styles.rolePanel
          }
        >
          <div
            className={
              styles.rolePanelTop
            }
          >
            <div>
              <p
                className={
                  styles.cardEyebrow
                }
              >
                Football Role Directory
              </p>

              <h2
                className={
                  styles.cardTitle
                }
              >
                Choose your roles
              </h2>
            </div>

            <div
              className={
                styles.roleCountBadge
              }
            >
              {footballRoles.length} roles
            </div>
          </div>

          <div
            className={
              styles.searchField
            }
          >
            <Search
              size={18}
              strokeWidth={1.8}
            />

            <input
              type="text"
              value={roleSearch}
              onChange={(event) =>
                setRoleSearch(
                  event.target.value
                )
              }
              placeholder="Search Football Roles"
            />

            {roleSearch && (
              <button
                type="button"
                className={
                  styles.clearSearchButton
                }
                onClick={() =>
                  setRoleSearch("")
                }
                aria-label="Clear role search"
              >
                <X
                  size={16}
                  strokeWidth={1.8}
                />
              </button>
            )}
          </div>

          {!roleSearch && (
            <div
              className={
                styles.roleFamilies
              }
            >
              {footballRoleFamilies.map(
                (family) => {
                  const active =
                    family.id ===
                    activeRoleFamilyId;

                  return (
                    <button
                      key={family.id}
                      type="button"
                      className={`${styles.roleFamilyButton} ${
                        active
                          ? styles.roleFamilyButtonActive
                          : ""
                      }`}
                      onClick={() =>
                        setActiveRoleFamilyId(
                          family.id
                        )
                      }
                    >
                      {family.name}
                    </button>
                  );
                }
              )}
            </div>
          )}

          <div
            className={
              styles.roleResults
            }
          >
            {visibleFootballRoles.length >
            0 ? (
              visibleFootballRoles.map(
                (role) => {
                  const isPrimary =
                    selectedPrimaryRoleId ===
                    role.id;

                  const isAdditional =
                    selectedAdditionalRoleIds.includes(
                      role.id
                    );

                  return (
                    <div
                      key={role.id}
                      className={`${styles.roleResult} ${
                        isPrimary
                          ? styles.roleResultPrimary
                          : ""
                      } ${
                        isAdditional
                          ? styles.roleResultAdditional
                          : ""
                      }`}
                    >
                      <div
                        className={
                          styles.roleResultIdentity
                        }
                      >
                        <strong>
                          {role.name}
                        </strong>

                        <span>
                          {isPrimary
                            ? "Primary Role"
                            : isAdditional
                              ? "Additional Role"
                              : "Available Role"}
                        </span>
                      </div>

                      <div
                        className={
                          styles.roleResultActions
                        }
                      >
                        <button
                          type="button"
                          className={`${styles.primaryRoleButton} ${
                            isPrimary
                              ? styles.primaryRoleButtonSelected
                              : ""
                          }`}
                          onClick={() =>
                            handleChoosePrimaryRole(
                              role.id
                            )
                          }
                        >
                          {isPrimary
                            ? "Primary ✓"
                            : "Set Primary"}
                        </button>

                        {!isPrimary && (
                          <button
                            type="button"
                            className={`${styles.additionalRoleButton} ${
                              isAdditional
                                ? styles.additionalRoleButtonSelected
                                : ""
                            }`}
                            onClick={() =>
                              handleToggleAdditionalRole(
                                role.id
                              )
                            }
                          >
                            {isAdditional
                              ? "Added ✓"
                              : "+ Add"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                }
              )
            ) : (
              <div
                className={
                  styles.noResults
                }
              >
                No Football Roles found.
              </div>
            )}
          </div>

          <div
            className={
              styles.roleSelectionSummary
            }
          >
            <div
              className={
                styles.roleSummaryPrimary
              }
            >
              <span>
                Primary Role
              </span>

              <strong>
                {primaryRole?.name ??
                  "Not selected"}
              </strong>
            </div>

            <div
              className={
                styles.roleSummaryAdditional
              }
            >
              <div
                className={
                  styles.roleSummaryHeader
                }
              >
                <span>
                  Additional Roles
                </span>

                <strong>
                  {
                    selectedAdditionalRoleIds.length
                  }
                  /5
                </strong>
              </div>

              {additionalRoles.length >
              0 ? (
                <div
                  className={
                    styles.roleChips
                  }
                >
                  {additionalRoles.map(
                    (role) => (
                      <button
                        key={role.id}
                        type="button"
                        className={
                          styles.roleChip
                        }
                        onClick={() =>
                          handleToggleAdditionalRole(
                            role.id
                          )
                        }
                      >
                        {role.name}
                        <X
                          size={13}
                          strokeWidth={1.8}
                        />
                      </button>
                    )
                  )}
                </div>
              ) : (
                <p
                  className={
                    styles.roleSummaryEmpty
                  }
                >
                  No additional roles
                  selected.
                </p>
              )}
            </div>
          </div>

          <div
            className={
              styles.roleActions
            }
          >
            <button
              type="button"
              className={
                styles.continueButton
              }
              onClick={
                handleSaveFootballRoles
              }
              disabled={
                working ||
                !selectedPrimaryRoleId
              }
            >
              {working
                ? "Saving..."
                : "Continue →"}
            </button>
          </div>
        </div>
      </section>
    );
  }

  function renderFootballBio() {
    const charactersUsed =
      footballBio.length;

    const charactersRemaining =
      1500 - charactersUsed;

    const bioPrompts = [
      "What does football mean to you?",
      "How are you connected to the game?",
      "What part of football excites you most?",
    ];

    return (
      <section
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(0, 0.76fr) minmax(560px, 1.24fr)",
          gap: "clamp(60px, 8vw, 130px)",
          alignItems: "start",
          padding: "70px 0 90px",
        }}
      >
        <div
          style={{
            maxWidth: "560px",
          }}
        >
          <p className={styles.eyebrow}>
            Football Bio
          </p>

          <h1
            style={{
              maxWidth: "620px",
              margin: "22px 0 0",
              fontSize:
                "clamp(54px, 5.4vw, 80px)",
              lineHeight: 0.96,
              letterSpacing: "-0.055em",
            }}
          >
            Tell SoccaR what football{" "}
            <span
              style={{
                color: "#9ce500",
              }}
            >
              means to you.
            </span>
          </h1>

          <p
            className={
              styles.description
            }
          >
            Your bio adds a human voice
            to your Football Identity.
            Write naturally — this is
            about your relationship with
            the game, not a formal CV.
          </p>

          <div
            style={{
              marginTop: "30px",
              paddingLeft: "16px",
              borderLeft:
                "2px solid rgba(156, 229, 0, 0.55)",
            }}
          >
            <p
              style={{
                margin: 0,
                color:
                  "rgba(255,255,255,0.5)",
                fontSize: "13px",
                lineHeight: 1.65,
              }}
            >
              Keep it personal,
              authentic and football
              focused. You can always
              refine it later.
            </p>
          </div>
        </div>

        <div
          style={{
            border:
              "1px solid rgba(255,255,255,0.10)",
            background:
              "rgba(255,255,255,0.025)",
            padding: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent:
                "space-between",
              gap: "24px",
              paddingBottom: "24px",
            }}
          >
            <div>
              <p
                className={
                  styles.cardEyebrow
                }
              >
                Your story in football
              </p>

              <h2
                className={
                  styles.cardTitle
                }
              >
                Write your Football Bio
              </h2>
            </div>

            <div
              style={{
                padding:
                  "8px 11px",
                border:
                  "1px solid rgba(156,229,0,0.25)",
                color: "#9ce500",
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing:
                  "0.07em",
                textTransform:
                  "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              1,500 max
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: "9px",
              marginBottom: "18px",
            }}
          >
            <span
              style={{
                color:
                  "rgba(255,255,255,0.42)",
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing:
                  "0.10em",
                textTransform:
                  "uppercase",
              }}
            >
              Need a starting point?
            </span>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              {bioPrompts.map(
                (prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => {
                      if (
                        footballBio
                          .trim()
                          .length === 0
                      ) {
                        setFootballBio(
                          `${prompt} `
                        );
                      }

                      setMessage(null);
                    }}
                    style={{
                      minHeight: "34px",
                      padding:
                        "0 11px",
                      border:
                        "1px solid rgba(255,255,255,0.10)",
                      background:
                        "transparent",
                      color:
                        "rgba(255,255,255,0.52)",
                      font: "inherit",
                      fontSize: "10px",
                      cursor:
                        "pointer",
                    }}
                  >
                    {prompt}
                  </button>
                )
              )}
            </div>
          </div>

          <div
            style={{
              position: "relative",
            }}
          >
            <textarea
              value={footballBio}
              onChange={(event) => {
                setFootballBio(
                  event.target.value
                );

                if (message) {
                  setMessage(null);
                }
              }}
              maxLength={1500}
              placeholder="For example: Football has been part of my life for as long as I can remember. I follow the game as a supporter, creator and member of the wider football community..."
              style={{
                width: "100%",
                minHeight: "290px",
                resize: "vertical",
                border:
                  "1px solid rgba(255,255,255,0.12)",
                outline: "none",
                padding:
                  "20px 20px 54px",
                background:
                  "rgba(0,0,0,0.22)",
                color: "#ffffff",
                font: "inherit",
                fontSize: "15px",
                lineHeight: 1.75,
              }}
            />

            <div
              style={{
                position:
                  "absolute",
                left: "20px",
                right: "20px",
                bottom: "17px",
                display: "flex",
                justifyContent:
                  "space-between",
                gap: "20px",
                color:
                  charactersRemaining <
                  100
                    ? "#9ce500"
                    : "rgba(255,255,255,0.34)",
                fontSize: "10px",
                fontWeight: 750,
                letterSpacing:
                  "0.06em",
                textTransform:
                  "uppercase",
                pointerEvents:
                  "none",
              }}
            >
              <span>
                {charactersUsed} used
              </span>

              <span>
                {charactersRemaining}{" "}
                remaining
              </span>
            </div>
          </div>

          <div
            style={{
              marginTop: "18px",
              padding: "18px",
              border:
                "1px solid rgba(156,229,0,0.16)",
              background:
                "rgba(156,229,0,0.025)",
            }}
          >
            <span
              style={{
                display: "block",
                color:
                  "rgba(255,255,255,0.38)",
                fontSize: "9px",
                fontWeight: 800,
                letterSpacing:
                  "0.10em",
                textTransform:
                  "uppercase",
              }}
            >
              Identity Preview
            </span>

            <p
              style={{
                margin:
                  "10px 0 0",
                color:
                  footballBio.trim()
                    ? "rgba(255,255,255,0.76)"
                    : "rgba(255,255,255,0.30)",
                fontSize: "13px",
                lineHeight: 1.7,
                whiteSpace:
                  "pre-wrap",
              }}
            >
              {footballBio.trim() ||
                "Your Football Bio preview will appear here as you write."}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent:
                "flex-end",
              marginTop: "22px",
              paddingTop: "22px",
              borderTop:
                "1px solid rgba(255,255,255,0.075)",
            }}
          >
            <button
              type="button"
              className={
                styles.continueButton
              }
              onClick={
                handleSaveFootballBio
              }
              disabled={
                working ||
                footballBio.trim()
                  .length === 0
              }
            >
              {working
                ? "Saving..."
                : "Continue →"}
            </button>
          </div>
        </div>
      </section>
    );
  }

  function renderRevealReady() {
    const savedNationalTeam =
      footballIdentity.nationalTeamId
        ? nationalTeams.find(
            (team) =>
              team.id ===
              footballIdentity.nationalTeamId
          ) ?? null
        : null;

    const savedPrimaryClub =
      footballIdentity.primaryClubId
        ? footballClubs.find(
            (club) =>
              club.id ===
              footballIdentity.primaryClubId
          ) ?? null
        : null;

    const savedPrimaryRoleLink =
      memberFootballRoles.find(
        (role) =>
          role.role_type === "PRIMARY"
      );

    const savedPrimaryRole =
      savedPrimaryRoleLink
        ? footballRoles.find(
            (role) =>
              role.id ===
              savedPrimaryRoleLink.role_id
          ) ?? null
        : null;

    const savedAdditionalRoles =
      memberFootballRoles
        .filter(
          (role) =>
            role.role_type ===
            "ADDITIONAL"
        )
        .map((memberRole) =>
          footballRoles.find(
            (role) =>
              role.id ===
              memberRole.role_id
          )
        )
        .filter(
          (
            role
          ): role is FootballRole =>
            Boolean(role)
        );

    const nationalTeamLabel =
      footballIdentity.nationalTeamStatus ===
      "NO_AFFILIATION"
        ? "No national-team affiliation"
        : savedNationalTeam?.name ??
          "Not available";

    const primaryClubLabel =
      footballIdentity.primaryClubStatus ===
      "NO_AFFILIATION"
        ? "No Primary Club affiliation"
        : savedPrimaryClub?.short_name ||
          savedPrimaryClub?.name ||
          "Not available";

    const locationLabel = [
      member.cityOfResidence,
      member.countryOfResidence,
    ]
      .filter(Boolean)
      .join(", ");

    return (
      <section
        style={{
          padding: "68px 0 100px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(0, 0.72fr) minmax(620px, 1.28fr)",
            gap: "clamp(64px, 8vw, 128px)",
            alignItems: "start",
          }}
        >
          <div
            style={{
              maxWidth: "600px",
              paddingTop: "36px",
            }}
          >
            <p className={styles.eyebrow}>
              Your Football Identity
            </p>

            <h1
              style={{
                margin: "22px 0 0",
                fontSize:
                  "clamp(60px, 6.7vw, 98px)",
                lineHeight: 0.92,
                letterSpacing: "-0.06em",
              }}
            >
              This is you in{" "}
              <span
                style={{
                  color: "#9ce500",
                }}
              >
                football.
              </span>
            </h1>

            <p
              className={
                styles.description
              }
            >
              Your football world,
              allegiances, roles and
              story are now connected
              across SoccaR.
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                width: "fit-content",
                marginTop: "34px",
                padding: "12px 15px",
                border:
                  "1px solid rgba(156,229,0,0.24)",
                color: "#9ce500",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.06em",
                textTransform:
                  "uppercase",
              }}
            >
              <Check
                size={16}
                strokeWidth={2.3}
              />
              Football Identity Complete
            </div>

            <p
              style={{
                maxWidth: "470px",
                margin: "18px 0 0",
                color:
                  "rgba(255,255,255,0.42)",
                fontSize: "13px",
                lineHeight: 1.65,
              }}
            >
              You&apos;ve built the
              foundation of how football
              will recognise you across
              SoccaR.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                marginTop: "34px",
              }}
            >
              <button
                type="button"
                className={
                  styles.continueButton
                }
                onClick={
                  handleCompleteFootballIdentity
                }
                disabled={working}
              >
                {working
                  ? "Entering SoccaR..."
                  : "Enter SoccaR →"}
              </button>

              <button
                type="button"
                className={
                  styles.editButton
                }
                onClick={() =>
                  router.push(
                    "/dashboard/profile"
                  )
                }
                disabled={working}
                style={{
                  padding: "0 24px",
                }}
              >
                View My Profile
              </button>
            </div>
          </div>

          <article
            style={{
              position: "relative",
              overflow: "hidden",
              minHeight: "610px",
              border:
                "1px solid rgba(156,229,0,0.22)",
              background:
                "linear-gradient(145deg, rgba(156,229,0,0.055) 0%, rgba(255,255,255,0.018) 42%, rgba(0,0,0,0.12) 100%)",
              padding: "34px",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "430px",
                height: "430px",
                right: "-180px",
                top: "-210px",
                borderRadius: "50%",
                background:
                  "rgba(156,229,0,0.055)",
                filter: "blur(12px)",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "relative",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent:
                    "space-between",
                  gap: "24px",
                  paddingBottom: "28px",
                  borderBottom:
                    "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div>
                  <p
                    className={
                      styles.cardEyebrow
                    }
                  >
                    SoccaR Football Identity
                  </p>

                  <h2
                    style={{
                      margin: "9px 0 0",
                      fontSize:
                        "clamp(30px, 3vw, 42px)",
                      letterSpacing:
                        "-0.045em",
                      lineHeight: 1,
                    }}
                  >
                    {fullName}
                  </h2>
                </div>

                <div
                  style={{
                    textAlign: "right",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      color:
                        "rgba(255,255,255,0.38)",
                      fontSize: "9px",
                      fontWeight: 800,
                      letterSpacing:
                        "0.11em",
                      textTransform:
                        "uppercase",
                    }}
                  >
                    Founding Member
                  </span>

                  <strong
                    style={{
                      display: "block",
                      marginTop: "5px",
                      color: "#9ce500",
                      fontSize: "22px",
                    }}
                  >
                    #
                    {member.founderNumber ??
                      "------"}
                  </strong>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "1px",
                  marginTop: "26px",
                  border:
                    "1px solid rgba(255,255,255,0.075)",
                  background:
                    "rgba(255,255,255,0.075)",
                }}
              >
                {[
                  [
                    "Football World",
                    locationLabel ||
                      member.countryOfResidence ||
                      "Not provided",
                  ],
                  [
                    "Country of Origin",
                    member.countryOfOrigin ||
                      "Not provided",
                  ],
                  [
                    "National Team",
                    nationalTeamLabel,
                  ],
                  [
                    "Primary Club",
                    primaryClubLabel,
                  ],
                ].map(
                  ([label, value]) => (
                    <div
                      key={label}
                      style={{
                        minHeight: "96px",
                        padding: "18px",
                        background:
                          "rgba(4,5,4,0.96)",
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          color:
                            "rgba(255,255,255,0.36)",
                          fontSize: "9px",
                          fontWeight: 800,
                          letterSpacing:
                            "0.10em",
                          textTransform:
                            "uppercase",
                        }}
                      >
                        {label}
                      </span>

                      <strong
                        style={{
                          display: "block",
                          marginTop: "8px",
                          color: "#ffffff",
                          fontSize: "16px",
                          lineHeight: 1.35,
                        }}
                      >
                        {value}
                      </strong>
                    </div>
                  )
                )}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "0.8fr 1.2fr",
                  gap: "18px",
                  marginTop: "22px",
                }}
              >
                <div
                  style={{
                    padding: "20px",
                    border:
                      "1px solid rgba(156,229,0,0.18)",
                    background:
                      "rgba(156,229,0,0.025)",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      color:
                        "rgba(255,255,255,0.36)",
                      fontSize: "9px",
                      fontWeight: 800,
                      letterSpacing:
                        "0.10em",
                      textTransform:
                        "uppercase",
                    }}
                  >
                    Primary Football Role
                  </span>

                  <strong
                    style={{
                      display: "block",
                      marginTop: "8px",
                      color: "#9ce500",
                      fontSize: "18px",
                      lineHeight: 1.3,
                    }}
                  >
                    {savedPrimaryRole?.name ??
                      "Not available"}
                  </strong>
                </div>

                <div
                  style={{
                    padding: "20px",
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      color:
                        "rgba(255,255,255,0.36)",
                      fontSize: "9px",
                      fontWeight: 800,
                      letterSpacing:
                        "0.10em",
                      textTransform:
                        "uppercase",
                    }}
                  >
                    Additional Roles
                  </span>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "7px",
                      marginTop: "10px",
                    }}
                  >
                    {savedAdditionalRoles.length >
                    0 ? (
                      savedAdditionalRoles.map(
                        (role) => (
                          <span
                            key={role.id}
                            style={{
                              padding:
                                "7px 9px",
                              border:
                                "1px solid rgba(156,229,0,0.16)",
                              color:
                                "rgba(255,255,255,0.68)",
                              fontSize:
                                "10px",
                            }}
                          >
                            {role.name}
                          </span>
                        )
                      )
                    ) : (
                      <span
                        style={{
                          color:
                            "rgba(255,255,255,0.34)",
                          fontSize: "11px",
                        }}
                      >
                        No additional roles
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: "22px",
                  paddingTop: "22px",
                  borderTop:
                    "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span
                  style={{
                    display: "block",
                    color:
                      "rgba(255,255,255,0.36)",
                    fontSize: "9px",
                    fontWeight: 800,
                    letterSpacing:
                      "0.10em",
                    textTransform:
                      "uppercase",
                  }}
                >
                  Football Bio
                </span>

                <p
                  style={{
                    margin: "10px 0 0",
                    color:
                      "rgba(255,255,255,0.70)",
                    fontSize: "13px",
                    lineHeight: 1.7,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {footballIdentity.footballBio ||
                    footballBio ||
                    "Your Football Bio."}
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>
    );
  }

  function renderCurrentStage() {
    switch (
      footballIdentity.currentStep
    ) {
      case "WELCOME":
        return renderWelcome();

      case "FOOTBALL_WORLD":
        return renderFootballWorld();

      case "NATIONAL_TEAM":
        return renderNationalTeam();

      case "PRIMARY_CLUB":
        return renderPrimaryClub();

      case "FOOTBALL_ROLE":
        return renderFootballRole();

      case "FOOTBALL_BIO":
        return renderFootballBio();

      case "REVEAL":
        return renderRevealReady();

      default:
        return (
          <section
            className={
              styles.readyStage
            }
          >
            <p
              className={
                styles.eyebrow
              }
            >
              Football Identity
            </p>

            <h1
              className={
                styles.readyTitle
              }
            >
              Journey in progress.
            </h1>

            <p
              className={
                styles.description
              }
            >
              Current step:{" "}
              {
                footballIdentity.currentStep
              }
            </p>
          </section>
        );
    }
  }

  return (
    <main className={styles.page}>
      <div
        className={
          styles.atmosphere
        }
      />

      <header
        className={
          styles.header
        }
      >
        <div>
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
            Football Identity
          </div>
        </div>

        <div
          className={
            styles.founderBlock
          }
        >
          <span
            className={
              styles.founderLabel
            }
          >
            Founding Member
          </span>

          <strong
            className={
              styles.founderNumber
            }
          >
            #
            {member.founderNumber ??
              "------"}
          </strong>
        </div>
      </header>

      <section
        className={
          styles.progressSection
        }
      >
        <div
          className={
            styles.progressMeta
          }
        >
          <span>
            {step.number} / 07
          </span>

          <span>
            {step.label}
          </span>
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
              width: `${progressWidth}%`,
            }}
          />
        </div>
      </section>

      <div
        className={
          styles.stage
        }
      >
        {renderCurrentStage()}

        {message && (
          <div
            className={
              styles.feedback
            }
          >
            {message}
          </div>
        )}
      </div>
    </main>
  );
}