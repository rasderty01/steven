import { SupplierCategory } from "@/types";
import { Database } from "@/utils/supabase/database.types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export function formatSupplierCategory(category: SupplierCategory): string {
  // Handle special cases first
  const specialCases: Record<string, string> = {
    AV_Equipment: "AV Equipment",
    Sound_System: "Sound System",
    FoodCatering: "Food & Catering",
    BeverageCatering: "Beverage & Catering",
  };

  if (category in specialCases) {
    return specialCases[category];
  }

  // For other cases, just capitalize the first letter
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export function getCategoryBadgeColor(category: SupplierCategory): string {
  const colors: Record<string, string> = {
    AV_Equipment: "bg-blue-100 text-blue-800",
    Sound_System: "bg-indigo-100 text-indigo-800",
    Lighting: "bg-yellow-100 text-yellow-800",
    FoodCatering: "bg-green-100 text-green-800",
    BeverageCatering: "bg-emerald-100 text-emerald-800",
    Decoration: "bg-pink-100 text-pink-800",
    Photography: "bg-purple-100 text-purple-800",
    Videography: "bg-violet-100 text-violet-800",
    Entertainment: "bg-rose-100 text-rose-800",
    Security: "bg-red-100 text-red-800",
    Transportation: "bg-orange-100 text-orange-800",
    Other: "bg-gray-100 text-gray-800",
  };

  return colors[category] || "bg-gray-100 text-gray-800";
}
