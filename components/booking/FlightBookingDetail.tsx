"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import AppHeader from "@/components/layout/AppHeader"
import { Button } from "@/components/ui/button"
import { getMockFlights, FlightClassOption } from "@/lib/mockFlights"
import { ArrowLeft, Plane, Clock, Users, Check } from "lucide-react"
import { cn, formatCurrencyIDR, formatDateID } from "@/lib/utils"
import DatePicker from "@/components/search/DatePicker"

type BookingPageProps = {
  searchParams: Record<string, string | string[] | undefined>
}

const ensureString = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) return value[0]
  return value
}

type ContactForm = {
  firstMiddle: string
  lastName: string
  email: string
  phone: string
}

type PassengerForm = {
  title: string
  firstMiddle: string
  lastName: string
  birthDate: string
  nationality: string
  idNumber: string
}

const buildPassengers = (count: number): PassengerForm[] =>
  Array.from({ length: count }, (_, idx) => ({
    title: idx === 0 ? "Tuan" : "Nyonya",
    firstMiddle: "",
    lastName: "",
    birthDate: "",
    nationality: "",
    idNumber: "",
  }))

const NATIONALITIES = [
  "Indonesia",
  "Singapura",
  "Malaysia",
  "Australia",
  "Amerika Serikat",
  "Inggris",
  "Jepang",
  "Korea Selatan",
]

export default function FlightBookingDetail({ searchParams }: BookingPageProps) {
  const router = useRouter()
  const flightId = ensureString(searchParams.flight)
  const classType = ensureString(searchParams.class)
  const paxCount = Math.max(1, Number(ensureString(searchParams.pax) || 1))

  const flights = useMemo(() => getMockFlights(), [])
  const flight = useMemo(() => flights.find((f) => f.id === flightId), [flights, flightId])
  const classOption = useMemo<FlightClassOption | undefined>(
    () => flight?.classes?.find((c) => c.type === classType) || flight?.classes?.[0],
    [flight, classType]
  )

  const [contact, setContact] = useState<ContactForm>({ firstMiddle: "", lastName: "", email: "", phone: "" })
  const [passengers, setPassengers] = useState(() => buildPassengers(paxCount))
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setPassengers(buildPassengers(paxCount))
  }, [paxCount])

  const pricePerPax = Number(ensureString(searchParams.classPrice) || classOption?.price || flight?.price || 0)
  const totalPrice = pricePerPax * paxCount

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const resetForm = () => {
    setContact({ firstMiddle: "", lastName: "", email: "", phone: "" })
    setPassengers(buildPassengers(paxCount))
    setSubmitted(false)
  }

  if (!flight) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader title="" />
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Penerbangan tidak ditemukan</h1>
          <p className="text-gray-600 mb-6">Silakan kembali ke halaman hasil pencarian dan pilih penerbangan lainnya.</p>
          <Button onClick={() => router.push("/flight")}>Kembali ke pencarian</Button>
        </div>
      </div>
    )
  }

  const departDate = ensureString(searchParams.depart) || flight.departDate
  const returnDate = ensureString(searchParams.return)

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>

        <BookingProgress currentStep="details" />

        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Detail Penerbangan & Booking</h1>
          <p className="text-gray-500">Lengkapi data pemesan dan penumpang untuk melanjutkan pemesanan.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr] items-start">
          <form onSubmit={onSubmit} className="space-y-6">
            <section className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Pemesan</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contact-first">
                    Nama depan & tengah (jika ada)
                  </label>
                  <input
                    id="contact-first"
                    type="text"
                    required
                    value={contact.firstMiddle}
                    onChange={(e) => setContact((prev) => ({ ...prev, firstMiddle: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    placeholder="Nama depan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contact-last">
                    Nama belakang/keluarga
                  </label>
                  <input
                    id="contact-last"
                    type="text"
                    required
                    value={contact.lastName}
                    onChange={(e) => setContact((prev) => ({ ...prev, lastName: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    placeholder="Nama keluarga"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contact-email">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={contact.email}
                    onChange={(e) => setContact((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    placeholder="contoh@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contact-phone">
                    Nomor Telepon
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    required
                    value={contact.phone}
                    onChange={(e) => setContact((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
              </div>
            </section>

            <section className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Data Penumpang</h2>
                <span className="text-sm text-gray-500 inline-flex items-center gap-2">
                  <Users className="w-4 h-4" /> {paxCount} penumpang
                </span>
              </div>
              <div className="space-y-6">
                {passengers.map((p, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-900">Penumpang {idx + 1}</h3>
                      <span className="text-xs text-gray-500">Dewasa</span>
                    </div>
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-[120px_minmax(0,1fr)_minmax(0,1fr)]">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
                          <select
                            value={p.title}
                            onChange={(e) =>
                              setPassengers((prev) => {
                                const next = [...prev]
                                next[idx] = { ...next[idx], title: e.target.value }
                                return next
                              })
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                          >
                            <option value="Tuan">Tuan</option>
                            <option value="Nyonya">Nyonya</option>
                            <option value="Nona">Nona</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nama depan & tengah (jika ada)</label>
                          <input
                            type="text"
                            value={p.firstMiddle}
                            onChange={(e) =>
                              setPassengers((prev) => {
                                const next = [...prev]
                                next[idx] = { ...next[idx], firstMiddle: e.target.value }
                                return next
                              })
                            }
                            required
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                            placeholder="Nama depan"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nama belakang/keluarga</label>
                          <input
                            type="text"
                            value={p.lastName}
                            onChange={(e) =>
                              setPassengers((prev) => {
                                const next = [...prev]
                                next[idx] = { ...next[idx], lastName: e.target.value }
                                return next
                              })
                            }
                            required
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                            placeholder="Nama keluarga"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                          <DatePicker
                            label="Tanggal lahir"
                            value={p.birthDate || undefined}
                            onChange={(val) =>
                              setPassengers((prev) => {
                                const next = [...prev]
                                next[idx] = { ...next[idx], birthDate: val || "" }
                                return next
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Kewarganegaraan</label>
                          <select
                            value={p.nationality}
                            onChange={(e) =>
                              setPassengers((prev) => {
                                const next = [...prev]
                                next[idx] = { ...next[idx], nationality: e.target.value }
                                return next
                              })
                            }
                            required
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                          >
                            <option value="">Pilih kewarganegaraan</option>
                            {NATIONALITIES.map((nation) => (
                              <option key={nation} value={nation}>
                                {nation}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="lg:col-span-1 sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">No. Identitas / Paspor</label>
                          <input
                            type="text"
                            value={p.idNumber}
                            onChange={(e) =>
                              setPassengers((prev) => {
                                const next = [...prev]
                                next[idx] = { ...next[idx], idNumber: e.target.value }
                                return next
                              })
                            }
                            required
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                            placeholder="Masukkan nomor identitas"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Catatan Tambahan</h2>
              <textarea
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                placeholder="Tambahkan permintaan khusus (opsional)"
              />
            </section>

            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" className="px-6 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90">
                Lanjutkan Pembayaran
              </Button>
              <button type="button" onClick={resetForm} className="text-sm text-gray-600 hover:text-gray-900">
                Reset form
              </button>
              {submitted && <span className="text-sm text-primary">Data tersimpan! Lanjutkan ke pembayaran.</span>}
            </div>
          </form>

          <aside className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm">
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
                        {ensureString(searchParams.from) || flight.from} 
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-right-icon lucide-move-right mx-1"><path d="M18 8L22 12L18 16"/><path d="M2 12H22"/></svg>
                        {ensureString(searchParams.to) || flight.to}</div>
                    <div className="text-base font-semibold text-gray-900">{flight.airline}</div>
                    <div className="text-xs text-gray-500">{flight.code}</div>
                  </div>
                </div>
                <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <div>
                      <div className="text-gray-500 text-xs uppercase">Berangkat</div>
                      <div className="font-semibold text-gray-900">{flight.departTime}</div>
                      <div className="text-xs text-gray-500">{ensureString(searchParams.from) || flight.from}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-500 text-xs uppercase">Tiba</div>
                      <div className="font-semibold text-gray-900">{flight.arriveTime}</div>
                      <div className="text-xs text-gray-500">{ensureString(searchParams.to) || flight.to}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                    <Clock className="w-3 h-3" /> Durasi {flight.duration} • {flight.stops === 0 ? "Langsung" : "Transit"}
                  </div>
                </div>
                <div className="rounded-lg border border-gray-100 bg-white/60 p-3 space-y-2 text-sm">
                  <SummaryRow label="Kelas Kabin" value={classOption?.type || "-"} />
                  <SummaryRow label="Paket" value={classOption?.fare || "-"} />
                  <SummaryRow label="Tanggal Berangkat" value={formatDateID(departDate)} />
                  <SummaryRow label="Tanggal Kembali" value={returnDate ? formatDateID(returnDate) : "-"} />
                  <SummaryRow label="Penumpang" value={`${paxCount} orang`} />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Rincian Harga</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Harga per penumpang</span>
                  <span className="font-medium text-gray-900">{formatCurrencyIDR(pricePerPax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Jumlah penumpang</span>
                  <span className="font-medium text-gray-900">{paxCount}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-semibold text-gray-900">
                  <span>Total</span>
                  <span>{formatCurrencyIDR(totalPrice)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

type BookingProgressProps = {
  currentStep: "details" | "payment"
}

const STEPS: { key: BookingProgressProps["currentStep"]; label: string }[] = [
  { key: "details", label: "Detail Penerbangan" },
  { key: "payment", label: "Pembayaran" },
]

function BookingProgress({ currentStep }: BookingProgressProps) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setAnimate(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  const currentIndex = useMemo(
    () => Math.max(0, STEPS.findIndex((step) => step.key === currentStep)),
    [currentStep]
  )
  const progress = useMemo(() => {
    if (STEPS.length <= 1) return 100
    return (currentIndex / (STEPS.length - 1)) * 100
  }, [currentIndex])

  return (
    <div className="relative mb-8">
      <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 bg-gray-200">
        <div
          className="h-1 bg-primary transition-all duration-700 ease-out"
          style={{ width: animate ? `${progress}%` : 0 }}
        />
      </div>
      <div className="relative flex justify-between">
        {STEPS.map((step, index) => {
          const state = index < currentIndex ? "done" : index === currentIndex ? "current" : "upcoming"
          return (
            <div key={step.key} className="flex flex-col items-center gap-2 text-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition-all duration-500",
                  state === "done" && "bg-primary text-primary-foreground border-primary",
                  state === "current" && "bg-primary text-primary-foreground border-primary shadow-lg scale-105",
                  state === "upcoming" && "bg-white text-gray-500 border-gray-300"
                )}
              >
                {state === "done" ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span
                className={cn(
                  "text-xs font-medium uppercase tracking-wide transition-colors duration-300",
                  state !== "upcoming" ? "text-primary" : "text-gray-500"
                )}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-gray-500 text-xs uppercase tracking-wide">{label}</span>
      <span className="text-gray-900 text-sm font-medium text-right">{value}</span>
    </div>
  )
}


