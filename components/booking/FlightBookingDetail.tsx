'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/layout/AppHeader'
import { Button } from '@/components/ui/button'
import { getMockFlights, type CabinOffering, type FareOption } from '@/lib/mockFlights'
import { ArrowLeft } from 'lucide-react'
// no local utils needed here
import FlightSummaryCard from '@/components/booking/FlightSummaryCard'
import PriceDetailsCard from '@/components/booking/PriceDetailsCard'
import BookingProgress from '@/components/booking/BookingProgress'
import ContactFormSection from '@/components/booking/ContactFormSection'
import PassengersSection from '@/components/booking/PassengersSection'
import NotesSection from '@/components/booking/NotesSection'
import { buildPassengers, ensureString, type ContactForm, type PassengerForm, NATIONALITIES } from '@/lib/booking'

type BookingPageProps = {
  searchParams: Record<string, string | string[] | undefined>
}

export default function FlightBookingDetail({ searchParams }: BookingPageProps) {
  const router = useRouter()
  const flightId = ensureString(searchParams.flight)
  const cabinParam = (ensureString(searchParams.cabin) || 'economy').toLowerCase()
  const fareCode = ensureString(searchParams.fare)
  const paxCount = Math.max(1, Number(ensureString(searchParams.pax) || 1))

  const flights = useMemo(() => getMockFlights(), [])
  const flight = useMemo(() => flights.find((f) => f.id === flightId), [flights, flightId])
  const offering = useMemo<CabinOffering | undefined>(() => {
    if (!flight) return undefined
    return flight.offerings.find((item) => item.cabinClass.toLowerCase() === cabinParam) || flight.offerings[0]
  }, [flight, cabinParam])
  const fareOption = useMemo<FareOption | undefined>(() => {
    if (!offering) return undefined
    if (fareCode) {
      const match = offering.fareOptions.find((fare) => fare.code === fareCode)
      if (match) return match
    }
    return offering.fareOptions[0]
  }, [offering, fareCode])

  const [contact, setContact] = useState<ContactForm>({ firstMiddle: '', lastName: '', email: '', phone: '' })
  const [passengers, setPassengers] = useState<PassengerForm[]>(() => buildPassengers(paxCount))
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setPassengers(buildPassengers(paxCount))
  }, [paxCount])

  const pricePerPax = fareOption?.price ?? 0
  const totalPrice = pricePerPax * paxCount

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const resetForm = () => {
    setContact({ firstMiddle: '', lastName: '', email: '', phone: '' })
    setPassengers(buildPassengers(paxCount))
    setSubmitted(false)
  }

  if (!flight || !offering || !fareOption) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <AppHeader title='' />
        <div className='max-w-4xl mx-auto px-6 py-20 text-center'>
          <h1 className='text-2xl font-semibold text-gray-900 mb-4'>Penerbangan tidak ditemukan</h1>
          <p className='text-gray-600 mb-6'>Silakan kembali ke halaman hasil pencarian dan pilih penerbangan lainnya.</p>
          <Button onClick={() => router.push('/flight')}>Kembali ke pencarian</Button>
        </div>
      </div>
    )
  }

  const departDate = ensureString(searchParams.depart) || flight.departDate
  const returnDate = ensureString(searchParams.return)

  return (
    <div className='min-h-screen bg-gray-50'>
      <AppHeader title='' />
      <main className='max-w-7xl mx-auto px-4 sm:px-6 py-6'>
        <button
          type='button'
          onClick={() => router.back()}
          className='mb-4 inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80'
        >
          <ArrowLeft className='w-4 h-4' /> Kembali
        </button>

        <BookingProgress currentStep='details' />

        <div className='mb-6'>
          <h1 className='text-2xl font-semibold text-gray-900'>Detail Penerbangan & Booking</h1>
          <p className='text-gray-500'>Lengkapi data pemesan dan penumpang untuk melanjutkan pemesanan.</p>
        </div>

        <div className='grid gap-6 lg:grid-cols-[2fr_1fr] items-start'>
          <form onSubmit={onSubmit} className='space-y-6'>
            <ContactFormSection value={contact} onChange={(patch) => setContact((prev) => ({ ...prev, ...patch }))} />

            <PassengersSection
              passengers={passengers}
              nationalities={NATIONALITIES}
              onChangePassenger={(idx, patch) =>
                setPassengers((prev) => {
                  const next = [...prev]
                  next[idx] = { ...next[idx], ...patch }
                  return next
                })
              }
            />

            <NotesSection />

            <div className='flex flex-wrap items-center gap-3'>
              <Button type='submit' className='px-6 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90'>
                Lanjutkan Pembayaran
              </Button>
              <button type='button' onClick={resetForm} className='text-sm text-gray-600 hover:text-gray-900'>
                Reset form
              </button>
              {submitted && <span className='text-sm text-primary'>Data tersimpan! Lanjutkan ke pembayaran.</span>}
            </div>
          </form>

          <aside className='space-y-4'>
            <FlightSummaryCard
              flight={flight}
              offering={offering}
              fareOption={fareOption}
              fromLabel={ensureString(searchParams.from) || flight.from}
              toLabel={ensureString(searchParams.to) || flight.to}
              departDate={departDate as string}
              returnDate={returnDate as string | undefined}
              paxCount={paxCount}
            />
            <PriceDetailsCard
              pricePerPax={pricePerPax}
              paxCount={paxCount}
              totalPrice={totalPrice}
            />
          </aside>
        </div>
      </main>
    </div>
  )
}
