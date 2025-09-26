"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/layout/AppHeader'
import BookingProgress from '@/components/booking/BookingProgress'
import FlightSummaryCard from '@/components/booking/FlightSummaryCard'
import PriceDetailsCard from '@/components/booking/PriceDetailsCard'
import PassengerDetailsCard from '@/components/payment/PassengerDetailsCard'
import { Button } from '@/components/ui/button'
import { ensureString, type PassengerForm } from '@/lib/booking'
import { getMockFlights, type CabinOffering, type FareOption } from '@/lib/mockFlights'
import { formatCurrencyIDR } from '@/lib/utils'
// no countdown here; countdown lives in confirm page

function Collapsible({ open, children }: { open: boolean; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [h, setH] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setH(open ? el.scrollHeight : 0)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [open])
  return (
    <div style={{ height: h }} className='overflow-hidden transition-[height] duration-300 ease-out'>
      <div ref={ref}>{children}</div>
    </div>
  )
}

function LogoImg({ png, svg, alt, className }: { png: string; svg: string; alt: string; className?: string }) {
  const [src, setSrc] = useState(png)
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => {
        if (src !== svg) setSrc(svg)
      }}
    />
  )
}

type PageProps = {
  searchParams: Record<string, string | string[] | undefined>
}

export default function PaymentPage({ searchParams }: PageProps) {
  const router = useRouter()
  const flightId = ensureString(searchParams.flight)
  const cabinParam = (ensureString(searchParams.cabin) || 'economy').toLowerCase()
  const fareCode = ensureString(searchParams.fare)

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

  const paxCount = Math.max(1, Number(ensureString(searchParams.pax) || 1))
  const pricePerPax = fareOption?.price ?? 0
  const totalPrice = pricePerPax * paxCount

  const [passengers, setPassengers] = useState<PassengerForm[]>([])
  const [method, setMethod] = useState<'va' | 'transfer' | 'minimarket'>('va')
  const [vaBank, setVaBank] = useState<'BCA' | 'BRI' | 'BNI' | 'MANDIRI'>('BCA')
  const [minimarket, setMinimarket] = useState<'Alfamart/Alfamidi' | 'Indomaret'>('Alfamart/Alfamidi')
  // modal removed; direct navigate to confirm page
  const bookingCtxRef = useRef<{ contact?: any; passengers?: PassengerForm[] } | null>(null)

  useEffect(() => {
    try {
      const s = sessionStorage.getItem('rf_booking')
      if (s) {
        const data = JSON.parse(s)
        bookingCtxRef.current = data
        if (Array.isArray(data?.passengers)) setPassengers(data.passengers)
      } else {
        // No booking context → redirect back to booking
        const qs = typeof window !== 'undefined' ? window.location.search : ''
        router.replace(`/flight/booking${qs || ''}`)
      }
    } catch {}
  }, [router])

  // Note: insert order is moved to confirmation page to avoid early creation

  if (!flight || !offering || !fareOption) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <AppHeader title='' />
        <div className='max-w-4xl mx-auto px-6 py-20 text-center text-gray-700'>
          Data pembayaran tidak lengkap. Silakan kembali ke halaman sebelumnya.
        </div>
      </div>
    )
  }

  const primaryLabel = (() => {
    if (method === 'va') return `Bayar Dengan VA ${vaBank}`
    if (method === 'transfer') return 'Bayar Dengan Transfer Bank'
    return `Bayar di Minimarket ${minimarket.includes('Indomaret') ? 'Indomaret' : 'Alfa'}`
  })()

  // Bank logos (placeholder SVGs). Falls back to code badge if missing.
  const bankLogos: Record<string, { png: string; svg: string }> = {
    BCA: { png: '/banks/bca.png', svg: '/banks/bca.svg' },
    BRI: { png: '/banks/bri.png', svg: '/banks/bri.svg' },
    BNI: { png: '/banks/bni.png', svg: '/banks/bni.svg' },
    MANDIRI: { png: '/banks/mandiri.png', svg: '/banks/mandiri.svg' },
  }

  const minimarketLogos: Record<string, { png: string; svg: string }> = {
    'Alfamart/Alfamidi': { png: '/minimarkets/alfa.png', svg: '/minimarkets/alfa.svg' },
    'Indomaret': { png: '/minimarkets/indomaret.png', svg: '/minimarkets/indomaret.svg' },
  }

  // note: countdown & expiry handling moved to confirm page

  return (
    <div className='min-h-screen bg-gray-50'>
      <AppHeader title='' />
      <main className='max-w-7xl mx-auto px-4 sm:px-6 py-6'>
        <BookingProgress currentStep='payment' />

        {/* Info banner removed; confirmation page handles countdown */}

        <div className='grid gap-6 lg:grid-cols-[2fr_1fr] items-start'>
          <section className='space-y-4'>
            <div className='bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>Mau bayar pakai metode apa?</h2>

              <div className='space-y-3'>
                <div className='border border-gray-200 rounded-xl overflow-hidden'>
                  <button type='button' className='w-full flex items-center justify-between px-4 py-3 font-medium' onClick={() => setMethod('va')}>
                    <span>Virtual Account</span>
                    <span className='inline-flex items-center gap-2 opacity-90'>
                      <LogoImg png={bankLogos['BCA'].png} svg={bankLogos['BCA'].svg} alt='BCA' className='h-5 w-auto' />
                      <LogoImg png={bankLogos['BRI'].png} svg={bankLogos['BRI'].svg} alt='BRI' className='h-5 w-auto' />
                      <LogoImg png={bankLogos['BNI'].png} svg={bankLogos['BNI'].svg} alt='BNI' className='h-5 w-auto' />
                      <LogoImg png={bankLogos['MANDIRI'].png} svg={bankLogos['MANDIRI'].svg} alt='MANDIRI' className='h-5 w-auto' />
                    </span>
                  </button>
                  <Collapsible open={method === 'va'}>
                    <div className='px-2 pb-3'>
                      {(['BCA','BRI','BNI','MANDIRI'] as const).map((bank) => (
                        <label key={bank} className='flex items-center justify-between gap-2 p-3 rounded-lg hover:bg-gray-50'>
                          <span className='inline-flex items-center gap-3'>
                            <input type='radio' name='vaBank' checked={vaBank===bank} onChange={() => setVaBank(bank)} />
                            <span className='text-sm'>{bank} Virtual Account</span>
                          </span>
                          <LogoImg png={bankLogos[bank].png} svg={bankLogos[bank].svg} alt={`${bank} logo`} className='h-5 w-auto opacity-90' />
                        </label>
                      ))}
                    </div>
                  </Collapsible>
                </div>

                <div className='border border-gray-200 rounded-xl overflow-hidden'>
                  <button type='button' className='w-full flex items-center justify-between px-4 py-3 font-medium' onClick={() => setMethod('transfer')}>
                    <span>Transfer Bank</span>
                    <LogoImg png={'/banks/atm-bersama.png'} svg={'/banks/atm-bersama.svg'} alt='ATM Bersama' className='h-5 w-auto opacity-90' />
                  </button>
                  <Collapsible open={method === 'transfer'}>
                    <div className='px-4 pb-4 text-sm text-gray-700 space-y-2'>
                      <div className='rounded-md bg-amber-50 border border-amber-200 p-3'>
                        <ul className='list-disc pl-5 space-y-1'>
                          <li>Pembayaran harus sesuai dengan nominal harga total agar dapat di verifikasi lebih cepat</li>
                          <li>Ada biaya admin Rp. 2.500 - Rp. 6.500</li>
                          <li>Tidak melayani pembayaran melalui RTGS & SKN (tidak dapat di proses)</li>
                        </ul>
                      </div>
                      <div className='flex items-center gap-3 pt-1'>
                        <LogoImg png={'/banks/atm-bersama.png'} svg={'/banks/atm-bersama.svg'} alt='ATM Bersama' className='h-6 w-auto opacity-90' />
                      </div>
                    </div>
                  </Collapsible>
                </div>

                <div className='border border-gray-200 rounded-xl overflow-hidden'>
                  <button type='button' className='w-full flex items-center justify-between px-4 py-3 font-medium' onClick={() => setMethod('minimarket')}>
                    <span>Minimarket</span>
                    <span className='inline-flex items-center gap-2 opacity-90'>
                      <LogoImg png={minimarketLogos['Alfamart/Alfamidi'].png} svg={minimarketLogos['Alfamart/Alfamidi'].svg} alt='Alfamart/Alfamidi' className='h-5 w-auto' />
                      <LogoImg png={minimarketLogos['Indomaret'].png} svg={minimarketLogos['Indomaret'].svg} alt='Indomaret' className='h-5 w-auto' />
                    </span>
                  </button>
                  <Collapsible open={method === 'minimarket'}>
                    <div className='px-2 pb-4'>
                      {(['Alfamart/Alfamidi','Indomaret'] as const).map((m) => (
                        <label key={m} className='flex items-center justify-between gap-2 p-3 rounded-lg hover:bg-gray-50'>
                          <span className='inline-flex items-center gap-3'>
                            <input type='radio' name='mart' checked={minimarket===m} onChange={() => setMinimarket(m)} />
                            <span className='text-sm'>{m}</span>
                          </span>
                          <LogoImg png={minimarketLogos[m].png} svg={minimarketLogos[m].svg} alt={`${m} logo`} className='h-5 w-auto opacity-90' />
                        </label>
                      ))}
                    </div>
                  </Collapsible>
                </div>
              </div>
            </div>

            <div className='bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm flex items-center justify-between'>
              <div className='text-gray-700'>Harga Total</div>
              <div className='text-lg font-semibold text-gray-900'>{formatCurrencyIDR(totalPrice)}</div>
            </div>

            <div>
              <Button
                className='w-full px-6 py-3 text-base'
                onClick={() => {
                  try {
                    const qs = typeof window !== 'undefined' ? window.location.search : ''
                    const usp = new URLSearchParams(qs)
                    usp.set('method', method)
                    usp.set('channel', method === 'va' ? vaBank : method === 'minimarket' ? minimarket : 'ATM BERSAMA')
                    router.push(`/flight/payment/confirm?${usp.toString()}`)
                  } catch {
                    router.push('/flight/payment/confirm')
                  }
                }}
              >
                {primaryLabel}
              </Button>
            </div>
          </section>

          <aside className='space-y-4'>
            <FlightSummaryCard
              flight={flight}
              offering={offering}
              fareOption={fareOption}
              fromLabel={ensureString(searchParams.from) || flight.from}
              toLabel={ensureString(searchParams.to) || flight.to}
              departDate={ensureString(searchParams.depart) || flight.departDate}
              returnDate={ensureString(searchParams.return)}
              paxCount={paxCount}
            />
            <PriceDetailsCard pricePerPax={pricePerPax} paxCount={paxCount} totalPrice={totalPrice} />
            <PassengerDetailsCard passengers={passengers} />
          </aside>
        </div>

        {/* Modal removed; flow navigates to confirmation page */}
      </main>
    </div>
  )
}
