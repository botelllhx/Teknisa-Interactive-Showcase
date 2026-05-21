"use client";

import { motion } from "framer-motion";
import { Wrench } from "lucide-react";
import { solutionsById } from "@/data/solutions";
import { getFlow } from "@/data/flows";
import { SegmentIcon } from "@/components/ui/SegmentIcon";
import { SolutionFrame, frameMaxWidth } from "@/components/mockups/frames";
import { cn } from "@/lib/cn";

interface SolutionDemoPlaceholderProps {
  solutionId: string;
}

export function SolutionDemoPlaceholder({ solutionId }: SolutionDemoPlaceholderProps) {
  const solution = solutionsById[solutionId];
  const steps = getFlow(solutionId);

  if (!solution) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-[1fr_auto_1fr] items-center gap-10 px-16 pb-16"
    >
      <aside className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white shadow-brand">
            <SegmentIcon name={solution.icon} size={26} />
          </div>
          <div>
            <p className="text-label-sm font-medium uppercase tracking-wider text-brand">
              {deviceLabel(solution.device)}
            </p>
            <h1 className="font-display text-display-lg leading-tight text-neutral-900">
              {solution.name}
            </h1>
          </div>
        </div>

        <p className="max-w-[40ch] text-body-lg text-neutral-600">
          {solution.description}
        </p>

        <div className="mt-2 inline-flex w-fit items-center gap-2.5 rounded-full border border-warning/20 bg-warning/5 px-4 py-2.5">
          <Wrench size={16} strokeWidth={2.25} className="text-warning" />
          <span className="font-ui text-label-sm font-medium text-warning">
            Mockup interativo em construção — {steps.length} etapas planejadas
          </span>
        </div>
      </aside>

      <div className={cn("w-full", frameMaxWidth(solution.device))}>
        <SolutionFrame device={solution.device}>
          <ScreenPlaceholder solutionName={solution.name} />
        </SolutionFrame>
      </div>

      <aside className="flex flex-col gap-3">
        <p className="text-label-sm font-medium uppercase tracking-wider text-neutral-500">
          Etapas do fluxo
        </p>
        <ol className="flex flex-col gap-2.5">
          {steps.map((step, i) => (
            <li
              key={step.id}
              className="flex items-start gap-3 rounded-frame-inner border border-brand/10 bg-white px-4 py-3 shadow-card"
            >
              <span className="mt-0.5 inline-flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand-subtle text-label-sm font-semibold text-brand">
                {i + 1}
              </span>
              <div>
                <p className="font-display text-body-md font-semibold text-neutral-900">
                  {step.label}
                </p>
                {step.tooltip && (
                  <p className="text-label-sm text-neutral-600">{step.tooltip}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </aside>
    </motion.div>
  );
}

function ScreenPlaceholder({ solutionName }: { solutionName: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-brand-ghost via-white to-brand-subtle/60 p-6 text-center">
      <span className="h-2 w-12 rounded-full bg-brand/30" />
      <p className="font-display text-body-md font-semibold text-brand">
        {solutionName}
      </p>
      <p className="max-w-[24ch] text-caption text-neutral-500">
        Tela do mockup será implementada no Sprint 6
      </p>
    </div>
  );
}

function deviceLabel(device: string): string {
  switch (device) {
    case "desktop":
      return "Desktop";
    case "mobile":
      return "Mobile";
    case "tablet":
      return "Tablet";
    case "pos-terminal":
      return "Terminal PDV";
    case "kiosk":
      return "Totem";
    default:
      return device;
  }
}
