import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Food & Drink specific utilities
export function scaleRecipe(ingredient: string, quantity: number, multiplier: number) {
  return `${ingredient}: ${quantity * multiplier}`;
}

export function convertUnit(value: number, fromUnit: string, toUnit: string): number {
  const conversions: Record<string, Record<string, number>> = {
    cups: { grams: 240, milliliters: 240, ounces: 8 },
    grams: { cups: 1 / 240, milliliters: 1, ounces: 0.035274 },
    milliliters: { cups: 1 / 240, grams: 1, ounces: 0.033814 },
    ounces: { cups: 1 / 8, grams: 28.3495, milliliters: 29.5735 },
  };
  if (conversions[fromUnit] && conversions[fromUnit][toUnit]) {
    return value * conversions[fromUnit][toUnit];
  }
  return value; // Fallback
}

export function calculateNutrition(caloriesPerServing: number, servings: number) {
  return caloriesPerServing * servings;
}