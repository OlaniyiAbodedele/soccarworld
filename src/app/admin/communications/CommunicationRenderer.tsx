import React from "react";

type Props = {
  content: string;
};

type Block =
  | {
      type: "h2";
      text: string;
    }
  | {
      type: "h3";
      text: string;
    }
  | {
      type: "quote";
      text: string;
    }
  | {
      type: "ul";
      items: string[];
    }
  | {
      type: "ol";
      items: string[];
    }
  | {
      type: "paragraph";
      text: string;
    };

function parseBlocks(
  content: string
): Block[] {
  const lines = content
    .replace(/\r\n/g, "\n")
    .split("\n");

  const blocks: Block[] = [];

  let paragraphLines: string[] = [];
  let unorderedItems: string[] = [];
  let orderedItems: string[] = [];

  function flushParagraph() {
    if (
      paragraphLines.length === 0
    ) {
      return;
    }

    blocks.push({
      type: "paragraph",
      text: paragraphLines.join(
        "\n"
      ),
    });

    paragraphLines = [];
  }

  function flushUnorderedList() {
    if (
      unorderedItems.length === 0
    ) {
      return;
    }

    blocks.push({
      type: "ul",
      items: unorderedItems,
    });

    unorderedItems = [];
  }

  function flushOrderedList() {
    if (
      orderedItems.length === 0
    ) {
      return;
    }

    blocks.push({
      type: "ol",
      items: orderedItems,
    });

    orderedItems = [];
  }

  function flushAll() {
    flushParagraph();
    flushUnorderedList();
    flushOrderedList();
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushAll();
      continue;
    }

    if (
      trimmed.startsWith(
        "### "
      )
    ) {
      flushAll();

      blocks.push({
        type: "h3",
        text: trimmed.slice(4),
      });

      continue;
    }

    if (
      trimmed.startsWith(
        "## "
      )
    ) {
      flushAll();

      blocks.push({
        type: "h2",
        text: trimmed.slice(3),
      });

      continue;
    }

    if (
      trimmed.startsWith(
        "> "
      )
    ) {
      flushAll();

      blocks.push({
        type: "quote",
        text: trimmed.slice(2),
      });

      continue;
    }

    if (
      trimmed.startsWith(
        "- "
      )
    ) {
      flushParagraph();
      flushOrderedList();

      unorderedItems.push(
        trimmed.slice(2)
      );

      continue;
    }

    if (
      /^\d+\.\s/.test(
        trimmed
      )
    ) {
      flushParagraph();
      flushUnorderedList();

      orderedItems.push(
        trimmed.replace(
          /^\d+\.\s/,
          ""
        )
      );

      continue;
    }

    flushUnorderedList();
    flushOrderedList();

    paragraphLines.push(
      trimmed
    );
  }

  flushAll();

  return blocks;
}

function renderInline(
  text: string
) {
  const tokenPattern =
    /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;

  const parts = text.split(
    tokenPattern
  );

  return parts.map(
    (part, index) => {
      if (
        part.startsWith(
          "**"
        ) &&
        part.endsWith("**")
      ) {
        return (
          <strong key={index}>
            {part.slice(2, -2)}
          </strong>
        );
      }

      if (
        part.startsWith("*") &&
        part.endsWith("*")
      ) {
        return (
          <em key={index}>
            {part.slice(1, -1)}
          </em>
        );
      }

      const linkMatch =
        part.match(
          /^\[([^\]]+)\]\(([^)]+)\)$/
        );

      if (linkMatch) {
        const [, label, href] =
          linkMatch;

        return (
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#9CE500",
              textDecoration:
                "underline",
              textUnderlineOffset:
                "3px",
            }}
          >
            {label}
          </a>
        );
      }

      return (
        <React.Fragment
          key={index}
        >
          {part}
        </React.Fragment>
      );
    }
  );
}

export default function CommunicationRenderer({
  content,
}: Props) {
  const blocks =
    parseBlocks(content);

  return (
    <div
      style={{
        display: "grid",
        gap: "22px",
      }}
    >
      {blocks.map(
        (block, index) => {
          switch (
            block.type
          ) {
            case "h2":
              return (
                <h2
                  key={index}
                  style={{
                    margin: 0,
                    color: "#ffffff",
                    fontSize:
                      "clamp(26px, 3vw, 34px)",
                    lineHeight: 1.15,
                    letterSpacing:
                      "-0.03em",
                  }}
                >
                  {renderInline(
                    block.text
                  )}
                </h2>
              );

            case "h3":
              return (
                <h3
                  key={index}
                  style={{
                    margin: 0,
                    color: "#ffffff",
                    fontSize:
                      "clamp(20px, 2.4vw, 26px)",
                    lineHeight: 1.25,
                    letterSpacing:
                      "-0.02em",
                  }}
                >
                  {renderInline(
                    block.text
                  )}
                </h3>
              );

            case "quote":
              return (
                <blockquote
                  key={index}
                  style={{
                    margin: 0,
                    padding:
                      "18px 20px",
                    borderLeft:
                      "3px solid #9CE500",
                    background:
                      "#0d0d0d",
                    color:
                      "#c8c8c8",
                    fontSize:
                      "15px",
                    lineHeight: 1.8,
                  }}
                >
                  {renderInline(
                    block.text
                  )}
                </blockquote>
              );

            case "ul":
              return (
                <ul
                  key={index}
                  style={{
                    margin: 0,
                    paddingLeft:
                      "24px",
                    color:
                      "#d0d0d0",
                    fontSize:
                      "15px",
                    lineHeight: 1.8,
                  }}
                >
                  {block.items.map(
                    (
                      item,
                      itemIndex
                    ) => (
                      <li
                        key={
                          itemIndex
                        }
                      >
                        {renderInline(
                          item
                        )}
                      </li>
                    )
                  )}
                </ul>
              );

            case "ol":
              return (
                <ol
                  key={index}
                  style={{
                    margin: 0,
                    paddingLeft:
                      "24px",
                    color:
                      "#d0d0d0",
                    fontSize:
                      "15px",
                    lineHeight: 1.8,
                  }}
                >
                  {block.items.map(
                    (
                      item,
                      itemIndex
                    ) => (
                      <li
                        key={
                          itemIndex
                        }
                      >
                        {renderInline(
                          item
                        )}
                      </li>
                    )
                  )}
                </ol>
              );

            case "paragraph":
            default:
              return (
                <p
                  key={index}
                  style={{
                    margin: 0,
                    color:
                      "#d0d0d0",
                    fontSize:
                      "15px",
                    lineHeight: 1.9,
                    whiteSpace:
                      "pre-line",
                  }}
                >
                  {renderInline(
                    block.text
                  )}
                </p>
              );
          }
        }
      )}
    </div>
  );
}