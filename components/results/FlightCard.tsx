"use client"

import { cn, formatCurrencyIDR } from "@/lib/utils"
import type { Flight, CabinOffering, FareOption } from "@/lib/mockFlights"
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
  cabin?: string
}

export default function FlightCard({
  flight,
  offering,
  className,
  queryContext,
}: {
  flight: Flight
  offering: CabinOffering
  className?: string
  queryContext?: QueryContext
}) {
  const [open, setOpen] = useState(false)
  const [selectedFareCode, setSelectedFareCode] = useState<string>(offering.fareOptions[0]?.code || "")
  const [loadingFareCode, setLoadingFareCode] = useState<string | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [accordionHeight, setAccordionHeight] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const firstCode = offering.fareOptions[0]?.code || ""
    setSelectedFareCode(firstCode)
    setLoadingFareCode(null)
  }, [offering])

  const fareOptions = offering.fareOptions

  const minPrice = useMemo(() => Math.min(...fareOptions.map((fare) => fare.price)), [fareOptions])

  const selectedFare = useMemo<FareOption | undefined>(() => {
    return fareOptions.find((fare) => fare.code === selectedFareCode) || fareOptions[0]
  }, [fareOptions, selectedFareCode])

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
  }, [open, fareOptions])

  const renderFareIcon = (fare: string, regex: RegExp, Icon: React.ComponentType<{ className?: string }>) => {
    if (!regex.test(fare)) return null
    return (
      <span className="inline-flex items-center gap-1">
        <Icon className="w-4 h-4" />
        {fare}
      </span>
    )
  }

  const handleProceed = (fare: FareOption) => {
    setSelectedFareCode(fare.code)
    setLoadingFareCode(fare.code)

    const params = new URLSearchParams()
    params.set("flight", flight.id)
    params.set("airline", flight.airline)
    params.set("code", flight.code)
    params.set("cabin", offering.cabinClass.toLowerCase())
    params.set("fare", fare.code)
    params.set("fareName", fare.name)
    params.set("farePrice", String(fare.price))
    if (fare.description) params.set("fareDesc", fare.description)
    params.set("from", (queryContext?.from || flight.from) ?? "")
    params.set("to", (queryContext?.to || flight.to) ?? "")
    if (queryContext?.depart ?? flight.departDate) {
      params.set("depart", (queryContext?.depart || flight.departDate) as string)
    }
    if (queryContext?.returnDate) params.set("return", queryContext.returnDate)
    if (queryContext?.trip) params.set("trip", queryContext.trip)
    if (queryContext?.transport) params.set("transport", queryContext.transport)
    if (queryContext?.pax) params.set("pax", String(queryContext.pax))

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
            <h3 className="text-lg font-semibold text-gray-900">
              {flight.airline} • {flight.code}
            </h3>
            <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium">
              {offering.cabinClass}
            </span>
            {flight.badges?.map((badge) => (
              <span key={badge} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                {badge}
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
            {renderFareIcon(flight.fareSummary, /(Meal|Snack)/i, Utensils)}
            {renderFareIcon(flight.fareSummary, /(Bagasi|20kg|30kg)/i, LuggageIcon)}
            {renderFareIcon(flight.fareSummary, /(Hand|kabin)/i, BriefcaseBusiness)}
            {renderFareIcon(flight.fareSummary, /(Wi.?Fi|Wifi)/i, Wifi)}
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
            <Info className="w-4 h-4 text-primary" /> Pilih paket tarif {offering.cabinClass.toLowerCase()}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {fareOptions.map((fare) => {
              const active = selectedFareCode === fare.code
              return (
                <div
                  key={fare.code}
                  className={cn(
                    "flex flex-col justify-between rounded-2xl border bg-white shadow-sm transition-all",
                    active ? "border-primary shadow-md" : "border-transparent hover:border-primary/50 hover:shadow-md"
                  )}
                >
                  <div className="p-4 space-y-3">
                    <div className="text-xs uppercase tracking-wide text-primary">
                      {offering.cabinClass} | {fare.name}
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900">
                        {formatCurrencyIDR(fare.price)}
                        <span className="text-sm font-normal text-gray-500"> /org</span>
                      </div>
                      {fare.description && <div className="text-xs text-gray-500">{fare.description}</div>}
                    </div>
                    <div className="space-y-2 text-sm text-gray-700">
                      {fare.perks.map((perk) => (
                        <div key={perk} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary" />
                          <span>{perk}</span>
                        </div>
                      ))}
                      {typeof fare.rescheduleFee === "number" && (
                        <div className="flex items-start gap-2">
                          <RefreshCcw className="w-4 h-4 mt-0.5 text-primary" />
                          <span>
                            Biaya reschedule {fare.rescheduleFee === 0 ? "gratis" : formatCurrencyIDR(fare.rescheduleFee)}
                          </span>
                        </div>
                      )}
                      {typeof fare.refundableUpTo === "number" && (
                        <div className="flex items-start gap-2">
                          <RotateCcw className="w-4 h-4 mt-0.5 text-primary" />
                          <span>Refund hingga {fare.refundableUpTo}%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 bg-gray-50 p-4 flex items-center justify-center">
                    <SpinnerButton
                      type="button"
                      loading={loadingFareCode === fare.code}
                      className={cn(
                        "min-w-[10rem] text-sm px-4 py-2 rounded-full font-semibold bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                      )}
                      onClick={() => handleProceed(fare)}
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

