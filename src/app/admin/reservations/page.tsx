import AdminShell from "../AdminShell";
import { requireSoccaRAdmin } from "@/lib/admin/requireSoccaRAdmin";
import { getReservationsData } from "./getReservationsData";
import ReservationsDirectory from "./ReservationsDirectory";

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

        <ReservationsDirectory reservations={reservations} />
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