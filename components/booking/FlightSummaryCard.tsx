import type { Flight, CabinOffering, FareOption } from "@/lib/mockFlights"
import { Plane, Clock } from "lucide-react"
import { IconArrowRight } from "@/components/icons"
import { cn, formatDateID } from "@/lib/utils"

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-gray-500 text-xs uppercase tracking-wide">{label}</span>
      <span className="text-gray-900 text-sm font-medium text-right">{value}</span>
    </div>
  )
}

export default function FlightSummaryCard({
  flight,
  offering,
  fareOption,
  fromLabel,
  toLabel,
  departDate,
  returnDate,
  paxCount,
  className,
}: {
  flight: Flight
  offering: CabinOffering
  fareOption: FareOption
  fromLabel: string
  toLabel: string
  departDate: string
  returnDate?: string
  paxCount: number
  className?: string
}) {
  return (
    <div className={cn("bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm", className)}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Penerbangan</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          {flight.logo ? (
            <div className="w-12 h-12 rounded-xl border border-gray-200 bg-white flex items-center justify-center">
              <img src={flight.logo} alt={`${flight.airline} logo`} className="w-10 h-10 object-contain" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-xl border border-gray-200 bg-primary/10 flex items-center justify-center">
              <Plane className="w-5 h-5 text-primary" />
            </div>
          )}
          <div>
            <div className="flex text-sm text-gray-600">
              {fromLabel}
              <IconArrowRight aria-hidden size={20} />
              {toLabel}
            </div>
            <div className="text-base font-semibold text-gray-900">{flight.airline}</div>
            <div className="text-xs text-gray-500">{flight.code}</div>
          </div>
        </div>
        <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 text-sm text-gray-700">
          <div className="flex justify-between">
            <div>
              <div className="text-gray-500 text-xs uppercase">Berangkat</div>
              <div className="font-semibold text-gray-900">{flight.departTime}</div>
              <div className="text-xs text-gray-500">{fromLabel}</div>
            </div>
            <div className="text-right">
              <div className="text-gray-500 text-xs uppercase">Tiba</div>
              <div className="font-semibold text-gray-900">{flight.arriveTime}</div>
              <div className="text-xs text-gray-500">{toLabel}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
            <Clock className="w-3 h-3" /> Durasi {flight.duration} | {flight.stops === 0 ? "Langsung" : "Transit"}
          </div>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white/60 p-3 space-y-2 text-sm">
          <SummaryRow label="Kelas Kabin" value={offering.cabinClass} />
          <SummaryRow label="Paket" value={fareOption.name} />
          <SummaryRow label="Tanggal Berangkat" value={formatDateID(departDate)} />
          <SummaryRow label="Tanggal Kembali" value={returnDate ? formatDateID(returnDate) : "-"} />
          <SummaryRow label="Penumpang" value={`${paxCount} orang`} />
        </div>
      </div>
    </div>
  )
}
