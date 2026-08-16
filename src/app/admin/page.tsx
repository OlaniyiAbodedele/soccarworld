import AdminShell from "./AdminShell";
import { getAdminOverviewData } from "./getAdminOverviewData";
import { requireSoccaRAdmin } from "@/lib/admin/requireSoccaRAdmin";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function AdminPage() {
  const admin = await requireSoccaRAdmin();
  const overview = await getAdminOverviewData();

  return (
    <AdminShell
      firstName={admin.firstName}
      lastName={admin.lastName}
      role={admin.role}
      activeSection="overview"
    >
      <section
        style={{
          width: "100%",
          maxWidth: "1320px",
          margin: "0 auto",
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "28px",
            marginBottom: "40px",
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                color: "#9CE500",
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              SoccaR Administration
            </p>

            <h1
              style={{
                margin: "12px 0 0",
                color: "#ffffff",
                fontSize: "clamp(34px, 4.5vw, 56px)",
                lineHeight: 1,
                letterSpacing: "-0.045em",
                fontWeight: 700,
              }}
            >
              Command Overview
            </h1>

            <p
              style={{
                margin: "16px 0 0",
                maxWidth: "650px",
                color: "#777777",
                fontSize: "14px",
                lineHeight: 1.7,
              }}
            >
              Live operational visibility across the
              SoccaR Founding Community.
            </p>
          </div>

          <div
            style={{
              minWidth: "220px",
              padding: "15px 17px",
              border: "1px solid #202020",
              borderRadius: "14px",
              background: "#0a0a0a",
            }}
          >
            <div
              style={{
                color: "#626262",
                fontSize: "9px",
                fontWeight: 800,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Console Status
            </div>

            <div
              style={{
                marginTop: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  display: "inline-block",
                  borderRadius: "999px",
                  background: "#9CE500",
                  boxShadow:
                    "0 0 12px rgba(156,229,0,0.55)",
                }}
              />

              Production Operational
            </div>
          </div>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "14px",
            marginBottom: "34px",
          }}
        >
          <article style={cardStyle}>
            <span style={labelStyle}>
              Founding Members
            </span>

            <strong style={valueStyle}>
              {overview.totalFounders}
            </strong>

            <span style={helperStyle}>
              Active Founder memberships
            </span>
          </article>

          <article style={cardStyle}>
            <span style={labelStyle}>
              Active Accounts
            </span>

            <strong style={valueStyle}>
              {overview.activeMembers}
            </strong>

            <span style={helperStyle}>
              Members with active SoccaR access
            </span>
          </article>

          <article style={cardStyle}>
            <span style={labelStyle}>
              Pending Verification
            </span>

            <strong style={valueStyle}>
              {overview.pendingVerification}
            </strong>

            <span style={helperStyle}>
              Reservations awaiting verification
            </span>
          </article>

          <article style={cardStyle}>
            <span style={labelStyle}>
              Pending Activation
            </span>

            <strong style={valueStyle}>
              {overview.pendingAccountActivation}
            </strong>

            <span style={helperStyle}>
              Members yet to activate account access
            </span>
          </article>

          <article style={cardStyle}>
            <span style={labelStyle}>
              Latest Founder Number
            </span>

            <strong
              style={{
                ...valueStyle,
                color: "#9CE500",
              }}
            >
              #{overview.currentFounderNumber}
            </strong>

            <span style={helperStyle}>
              Permanent sequence position
            </span>
          </article>
        </section>

        <section
          style={{
            border: "1px solid #202020",
            borderRadius: "18px",
            background: "#090909",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "20px",
              padding: "22px 24px",
              borderBottom: "1px solid #1d1d1d",
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  color: "#666666",
                  fontSize: "9px",
                  fontWeight: 800,
                  letterSpacing: "0.17em",
                  textTransform: "uppercase",
                }}
              >
                Registration Monitor
              </p>

              <h2
                style={{
                  margin: "8px 0 0",
                  color: "#ffffff",
                  fontSize: "20px",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                Recent Founder reservations
              </h2>
            </div>

            <span
              style={{
                color: "#575757",
                fontSize: "11px",
              }}
            >
              Latest 8
            </span>
          </div>

          {overview.recentReservations.length === 0 ? (
            <div
              style={{
                padding: "42px 24px",
                color: "#666666",
                fontSize: "13px",
              }}
            >
              No reservations yet.
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
                  minWidth: "860px",
                  borderCollapse: "collapse",
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
                    ].map((heading) => (
                      <th
                        key={heading}
                        style={{
                          padding: "13px 20px",
                          borderBottom:
                            "1px solid #181818",
                          color: "#5f5f5f",
                          fontSize: "9px",
                          fontWeight: 800,
                          letterSpacing: "0.13em",
                          textAlign: "left",
                          textTransform: "uppercase",
                        }}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {overview.recentReservations.map(
                    (reservation) => (
                      <tr key={reservation.id}>
                        <td style={tableCellStyle}>
                          <strong
                            style={{
                              color: "#ffffff",
                              fontWeight: 650,
                            }}
                          >
                            {reservation.firstName}{" "}
                            {reservation.lastName}
                          </strong>
                        </td>

                        <td style={tableCellStyle}>
                          {reservation.email}
                        </td>

                        <td style={tableCellStyle}>
                          {reservation.country || "—"}
                        </td>

                        <td style={tableCellStyle}>
                          {reservation.memberType || "—"}
                        </td>

                        <td style={tableCellStyle}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              minHeight: "25px",
                              padding: "0 9px",
                              border:
                                "1px solid #242424",
                              borderRadius: "999px",
                              background: "#111111",
                              color:
                                reservation.status ===
                                "CONVERTED"
                                  ? "#9CE500"
                                  : "#c2c2c2",
                              fontSize: "9px",
                              fontWeight: 800,
                              letterSpacing: "0.07em",
                            }}
                          >
                            {reservation.status}
                          </span>
                        </td>

                        <td style={tableCellStyle}>
                          {formatDate(
                            reservation.createdAt
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer
          style={{
            marginTop: "26px",
            color: "#474747",
            fontSize: "10px",
            lineHeight: 1.7,
          }}
        >
          SoccaR Admin Console v1.0 · Operational
          visibility only · Founder Numbers remain
          system-issued and protected.
        </footer>
      </section>
    </AdminShell>
  );
}

const cardStyle = {
  minHeight: "156px",
  display: "flex",
  flexDirection: "column" as const,
  padding: "20px",
  border: "1px solid #1f1f1f",
  borderRadius: "16px",
  background: "#090909",
};

const labelStyle = {
  color: "#696969",
  fontSize: "9px",
  fontWeight: 800,
  letterSpacing: "0.14em",
  textTransform: "uppercase" as const,
};

const valueStyle = {
  marginTop: "18px",
  color: "#ffffff",
  fontSize: "36px",
  lineHeight: 1,
  letterSpacing: "-0.04em",
};

const helperStyle = {
  marginTop: "auto",
  paddingTop: "16px",
  color: "#5d5d5d",
  fontSize: "11px",
  lineHeight: 1.45,
};

const tableCellStyle = {
  padding: "16px 20px",
  borderBottom: "1px solid #141414",
  color: "#9e9e9e",
  fontSize: "12px",
  whiteSpace: "nowrap" as const,
};