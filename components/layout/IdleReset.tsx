"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Hand } from "lucide-react";
import { useIdleTimer } from "@/hooks/useIdleTimer";
import { useShowcase } from "@/lib/store";
import { timing, Z_INDEX } from "@/lib/tokens";

export function IdleReset() {
  const view = useShowcase((s) => s.view);
  const goHome = useShowcase((s) => s.goHome);

  const enabled = view !== "home";

  const { isIdle, shouldReset } = useIdleTimer({
    timeout: timing.idleTimeout,
    graceTimeout: timing.idleOverlayGrace,
    enabled,
  });

  useEffect(() => {
    if (shouldReset) {
      goHome();
    }
  }, [shouldReset, goHome]);

  return (
    <AnimatePresence>
      {isIdle && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ zIndex: Z_INDEX.idle }}
          className="pointer-events-none fixed inset-0 flex items-center justify-center bg-white/92 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-8 text-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-32 w-32 items-center justify-center rounded-full bg-brand text-white shadow-brand"
            >
              <Hand size={56} strokeWidth={1.5} />
            </motion.div>
            <div>
              <h2 className="font-display text-display-lg text-neutral-900">
                Toque para explorar
              </h2>
              <p className="mt-3 text-body-lg text-neutral-600">
                As soluções Teknisa estão à sua espera
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
