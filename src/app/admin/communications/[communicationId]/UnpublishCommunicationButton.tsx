"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  communicationId: string;
  communicationTitle: string;
};

type UnpublishResponse = {
  success: boolean;
  message?: string;
};

export default function UnpublishCommunicationButton({
  communicationId,
  communicationTitle,
}: Props) {
  const router = useRouter();

  const [unpublishing, setUnpublishing] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  async function handleUnpublish() {
    if (unpublishing) {
      return;
    }

    const confirmed = window.confirm(
      `Unpublish "${communicationTitle}"?\n\nIt will be removed from Founder Updates and returned to Draft status.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setUnpublishing(true);
      setErrorMessage(null);

      const response = await fetch(
        "/api/admin/communications/unpublish",
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
        (await response.json()) as UnpublishResponse;

      if (
        !response.ok ||
        !result.success
      ) {
        setErrorMessage(
          result.message ||
            "We could not unpublish this communication."
        );

        return;
      }

      router.refresh();
    } catch (error) {
      console.error(
        "SoccaR communication unpublish error:",
        error
      );

      setErrorMessage(
        "Something unexpected happened while unpublishing."
      );
    } finally {
      setUnpublishing(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleUnpublish}
        disabled={unpublishing}
        style={{
          minHeight: "42px",
          padding: "0 18px",
          border: "1px solid #2a2a2a",
          borderRadius: "999px",
          background: "#0d0d0d",
          color: "#ffffff",
          fontSize: "11px",
          fontWeight: 800,
          cursor: unpublishing
            ? "wait"
            : "pointer",
          opacity: unpublishing
            ? 0.55
            : 1,
          whiteSpace: "nowrap",
        }}
      >
        {unpublishing
          ? "Unpublishing…"
          : "Unpublish"}
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