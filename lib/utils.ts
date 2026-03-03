import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number, decimals = 2): string {
  return num.toFixed(decimals)
}

export function formatChange(change: number): string {
  return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`
}

export function getChangeColor(change: number): string {
  if (change > 0) return 'text-red-400'  // price up = bad for buyers
  if (change < 0) return 'text-green-400' // price down = good
  return 'text-gray-400'
}

export function getChangeBg(change: number): string {
  if (change > 0) return 'bg-red-500/10'
  if (change < 0) return 'bg-green-500/10'
  return 'bg-gray-500/10'
}
