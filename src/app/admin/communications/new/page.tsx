"use client";

import {
  useState,
} from "react";

import { useRouter } from "next/navigation";

import CommunicationEditor from "../CommunicationEditor";

type CreateCommunicationResponse = {
  success: boolean;
  message?: string;
  communication?: {
    id: string;
    title: string;
    slug: string;
    status: string;
  };
};

const categories = [
  {
    value: "PLATFORM",
    label: "Platform",
  },
  {
    value: "FOUNDING_COMMUNITY",
    label: "Founding Community",
  },
  {
    value: "PRODUCT",
    label: "Product Update",
  },
  {
    value: "EARLY_ACCESS",
    label: "Early Access",
  },
  {
    value: "ANNOUNCEMENT",
    label: "Announcement",
  },
];

function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NewCommunicationPage() {
  const router = useRouter();

  const [title, setTitle] =
    useState("");

  const [slug, setSlug] =
    useState("");

  const [excerpt, setExcerpt] =
    useState("");

  const [body, setBody] =
    useState("");

  const [category, setCategory] =
    useState("ANNOUNCEMENT");

  const [
    isFeatured,
    setIsFeatured,
  ] = useState(false);

  const [saving, setSaving] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(
    null
  );

  const [
    successMessage,
    setSuccessMessage,
  ] = useState<string | null>(
    null
  );

  function handleTitleChange(
    value: string
  ) {
    setTitle(value);

    if (!slug) {
      setSlug(
        createSlug(value)
      );
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (saving) {
      return;
    }

    try {
      setSaving(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const response =
        await fetch(
          "/api/admin/communications",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              title,
              slug,
              excerpt,
              body,
              category,
              isFeatured,
            }),
          }
        );

      const result =
        (await response.json()) as CreateCommunicationResponse;

      if (
        !response.ok ||
        !result.success ||
        !result.communication
      ) {
        setErrorMessage(
          result.message ||
            "We could not save this communication draft."
        );

        return;
      }

      setSuccessMessage(
        "Communication saved as draft."
      );

      router.push(
        `/admin/communications/${result.communication.id}`
      );

      router.refresh();
    } catch (error) {
      console.error(
        "SoccaR communication draft creation error:",
        error
      );

      setErrorMessage(
        "Something unexpected happened while saving this draft."
      );
    } finally {
      setSaving(false);
    }
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
              fontSize:
                "clamp(34px, 5vw, 54px)",
              lineHeight: 1,
              letterSpacing:
                "-0.045em",
            }}
          >
            Create Draft
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
            Create a new Founder Update.
            Nothing will be published
            from this screen.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gap: "18px",
          }}
        >
          <Field label="Title">
            <input
              type="text"
              value={title}
              onChange={(event) =>
                handleTitleChange(
                  event.target.value
                )
              }
              placeholder="Enter article title"
              style={inputStyle}
              required
            />
          </Field>

          <Field
            label="Slug"
            hint="Used in the article URL."
          >
            <input
              type="text"
              value={slug}
              onChange={(event) =>
                setSlug(
                  createSlug(
                    event.target.value
                  )
                )
              }
              placeholder="article-url-slug"
              style={inputStyle}
              required
            />
          </Field>

          <Field label="Category">
            <select
              value={category}
              onChange={(event) =>
                setCategory(
                  event.target.value
                )
              }
              style={inputStyle}
            >
              {categories.map(
                (item) => (
                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                )
              )}
            </select>
          </Field>

          <Field
            label="Excerpt"
            hint="Short summary shown in the Founder Updates listing."
          >
            <textarea
              value={excerpt}
              onChange={(event) =>
                setExcerpt(
                  event.target.value
                )
              }
              placeholder="Write a concise article summary"
              style={{
                ...inputStyle,
                minHeight: "110px",
                paddingTop: "14px",
                resize: "vertical",
              }}
              required
            />
          </Field>

          <Field
            label="Article Body"
            hint="Use the formatting toolbar to structure the article."
          >
            <CommunicationEditor
              value={body}
              onChange={setBody}
            />
          </Field>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "16px",
              border: "1px solid #202020",
              borderRadius: "14px",
              background: "#090909",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(event) =>
                setIsFeatured(
                  event.target.checked
                )
              }
            />

            <span>
              <strong
                style={{
                  display: "block",
                  color: "#ffffff",
                  fontSize: "13px",
                }}
              >
                Featured communication
              </strong>

              <span
                style={{
                  display: "block",
                  marginTop: "4px",
                  color: "#666666",
                  fontSize: "11px",
                }}
              >
                Marks this draft as the
                featured Founder Update
                when it is eventually
                published.
              </span>
            </span>
          </label>

          {errorMessage && (
            <p
              style={{
                margin: 0,
                color: "#ff6259",
                fontSize: "12px",
              }}
            >
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p
              style={{
                margin: 0,
                color: "#9CE500",
                fontSize: "12px",
              }}
            >
              {successMessage}
            </p>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              paddingTop: "8px",
            }}
          >
            <button
              type="button"
              onClick={() =>
                router.push(
                  "/admin/communications"
                )
              }
              style={secondaryButtonStyle}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              style={{
                ...primaryButtonStyle,
                opacity:
                  saving
                    ? 0.55
                    : 1,
                cursor:
                  saving
                    ? "wait"
                    : "pointer",
              }}
            >
              {saving
                ? "Saving Draft…"
                : "Save Draft"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label
      style={{
        display: "grid",
        gap: "8px",
      }}
    >
      <span
        style={{
          color: "#ffffff",
          fontSize: "12px",
          fontWeight: 700,
        }}
      >
        {label}
      </span>

      {hint && (
        <span
          style={{
            color: "#616161",
            fontSize: "10px",
          }}
        >
          {hint}
        </span>
      )}

      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%",
  minHeight: "48px",
  padding: "0 14px",
  border: "1px solid #242424",
  borderRadius: "12px",
  outline: "none",
  background: "#0b0b0b",
  color: "#ffffff",
  fontSize: "13px",
};

const secondaryButtonStyle = {
  minHeight: "46px",
  padding: "0 18px",
  border: "1px solid #252525",
  borderRadius: "999px",
  background: "#0d0d0d",
  color: "#ffffff",
  fontSize: "12px",
  fontWeight: 700,
  cursor: "pointer",
};

const primaryButtonStyle = {
  minHeight: "46px",
  padding: "0 20px",
  border: 0,
  borderRadius: "999px",
  background: "#9CE500",
  color: "#050505",
  fontSize: "12px",
  fontWeight: 800,
};