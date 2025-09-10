import FlightCard from "@/components/results/FlightCard"
import SearchForm from "@/components/search/SearchForm"
import { mockFlights } from "@/lib/mockFlights"
import AppHeader from "@/components/layout/AppHeader"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Flight Results",
}

export default function ResultsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const from = (searchParams.from as string) || "JFK"
  const to = (searchParams.to as string) || "LAX"
  const trip = (searchParams.trip as string) || "round"

  const flights = mockFlights.filter((f) => f.from.includes(from) && f.to.includes(to))

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Flight Search" />

      {/* Search Form (below header) */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <SearchForm inline={false} />
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center gap-3 mb-6 text-gray-700">
          <span className="text-sm">From</span>
          <span className="font-medium">{from}</span>
          <span className="text-sm">to</span>
          <span className="font-medium">{to}</span>
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 ml-2">{trip}</span>
        </div>

        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
          {flights.length === 0 ? (
            <div className="text-gray-600 bg-white border border-gray-200 rounded-lg p-6">Tidak ada hasil untuk rute ini (mock data).</div>
          ) : (
            flights.map((f) => <FlightCard key={f.id} flight={f} />)
          )}
        </div>
      </main>
    </div>
  )
}
