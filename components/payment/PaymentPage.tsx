"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/layout/AppHeader'
import BookingProgress from '@/components/booking/BookingProgress'
import FlightSummaryCard from '@/components/booking/FlightSummaryCard'
import PriceDetailsCard from '@/components/booking/PriceDetailsCard'
import PassengerDetailsCard from '@/components/payment/PassengerDetailsCard'
import PaymentCountdown from '@/components/payment/PaymentCountdown'
import { Button } from '@/components/ui/button'
import { ensureString, type PassengerForm } from '@/lib/booking'
import { getMockFlights, type CabinOffering, type FareOption } from '@/lib/mockFlights'
import { formatCurrencyIDR } from '@/lib/utils'
import { Lock } from 'lucide-react'

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
  const [vaBank, setVaBank] = useState<'BCA' | 'BRI' | 'BNI'>('BCA')
  const [minimarket, setMinimarket] = useState<'Alfamart/Alfamidi' | 'Indomaret'>('Alfamart/Alfamidi')
  const [showModal, setShowModal] = useState(false)
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
  }

  const minimarketLogos: Record<string, { png: string; svg: string }> = {
    'Alfamart/Alfamidi': { png: '/minimarkets/alfa.png', svg: '/minimarkets/alfa.svg' },
    'Indomaret': { png: '/minimarkets/indomaret.png', svg: '/minimarkets/indomaret.svg' },
  }

  const handleExpire = () => {
    try {
      sessionStorage.setItem('rf_payment_expired', '1')
      sessionStorage.removeItem('rf_payment_exp')
      sessionStorage.removeItem('rf_booking')
    } catch {}
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <AppHeader title='' />
      <main className='max-w-7xl mx-auto px-4 sm:px-6 py-6'>
        <BookingProgress currentStep='payment' />

        <div className='mb-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sky-800 flex items-center justify-between'>
          <span>Tenang, harga tidak akan berubah. Yuk selesaikan pembayaran dalam <PaymentCountdown onExpire={handleExpire} />.</span>
          <span className='hidden sm:inline-flex items-center gap-1 text-xs rounded-full bg-emerald-100 text-emerald-700 px-2 py-1'>
            <Lock className='w-3 h-3' /> Pembayaran Aman
          </span>
        </div>

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
                    </span>
                  </button>
                  <Collapsible open={method === 'va'}>
                    <div className='px-2 pb-3'>
                      {(['BCA','BRI','BNI'] as const).map((bank) => (
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
                    // keep existing params (from,to,flight,cabin,fare,pax,depart,return,...)
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

        {showModal && (
          <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
            <div className='bg-white rounded-xl w-full max-w-lg p-6 space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900'>Konfirmasi</h3>
              <p className='text-gray-700'>Metode: {primaryLabel}. Berikut langkah pembayaran:</p>
              <div className='rounded-md bg-gray-50 border border-gray-200 p-3 text-sm text-gray-700'>
                {method === 'va' && (
                  <ol className='list-decimal pl-5 space-y-1'>
                    <li>Buka aplikasi/ATM bank {vaBank} Anda</li>
                    <li>Pilih menu Virtual Account</li>
                    <li>Masukkan nomor VA: <strong>{order?.payment_reference ?? `${vaBank === 'BCA' ? '3901' : vaBank === 'BRI' ? '77777' : '8808'}${String(flight.id).slice(-6)}`}</strong></li>
                    <li>Periksa nominal: <strong>{formatCurrencyIDR(totalPrice)}</strong> lalu konfirmasi</li>
                    <li>Selesaikan pembayaran</li>
                  </ol>
                )}
                {method === 'transfer' && (
                  <ol className='list-decimal pl-5 space-y-1'>
                    <li>Masuk ke aplikasi perbankan pilihan Anda</li>
                    <li>Lakukan transfer ke rekening perusahaan sesuai instruksi yang akan dikirimkan</li>
                    <li>Nominal harus tepat: <strong>{formatCurrencyIDR(totalPrice)}</strong></li>
                    <li>Unggah bukti transfer jika diminta</li>
                  </ol>
                )}
                {method === 'minimarket' && (
                  <ol className='list-decimal pl-5 space-y-1'>
                    <li>Kunjungi {minimarket}</li>
                    <li>Informasikan ingin pembayaran pesanan RedFeng</li>
                    <li>Tunjukkan kode bayar: <strong>{order?.payment_reference ?? `RF-${String(flight.id).slice(-4)}-${String(totalPrice).slice(0,3)}`}</strong></li>
                    <li>Bayar sebesar <strong>{formatCurrencyIDR(totalPrice)}</strong></li>
                  </ol>
                )}
              </div>
              <div className='flex justify-end gap-2'>
                <button className='px-4 py-2 text-sm text-gray-600' onClick={() => setShowModal(false)}>Tutup</button>
                <Button onClick={() => setShowModal(false)}>OK</Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
