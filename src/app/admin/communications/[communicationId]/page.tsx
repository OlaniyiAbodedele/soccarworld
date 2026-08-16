import Link from "next/link";

import AdminShell from "../../AdminShell";
import PublishCommunicationButton from "./PublishCommunicationButton";
import PublishedCommunicationActions from "./PublishedCommunicationActions";
import UnpublishCommunicationButton from "./UnpublishCommunicationButton";

import { requireSoccaRAdmin } from "@/lib/admin/requireSoccaRAdmin";
import { getCommunicationsData } from "../getCommunicationsData";

type CommunicationPageProps = {
  params: Promise<{
    communicationId: string;
  }>;
};

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

export default async function CommunicationDetailPage({
  params,
}: CommunicationPageProps) {
  const admin = await requireSoccaRAdmin();

  const { communicationId } = await params;

  const communications =
    await getCommunicationsData();

  const communication =
    communications.find(
      (item) => item.id === communicationId
    );

  if (!communication) {
    return (
      <AdminShell
        firstName={admin.firstName}
        lastName={admin.lastName}
        role={admin.role}
        activeSection="communications"
      >
        <section
          style={{
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          <p
            style={{
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
              fontSize: "42px",
            }}
          >
            Communication not found
          </h1>
        </section>
      </AdminShell>
    );
  }

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
          maxWidth: "1100px",
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
              Founder Communication Record
            </p>

            <h1
              style={{
                margin: "12px 0 0",
                color: "#ffffff",
                fontSize:
                  "clamp(34px, 4.5vw, 54px)",
                lineHeight: 1,
                letterSpacing:
                  "-0.045em",
              }}
            >
              {communication.title}
            </h1>

            <p
              style={{
                margin: "16px 0 0",
                color: "#747474",
                fontSize: "14px",
                lineHeight: 1.7,
                maxWidth: "720px",
              }}
            >
              {communication.excerpt}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
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
                Publication Status
              </div>

              <strong
                style={{
                  display: "block",
                  marginTop: "8px",
                  color:
                    communication.status ===
                    "PUBLISHED"
                      ? "#9CE500"
                      : "#ffffff",
                  fontSize: "16px",
                }}
              >
                {communication.status}
              </strong>
            </div>

            {communication.status ===
              "DRAFT" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <Link
                  href={`/admin/communications/${communication.id}/edit`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "42px",
                    padding: "0 18px",
                    border:
                      "1px solid #9CE500",
                    borderRadius: "999px",
                    background: "#9CE500",
                    color: "#050505",
                    fontSize: "11px",
                    fontWeight: 800,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  Edit Draft
                </Link>

                <Link
                  href={`/admin/communications/${communication.id}/preview`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "42px",
                    padding: "0 18px",
                    border:
                      "1px solid #2a2a2a",
                    borderRadius: "999px",
                    background: "#0d0d0d",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: 800,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  Preview Draft
                </Link>

                <PublishCommunicationButton
                  communicationId={communication.id}
                  communicationTitle={communication.title}
                />
              </div>
            )}

            {communication.status ===
              "PUBLISHED" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <PublishedCommunicationActions
                  slug={communication.slug}
                />

                <UnpublishCommunicationButton
                  communicationId={communication.id}
                  communicationTitle={communication.title}
                />
              </div>
            )}
          </div>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          <InfoCard
            label="Category"
            value={communication.category}
          />

          <InfoCard
            label="Slug"
            value={`/${communication.slug}`}
          />

          <InfoCard
            label="Featured"
            value={
              communication.isFeatured
                ? "Yes"
                : "No"
            }
          />

          <InfoCard
            label="Published"
            value={formatDate(
              communication.publishedAt
            )}
          />

          <InfoCard
            label="Created"
            value={formatDate(
              communication.createdAt
            )}
          />

          <InfoCard
            label="Updated"
            value={formatDate(
              communication.updatedAt
            )}
          />
        </section>

        <article
          style={{
            padding: "28px",
            border: "1px solid #202020",
            borderRadius: "18px",
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
            Article Body
          </div>

          <div
            style={{
              marginTop: "18px",
              color: "#d0d0d0",
              fontSize: "15px",
              lineHeight: 1.8,
              whiteSpace: "pre-wrap",
            }}
          >
            {communication.body}
          </div>
        </article>
      </section>
    </AdminShell>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
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

      <div
        style={{
          marginTop: "14px",
          color: "#ffffff",
          fontSize: "14px",
          fontWeight: 650,
          lineHeight: 1.5,
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </article>
  );
}