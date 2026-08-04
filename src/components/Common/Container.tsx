import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export default function Container({
  children,
  className = "",
}: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full ${className}`}
      style={{
        maxWidth: "1440px",
        paddingLeft: "clamp(24px, 4vw, 72px)",
        paddingRight: "clamp(24px, 4vw, 72px)",
      }}
    >
      {children}
    </div>
  );
}