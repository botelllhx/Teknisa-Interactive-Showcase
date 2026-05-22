import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-ui text-[10px] font-bold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-1",
  {
    variants: {
      variant: {
        default: "border-transparent bg-brand text-white shadow-brand",
        secondary:
          "border-brand/15 bg-brand-ghost text-brand",
        success:
          "border-success/20 bg-success/10 text-success",
        warning:
          "border-warning/20 bg-warning/10 text-warning",
        danger: "border-danger/20 bg-danger/10 text-danger",
        outline: "border-neutral-200 text-neutral-700",
        ai: "border-transparent bg-gradient-to-r from-brand via-brand-light to-[#7c3aed] text-white shadow-brand",
        ghost: "border-transparent bg-neutral-100 text-neutral-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
