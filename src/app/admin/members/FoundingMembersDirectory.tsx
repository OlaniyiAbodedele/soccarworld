"use client";

import {
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import type { AdminFoundingMember } from "../getFoundingMembersData";

type Props = {
  members: AdminFoundingMember[];
};

export default function FoundingMembersDirectory({
  members,
}: Props) {
const router = useRouter();
  const [search, setSearch] =
    useState("");

  const [
    accountStatus,
    setAccountStatus,
  ] = useState("ALL");

  const [
    country,
    setCountry,
  ] = useState("ALL");

  const [
    memberType,
    setMemberType,
  ] = useState("ALL");

  const countries = useMemo(
    () =>
      Array.from(
        new Set(
          members
            .map(
              (member) =>
                member.countryOfResidence
            )
            .filter(
              (
                value
              ): value is string =>
                Boolean(value)
            )
        )
      ).sort(),
    [members]
  );

  const memberTypes = useMemo(
    () =>
      Array.from(
        new Set(
          members
            .map(
              (member) =>
                member.memberType
            )
            .filter(Boolean)
        )
      ).sort(),
    [members]
  );

  const filteredMembers =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return members.filter(
        (member) => {
          const fullName =
            `${member.firstName} ${member.lastName}`.toLowerCase();

          const matchesSearch =
            !normalizedSearch ||
            fullName.includes(
              normalizedSearch
            ) ||
            member.email
              .toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            member.founderNumber.includes(
              normalizedSearch.replace(
                "#",
                ""
              )
            );

          const matchesStatus =
            accountStatus ===
              "ALL" ||
            member.accountStatus ===
              accountStatus;

          const matchesCountry =
            country === "ALL" ||
            member.countryOfResidence ===
              country;

          const matchesMemberType =
            memberType === "ALL" ||
            member.memberType ===
              memberType;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesCountry &&
            matchesMemberType
          );
        }
      );
    }, [
      members,
      search,
      accountStatus,
      country,
      memberType,
    ]);

  return (
    <>
      <section
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(260px, 1.8fr) repeat(3, minmax(160px, 1fr))",
          gap: "12px",
          marginBottom: "18px",
        }}
      >
        <input
          type="search"
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          placeholder="Search name, email or Founder Number"
          style={controlStyle}
        />

        <select
          value={accountStatus}
          onChange={(event) =>
            setAccountStatus(
              event.target.value
            )
          }
          style={controlStyle}
        >
          <option value="ALL">
            All account states
          </option>

          <option value="ACTIVE">
            Active
          </option>

          <option value="PENDING_ACTIVATION">
            Pending activation
          </option>

          <option value="SUSPENDED">
            Suspended
          </option>
        </select>

        <select
          value={country}
          onChange={(event) =>
            setCountry(
              event.target.value
            )
          }
          style={controlStyle}
        >
          <option value="ALL">
            All countries
          </option>

          {countries.map(
            (value) => (
              <option
                key={value}
                value={value}
              >
                {value}
              </option>
            )
          )}
        </select>

        <select
          value={memberType}
          onChange={(event) =>
            setMemberType(
              event.target.value
            )
          }
          style={controlStyle}
        >
          <option value="ALL">
            All member types
          </option>

          {memberTypes.map(
            (value) => (
              <option
                key={value}
                value={value}
              >
                {value}
              </option>
            )
          )}
        </select>
      </section>

      <section
        style={{
          border:
            "1px solid #202020",
          borderRadius: "18px",
          background: "#090909",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "22px 24px",
            borderBottom:
              "1px solid #1d1d1d",
            display: "flex",
            justifyContent:
              "space-between",
            gap: "20px",
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                color: "#666666",
                fontSize: "9px",
                fontWeight: 800,
                letterSpacing:
                  "0.17em",
                textTransform:
                  "uppercase",
              }}
            >
              Membership Directory
            </p>

            <h2
              style={{
                margin: "8px 0 0",
                color: "#ffffff",
                fontSize: "20px",
                letterSpacing:
                  "-0.02em",
              }}
            >
              Permanent Founder records
            </h2>
          </div>

          <span
            style={{
              color: "#666666",
              fontSize: "11px",
            }}
          >
            {
              filteredMembers.length
            }{" "}
            of {members.length}
          </span>
        </div>

        {filteredMembers.length ===
        0 ? (
          <div
            style={{
              padding: "44px 24px",
              color: "#666666",
              fontSize: "13px",
            }}
          >
            No Founding Members
            match these filters.
          </div>
        ) : (
          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                minWidth: "1060px",
                borderCollapse:
                  "collapse",
              }}
            >
              <thead>
                <tr>
                  {[
                    "Founder No.",
                    "Name",
                    "Email",
                    "Residence",
                    "Origin",
                    "Member Type",
                    "Account",
                    "Issued",
                    "View",
                  ].map(
                    (heading) => (
                      <th
                        key={heading}
                        style={{
                          padding:
                            "13px 18px",
                          borderBottom:
                            "1px solid #181818",
                          color:
                            "#5f5f5f",
                          fontSize:
                            "9px",
                          fontWeight:
                            800,
                          letterSpacing:
                            "0.12em",
                          textAlign:
                            "left",
                          textTransform:
                            "uppercase",
                        }}
                      >
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {filteredMembers.map(
                  (member) => (
                    <tr
                      key={
                        member.memberId
                      }
                    >
                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        <strong
                          style={{
                            color:
                              "#9CE500",
                            fontWeight:
                              800,
                          }}
                        >
                          #
                          {
                            member.founderNumber
                          }
                        </strong>
                      </td>

                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        <strong
                          style={{
                            color:
                              "#ffffff",
                            fontWeight:
                              650,
                          }}
                        >
                          {
                            member.firstName
                          }{" "}
                          {
                            member.lastName
                          }
                        </strong>
                      </td>

                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        {member.email}
                      </td>

                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        {member.countryOfResidence ||
                          "—"}
                      </td>

                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        {member.countryOfOrigin ||
                          "—"}
                      </td>

                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        {
                          member.memberType
                        }
                      </td>

                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        <span
                          style={{
                            display:
                              "inline-flex",
                            minHeight:
                              "25px",
                            alignItems:
                              "center",
                            padding:
                              "0 9px",
                            borderRadius:
                              "999px",
                            border:
                              "1px solid #242424",
                            background:
                              "#111111",
                            color:
                              member.accountStatus ===
                              "ACTIVE"
                                ? "#9CE500"
                                : "#c2c2c2",
                            fontSize:
                              "9px",
                            fontWeight:
                              800,
                            letterSpacing:
                              "0.08em",
                          }}
                        >
                          {
                            member.accountStatus
                          }
                        </span>
                      </td>

                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        {new Intl.DateTimeFormat(
                          "en",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        ).format(
                          new Date(
                            member.issuedAt
                          )
                        )}
                      </td>
                      <td
  style={{
    padding: "16px 18px",
    borderBottom:
      "1px solid #141414",
    whiteSpace: "nowrap",
  }}
>
  <button
    type="button"
    onClick={() =>
      router.push(
        `/admin/members/${member.memberId}`
      )
    }
    style={{
      border: "1px solid #252525",
      borderRadius: "999px",
      background: "#0d0d0d",
      color: "#ffffff",
      padding: "8px 14px",
      fontSize: "11px",
      fontWeight: 700,
      cursor: "pointer",
    }}
  >
    View
  </button>
</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

const controlStyle = {
  width: "100%",
  minHeight: "46px",
  padding: "0 14px",
  border: "1px solid #242424",
  borderRadius: "12px",
  outline: "none",
  background: "#0b0b0b",
  color: "#ffffff",
  fontSize: "12px",
};

const tableCellStyle = {
  padding: "16px 18px",
  borderBottom:
    "1px solid #141414",
  color: "#9e9e9e",
  fontSize: "12px",
  whiteSpace: "nowrap" as const,
};