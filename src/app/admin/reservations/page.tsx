import AdminShell from "../AdminShell";
import { requireSoccaRAdmin } from "@/lib/admin/requireSoccaRAdmin";
import { getReservationsData } from "./getReservationsData";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function ReservationsPage() {
  const admin = await requireSoccaRAdmin();
  const reservations = await getReservationsData();

  return (
    <AdminShell
      firstName={admin.firstName}
      lastName={admin.lastName}
      role={admin.role}
      activeSection="reservations"
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
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "24px",
            marginBottom: "34px",
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
              Registration Administration
            </p>

            <h1
              style={{
                margin: "12px 0 0",
                color: "#ffffff",
                fontSize: "clamp(34px, 4.5vw, 54px)",
                lineHeight: 1,
                letterSpacing: "-0.045em",
              }}
            >
              Reservations
            </h1>

            <p
              style={{
                margin: "16px 0 0",
                color: "#747474",
                fontSize: "14px",
                lineHeight: 1.7,
              }}
            >
              Monitor Founder reservations and their current
              verification status.
            </p>
          </div>

          <div
            style={{
              padding: "14px 16px",
              border: "1px solid #202020",
              borderRadius: "14px",
              background: "#0a0a0a",
            }}
          >
            <div
              style={{
                color: "#606060",
                fontSize: "9px",
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Total Reservations
            </div>

            <strong
              style={{
                display: "block",
                marginTop: "8px",
                color: "#9CE500",
                fontSize: "28px",
                lineHeight: 1,
              }}
            >
              {reservations.length}
            </strong>
          </div>
        </header>

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
              padding: "22px 24px",
              borderBottom: "1px solid #1d1d1d",
            }}
          >
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
              Reservation Monitor
            </p>

            <h2
              style={{
                margin: "8px 0 0",
                color: "#ffffff",
                fontSize: "20px",
                letterSpacing: "-0.02em",
              }}
            >
              Founder registration records
            </h2>
          </div>

          {reservations.length === 0 ? (
            <div
              style={{
                padding: "44px 24px",
                color: "#666666",
                fontSize: "13px",
              }}
            >
              No Founder reservations yet.
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
                          padding: "13px 18px",
                          borderBottom: "1px solid #181818",
                          color: "#5f5f5f",
                          fontSize: "9px",
                          fontWeight: 800,
                          letterSpacing: "0.12em",
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
                  {reservations.map((reservation) => (
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
                            minHeight: "25px",
                            alignItems: "center",
                            padding: "0 9px",
                            borderRadius: "999px",
                            border: "1px solid #242424",
                            background: "#111111",
                            color:
                              reservation.status === "CONVERTED"
                                ? "#9CE500"
                                : "#c2c2c2",
                            fontSize: "9px",
                            fontWeight: 800,
                            letterSpacing: "0.08em",
                          }}
                        >
                          {reservation.status}
                        </span>
                      </td>

                      <td style={tableCellStyle}>
                        {formatDate(reservation.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </AdminShell>
  );
}

const tableCellStyle = {
  padding: "16px 18px",
  borderBottom: "1px solid #141414",
  color: "#9e9e9e",
  fontSize: "12px",
  whiteSpace: "nowrap" as const,
};