import Link from "next/link";

import AdminShell from "../../../AdminShell";
import CommunicationRenderer from "../../CommunicationRenderer";
import { requireSoccaRAdmin } from "@/lib/admin/requireSoccaRAdmin";
import { getCommunicationsData } from "../../getCommunicationsData";

type PreviewCommunicationPageProps = {
  params: Promise<{
    communicationId: string;
  }>;
};

function formatDate(value: string | null) {
  if (!value) {
    return "Draft Preview";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function getCategoryLabel(category: string) {
  switch (category) {
    case "PLATFORM":
      return "Platform";

    case "FOUNDING_COMMUNITY":
      return "Founding Community";

    case "PRODUCT":
      return "Product Update";

    case "EARLY_ACCESS":
      return "Early Access";

    case "ANNOUNCEMENT":
      return "Announcement";

    default:
      return category;
  }
}

export default async function PreviewCommunicationPage({
  params,
}: PreviewCommunicationPageProps) {
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
            Preview unavailable
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
          maxWidth: "980px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
            marginBottom: "28px",
            padding: "14px 16px",
            border: "1px solid rgba(156,229,0,0.18)",
            borderRadius: "14px",
            background: "rgba(156,229,0,0.04)",
          }}
        >
          <div>
            <div
              style={{
                color: "#9CE500",
                fontSize: "9px",
                fontWeight: 800,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              Admin Preview
            </div>

            <div
              style={{
                marginTop: "5px",
                color: "#777777",
                fontSize: "11px",
              }}
            >
              This article is not being published from this screen.
            </div>
          </div>

          <Link
            href={`/admin/communications/${communication.id}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "38px",
              padding: "0 15px",
              border: "1px solid #2a2a2a",
              borderRadius: "999px",
              background: "#0c0c0c",
              color: "#ffffff",
              fontSize: "10px",
              fontWeight: 700,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Back to Record
          </Link>
        </div>

        <article
          style={{
            padding: "clamp(28px, 5vw, 58px)",
            border: "1px solid #202020",
            borderRadius: "20px",
            background: "#090909",
          }}
        >
          <header
            style={{
              maxWidth: "780px",
              marginBottom: "34px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "10px",
                marginBottom: "18px",
              }}
            >
              <span
                style={{
                  color: "#9CE500",
                  fontSize: "10px",
                  fontWeight: 800,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                {getCategoryLabel(
                  communication.category
                )}
              </span>

              <span
                style={{
                  color: "#444444",
                }}
              >
                •
              </span>

              <span
                style={{
                  color: "#666666",
                  fontSize: "11px",
                }}
              >
                {formatDate(
                  communication.publishedAt
                )}
              </span>
            </div>

            <h1
              style={{
                margin: 0,
                color: "#ffffff",
                fontSize:
                  "clamp(38px, 6vw, 68px)",
                lineHeight: 1.02,
                letterSpacing: "-0.05em",
                fontWeight: 700,
              }}
            >
              {communication.title}
            </h1>

            <p
              style={{
                margin: "22px 0 0",
                color: "#8a8a8a",
                fontSize: "17px",
                lineHeight: 1.7,
              }}
            >
              {communication.excerpt}
            </p>
          </header>

          <div
            style={{
              width: "100%",
              height: "1px",
              marginBottom: "34px",
              background: "#1e1e1e",
            }}
          />

          <div
            style={{
              maxWidth: "760px",
            }}
          >
            <CommunicationRenderer
              content={communication.body}
            />
          </div>
        </article>
      </section>
    </AdminShell>
  );
}