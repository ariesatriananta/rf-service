"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import { Calendar as CalendarIcon, X } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { format, parseISO, isValid } from "date-fns"

type Props = {
  label: string
  value?: string // in yyyy-MM-dd
  onChange: (val: string | "") => void
  placeholder?: string
  disabledBefore?: Date
}

export default function DatePicker({ label, value, onChange, placeholder = "dd / mm / yyyy", disabledBefore }: Props) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const selectedDate = useMemo(() => {
    if (!value) return undefined
    const d = parseISO(value)
    return isValid(d) ? d : undefined
  }, [value])

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-left hover:bg-gray-100"
      >
        <div className="text-xs text-gray-500 mb-1">{label}</div>
        <div className="flex items-center justify-between text-sm">
          <span className={value ? "text-gray-900" : "text-gray-500"}>
            {selectedDate ? format(selectedDate, "dd / MM / yyyy") : placeholder}
          </span>
          <CalendarIcon className="w-4 h-4 text-gray-600" />
        </div>
      </button>

      {open && (
        <div className="absolute left-0 z-30 mt-2 w-[22rem] sm:w-[24rem] max-w-[95vw] rounded-xl border border-gray-200 bg-white shadow-lg p-2">
          <div className="flex justify-end">
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800 px-2 py-1 rounded-md hover:bg-gray-100"
              >
                <X className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(d) => {
              if (d) onChange(format(d, "yyyy-MM-dd"))
              setOpen(false)
            }}
            disabled={disabledBefore ? [{ before: disabledBefore }] : undefined}
            captionLayout="dropdown"
            styles={{
              caption: { display: "flex", justifyContent: "center" },
            }}
          />
        </div>
      )}
    </div>
  )
}
