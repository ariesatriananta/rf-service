import FlightCard from "@/components/results/FlightCard"
import { getMockFlights, type Flight } from "@/lib/mockFlights"

type SearchParams = {
  from?: string
  to?: string
  depart?: string
  return?: string
  pax?: string
  trip?: "round" | "oneway" | "multicity"
  transport?: "pesawat" | "bus" | "kapal"
  stops?: "any" | "nonstop" | "transit"
  sort?: "price" | "duration" | "depart-asc" | "depart-desc" | "arrive-asc" | "arrive-desc"
  airline?: string
  price_min?: string
  price_max?: string
  cabin?: string
  debug?: string
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

const normalizeCabin = (value?: string) => {
  if (!value) return "economy"
  const lowered = value.toLowerCase()
  if (lowered === "business" || lowered === "bisnis") return "business"
  return "economy"
}

function ResultsContent({ searchParams }: { searchParams: SearchParams }) {
  const from = searchParams.from
  const to = searchParams.to
  const depart = searchParams.depart
  const qStops = searchParams.stops || "any"
  const qSort = (searchParams.sort as string) || "price"
  const qAirline = (searchParams.airline as string) || ""
  const qPriceMin = Number(searchParams.price_min || 0)
  const qPriceMax = Number(searchParams.price_max || 5000000)
  const requestedCabin = normalizeCabin(searchParams.cabin)

  const hasQuery = Boolean(from && to)

  if (!hasQuery) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-600">
        Tidak ditemukan data
      </div>
    )
  }

  const flightsSource = getMockFlights()
  const filteredByRoute = flightsSource.filter((flight) => {
    const matchFrom = flight.from.toLowerCase().includes((from as string).toLowerCase())
    const matchTo = flight.to.toLowerCase().includes((to as string).toLowerCase())
    return matchFrom && matchTo
  })

  const flightsWithCabin = filteredByRoute
    .map((flight) => {
      const offering = flight.offerings.find((o) => o.cabinClass.toLowerCase() === requestedCabin)
      if (!offering) return null
      const cheapestFare = Math.min(...offering.fareOptions.map((fare) => fare.price))
      return { flight, offering, cheapestFare }
    })
    .filter(Boolean) as { flight: Flight; offering: Flight["offerings"][number]; cheapestFare: number }[]

  let flights = flightsWithCabin

  if (depart) {
    const availableDates = new Set(flightsWithCabin.map(({ flight }) => flight.departDate))
    if (availableDates.has(depart)) {
      flights = flights.filter(({ flight }) => flight.departDate === depart)
    }
    // Jika tanggal yang diminta tidak tersedia di mock, biarkan tanpa filter tanggal
  }

  if (qStops === "nonstop") {
    flights = flights.filter(({ flight }) => flight.stops === 0)
  } else if (qStops === "transit") {
    flights = flights.filter(({ flight }) => flight.stops > 0)
  }

  if (qAirline) {
    const allow = new Set(qAirline.split(",").filter(Boolean))
    flights = flights.filter(({ flight }) => allow.has(flight.airline))
  }

  flights = flights.filter(({ cheapestFare }) => cheapestFare >= qPriceMin && cheapestFare <= qPriceMax)

  flights = [...flights].sort((a, b) => {
    if (qSort === "price") return a.cheapestFare - b.cheapestFare
    if (qSort === "duration") return parseMinutes(a.flight.duration) - parseMinutes(b.flight.duration)
    if (qSort === "depart-asc") return parseMinutes(a.flight.departTime) - parseMinutes(b.flight.departTime)
    if (qSort === "depart-desc") return parseMinutes(b.flight.departTime) - parseMinutes(a.flight.departTime)
    if (qSort === "arrive-asc") return parseMinutes(a.flight.arriveTime) - parseMinutes(b.flight.arriveTime)
    if (qSort === "arrive-desc") return parseMinutes(b.flight.arriveTime) - parseMinutes(a.flight.arriveTime)
    return 0
  })

  if (flights.length === 0) {
    if (searchParams.debug === '1') {
      return (
        <div className="space-y-3">
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-600">
            Tidak ada hasil untuk rute ini (mock data).
          </div>
          <pre className="bg-gray-900 text-gray-100 text-xs p-3 rounded-md overflow-auto">
{JSON.stringify({
  query: { from, to, depart, stops: qStops, sort: qSort, airline: qAirline, price_min: qPriceMin, price_max: qPriceMax, cabin: requestedCabin },
  counts: {
    source: flightsSource.length,
    byRoute: filteredByRoute.length,
    withCabin: flightsWithCabin.length,
    final: flights.length,
  },
  sampleRouteMatches: filteredByRoute.slice(0,3).map(f=>({id:f.id, from:f.from, to:f.to, date:f.departDate})),
}, null, 2)}
          </pre>
        </div>
      )
    }
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-600">
        Tidak ada hasil untuk rute ini (mock data).
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {flights.map(({ flight, offering }) => (
        <FlightCard
          key={`${flight.id}-${offering.cabinClass}`}
          flight={flight}
          offering={offering}
          queryContext={{
            from,
            to,
            depart,
            returnDate: searchParams.return,
            pax: Number(searchParams.pax || 1),
            trip: searchParams.trip,
            transport: searchParams.transport,
            cabin: requestedCabin,
          }}
        />
      ))}
    </div>
  )
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))
const resolveDelayMs = () => {
  const envVal = process.env.NEXT_PUBLIC_RESULTS_DELAY_MS ?? process.env.RESULTS_DELAY_MS
  const parsed = Number(envVal)
  if (Number.isFinite(parsed) && parsed >= 0) return parsed
  return 500
}

export default async function FlightResults({ searchParams }: { searchParams: SearchParams }) {
  const hasQuery = Boolean(searchParams.from && searchParams.to)
  if (hasQuery) {
    const ms = resolveDelayMs()
    if (ms > 0) await delay(ms)
  }
  return <ResultsContent searchParams={searchParams} />
}
