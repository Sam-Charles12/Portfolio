"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/gsap";

export type FollowCursor = boolean | "x" | "y";

export const TooltipProvider = TooltipPrimitive.Provider;

const TooltipOpenContext = React.createContext(false);
const TooltipCursorContext = React.createContext({ x: 0, y: 0 });

export interface TooltipProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>,
    "open" | "defaultOpen" | "onOpenChange"
  > {
  followCursor?: FollowCursor;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayDuration?: number;
}

export function Tooltip({
  children,
  followCursor = false,
  delayDuration = 150,
  defaultOpen,
  open: controlledOpen,
  onOpenChange,
  ...rest
}: TooltipProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(
    defaultOpen ?? false
  );
  const open = controlledOpen ?? uncontrolledOpen;
  const [cursor, setCursor] = React.useState({ x: 0, y: 0 });

  const handleOpenChange = React.useCallback(
    (value: boolean) => {
      onOpenChange?.(value);
      if (controlledOpen === undefined) setUncontrolledOpen(value);
    },
    [controlledOpen, onOpenChange]
  );

  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root
        open={open}
        onOpenChange={handleOpenChange}
        {...rest}
      >
        <TooltipOpenContext.Provider value={open}>
          <TooltipCursorContext.Provider value={cursor}>
            {followCursor ? (
              <span
                className="inline-flex"
                onMouseMove={(event) =>
                  setCursor({ x: event.clientX, y: event.clientY })
                }
              >
                {children}
              </span>
            ) : (
              children
            )}
          </TooltipCursorContext.Provider>
        </TooltipOpenContext.Provider>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

export const TooltipTrigger = TooltipPrimitive.Trigger;

export interface TooltipContentProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
    "asChild" | "style"
  > {
  followCursor?: FollowCursor;
  style?: React.CSSProperties;
}

const BUBBLE_STYLE: React.CSSProperties = {
  background: "var(--ink)",
  color: "var(--bg)",
  fontFamily: "var(--font-mono)",
  fontSize: 12,
  letterSpacing: "0.08em",
  lineHeight: 1.4,
  padding: "6px 12px",
  borderRadius: "var(--radius-pill)",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
  maxWidth: 240,
  overflow: "hidden",
  transformOrigin: "var(--radix-tooltip-content-transform-origin)",
};

export function TooltipContent({
  side = "top",
  sideOffset = 8,
  align = "center",
  alignOffset = 0,
  followCursor = false,
  children,
  style,
  ...props
}: TooltipContentProps) {
  const open = React.useContext(TooltipOpenContext);
  const cursor = React.useContext(TooltipCursorContext);

  const slide = 6;
  const fromVars = {
    opacity: 0,
    scale: 0.85,
    filter: "blur(4px)",
    x: side === "left" ? slide : side === "right" ? -slide : 0,
    y: side === "top" ? slide : side === "bottom" ? -slide : 0,
  };
  const toVars = { opacity: 1, scale: 1, x: 0, y: 0, filter: "blur(0px)" };

  // Cursor-following bubble — fixed to the pointer, no Radix positioning.
  if (followCursor) {
    const offset = 14;
    return (
      <TooltipPrimitive.Portal forceMount>
        <AnimatedBubble
          open={open}
          fromVars={fromVars}
          toVars={toVars}
          style={{
            ...BUBBLE_STYLE,
            position: "fixed",
            left: cursor.x + offset,
            top: cursor.y + offset,
            zIndex: 60,
            pointerEvents: "none",
            ...style,
          }}
        >
          {children}
        </AnimatedBubble>
      </TooltipPrimitive.Portal>
    );
  }

  // Anchored bubble — Radix positions the invisible wrapper,
  // GSAP animates the pill inside (same hover animation).
  return (
    <TooltipPrimitive.Portal forceMount>
      <TooltipPrimitive.Content
        forceMount
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        style={{
          background: "transparent",
          border: "none",
          padding: 0,
          boxShadow: "none",
          zIndex: 60,
        }}
        {...props}
      >
        <AnimatedBubble
          open={open}
          fromVars={fromVars}
          toVars={toVars}
          style={{ ...BUBBLE_STYLE, ...style }}
        >
          {children}
        </AnimatedBubble>
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

/**
 * Mount-animated bubble (GSAP). Stays rendered through the close tween,
 * then unmounts — the animated exit.
 */
function AnimatedBubble({
  open,
  fromVars,
  toVars,
  style,
  children,
}: {
  open: boolean;
  fromVars: gsap.TweenVars;
  toVars: gsap.TweenVars;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [render, setRender] = React.useState(open);
  const varsRef = React.useRef({ fromVars, toVars });
  varsRef.current = { fromVars, toVars };

  React.useEffect(() => {
    const el = ref.current;
    const reduced = prefersReducedMotion();
    if (open) {
      setRender(true);
      return;
    }
    if (!el || !render) return;
    if (reduced) {
      setRender(false);
      return;
    }
    const tween = gsap.to(el, {
      opacity: 0,
      scale: 0.95,
      filter: "blur(2px)",
      duration: 0.12,
      ease: "power2.in",
      overwrite: true,
      onComplete: () => setRender(false),
    });
    return () => {
      tween.kill();
    };
  }, [open, render]);

  React.useEffect(() => {
    if (!render || !open || !ref.current) return;
    if (prefersReducedMotion()) return;
    const tween = gsap.fromTo(ref.current, varsRef.current.fromVars, {
      ...varsRef.current.toVars,
      duration: 0.35,
      ease: "back.out(1.6)",
      overwrite: true,
    });
    return () => {
      tween.kill();
    };
  }, [render, open]);

  if (!render) return null;
  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  );
}
