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
  { icon: string; bg: string; ring: string }
> = {
  success: { icon: "text-success", bg: "bg-success/10", ring: "ring-success/20" },
  warning: { icon: "text-warning", bg: "bg-warning/10", ring: "ring-warning/20" },
  info: { icon: "text-brand", bg: "bg-brand-subtle", ring: "ring-brand/20" },
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
          initial={{ opacity: 0, x: 40, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 40, scale: 0.98 }}
          transition={{
            type: "spring",
            stiffness: 320,
            damping: 24,
          }}
          className={cn(
            "pointer-events-auto flex w-80 items-start gap-3 rounded-frame-inner border border-brand/5 bg-white px-4 py-3.5 shadow-card",
            className,
          )}
        >
          <span
            className={cn(
              "flex h-10 w-10 flex-none items-center justify-center rounded-xl ring-1",
              tone.bg,
              tone.ring,
            )}
          >
            <Icon className={tone.icon} size={20} strokeWidth={2.25} />
          </span>
          <div className="flex-1">
            <p className="font-display text-body-md font-semibold text-neutral-900">
              {title}
            </p>
            {description && (
              <p className="mt-0.5 text-label-sm text-neutral-600">
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
            className="flex-none text-neutral-400 transition-colors hover:text-neutral-700"
          >
            <X size={16} strokeWidth={2.25} />
          </button>
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
