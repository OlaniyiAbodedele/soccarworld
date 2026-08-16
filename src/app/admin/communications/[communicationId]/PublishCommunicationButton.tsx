"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  communicationId: string;
  communicationTitle: string;
};

type PublishResponse = {
  success: boolean;
  message?: string;
};

export default function PublishCommunicationButton({
  communicationId,
  communicationTitle,
}: Props) {
  const router = useRouter();

  const [publishing, setPublishing] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  async function handlePublish() {
    if (publishing) {
      return;
    }

    const confirmed = window.confirm(
      `Publish "${communicationTitle}" now?\n\nOnce published, it will become visible to Founding Members.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setPublishing(true);
      setErrorMessage(null);

      const response = await fetch(
        "/api/admin/communications/publish",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            id: communicationId,
          }),
        }
      );

      const result =
        (await response.json()) as PublishResponse;

      if (
        !response.ok ||
        !result.success
      ) {
        setErrorMessage(
          result.message ||
            "We could not publish this communication."
        );

        return;
      }

      router.refresh();
    } catch (error) {
      console.error(
        "SoccaR communication publishing error:",
        error
      );

      setErrorMessage(
        "Something unexpected happened while publishing."
      );
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handlePublish}
        disabled={publishing}
        style={{
          minHeight: "42px",
          padding: "0 18px",
          border: "1px solid #9CE500",
          borderRadius: "999px",
          background: "transparent",
          color: "#9CE500",
          fontSize: "11px",
          fontWeight: 800,
          cursor: publishing
            ? "wait"
            : "pointer",
          opacity: publishing
            ? 0.55
            : 1,
          whiteSpace: "nowrap",
        }}
      >
        {publishing
          ? "Publishing…"
          : "Publish Draft"}
      </button>

      {errorMessage && (
        <p
          style={{
            margin: "8px 0 0",
            maxWidth: "220px",
            color: "#ff6259",
            fontSize: "10px",
            lineHeight: 1.5,
          }}
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}