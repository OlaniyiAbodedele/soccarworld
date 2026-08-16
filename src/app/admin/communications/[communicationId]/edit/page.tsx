import EditCommunicationForm from "./EditCommunicationForm";
import { requireSoccaRAdmin } from "@/lib/admin/requireSoccaRAdmin";
import { getCommunicationsData } from "../../getCommunicationsData";

type EditCommunicationPageProps = {
  params: Promise<{
    communicationId: string;
  }>;
};

export default async function EditCommunicationPage({
  params,
}: EditCommunicationPageProps) {
  await requireSoccaRAdmin();

  const { communicationId } = await params;

  const communications =
    await getCommunicationsData();

  const communication =
    communications.find(
      (item) =>
        item.id === communicationId
    );

  if (!communication) {
    return null;
  }

  return (
  <main
    style={{
      minHeight: "100vh",
      background: "#050505",
      color: "#ffffff",
      padding: "46px 24px 64px",
    }}
  >
    <section
      style={{
        width: "100%",
        maxWidth: "920px",
        margin: "0 auto",
      }}
    >
      <header
        style={{
          marginBottom: "34px",
        }}
      >
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
            fontSize: "clamp(34px, 5vw, 54px)",
            lineHeight: 1,
            letterSpacing: "-0.045em",
          }}
        >
          Edit Draft
        </h1>

        <p
          style={{
            margin: "16px 0 0",
            maxWidth: "680px",
            color: "#747474",
            fontSize: "14px",
            lineHeight: 1.7,
          }}
        >
          Update this Founder communication while it remains
          unpublished.
        </p>
      </header>

      <EditCommunicationForm
        id={communication.id}
        initialTitle={communication.title}
        initialSlug={communication.slug}
        initialExcerpt={communication.excerpt}
        initialBody={communication.body}
        initialCategory={communication.category}
        initialIsFeatured={communication.isFeatured}
      />
    </section>
  </main>
);
}