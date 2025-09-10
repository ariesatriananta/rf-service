type TripType = "round" | "oneway" | "multicity"
type TransportType = "pesawat" | "bus" | "kapal"

export default function QuerySummary({
  from,
  to,
  pax,
  trip,
  depart,
  ret,
  transport,
}: {
  from?: string
  to?: string
  pax: number
  trip: TripType
  depart?: string
  ret?: string
  transport: TransportType
}) {
  const formatDate = (v?: string) =>
    v ? new Date(v).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "—"

  const Pill = ({ children }: { children: React.ReactNode }) => (
    <span className="px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-900 border border-gray-200">
      {children}
    </span>
  )

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Pill>
        {from} → {to}
      </Pill>
      <Pill>Berangkat: {formatDate(depart)}</Pill>
      {trip === "round" && <Pill>Pulang: {formatDate(ret)}</Pill>}
      <Pill>
        {pax} {pax > 1 ? "penumpang" : "penumpang"}
      </Pill>
      <span className="px-3 py-1.5 rounded-full text-sm bg-black text-white border border-black">
        {trip === "round" ? "Pulang‑pergi" : "Sekali jalan"}
      </span>
      <span className="px-3 py-1.5 rounded-full text-sm bg-gray-900 text-white border border-gray-900 capitalize">
        {transport}
      </span>
    </div>
  )
}
