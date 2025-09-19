import SearchForm from "@/components/search/SearchForm"
import AppHeader from "@/components/layout/AppHeader"
import QuerySummary from "@/components/results/QuerySummary"
import ResultsControls from "@/components/results/ResultsControls"
import FlightCard from "@/components/results/FlightCard"
import FlightResults from "@/components/results/FlightResults"
import FlightResultsSkeleton from "@/components/results/FlightResultsSkeleton"
import { getMockFlights } from "@/lib/mockFlights"
import { formatDateID } from "@/lib/utils"
import type { Metadata } from "next"
import { Suspense } from "react"
import { Plane } from "lucide-react"
import { IconArrowRight } from '@/components/icons'

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
  cabin?: string
}

const cabinLabels: Record<string, string> = {
  economy: "Ekonomi",
  business: "Bisnis",
}

export default function FlightBookingPage({ searchParams }: { searchParams: SearchParams }) {
  const from = searchParams.from
  const to = searchParams.to
  const pax = Number(searchParams.pax || 1)
  const trip = searchParams.trip || "round"
  const depart = searchParams.depart
  const ret = searchParams.return
  const transport = searchParams.transport || "pesawat"
  const tripLabel = trip === "round" ? "Pulang-Pergi" : trip === "oneway" ? "Sekali Jalan" : "Multi-kota"
  const transportLabel = transport === "pesawat" ? "Pesawat" : transport === "bus" ? "Bus" : "Kapal"
  const cabinParam = (searchParams.cabin || "economy").toLowerCase()
  const cabinLabel = cabinLabels[cabinParam] || "Ekonomi"

  const hasQuery = Boolean(from && to)

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
                key={JSON.stringify({ from, to, depart, ret, cabin: cabinParam })}
                fallback={<FlightResultsSkeleton />}
              >
                {/* @ts-expect-error Async Server Component */}
                <FlightResults searchParams={searchParams} />
              </Suspense>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="w-full lg:w-80">
            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 lg:sticky lg:top-6 space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Ringkasan Pencarian</h2>
                <p className="text-sm text-gray-500">Pastikan detail perjalanan Anda sudah sesuai.</p>
              </div>

              {!hasQuery ? (
                <div className="text-gray-600">Belum ada rute yang dipilih.</div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl border border-gray-200 bg-primary/10 flex items-center justify-center">
                      <Plane className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 uppercase tracking-wide">Rute</div>
                      <div className="flex text-base font-semibold text-gray-900">
                        {from || "-"} 
                        <IconArrowRight aria-hidden size={24} strokeWidth={1} />
                        {to || "-"}</div>
                      <div className="flex text-xs text-gray-500">
                        {tripLabel} 
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dot-icon lucide-dot"><circle cx="12.1" cy="12.1" r="1"/></svg>
                        {transportLabel}</div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-100 bg-gray-50/70 p-3 space-y-2 text-sm">
                    <SummaryRow label="Tanggal Pergi" value={formatDateID(depart) || "-"} />
                    <SummaryRow
                      label="Tanggal Pulang"
                      value={trip === "round" ? (formatDateID(ret) || "-") : tripLabel}
                    />
                    <SummaryRow label="Kelas Kabin" value={cabinLabel} />
                    <SummaryRow label="Penumpang" value={`${pax} orang`} />
                    <SummaryRow label="Transport" value={transportLabel} />
                  </div>

                  <div>
                    <a
                      href="#flight-searchForm"
                      className="inline-flex w-full justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Ubah pencarian
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs uppercase tracking-wide text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right">{value}</span>
    </div>
  )
}
