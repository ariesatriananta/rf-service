import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import SearchForm from "@/components/search/SearchForm"
import AppHeader from "@/components/layout/AppHeader"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Flight",
}

export default function FlightBookingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="" />

      {/* Search Form (moved below header) */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <SearchForm inline={false} />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_20rem] gap-6 lg:gap-8 items-start">
          {/* Flight Results */}
          <div className="space-y-4">
            {/* Delta Flight */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <img src="/airplane-wing-sunset-view-from-window.jpg" alt="Flight view" className="w-full sm:w-40 h-36 sm:h-28 rounded-lg object-cover" />

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Delta • DL 123</h3>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                      Best
                    </Badge>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                      Refundable
                    </Badge>
                  </div>

                  <div className="text-gray-600 mb-1">JFK 08:10 – LAX 11:25 • 6h 15m • Nonstop</div>

                  <div className="text-gray-500 text-sm">Economy • Wi‑Fi • Power</div>
                </div>

                <div className="sm:text-right mt-4 sm:mt-0 w-full sm:w-auto">
                  <div className="text-2xl font-bold text-gray-900 mb-1">$289</div>
                  <div className="text-sm text-gray-500 mb-4">per traveler</div>
                  <Button className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-full">Select</Button>
                </div>
              </div>
            </div>

            {/* United Flight */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <img
                  src="/airplane-interior-cabin-seats-aisle.jpg"
                  alt="Flight interior"
                  className="w-full sm:w-40 h-36 sm:h-28 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">United • UA 456</h3>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                      Shortest
                    </Badge>
                  </div>

                  <div className="text-gray-600 mb-1">EWR 09:30 – LAX 12:45 • 6h 15m • Nonstop</div>

                  <div className="text-gray-500 text-sm">Economy • Basic baggage</div>
                </div>

                <div className="sm:text-right mt-4 sm:mt-0 w-full sm:w-auto">
                  <div className="text-2xl font-bold text-gray-900 mb-1">$279</div>
                  <div className="text-sm text-gray-500 mb-4">per traveler</div>
                  <Button className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-full">Select</Button>
                </div>
              </div>
            </div>

            {/* JetBlue Flight */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <img
                  src="/airplane-exterior-wing-sky-clouds-sunset.jpg"
                  alt="Flight exterior"
                  className="w-full sm:w-40 h-36 sm:h-28 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">JetBlue • B6 789</h3>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                      More legroom
                    </Badge>
                  </div>

                  <div className="text-gray-600 mb-1">JFK 10:20 – LAX 13:45 • 6h 25m • Nonstop</div>

                  <div className="text-gray-500 text-sm">Even More Space • Wi‑Fi</div>
                </div>

                <div className="sm:text-right mt-4 sm:mt-0 w-full sm:w-auto">
                  <div className="text-2xl font-bold text-gray-900 mb-1">$315</div>
                  <div className="text-sm text-gray-500 mb-4">per traveler</div>
                  <Button className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-full">Select</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="w-full lg:w-80">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 lg:sticky lg:top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Book your flight</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-700">FROM</div>
                    <div className="text-gray-900">JFK New York</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-700">TO</div>
                    <div className="text-gray-900">LAX Los Angeles</div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-700">DEPART</div>
                    <div className="text-gray-500">Add date</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-700">RETURN</div>
                    <div className="text-gray-500">Add date</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-700">PASSENGERS</div>
                  <div className="text-gray-900">1 adult, Economy</div>
                </div>
              </div>

              <Button className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-full">Reserve flight</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

