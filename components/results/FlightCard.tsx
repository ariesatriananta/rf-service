import { cn } from "@/lib/utils"
import { Ticket, Utensils, Briefcase, BriefcaseBusiness, Wifi, BriefcaseConveyorBelt, BriefcaseConveyorBeltIcon, BriefcaseIcon, LuggageIcon, Clock } from "lucide-react"

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
  logo?: string
}

export default function FlightCard({ flight, className }: { flight: Flight; className?: string }) {
  return (
    <div className={cn("bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm", className)}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        {flight.logo ? (
          <div className="w-full sm:w-40 h-36 sm:h-28 rounded-lg bg-white border border-gray-100 flex items-center justify-center">
            <img src={flight.logo} alt={`${flight.airline} logo`} className="h-10 w-auto object-contain" />
          </div>
        ) : flight.image ? (
          <img src={flight.image} alt={`${flight.airline} preview`} className="w-full sm:w-40 h-36 sm:h-28 rounded-lg object-cover" />
        ) : (
          <div className="w-full sm:w-40 h-36 sm:h-28 rounded-lg bg-gray-100" />
        )}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {flight.airline} • {flight.code}
            </h3>
            {flight.badges?.map((b) => (
              <span key={b} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                {b}
              </span>
            ))}
          </div>
          <div className="text-gray-600 text-sm mb-1">
            {flight.from} {flight.departTime} – {flight.to} {flight.arriveTime}
            &nbsp; • &nbsp;
            <span className="inline-flex items-center gap-1.5 text-slate-600">
               <Clock className="w-3 h-3 relative top-[0px]" strokeWidth={1.75} />{flight.duration}
            </span>
            &nbsp; • &nbsp;
            {flight.stops === 0 ? "Langsung" : "Transit"}
          </div>
          <div className="text-gray-500 text-sm inline-flex items-center gap-3 flex-wrap">

            {/* Extra icons inferred from fare */}
            {/(Meal|Snack)/i.test(flight.fare) && (
              <span className="inline-flex items-center gap-1"><Utensils className="w-4 h-4" />{flight.fare}</span>
            )}
            {/(Bagasi|20kg|bag)/i.test(flight.fare) && (
              <span className="inline-flex items-center gap-1"><LuggageIcon className="w-4 h-4" />{flight.fare}</span>
            )}
            {/(Hand)/i.test(flight.fare) && (
              <span className="inline-flex items-center gap-1"><BriefcaseBusiness className="w-4 h-4" />{flight.fare}</span>
            )}
            {/(Wi.?‑?Fi|Wifi)/i.test(flight.fare) && (
              <span className="inline-flex items-center gap-1"><Wifi className="w-4 h-4" />{flight.fare}</span>
            )}

          </div>
        </div>
        <div className="sm:text-right mt-4 sm:mt-0 w-full sm:w-auto">
          <div className="text-lg font-bold text-[#d6190d]">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(flight.price)}</div>
          <div className="text-sm text-gray-500 mb-4">per pax</div>
          <button className="bg-primary text-sm hover:bg-primary/90 text-primary-foreground px-6 py-1 rounded-sm w-full sm:w-auto">Pilih</button>
        </div>
      </div>
    </div>
  )
}
