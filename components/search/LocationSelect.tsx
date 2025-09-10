"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import { Search, X, Plane, Building2 } from "lucide-react"
import { filterLocations, locations, Location } from "@/lib/locations"

type Props = {
  label: string
  value: string
  onChange: (code: string) => void
  placeholder?: string
}

export default function LocationSelect({ label, value, onChange, placeholder = "Ketik kota/bandara" }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const containerRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const selected: Location | undefined = useMemo(
    () => locations.find((l) => l.code.toLowerCase() === value.toLowerCase()),
    [value]
  )

  const results = useMemo(() => (query ? filterLocations(query) : locations.slice(0, 8)), [query])

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 0)
  }, [open])

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-left hover:bg-gray-100"
      >
        <div className="text-xs text-gray-500 mb-1">{label}</div>
        <div className="text-sm text-gray-900">
          {selected ? (
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold mr-2">{selected.city}</span>
                <span className="text-gray-500">{selected.code}</span>
              </div>
            </div>
          ) : (
            <span className="text-gray-500">{value || placeholder}</span>
          )}
        </div>
      </button>

      {open && (
        <div className="absolute left-0 z-30 mt-2 w-[28rem] max-w-[90vw] rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="flex items-center gap-2 px-3 py-2 border-b">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery("")} type="button" className="p-1 text-gray-500 hover:text-gray-700">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <ul className="max-h-72 overflow-auto py-1">
            {results.map((l) => (
              <li key={`${l.code}-${l.name}`}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(l.code)
                    setOpen(false)
                    setQuery("")
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      {l.type === "airport" ? (
                        <Plane className="w-4 h-4 mt-1 text-gray-600" />
                      ) : (
                        <Building2 className="w-4 h-4 mt-1 text-gray-600" />
                      )}
                      <div>
                        <div className="text-sm text-gray-900">
                          <span className="font-medium mr-1">{l.city}</span>
                          <span className="text-gray-500">{l.country}</span>
                        </div>
                        <div className="text-xs text-gray-500">{l.name}</div>
                      </div>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md font-medium">{l.code}</span>
                  </div>
                </button>
              </li>
            ))}
            {results.length === 0 && (
              <li className="px-3 py-4 text-sm text-gray-500">Tidak ada hasil</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
