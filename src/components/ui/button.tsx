import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const VARIANTS: Record<NonNullable<ButtonProps["variant"]>, string> = {
  // Sidebar SidebarMenuButton language: hover/active share the same accent
  // bg + accent-foreground. accent -> var(--surface-raised-hover),
  // accent-foreground -> var(--text-100). Layered under existing styles.
  default:
    "bg-ink text-bg hover:opacity-85 active:opacity-85 data-active:opacity-85",
  outline:
    "border border-[var(--border-25)] bg-transparent text-ink hover:bg-[var(--surface-raised-hover)] hover:text-[var(--text-100)] active:bg-[var(--surface-raised-hover)] active:text-[var(--text-100)]",
  ghost:
    "bg-transparent text-ink hover:bg-[var(--surface-raised-hover)] hover:text-[var(--text-100)] active:bg-[var(--surface-raised-hover)] active:text-[var(--text-100)]",
  secondary:
    "bg-[var(--surface-raised)] text-ink hover:bg-[var(--surface-raised-hover)] hover:text-[var(--text-100)] active:bg-[var(--surface-raised-hover)] active:text-[var(--text-100)]",
  link: "bg-transparent text-ink underline-offset-4 hover:underline hover:text-[var(--text-100)]",
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
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    />
  );
}
