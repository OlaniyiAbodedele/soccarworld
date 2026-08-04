import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#9CE500] text-black hover:bg-[#B2FF1A] focus-visible:outline-[#9CE500]",
  secondary:
    "border border-white/15 bg-white/[0.04] text-white hover:border-[#9CE500]/50 hover:bg-white/[0.08] focus-visible:outline-white",
  ghost:
    "bg-transparent text-white/70 hover:text-white focus-visible:outline-white",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 text-sm font-semibold tracking-[0.08em] transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-50 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}