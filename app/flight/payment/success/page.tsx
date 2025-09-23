"use client"

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import AppHeader from '@/components/layout/AppHeader'
import { CheckCircle2 } from 'lucide-react'
import SupportCard from '@/components/payment/SupportCard'

export default function PaymentSuccessPage() {
  const params = useSearchParams()
  const router = useRouter()
  const kode = params.get('kode')
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    try {
      const s = sessionStorage.getItem('rf_booking')
      if (s) {
        const data = JSON.parse(s)
        if (data?.contact?.email) setEmail(String(data.contact.email))
      }
    } catch {}
  }, [])
  return (
    <div className='min-h-screen bg-gray-50'>
      <AppHeader title='' />
      <main className='max-w-3xl mx-auto px-6 py-16'>
        <div className='text-center'>
          <div className='mx-auto mb-4 inline-flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700 w-20 h-20'>
            <CheckCircle2 className='w-12 h-12' />
          </div>
          <h1 className='text-2xl font-semibold text-gray-900 mb-2'>Pembayaran Berhasil</h1>
          <p className='text-gray-600 mb-3'>Terima kasih! Pesanan Anda sedang diproses.</p>
          {kode && (
            <div className='mb-6 text-sm text-gray-700'>
              No. Pesanan: <span className='font-medium'>{kode}</span>
            </div>
          )}
          <div className='relative inline-block mb-8'>
            <div className='absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-300/40 to-sky-300/40 blur' />
            <div className='relative bg-white border border-emerald-200/70 rounded-2xl px-5 py-4 text-gray-800 text-sm shadow-sm'>
              <div className='font-medium mb-1'>Invoice & E‑Ticket Segera Dikirim</div>
              <div className='text-gray-600'>
                Kami akan mengirimkan invoice dan e‑ticket ke email Anda
                {email ? (
                  <> <span className='font-medium text-gray-900'>({email})</span>. </>
                ) : (
                  <>. </>
                )}
                Mohon cek berkala, termasuk folder spam/promosi.
              </div>
            </div>
          </div>
          <div className='flex items-center justify-center gap-3'>
            <button
              className='px-5 py-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90'
              onClick={() => router.push('/')}
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>

        <div className='mt-10'>
          <SupportCard />
        </div>
      </main>
    </div>
  )
}
