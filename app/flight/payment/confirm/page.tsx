"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AppHeader from '@/components/layout/AppHeader'
import BookingProgress from '@/components/booking/BookingProgress'
import FlightSummaryCard from '@/components/booking/FlightSummaryCard'
import PriceDetailsCard from '@/components/booking/PriceDetailsCard'
import PassengerDetailsCard from '@/components/payment/PassengerDetailsCard'
import SupportCard from '@/components/payment/SupportCard'
import PaymentCountdown from '@/components/payment/PaymentCountdown'
import { Button } from '@/components/ui/button'
import { ensureString, type PassengerForm } from '@/lib/booking'
import { getMockFlights, type CabinOffering, type FareOption } from '@/lib/mockFlights'
import { formatCurrencyIDR } from '@/lib/utils'

const COUNTDOWN_KEY = 'rf_payment_exp'

export default function PaymentConfirmPage() {
  const router = useRouter()
  const params = useSearchParams()
  const flightId = ensureString(params.get('flight'))
  const cabinParam = (ensureString(params.get('cabin')) || 'economy').toLowerCase()
  const fareCode = ensureString(params.get('fare'))
  const paxCount = Math.max(1, Number(ensureString(params.get('pax')) || 1))
  const method = (ensureString(params.get('method')) as 'va' | 'transfer' | 'minimarket') || 'va'
  const channel = ensureString(params.get('channel')) || (method === 'va' ? 'BCA' : method === 'minimarket' ? 'Alfamart/Alfamidi' : 'ATM BERSAMA')

  const flights = useMemo(() => getMockFlights(), [])
  const flight = useMemo(() => flights.find((f) => f.id === flightId), [flights, flightId])
  const offering = useMemo<CabinOffering | undefined>(() => {
    if (!flight) return undefined
    return flight.offerings.find((it) => it.cabinClass.toLowerCase() === cabinParam) || flight.offerings[0]
  }, [flight, cabinParam])
  const fareOption = useMemo<FareOption | undefined>(() => {
    if (!offering) return undefined
    if (fareCode) {
      const m = offering.fareOptions.find((f) => f.code === fareCode)
      if (m) return m
    }
    return offering.fareOptions[0]
  }, [offering, fareCode])

  const pricePerPax = fareOption?.price ?? 0
  const totalPrice = pricePerPax * paxCount

  const [passengers, setPassengers] = useState<PassengerForm[]>([])
  const bookingCtxRef = useRef<{ contact?: any; passengers?: PassengerForm[] } | null>(null)
  const [order, setOrder] = useState<null | { orders_id: number; kode: string; payment_reference: string; payment_channel: string; payment_expires_at: string | Date; amount: number; payment_status: string; recipient_name?: string }>(null)

  useEffect(() => {
    try {
      const s = sessionStorage.getItem('rf_booking')
      if (s) {
        const data = JSON.parse(s)
        bookingCtxRef.current = data
        if (Array.isArray(data?.passengers)) setPassengers(data.passengers)
      }
    } catch {}
  }, [])

  // Init order on mount (idempotent)
  useEffect(() => {
    const ready = !!(flight && offering && fareOption)
    if (!ready || order) return
    const run = async () => {
      try {
        const res = await fetch('/api/orders/init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            flightId,
            fareCode: fareOption?.code,
            cabin: cabinParam,
            pax: paxCount,
            from: ensureString(params.get('from')) || flight?.from,
            to: ensureString(params.get('to')) || flight?.to,
            depart: ensureString(params.get('depart')) || flight?.departDate,
            returnDate: ensureString(params.get('return')) || undefined,
            method,
            channel,
            contact: bookingCtxRef.current?.contact || undefined,
            passengers: bookingCtxRef.current?.passengers || passengers,
          }),
        })
        if (!res.ok) return
        const data = await res.json()
        setOrder(data)
        try {
          const exp = new Date(data.payment_expires_at).getTime()
          sessionStorage.setItem(COUNTDOWN_KEY, String(exp))
        } catch {}
      } catch {}
    }
    run()
  }, [flight, offering, fareOption, passengers, paxCount, cabinParam, method, channel, params, flightId, fareCode, order])

  // Poll status every 3s and redirect on PAID
  useEffect(() => {
    if (!order?.orders_id) return
    const id = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${order.orders_id}`)
        if (!res.ok) return
        const data = await res.json()
        if (data.payment_status === 'PAID') {
          router.replace(`/flight/payment/success?kode=${encodeURIComponent(data.kode)}`)
        }
      } catch {}
    }, 3000)
    return () => clearInterval(id)
  }, [order?.orders_id, router])

  if (!flight || !offering || !fareOption) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <AppHeader title='' />
        <div className='max-w-4xl mx-auto px-6 py-20 text-center text-gray-700'>
          Data pembayaran tidak lengkap. Silakan kembali.
          <div className='mt-4'>
            <Button onClick={() => router.back()}>Kembali</Button>
          </div>
        </div>
      </div>
    )
  }

  const recipientName = order?.recipient_name || 'PT Jenovac Infinity Royal'

  return (
    <div className='min-h-screen bg-gray-50'>
      <AppHeader title='' />
      <main className='max-w-7xl mx-auto px-4 sm:px-6 py-6'>
        <BookingProgress currentStep='payment' />

        <div className='mb-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sky-800 flex items-center justify-between'>
          <span>Tenang, harga tidak akan berubah. Selesaikan pembayaran dalam <PaymentCountdown />.</span>
        </div>

        <div className='grid gap-6 lg:grid-cols-[2fr_1fr] items-start'>
          <section className='space-y-4'>
            <div className='bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>Mohon Transfer ke</h2>
              <div className='rounded-lg border border-gray-200'>
                <div className='px-4 py-3 border-b text-sm font-medium'>{order?.payment_channel || channel} Virtual Account</div>
                <div className='p-4 grid gap-3'>
                  <div className='grid grid-cols-[160px_1fr_auto] items-center gap-2'>
                    <div className='text-gray-600'>Nomor Rekening</div>
                    <div className='font-mono text-lg'>{order?.payment_reference || '—'}</div>
                    <button className='text-primary text-sm' onClick={() => { navigator.clipboard?.writeText(order?.payment_reference || '') }}>Salin</button>
                  </div>
                  <div className='grid grid-cols-[160px_1fr] items-center gap-2'>
                    <div className='text-gray-600'>Nama Penerima</div>
                    <div className='font-medium'>{recipientName}</div>
                  </div>
                  <div className='grid grid-cols-[160px_1fr_auto] items-center gap-2'>
                    <div className='text-gray-600'>Jumlah Transfer</div>
                    <div className='font-semibold'>{formatCurrencyIDR(order?.amount ?? totalPrice)}</div>
                    <button className='text-primary text-sm' onClick={() => { navigator.clipboard?.writeText(String(order?.amount ?? totalPrice)) }}>Salin</button>
                  </div>
                </div>
              </div>
            </div>

            <div className='bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm'>
              <h3 className='text-lg font-semibold mb-2'>Cara Membayar</h3>
              <ol className='list-decimal pl-5 space-y-1 text-sm text-gray-700'>
                <li>Buka aplikasi/ATM {order?.payment_channel || channel}</li>
                <li>Pilih menu Virtual Account</li>
                <li>Masukkan nomor VA: {order?.payment_reference || '—'}</li>
                <li>Periksa nominal: {formatCurrencyIDR(order?.amount ?? totalPrice)}</li>
                <li>Konfirmasi pembayaran</li>
              </ol>
            </div>

            {/* Support card moved under payment instructions */}
            <SupportCard />
          </section>

          <aside className='space-y-4'>
            <FlightSummaryCard
              flight={flight}
              offering={offering}
              fareOption={fareOption}
              fromLabel={ensureString(params.get('from')) || flight.from}
              toLabel={ensureString(params.get('to')) || flight.to}
              departDate={ensureString(params.get('depart')) || flight.departDate}
              returnDate={ensureString(params.get('return')) || undefined}
              paxCount={paxCount}
            />
            <PriceDetailsCard pricePerPax={pricePerPax} paxCount={paxCount} totalPrice={totalPrice} />
            <PassengerDetailsCard passengers={passengers} />
          </aside>
        </div>
      </main>
    </div>
  )
}
