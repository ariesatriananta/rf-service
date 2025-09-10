import { cn } from "@/lib/utils"

export type Flight = {
  id: string
  airline: string
  code: string
  from: string
  to: string
  departTime: string
  arriveTime: string
  duration: string
  stops: number
  price: number
  fare: string
  image?: string
  badges?: string[]
}

export default function FlightCard({ flight, className }: { flight: Flight; className?: string }) {
  return (
    <div className={cn("bg-white rounded-lg border border-gray-200 p-4 sm:p-6", className)}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        {flight.image ? (
          <img src={flight.image} alt={`${flight.airline} preview`} className="w-full sm:w-40 h-36 sm:h-28 rounded-lg object-cover" />
        ) : (
          <div className="w-full sm:w-40 h-36 sm:h-28 rounded-lg bg-gray-100" />
        )}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {flight.airline} · {flight.code}
            </h3>
            {flight.badges?.map((b) => (
              <span key={b} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                {b}
              </span>
            ))}
          </div>
          <div className="text-gray-600 mb-1">
            {flight.from} {flight.departTime} → {flight.to} {flight.arriveTime} · {flight.duration} · {flight.stops === 0 ? "Nonstop" : `${flight.stops} stops`}
          </div>
          <div className="text-gray-500 text-sm">{flight.fare}</div>
        </div>
        <div className="sm:text-right mt-4 sm:mt-0 w-full sm:w-auto">
          <div className="text-2xl font-bold text-gray-900 mb-1">${flight.price}</div>
          <div className="text-sm text-gray-500 mb-4">per traveler</div>
          <button className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-full w-full sm:w-auto">Select</button>
        </div>
      </div>
    </div>
  )
}

