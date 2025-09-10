"use client"
import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

type SortKey = "price" | "duration" | "depart-asc" | "depart-desc" | "arrive-asc" | "arrive-desc"

export default function ResultsControls({ airlines, priceMaxDefault = 1000 }: { airlines: string[]; priceMaxDefault?: number }) {
  const router = useRouter()
  const params = useSearchParams()

  const currentSort = (params.get("sort") as SortKey) || "price"
  const stops = params.get("stops") || "any" // any | nonstop | transit
  const priceMin = Number(params.get("price_min") || 0)
  const priceMax = Number(params.get("price_max") || priceMaxDefault)
  const selectedAirlines = useMemo(() => new Set((params.get("airline") || "").split(",").filter(Boolean)), [params])

  const updateParam = (key: string, value?: string) => {
    const usp = new URLSearchParams(params.toString())
    if (value === undefined || value === "") usp.delete(key)
    else usp.set(key, value)
    router.push(`/flight?${usp.toString()}`)
  }

  const toggleAirline = (name: string) => {
    const set = new Set(selectedAirlines)
    if (set.has(name)) set.delete(name)
    else set.add(name)
    updateParam("airline", Array.from(set).join(","))
  }

  const [localMin, setLocalMin] = useState(priceMin)
  const [localMax, setLocalMax] = useState(priceMax)

  const commitPrice = () => {
    const min = Math.min(localMin, localMax)
    const max = Math.max(localMin, localMax)
    updateParam("price_min", String(min))
    updateParam("price_max", String(max))
  }

  return (
    <div className="mb-4 rounded-xl border border-gray-200 bg-white p-3 sm:p-4">
      <div className="flex flex-col gap-4">
        {/* Sorting */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600 mr-2">Urutkan:</span>
          {[
            { key: "price", label: "Harga terendah" },
            { key: "duration", label: "Durasi terpendek" },
            { key: "depart-asc", label: "Berangkat paling awal" },
            // { key: "depart-desc", label: "Berangkat paling akhir" },
            { key: "arrive-asc", label: "Tiba paling awal" },
            // { key: "arrive-desc", label: "Tiba paling akhir" },
          ].map((s) => (
            <Button
              key={s.key}
              size="sm"
              variant={currentSort === (s.key as SortKey) ? "default" : "outline"}
              className={(currentSort === (s.key as SortKey) ? "hover:bg-primary" : "hover:bg-background hover:text-inherit") + " transition-none"}
              onClick={() => updateParam("sort", s.key)}
            >
              {s.label}
            </Button>
          ))}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Stops */}
          <div className="rounded-lg border border-gray-200 p-3">
            <div className="text-sm font-medium text-gray-900 mb-2">Penerbangan</div>
            <div className="flex items-center gap-2">
              {[
                { v: "any", label: "Semua" },
                { v: "nonstop", label: "Langsung" },
                { v: "transit", label: "Transit" },
              ].map((o) => (
                <label key={o.v} className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="stops"
                    checked={stops === o.v}
                    onChange={() => updateParam("stops", o.v)}
                    className="accent-[#ff6347]"
                  />
                  <span>{o.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div className="rounded-lg border border-gray-200 p-3">
            <div className="text-sm font-medium text-gray-900 mb-2">Harga</div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={priceMaxDefault}
                step={10000}
                value={localMin}
                onChange={(e) => setLocalMin(Number(e.target.value))}
                className="w-full"
              />
              <input
                type="range"
                min={0}
                max={priceMaxDefault}
                step={10000}
                value={localMax}
                onChange={(e) => setLocalMax(Number(e.target.value))}
                className="w-full"
              />
              <Button size="sm" variant="outline" onClick={commitPrice}>
                Terapkan
              </Button>
            </div>
            <div className="mt-2 text-sm text-gray-600">Rp {localMin.toLocaleString()} – Rp {localMax.toLocaleString()}</div>
          </div>

          {/* Airlines */}
          <div className="rounded-lg border border-gray-200 p-3">
            <div className="text-sm font-medium text-gray-900 mb-2">Maskapai</div>
            <div className="flex flex-wrap gap-2">
              {airlines.map((a) => (
                <button
                  key={a}
                  onClick={() => toggleAirline(a)}
                  className={
                    "px-3 py-1.5 rounded-full text-sm border " +
                    (selectedAirlines.has(a)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-white text-gray-900 border-gray-200 hover:bg-gray-50")
                  }
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
