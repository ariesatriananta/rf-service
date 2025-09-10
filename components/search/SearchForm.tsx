"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Search, Plane, Ship, Bus, ArrowLeftRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import LocationSelect from "@/components/search/LocationSelect"
import DatePicker from "@/components/search/DatePicker"

type TripType = "round" | "oneway" | "multicity"
type TransportType = "pesawat" | "bus" | "kapal"

export default function SearchForm({ inline = true }: { inline?: boolean }) {
  const router = useRouter()
  const params = useSearchParams()
  const [from, setFrom] = useState(params.get("from") || "JFK")
  const [to, setTo] = useState(params.get("to") || "LAX")
  const [depart, setDepart] = useState(params.get("depart") || "")
  const [returnDate, setReturnDate] = useState(params.get("return") || "")
  const [passengers, setPassengers] = useState(Number(params.get("pax") || 1))
  const [trip, setTrip] = useState<TripType>((params.get("trip") as TripType) || "round")
  const [transport, setTransport] = useState<TransportType>((params.get("transport") as TransportType) || "pesawat")

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const usp = new URLSearchParams()
    usp.set("from", from)
    usp.set("to", to)
    if (depart) usp.set("depart", depart)
    if (trip === "round" && returnDate) usp.set("return", returnDate)
    usp.set("pax", String(passengers))
    usp.set("trip", trip)
    usp.set("transport", transport)
    router.push(`/results?${usp.toString()}`)
  }

  const swapLocations = () => {
    const f = from
    setFrom(to)
    setTo(f)
  }

  const container = (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Tabs Transport */}
      <div className="flex items-center gap-2 px-4 pt-3">
        <div role="tablist" aria-label="Transport" className="flex gap-2">
          <button
            type="button"
            role="tab"
            aria-selected={transport === "pesawat"}
            onClick={() => setTransport("pesawat")}
            className={(transport === "pesawat" ? "bg-black text-white" : "text-gray-700 hover:text-gray-900") + " rounded-full px-3 py-1.5 text-sm font-medium inline-flex items-center gap-2"}
          >
            <Plane className="w-4 h-4" /> Pesawat
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={transport === "bus"}
            onClick={() => setTransport("bus")}
            className={(transport === "bus" ? "bg-black text-white" : "text-gray-700 hover:text-gray-900") + " rounded-full px-3 py-1.5 text-sm font-medium inline-flex items-center gap-2"}
          >
            <Bus className="w-4 h-4" /> Bus
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={transport === "kapal"}
            onClick={() => setTransport("kapal")}
            className={(transport === "kapal" ? "bg-black text-white" : "text-gray-700 hover:text-gray-900") + " rounded-full px-3 py-1.5 text-sm font-medium inline-flex items-center gap-2"}
          >
            <Ship className="w-4 h-4" /> Kapal
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="px-4 pt-3">
        <div className="h-px bg-gray-200" />
      </div>

      {/* Body */}
      <div className="px-4 py-4">
        {/* Trip choice */}
        <div className="flex items-center gap-6 mb-4 text-sm">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <span className={trip === "oneway" ? "text-black" : "text-gray-700"}>
              <input type="radio" name="trip" className="accent-black" checked={trip === "oneway"} onChange={() => setTrip("oneway")} />
              <span className="ml-2">Sekali jalan</span>
            </span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <span className={trip === "round" ? "text-black" : "text-gray-700"}>
              <input type="radio" name="trip" className="accent-black" checked={trip === "round"} onChange={() => setTrip("round")} />
              <span className="ml-2">Pulang-pergi</span>
            </span>
          </label>
        </div>

        {/* Fields row */}
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6 items-end">
          {/* From + To with Swap */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-0 sm:gap-3 col-span-1 sm:col-span-2 lg:col-span-2">
            <LocationSelect label="Dari" value={from} onChange={setFrom} placeholder="Ketik kota/bandara" />
            <LocationSelect label="Ke" value={to} onChange={setTo} placeholder="Ketik kota/bandara" />
            <button
              type="button"
              onClick={swapLocations}
              aria-label="Tukar lokasi asal dan tujuan"
              className="flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full bg-white border border-gray-200 shadow hover:bg-gray-50"
            >
              <ArrowLeftRight className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          {/* Depart */}
          <DatePicker label="Pergi" value={depart || undefined} onChange={(v) => setDepart(v)} />

          {/* Return (only round) */}
          {trip === "round" && (
            <DatePicker
              label="Pulang - lebih hemat!"
              value={returnDate || undefined}
              onChange={(v) => setReturnDate(v)}
              disabledBefore={depart ? new Date(depart) : undefined}
            />
          )}

          {/* Pax & class */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
            <div className="text-xs text-gray-500 mb-1">Penumpang, Kelas</div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="w-16 bg-transparent text-sm text-gray-900 focus:outline-none"
              />
              <select className="bg-transparent text-sm text-gray-900 focus:outline-none">
                <option>Ekonomi</option>
                <option>Bisnis</option>
                <option>First</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="self-stretch flex items-center justify-start">
            <Button type="submit" className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl w-full lg:w-auto">
              <Search className="w-4 h-4 mr-2" /> Cari Tiket
            </Button>
          </div>
        </form>
      </div>

      {/* Bottom note */}
      <div className="px-4 pb-4 text-sm text-gray-600">
        <span className="text-gray-500">Yuk, cek promo yang tersedia supaya pesanan lebih hemat.</span>
      </div>
    </div>
  )

  if (inline) return container
  return (
    <div className="w-full">{container}</div>
  )
}
