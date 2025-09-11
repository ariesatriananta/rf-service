import FlightCard from "@/components/results/FlightCard"
import { getMockFlights } from "@/lib/mockFlights"

type SearchParams = {
  from?: string
  to?: string
  depart?: string
  return?: string
  trip?: "round" | "oneway" | "multicity"
  stops?: "any" | "nonstop" | "transit"
  sort?: "price" | "duration" | "depart-asc" | "depart-desc" | "arrive-asc" | "arrive-desc"
  airline?: string
  price_min?: string
  price_max?: string
}

const parseMinutes = (t: string) => {
  if (t.includes("h")) {
    const [h, m] = t
      .split("h")
      .map((s) => s.replace(/[^0-9]/g, ""))
      .filter(Boolean)
    const hh = Number(h || 0)
    const mm = Number(m || 0)
    return hh * 60 + mm
  }
  const [hh, mm] = t.split(":").map(Number)
  return hh * 60 + mm
}

export default async function FlightResults({ searchParams }: { searchParams: SearchParams }) {
  const from = searchParams.from
  const to = searchParams.to
  const depart = searchParams.depart
  const qStops = searchParams.stops || "any"
  const qSort = (searchParams.sort as string) || "price"
  const qAirline = (searchParams.airline as string) || ""
  const qPriceMin = Number(searchParams.price_min || 0)
  const qPriceMax = Number(searchParams.price_max || 5000000)

  const hasQuery = Boolean(from && to)

  // Simulate fetch delay so Suspense fallback shows for this section only
  if (hasQuery) {
    await new Promise((r) => setTimeout(r, 500))
  }

  if (!hasQuery) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-600">
        Tidak ditemukan data
      </div>
    )
  }

  let flights = getMockFlights().filter(
    (f) => f.from.includes(from as string) && f.to.includes(to as string)
  )

  if (depart) flights = flights.filter((f) => f.departDate === depart)
  if (qStops === "nonstop") flights = flights.filter((f) => f.stops === 0)
  else if (qStops === "transit") flights = flights.filter((f) => f.stops > 0)
  if (qAirline) {
    const allow = new Set(qAirline.split(",").filter(Boolean))
    flights = flights.filter((f) => allow.has(f.airline))
  }
  flights = flights.filter((f) => f.price >= qPriceMin && f.price <= qPriceMax)

  flights = [...flights].sort((a, b) => {
    if (qSort === "price") return a.price - b.price
    if (qSort === "duration") return parseMinutes(a.duration) - parseMinutes(b.duration)
    if (qSort === "depart-asc") return parseMinutes(a.departTime) - parseMinutes(b.departTime)
    if (qSort === "depart-desc") return parseMinutes(b.departTime) - parseMinutes(a.departTime)
    if (qSort === "arrive-asc") return parseMinutes(a.arriveTime) - parseMinutes(b.arriveTime)
    if (qSort === "arrive-desc") return parseMinutes(b.arriveTime) - parseMinutes(a.arriveTime)
    return 0
  })

  if (flights.length === 0)
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-600">
        Tidak ada hasil untuk rute ini (mock data).
      </div>
    )

  return (
    <div className="grid gap-4">
      {flights.map((f) => (
        <FlightCard key={f.id} flight={f} />
      ))}
    </div>
  )
}

