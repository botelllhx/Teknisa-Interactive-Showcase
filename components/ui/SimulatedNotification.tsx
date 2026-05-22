"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/cn";

export type NotificationType = "success" | "warning" | "info";

interface SimulatedNotificationProps {
  id?: string | number;
  type?: NotificationType;
  title: string;
  description?: string;
  duration?: number;
  visible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const ICON: Record<NotificationType, typeof CheckCircle2> = {
  success: CheckCircle2,
  warning: AlertCircle,
  info: Info,
};

const TONE: Record<
  NotificationType,
  {
    icon: string;
    bg: string;
    ring: string;
    accent: string;
    progress: string;
  }
> = {
  success: {
    icon: "text-success",
    bg: "bg-success/10",
    ring: "ring-success/20",
    accent: "bg-success",
    progress: "bg-success",
  },
  warning: {
    icon: "text-warning",
    bg: "bg-warning/10",
    ring: "ring-warning/20",
    accent: "bg-warning",
    progress: "bg-warning",
  },
  info: {
    icon: "text-brand",
    bg: "bg-brand-subtle",
    ring: "ring-brand/20",
    accent: "bg-brand",
    progress: "bg-brand",
  },
};

export function SimulatedNotification({
  id,
  type = "success",
  title,
  description,
  duration = 3000,
  visible = true,
  onDismiss,
  className,
}: SimulatedNotificationProps) {
  const [internalVisible, setInternalVisible] = useState(visible);

  useEffect(() => {
    setInternalVisible(visible);
  }, [visible, id]);

  useEffect(() => {
    if (!internalVisible) return;
    const timer = setTimeout(() => {
      setInternalVisible(false);
      onDismiss?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [internalVisible, duration, onDismiss, id]);

  const Icon = ICON[type];
  const tone = TONE[type];

  return (
    <AnimatePresence mode="wait">
      {internalVisible && (
        <motion.div
          key={id ?? title}
          initial={{ opacity: 0, x: 32, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 32, scale: 0.98 }}
          transition={{
            type: "spring",
            stiffness: 320,
            damping: 24,
          }}
          className={cn(
            "pointer-events-auto relative w-80 overflow-hidden rounded-2xl border border-brand/5 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.05)]",
            className,
          )}
        >
          {/* Left accent line */}
          <span
            aria-hidden
            className={cn(
              "absolute left-0 top-0 h-full w-[3px]",
              tone.accent,
            )}
          />

          <div className="flex items-start gap-3 px-4 py-3.5 pl-5">
            <span
              className={cn(
                "flex h-10 w-10 flex-none items-center justify-center rounded-xl ring-1",
                tone.bg,
                tone.ring,
              )}
            >
              <Icon
                className={tone.icon}
                size={20}
                strokeWidth={2.25}
              />
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-display text-[15px] font-semibold leading-tight text-neutral-900">
                {title}
              </p>
              {description && (
                <p className="mt-0.5 font-ui text-[13px] leading-snug text-neutral-600">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setInternalVisible(false);
                onDismiss?.();
              }}
              aria-label="Fechar notificação"
              className="-mr-1 -mt-1 flex h-6 w-6 flex-none items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
            >
              <X size={14} strokeWidth={2.25} />
            </button>
          </div>

          {/* Auto-dismiss progress bar */}
          <div className="h-[2px] w-full bg-neutral-100">
            <motion.span
              key={`progress-${id ?? title}`}
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: duration / 1000, ease: "linear" }}
              className={cn("block h-full", tone.progress)}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function NotificationStack({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed right-6 top-6 z-40 flex flex-col gap-3",
        className,
      )}
    >
      {children}
    </div>
  );
}
