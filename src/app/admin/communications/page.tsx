import Link from "next/link";
import AdminShell from "../AdminShell";
import { requireSoccaRAdmin } from "@/lib/admin/requireSoccaRAdmin";
import { getCommunicationsData } from "./getCommunicationsData";

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function CommunicationsPage() {
  const admin = await requireSoccaRAdmin();
  const communications = await getCommunicationsData();

  const publishedCount = communications.filter(
    (item) => item.status === "PUBLISHED"
  ).length;

  const draftCount = communications.filter(
    (item) => item.status === "DRAFT"
  ).length;

  const featuredCount = communications.filter(
    (item) => item.isFeatured
  ).length;

  return (
    <AdminShell
      firstName={admin.firstName}
      lastName={admin.lastName}
      role={admin.role}
      activeSection="communications"
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
              Founder Communications
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
              Communications
            </h1>

            <p
              style={{
                margin: "16px 0 0",
                color: "#747474",
                fontSize: "14px",
                lineHeight: 1.7,
                maxWidth: "680px",
              }}
            >
              Review Founder Updates, publication status,
              categories and featured communications.
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
              Total Updates
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
              {communications.length}
            </strong>
          </div>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "14px",
            marginBottom: "24px",
          }}
        >
          <StatCard
            label="Published"
            value={publishedCount}
          />

          <StatCard
            label="Drafts"
            value={draftCount}
          />

          <StatCard
            label="Featured"
            value={featuredCount}
          />

          <StatCard
            label="Categories"
            value={
              new Set(
                communications.map(
                  (item) => item.category
                )
              ).size
            }
          />
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
              Founder Updates Library
            </p>

            <h2
              style={{
                margin: "8px 0 0",
                color: "#ffffff",
                fontSize: "20px",
                letterSpacing: "-0.02em",
              }}
            >
              Communications records
            </h2>
          </div>

          {communications.length === 0 ? (
            <div
              style={{
                padding: "44px 24px",
                color: "#666666",
                fontSize: "13px",
              }}
            >
              No Founder communications yet.
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
                  minWidth: "1040px",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr>
                    {[
                      "Title",
                      "Category",
                      "Status",
                      "Featured",
                      "Published",
                      "Updated",
                      "View",
                    ].map((heading) => (
                      <th
                        key={heading}
                        style={{
                          padding: "13px 18px",
                          borderBottom:
                            "1px solid #181818",
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
                  {communications.map(
                    (communication) => (
                      <tr key={communication.id}>
                        <td style={tableCellStyle}>
                          <strong
                            style={{
                              color: "#ffffff",
                              fontWeight: 650,
                            }}
                          >
                            {communication.title}
                          </strong>

                          <div
                            style={{
                              marginTop: "5px",
                              color: "#606060",
                              fontSize: "10px",
                            }}
                          >
                            /{communication.slug}
                          </div>
                        </td>

                        <td style={tableCellStyle}>
                          {communication.category}
                        </td>

                        <td style={tableCellStyle}>
                          <span
                            style={{
                              display: "inline-flex",
                              minHeight: "25px",
                              alignItems: "center",
                              padding: "0 9px",
                              borderRadius: "999px",
                              border:
                                "1px solid #242424",
                              background: "#111111",
                              color:
                                communication.status ===
                                "PUBLISHED"
                                  ? "#9CE500"
                                  : "#c2c2c2",
                              fontSize: "9px",
                              fontWeight: 800,
                              letterSpacing: "0.08em",
                            }}
                          >
                            {communication.status}
                          </span>
                        </td>

                        <td style={tableCellStyle}>
                          {communication.isFeatured
                            ? "Yes"
                            : "No"}
                        </td>

                        <td style={tableCellStyle}>
                          {formatDate(
                            communication.publishedAt
                          )}
                        </td>

                        <td style={tableCellStyle}>
                          {formatDate(
                            communication.updatedAt
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
  <Link
    href={`/admin/communications/${communication.id}`}
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      border: "1px solid #252525",
      borderRadius: "999px",
      background: "#0d0d0d",
      color: "#ffffff",
      padding: "8px 14px",
      fontSize: "11px",
      fontWeight: 700,
      textDecoration: "none",
    }}
  >
    View
  </Link>
</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </AdminShell>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <article
      style={{
        minHeight: "120px",
        padding: "18px",
        border: "1px solid #202020",
        borderRadius: "16px",
        background: "#090909",
      }}
    >
      <div
        style={{
          color: "#666666",
          fontSize: "9px",
          fontWeight: 800,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>

      <strong
        style={{
          display: "block",
          marginTop: "16px",
          color: "#ffffff",
          fontSize: "32px",
          lineHeight: 1,
        }}
      >
        {value}
      </strong>
    </article>
  );
}

const tableCellStyle = {
  padding: "16px 18px",
  borderBottom: "1px solid #141414",
  color: "#9e9e9e",
  fontSize: "12px",
  whiteSpace: "nowrap" as const,
};