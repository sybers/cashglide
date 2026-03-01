import type { Category } from "@/types";

interface CategoryStyles {
  header: string;
  title: string;
  button: string;
  total: string;
}

const CATEGORY_STYLES: Record<Category["type"], CategoryStyles> = {
  revenue: {
    header: "bg-emerald-50/80 border-emerald-200/50",
    title: "text-emerald-600",
    button: "bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700",
    total: "text-emerald-500",
  },
  investment: {
    header: "bg-sky-50/80 border-sky-200/50",
    title: "text-sky-600",
    button: "bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700",
    total: "text-sky-500",
  },
  expense: {
    header: "bg-rose-50/80 border-rose-200/50",
    title: "text-rose-500",
    button: "bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700",
    total: "text-rose-500",
  },
};

export function getCategoryStyles(type: Category["type"]): CategoryStyles {
  return CATEGORY_STYLES[type];
}
