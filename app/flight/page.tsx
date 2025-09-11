import { Button } from "@/components/ui/button"
import SearchForm from "@/components/search/SearchForm"
import AppHeader from "@/components/layout/AppHeader"
import QuerySummary from "@/components/results/QuerySummary"
import ResultsControls from "@/components/results/ResultsControls"
import FlightCard from "@/components/results/FlightCard"
import FlightResults from "@/components/results/FlightResults"
import FlightResultsSkeleton from "@/components/results/FlightResultsSkeleton"
import { getMockFlights } from "@/lib/mockFlights"
import type { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Flight",
}

type SearchParams = {
  from?: string
  to?: string
  depart?: string
  return?: string
  pax?: string
  trip?: "round" | "oneway" | "multicity"
  transport?: "pesawat" | "bus" | "kapal"
  // Filters & sorting from query string
  stops?: "any" | "nonstop" | "transit"
  sort?: "price" | "duration" | "depart-asc" | "depart-desc" | "arrive-asc" | "arrive-desc"
  airline?: string
  price_min?: string
  price_max?: string
}

export default function FlightBookingPage({ searchParams }: { searchParams: SearchParams }) {
  const from = searchParams.from
  const to = searchParams.to
  const pax = Number(searchParams.pax || 1)
  const trip = searchParams.trip || "round"
  const depart = searchParams.depart
  const ret = searchParams.return
  const transport = searchParams.transport || "pesawat"

  const formatDate = (v?: string) =>
    v ? new Date(v).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : undefined

  const hasQuery = Boolean(from && to)

  // helpers for filter/sort
  const parseMinutes = (t: string) => {
    if (t.includes("h")) {
      const [h, m] = t.split("h").map((s) => s.replace(/[^0-9]/g, "")).filter(Boolean)
      const hh = Number(h || 0)
      const mm = Number(m || 0)
      return hh * 60 + mm
    }
    const [hh, mm] = t.split(":").map(Number)
    return hh * 60 + mm
  }

  const qStops = searchParams.stops || "any" // any|nonstop|transit
  const qSort = (searchParams.sort as string) || "price"
  const qAirline = (searchParams.airline as string) || ""
  const qPriceMin = Number(searchParams.price_min || 0)
  const qPriceMax = Number(searchParams.price_max || 5000000)

  const flightsData = getMockFlights()
  const airlinesAll = Array.from(new Set(flightsData.map((f) => f.airline)))

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="" />

      {/* Search Form (below header) */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4" id="flight-searchForm">
          <SearchForm inline={false} actionPath="/flight" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Query summary (only when both from & to present) */}
        {/* {hasQuery && (
          <div className="mb-4 bg-white border border-gray-200 rounded-lg p-4">
            <QuerySummary from={from} to={to} pax={pax} trip={trip} depart={depart} ret={ret} transport={transport} />
          </div>
        )} */}

        {/* Sorting & Filters */}
        <ResultsControls airlines={airlinesAll} priceMaxDefault={3000000} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_20rem] gap-6 lg:gap-8 items-start">
          {/* Flight Results */}
          <div className="space-y-4">
            {!hasQuery ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-600">
                Tidak ditemukan data
              </div>
            ) : (
              <Suspense
                key={JSON.stringify({ from, to, depart, ret, qStops, qSort, qAirline, qPriceMin, qPriceMax })}
                fallback={<FlightResultsSkeleton />}
              >
                <FlightResults searchParams={searchParams} />
              </Suspense>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="w-full lg:w-80 shadow-sm">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 lg:sticky lg:top-6">
              <h2 className="text-lg font-semibold  mb-6 text-primary">Penerbangan Anda</h2>

              {!hasQuery ? (
                <div className="text-gray-600">Tidak ditemukan data</div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <div>
                        <div className="text-sm text-gray-600 mr-2">Dari</div>
                        <div className="text-gray-900">{from}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 mr-2">Ke</div>
                        <div className="text-gray-900">{to}</div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-700">Pergi</div>
                        <div className="text-gray-900">{formatDate(depart) || "—"}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-700">Kembali</div>
                        <div className="text-gray-900">{trip === "round" ? (formatDate(ret) || "—") : "—"}</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-700">Passengers</div>
                      <div className="text-gray-900">{pax} {pax > 1 ? "penumpang" : "penumpang"}</div>
                    </div>
                  </div>

                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-5 text-md rounded-full">Booking Sekarang</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
