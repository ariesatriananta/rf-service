import type { ReactNode } from "react"
import { formatDateID } from "@/lib/utils"

type TripType = "round" | "oneway" | "multicity"
type TransportType = "pesawat" | "bus" | "kapal"

type Props = {
  from?: string
  to?: string
  pax: number
  trip: TripType
  depart?: string
  ret?: string
  transport: TransportType
}

const formatDate = (value?: string) => formatDateID(value) ?? "-"

const Pill = ({ children }: { children: ReactNode }) => (
  <span className="px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-900 border border-gray-200">
    {children}
  </span>
)

export default function QuerySummary({ from, to, pax, trip, depart, ret, transport }: Props) {
  const tripLabel = trip === "round" ? "Pulang-pergi" : trip === "oneway" ? "Sekali jalan" : "Multi-kota"

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Pill>
        {from} ? {to}
      </Pill>
      <Pill>Berangkat: {formatDate(depart)}</Pill>
      {trip === "round" && <Pill>Pulang: {formatDate(ret)}</Pill>}
      <Pill>
        {pax} {pax > 1 ? "penumpang" : "penumpang"}
      </Pill>
      <span className="px-3 py-1.5 rounded-full text-sm bg-black text-white border border-black">
        {tripLabel}
      </span>
      <span className="px-3 py-1.5 rounded-full text-sm bg-gray-900 text-white border border-gray-900 capitalize">
        {transport}
      </span>
    </div>
  )
}


