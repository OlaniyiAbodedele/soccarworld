import AdminShell from "../../AdminShell";
import { requireSoccaRAdmin } from "@/lib/admin/requireSoccaRAdmin";
import { getFoundingMembersData } from "../../getFoundingMembersData";

type MemberPageProps = {
  params: Promise<{
    memberId: string;
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

export default async function MemberPage({
  params,
}: MemberPageProps) {
  const admin = await requireSoccaRAdmin();

  const { memberId } = await params;

  const members = await getFoundingMembersData();

  const member = members.find(
    (item) => item.memberId === memberId
  );

  if (!member) {
    return (
      <AdminShell
        firstName={admin.firstName}
        lastName={admin.lastName}
        role={admin.role}
        activeSection="members"
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
            Member Administration
          </p>

          <h1
            style={{
              margin: "12px 0 0",
              color: "#ffffff",
              fontSize: "42px",
            }}
          >
            Member not found
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
      activeSection="members"
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
              Founding Member Record
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
              {member.firstName} {member.lastName}
            </h1>

            <p
              style={{
                margin: "16px 0 0",
                color: "#747474",
                fontSize: "14px",
              }}
            >
              Permanent Founder profile and account record.
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
              Founder Number
            </div>

            <strong
              style={{
                display: "block",
                marginTop: "8px",
                color: "#9CE500",
                fontSize: "28px",
              }}
            >
              #{member.founderNumber}
            </strong>
          </div>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "16px",
          }}
        >
          <InfoCard
            label="Email"
            value={member.email}
          />

          <InfoCard
            label="Account Status"
            value={member.accountStatus}
          />

          <InfoCard
            label="Member Type"
            value={member.memberType}
          />

          <InfoCard
            label="Country of Residence"
            value={member.countryOfResidence || "—"}
          />

          <InfoCard
            label="Country of Origin"
            value={member.countryOfOrigin || "—"}
          />

          <InfoCard
            label="City of Residence"
            value={member.cityOfResidence || "—"}
          />

          <InfoCard
            label="Membership Issued"
            value={formatDate(member.issuedAt)}
          />

          <InfoCard
            label="Account Activated"
            value={formatDate(member.activatedAt)}
          />
        </section>
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
        minHeight: "130px",
        padding: "20px",
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
          fontSize: "15px",
          fontWeight: 650,
          lineHeight: 1.5,
        }}
      >
        {value}
      </div>
    </article>
  );
}