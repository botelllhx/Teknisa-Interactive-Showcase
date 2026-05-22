"use client";

import {
  Monitor,
  Utensils,
  LayoutGrid,
  Users,
  ShoppingCart,
  Heart,
  Sparkles,
  Globe,
  Calculator,
  Smartphone,
  BookOpen,
  ScanLine,
  ChefHat,
  Timer,
  Salad,
  BadgeCheck,
  Scale,
  FileText,
  GitBranch,
  PackageSearch,
  UsersRound,
  UserCircle,
  LayoutDashboard,
  TrendingUp,
  ShoppingBasket,
  Briefcase,
  BrainCircuit,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Monitor,
  Utensils,
  LayoutGrid,
  Users,
  ShoppingCart,
  Heart,
  Sparkles,
  Globe,
  Calculator,
  Smartphone,
  BookOpen,
  ScanLine,
  ChefHat,
  Timer,
  Salad,
  BadgeCheck,
  Scale,
  FileText,
  GitBranch,
  PackageSearch,
  UsersRound,
  UserCircle,
  LayoutDashboard,
  TrendingUp,
  ShoppingBasket,
  Briefcase,
  BrainCircuit,
};

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function SegmentIcon({
  name,
  size = 48,
  className,
  strokeWidth = 1.75,
}: IconProps) {
  const Icon = ICONS[name] ?? Monitor;
  return <Icon size={size} className={className} strokeWidth={strokeWidth} />;
}
