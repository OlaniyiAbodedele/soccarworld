"use client";

import { useRouter } from "next/navigation";

type Props = {
  slug: string;
};

export default function PublishedCommunicationActions({
  slug,
}: Props) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() =>
        router.push(
          `/dashboard/updates/${slug}`
        )
      }
      style={{
        minHeight: "42px",
        padding: "0 18px",
        border: "1px solid #2a2a2a",
        borderRadius: "999px",
        background: "#0d0d0d",
        color: "#ffffff",
        fontSize: "11px",
        fontWeight: 800,
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      View Live Article
    </button>
  );
}