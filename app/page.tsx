import { Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function FlightBookingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rounded-full"></div>
            </div>
            <span className="text-xl font-semibold text-gray-900">Rentals</span>
          </div>

          {/* Search Form */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">From</label>
                <input
                  type="text"
                  placeholder="City or Airport"
                  className="text-sm text-gray-500 bg-transparent border-none outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">To</label>
                <input
                  type="text"
                  placeholder="City or Airport"
                  className="text-sm text-gray-500 bg-transparent border-none outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Dates</label>
                <input
                  type="text"
                  placeholder="Add dates"
                  className="text-sm text-gray-500 bg-transparent border-none outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Passengers</label>
                <input
                  type="text"
                  placeholder="1 traveler"
                  className="text-sm text-gray-500 bg-transparent border-none outline-none"
                />
              </div>
            </div>

            <Button className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-full">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          {/* User Avatar */}
          <Avatar className="w-10 h-10">
            <AvatarImage src="/diverse-user-avatars.png" />
            <AvatarFallback>
              <User className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Filter Tabs */}
        <div className="flex items-center gap-4 mb-8">
          <Button className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-full">Round trip</Button>
          <Button variant="ghost" className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-full">
            One way
          </Button>
          <Button variant="ghost" className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-full">
            Multi-city
          </Button>
          <Button variant="ghost" className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-full">
            Stops: Any
          </Button>
          <Button variant="ghost" className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-full">
            Bags
          </Button>
          <Button variant="ghost" className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-full">
            Times
          </Button>
        </div>

        <div className="flex gap-8">
          {/* Flight Results */}
          <div className="flex-1 space-y-4">
            {/* Delta Flight */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-6">
                <img src="/airplane-wing-sunset-view-from-window.jpg" alt="Flight view" className="w-40 h-30 rounded-lg object-cover" />

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

                  <div className="text-gray-600 mb-1">JFK 08:10 — LAX 11:25 • 6h 15m • Nonstop</div>

                  <div className="text-gray-500 text-sm">Economy • Wi-Fi • Power</div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 mb-1">$289</div>
                  <div className="text-sm text-gray-500 mb-4">per traveler</div>
                  <Button className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-full">Select</Button>
                </div>
              </div>
            </div>

            {/* United Flight */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-6">
                <img
                  src="/airplane-interior-cabin-seats-aisle.jpg"
                  alt="Flight interior"
                  className="w-40 h-30 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">United • UA 456</h3>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                      Shortest
                    </Badge>
                  </div>

                  <div className="text-gray-600 mb-1">EWR 09:30 — LAX 12:45 • 6h 15m • Nonstop</div>

                  <div className="text-gray-500 text-sm">Economy • Basic baggage</div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 mb-1">$279</div>
                  <div className="text-sm text-gray-500 mb-4">per traveler</div>
                  <Button className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-full">Select</Button>
                </div>
              </div>
            </div>

            {/* JetBlue Flight */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-6">
                <img
                  src="/airplane-exterior-wing-sky-clouds-sunset.jpg"
                  alt="Flight exterior"
                  className="w-40 h-30 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">JetBlue • B6 789</h3>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                      More legroom
                    </Badge>
                  </div>

                  <div className="text-gray-600 mb-1">JFK 10:20 — LAX 13:45 • 6h 25m • Nonstop</div>

                  <div className="text-gray-500 text-sm">Even More Space • Wi-Fi</div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 mb-1">$315</div>
                  <div className="text-sm text-gray-500 mb-4">per traveler</div>
                  <Button className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-full">Select</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="w-80">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
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
