"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "motion/react";

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
  const reduceMotion = useReducedMotion();

  const slide = 6;
  const initial = reduceMotion
    ? { opacity: 0 }
    : {
        opacity: 0,
        scale: 0.85,
        filter: "blur(4px)",
        x: side === "left" ? slide : side === "right" ? -slide : 0,
        y: side === "top" ? slide : side === "bottom" ? -slide : 0,
      };
  const animate = reduceMotion
    ? { opacity: 1 }
    : { opacity: 1, scale: 1, x: 0, y: 0, filter: "blur(0px)" };
  const enterTransition: Transition = reduceMotion
    ? { duration: 0.12 }
    : { type: "spring", stiffness: 550, damping: 32, mass: 0.6 };
  const exitTransition: Transition = { duration: 0.12, ease: "easeIn" };

  const exit = reduceMotion
    ? { opacity: 0 }
    : {
        opacity: 0,
        scale: 0.95,
        filter: "blur(2px)",
        transition: exitTransition,
      };

  // Cursor-following bubble — fixed to the pointer, no Radix positioning.
  if (followCursor) {
    const offset = 14;
    return (
      <TooltipPrimitive.Portal forceMount>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={initial}
              animate={animate}
              exit={exit}
              transition={enterTransition}
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
            </motion.div>
          )}
        </AnimatePresence>
      </TooltipPrimitive.Portal>
    );
  }

  // Anchored bubble — Radix positions the invisible wrapper,
  // motion animates the pill inside (same hover animation).
  return (
    <TooltipPrimitive.Portal forceMount>
      <AnimatePresence>
        {open && (
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
            <motion.div
              initial={initial}
              animate={animate}
              exit={exit}
              transition={enterTransition}
              style={{ ...BUBBLE_STYLE, ...style }}
            >
              {children}
            </motion.div>
          </TooltipPrimitive.Content>
        )}
      </AnimatePresence>
    </TooltipPrimitive.Portal>
  );
}
