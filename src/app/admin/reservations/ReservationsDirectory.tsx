"use client";

import {
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import type { AdminReservation } from "./getReservationsData";

type Props = {
  reservations: AdminReservation[];
};

export default function ReservationsDirectory({
  reservations,
}: Props) {
    const router = useRouter();
  const [search, setSearch] =
    useState("");

  const [
    status,
    setStatus,
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
          reservations
            .map(
              (reservation) =>
                reservation.country
            )
            .filter(
              (
                value
              ): value is string =>
                Boolean(value)
            )
        )
      ).sort(),
    [reservations]
  );

  const memberTypes = useMemo(
    () =>
      Array.from(
        new Set(
          reservations
            .map(
              (reservation) =>
                reservation.memberType
            )
            .filter(
  (value): value is string =>
    Boolean(value)
)
        )
      ).sort(),
    [reservations]
  );

  const filteredReservations =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return reservations.filter(
        (reservation) => {
          const fullName =
            `${reservation.firstName} ${reservation.lastName}`.toLowerCase();

          const matchesSearch =
            !normalizedSearch ||
            fullName.includes(
              normalizedSearch
            ) ||
            reservation.email
              .toLowerCase()
              .includes(
                normalizedSearch
              );

          const matchesStatus =
            status === "ALL" ||
            reservation.status ===
              status;

          const matchesCountry =
            country === "ALL" ||
            reservation.country ===
              country;

          const matchesMemberType =
            memberType === "ALL" ||
            reservation.memberType ===
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
      reservations,
      search,
      status,
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
          placeholder="Search name or email"
          style={controlStyle}
        />

        <select
          value={status}
          onChange={(event) =>
            setStatus(
              event.target.value
            )
          }
          style={controlStyle}
        >
          <option value="ALL">
            All statuses
          </option>

          <option value="PENDING_VERIFICATION">
            Pending verification
          </option>

          <option value="VERIFIED">
            Verified
          </option>

          <option value="CONVERTED">
            Converted
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
            alignItems: "center",
            gap: "20px",
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
              Reservation Monitor
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
              Founder registration records
            </h2>
          </div>

          <span
            style={{
              color: "#666666",
              fontSize: "11px",
            }}
          >
            {
              filteredReservations.length
            }{" "}
            of {reservations.length}
          </span>
        </div>

        {filteredReservations.length ===
        0 ? (
          <div
            style={{
              padding: "44px 24px",
              color: "#666666",
              fontSize: "13px",
            }}
          >
            No reservations match
            these filters.
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
                minWidth: "980px",
                borderCollapse:
                  "collapse",
              }}
            >
              <thead>
                <tr>
                  {[
                    "Name",
                    "Email",
                    "Country",
                    "Member Type",
                    "Status",
                    "Created",
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
                {filteredReservations.map(
                  (reservation) => (
                    <tr
                      key={
                        reservation.id
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
                              "#ffffff",
                            fontWeight:
                              650,
                          }}
                        >
                          {
                            reservation.firstName
                          }{" "}
                          {
                            reservation.lastName
                          }
                        </strong>
                      </td>

                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        {
                          reservation.email
                        }
                      </td>

                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        {reservation.country ||
                          "—"}
                      </td>

                      <td
                        style={
                          tableCellStyle
                        }
                      >
                        {reservation.memberType ||
                          "—"}
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
                              reservation.status ===
                              "CONVERTED"
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
                            reservation.status
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
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        ).format(
                          new Date(
                            reservation.createdAt
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
        `/admin/reservations/${reservation.id}`
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