"use client"

import { cn, formatCurrencyIDR } from "@/lib/utils"
import type { Flight, FlightClassOption } from "@/lib/mockFlights"
import {
  Utensils,
  BriefcaseBusiness,
  Wifi,
  LuggageIcon,
  Clock,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
  RefreshCcw,
  RotateCcw,
} from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { SpinnerButton } from "@/components/ui/spinner-button"

type QueryContext = {
  from?: string
  to?: string
  depart?: string
  returnDate?: string
  pax?: number
  trip?: string
  transport?: string
}

export default function FlightCard({
  flight,
  className,
  queryContext,
}: {
  flight: Flight
  className?: string
  queryContext?: QueryContext
}) {
  const [open, setOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState<string>(flight.classes?.[0]?.type || "Economy")
  const contentRef = useRef<HTMLDivElement>(null)
  const [accordionHeight, setAccordionHeight] = useState(0)
  const router = useRouter()
  const [loadingClass, setLoadingClass] = useState<string | null>(null)

  const classOptions = useMemo<FlightClassOption[]>(() => {
    if (flight.classes && flight.classes.length > 0) return flight.classes
    return [
      {
        type: "Economy",
        price: flight.price,
        fare: flight.fare,
        subtitle: "Standar",
        perks: [
          "Bagasi kabin 7 kg",
          "Bagasi 20 kg",
          "Kursi standar (jarak 29 inci)",
          "Tata kursi 3-3",
        ],
        rescheduleFee: 485200,
        refundableUpTo: 50,
      },
      {
        type: "Bisnis",
        price: Math.round(flight.price * 1.6),
        fare: "Meal - Bagasi 30kg",
        subtitle: "Premium",
        perks: [
          "Bagasi kabin 10 kg",
          "Bagasi 30 kg",
          "Kursi prioritas recliner",
          "Lounge akses",
          "Makanan hangat",
        ],
        rescheduleFee: 325000,
        refundableUpTo: 75,
      },
    ]
  }, [flight.classes, flight.fare, flight.price])

  const minPrice = useMemo(() => Math.min(...classOptions.map((c) => c.price)), [classOptions])

  useEffect(() => {
    const el = contentRef.current
    if (!open || !el) {
      setAccordionHeight(0)
      return
    }

    const updateHeight = () => setAccordionHeight(el.scrollHeight + 24)
    updateHeight()

    let observer: ResizeObserver | undefined
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(updateHeight)
      observer.observe(el)
    }

    return () => observer?.disconnect()
  }, [open, classOptions])

  const renderFareIcon = (fare: string, regex: RegExp, Icon: React.ComponentType<{ className?: string }>) => {
    if (!regex.test(fare)) return null
    return (
      <span className="inline-flex items-center gap-1">
        <Icon className="w-4 h-4" />
        {fare}
      </span>
    )
  }

  const handleProceed = (option: FlightClassOption) => {
    setSelectedClass(option.type)
    setLoadingClass(option.type)
    const params = new URLSearchParams()
    params.set("flight", flight.id)
    params.set("airline", flight.airline)
    params.set("code", flight.code)
    params.set("class", option.type)
    params.set("classPrice", String(option.price))
    if (option.fare) params.set("classFare", option.fare)
    if (option.subtitle) params.set("classLabel", option.subtitle)
    params.set("from", (queryContext?.from || flight.from) ?? "")
    params.set("to", (queryContext?.to || flight.to) ?? "")
    if (queryContext?.depart ?? flight.departDate) {
      params.set("depart", (queryContext?.depart || flight.departDate) as string)
    }
    if (queryContext?.returnDate) params.set("return", queryContext.returnDate)
    if (queryContext?.trip) params.set("trip", queryContext.trip)
    if (queryContext?.transport) params.set("transport", queryContext.transport)
    params.set("departTime", flight.departTime)
    params.set("arriveTime", flight.arriveTime)
    params.set("duration", flight.duration)
    params.set("stops", String(flight.stops))
    params.set("pax", String(queryContext?.pax || 1))

    setTimeout(() => {
      router.push(`/flight/booking?${params.toString()}`)
    }, 500)
  }

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
            <h3 className="flex text-lg font-semibold text-gray-900">
                {flight.airline}
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dot-icon lucide-dot"><circle cx="12.1" cy="12.1" r="1"/></svg>
                {flight.code}
            </h3>
            {flight.badges?.map((b) => (
              <span key={b} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                {b}
              </span>
            ))}
          </div>

          <div className="mb-2">
            <div className="grid grid-cols-[6rem_1fr_6rem] items-center gap-3 sm:gap-6">
              <div className="text-left">
                <div className="text-xl font-semibold text-gray-900 leading-tight">{flight.departTime}</div>
                <div className="text-xs uppercase tracking-wide text-gray-500">{flight.from}</div>
              </div>

              <div className="flex flex-col items-center">
                <div className="text-xs text-gray-600 mb-1 inline-flex items-center gap-1.5">
                  <Clock className="w-3 h-3" strokeWidth={1.75} />
                  {flight.duration}
                </div>
                <div className="w-full flex items-center">
                  <div className="h-[2px] bg-gray-300 flex-1 rounded" />
                  <div className="px-2 text-xs text-gray-600 whitespace-nowrap">
                    {flight.stops === 0 ? "Langsung" : "Transit"}
                  </div>
                  <div className="h-[2px] bg-gray-300 flex-1 rounded" />
                  <div className="w-0 h-0 border-t-[4px] border-b-[4px] border-l-[6px] border-t-transparent border-b-transparent border-l-gray-400 ml-1" />
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-semibold text-gray-900 leading-tight">{flight.arriveTime}</div>
                <div className="text-xs uppercase tracking-wide text-gray-500">{flight.to}</div>
              </div>
            </div>
          </div>

          <div className="text-gray-500 text-sm inline-flex items-center gap-3 flex-wrap">
            {renderFareIcon(flight.fare, /(Meal|Snack)/i, Utensils)}
            {renderFareIcon(flight.fare, /(Bagasi|20kg|bag)/i, LuggageIcon)}
            {renderFareIcon(flight.fare, /(Hand)/i, BriefcaseBusiness)}
            {renderFareIcon(flight.fare, /(Wi.?Fi|Wifi)/i, Wifi)}
          </div>
        </div>

        <div className="sm:text-right mt-4 sm:mt-0 w-full sm:w-auto">
          <div className="text-lg font-bold text-[#d6190d]">{formatCurrencyIDR(minPrice)}</div>
          <div className="text-sm text-gray-500 mb-4">per pax</div>
          <button
            onClick={() => setOpen((v) => !v)}
            className="bg-primary text-sm hover:bg-primary/90 text-primary-foreground px-6 py-1 rounded-sm w-full sm:w-auto inline-flex items-center gap-1 cursor-pointer"
            aria-expanded={open}
            aria-controls={`accordion-${flight.id}`}
            type="button"
          >
            Pilih {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div
        id={`accordion-${flight.id}`}
        className={cn(
          "transition-all duration-300 ease-in-out overflow-hidden",
          open ? "mt-4 border-t border-gray-200 pt-4" : "max-h-0"
        )}
        style={{ maxHeight: accordionHeight, opacity: open ? 1 : 0 }}
      >
        <div
          ref={contentRef}
          className="space-y-4"
          style={{ opacity: open ? 1 : 0, transition: "opacity 0.25s ease" }}
        >
          <div className="text-sm font-medium text-gray-800 flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" /> Pilih kelas kabin
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {classOptions.map((c) => {
              const active = selectedClass === c.type

              return (
                <div
                  key={c.type}
                  className={cn(
                    "flex flex-col justify-between rounded-2xl border bg-white shadow-sm transition-all",
                    active ? "border-primary shadow-md" : "border-transparent hover:border-primary/50 hover:shadow-md"
                  )}
                >
                  <div className="p-4 space-y-3">
                    <div className="text-xs uppercase tracking-wide text-primary">
                      {c.type}
                      {c.subtitle ? ` | ${c.subtitle}` : ""}
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900">
                        {formatCurrencyIDR(c.price)}
                        <span className="text-sm font-normal text-gray-500"> /org</span>
                      </div>
                      <div className="text-xs text-gray-500">Harga termasuk pajak</div>
                    </div>
                    {c.fare && <div className="text-sm text-gray-600">{c.fare}</div>}
                    <div className="space-y-2 text-sm text-gray-700">
                      {c.perks?.map((perk) => (
                        <div key={perk} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary" />
                          <span>{perk}</span>
                        </div>
                      ))}
                      {c.rescheduleFee && (
                        <div className="flex items-start gap-2">
                          <RefreshCcw className="w-4 h-4 mt-0.5 text-primary" />
                          <span>Biaya reschedule {formatCurrencyIDR(c.rescheduleFee)}</span>
                        </div>
                      )}
                      {typeof c.refundableUpTo === "number" && (
                        <div className="flex items-start gap-2">
                          <RotateCcw className="w-4 h-4 mt-0.5 text-primary" />
                          <span>Bisa direfund hingga {c.refundableUpTo}%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 bg-gray-50 p-4 flex items-center justify-center">
                    <SpinnerButton
                      type="button"
                      loading={loadingClass === c.type}
                      className="min-w-[10rem] text-sm px-4 py-2 rounded-full font-semibold bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                      onClick={() => handleProceed(c)}
                    >
                      Booking Sekarang
                    </SpinnerButton>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}



