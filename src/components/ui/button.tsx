import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const VARIANTS: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default: "bg-ink text-bg hover:opacity-85",
  outline:
    "border border-[var(--border-25)] bg-transparent text-ink hover:bg-[rgba(128,128,128,0.12)]",
  ghost: "bg-transparent text-ink hover:bg-[rgba(128,128,128,0.12)]",
  secondary: "bg-[var(--surface-raised)] text-ink hover:opacity-90",
  link: "bg-transparent text-ink underline-offset-4 hover:underline",
};

const SIZES: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "h-10 px-5 text-sm",
  sm: "h-8 px-3 text-xs",
  lg: "h-12 px-7 text-base",
  icon: "h-10 w-10",
};

export function Button({
  variant = "default",
  size = "default",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] disabled:pointer-events-none disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    />
  );
}
