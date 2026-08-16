"use client";

import {
  useRef,
} from "react";

type Props = {
  value: string;
  onChange: (
    value: string
  ) => void;
};

export default function CommunicationEditor({
  value,
  onChange,
}: Props) {
  const textareaRef =
    useRef<HTMLTextAreaElement | null>(
      null
    );

  function replaceSelection(
    before: string,
    after = "",
    placeholder = ""
  ) {
    const textarea =
      textareaRef.current;

    if (!textarea) {
      return;
    }

    const start =
      textarea.selectionStart;

    const end =
      textarea.selectionEnd;

    const selected =
      value.slice(
        start,
        end
      ) || placeholder;

    const nextValue =
      value.slice(0, start) +
      before +
      selected +
      after +
      value.slice(end);

    onChange(nextValue);

    requestAnimationFrame(() => {
      textarea.focus();

      const selectionStart =
        start +
        before.length;

      const selectionEnd =
        selectionStart +
        selected.length;

      textarea.setSelectionRange(
        selectionStart,
        selectionEnd
      );
    });
  }

  function prefixLines(
    prefix: string
  ) {
    const textarea =
      textareaRef.current;

    if (!textarea) {
      return;
    }

    const start =
      textarea.selectionStart;

    const end =
      textarea.selectionEnd;

    const selected =
      value.slice(
        start,
        end
      ) || "Text";

    const formatted =
      selected
        .split("\n")
        .map(
          (line) =>
            `${prefix}${line}`
        )
        .join("\n");

    const nextValue =
      value.slice(0, start) +
      formatted +
      value.slice(end);

    onChange(nextValue);
  }

  return (
    <div
      style={{
        border:
          "1px solid #242424",
        borderRadius: "14px",
        background: "#0b0b0b",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          padding: "10px",
          borderBottom:
            "1px solid #202020",
          background: "#090909",
        }}
      >
        <ToolbarButton
          label="H2"
          onClick={() =>
            prefixLines("## ")
          }
        />

        <ToolbarButton
          label="H3"
          onClick={() =>
            prefixLines("### ")
          }
        />

        <ToolbarButton
          label="B"
          title="Bold"
          onClick={() =>
            replaceSelection(
              "**",
              "**",
              "bold text"
            )
          }
        />

        <ToolbarButton
          label="I"
          title="Italic"
          onClick={() =>
            replaceSelection(
              "*",
              "*",
              "italic text"
            )
          }
        />

        <ToolbarButton
          label="• List"
          onClick={() =>
            prefixLines("- ")
          }
        />

        <ToolbarButton
          label="1. List"
          onClick={() =>
            prefixLines("1. ")
          }
        />

        <ToolbarButton
          label="Quote"
          onClick={() =>
            prefixLines("> ")
          }
        />

        <ToolbarButton
          label="Link"
          onClick={() =>
            replaceSelection(
              "[",
              "](https://)",
              "link text"
            )
          }
        />
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder="Write the full Founder Update..."
        style={{
          width: "100%",
          minHeight: "380px",
          display: "block",
          padding: "18px",
          border: 0,
          outline: "none",
          resize: "vertical",
          background:
            "transparent",
          color: "#ffffff",
          fontSize: "14px",
          lineHeight: 1.8,
          fontFamily:
            "inherit",
        }}
        required
      />

      <div
        style={{
          padding:
            "10px 14px",
          borderTop:
            "1px solid #202020",
          color: "#555555",
          fontSize: "10px",
          lineHeight: 1.5,
        }}
      >
        Supports headings,
        emphasis, lists,
        quotes and links.
      </div>
    </div>
  );
}

function ToolbarButton({
  label,
  title,
  onClick,
}: {
  label: string;
  title?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={
        title ?? label
      }
      onClick={onClick}
      style={{
        minHeight: "32px",
        padding: "0 10px",
        border:
          "1px solid #252525",
        borderRadius: "8px",
        background: "#101010",
        color: "#bcbcbc",
        fontSize: "11px",
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}