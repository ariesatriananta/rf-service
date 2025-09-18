import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const MONTHS_ID_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
]

export const formatCurrencyIDR = (value: number) =>
  `Rp ${Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`

export const formatDateID = (iso?: string) => {
  if (!iso) return "-"
  const match = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(iso)
  if (!match) return iso
  const [, year, month, day] = match
  const monthIndex = Number(month) - 1
  const label = MONTHS_ID_SHORT[monthIndex] ?? month
  return `${day.padStart(2, "0")} ${label} ${year}`
}

