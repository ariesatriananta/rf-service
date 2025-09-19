"use client"

import DatePicker from "@/components/search/DatePicker"
import type { PassengerForm } from "@/lib/booking"

export default function PassengerFormCard({
  passenger,
  index,
  nationalities,
  onChange,
}: {
  passenger: PassengerForm
  index: number
  nationalities: string[]
  onChange: (patch: Partial<PassengerForm>) => void
}) {
  return (
    <div className='border border-gray-200 rounded-xl p-4'>
      <div className='flex items-center justify-between mb-3'>
        <h3 className='text-sm font-semibold text-gray-900'>Penumpang {index + 1}</h3>
        <span className='text-xs text-gray-500'>Dewasa</span>
      </div>
      <div className='space-y-4'>
        <div className='grid gap-4 sm:grid-cols-[minmax(0,10rem)_1fr_1fr]'>
          <label className='flex flex-col gap-1 text-sm'>
            <span className='text-gray-600'>Title</span>
            <select
              value={passenger.title}
              onChange={(e) => onChange({ title: e.target.value })}
              className='rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none'
            >
              <option value='Tuan'>Tuan</option>
              <option value='Nyonya'>Nyonya</option>
            </select>
          </label>
          <label className='flex flex-col gap-1 text-sm'>
            <span className='text-gray-600'>Nama depan & tengah</span>
            <input
              type='text'
              value={passenger.firstMiddle}
              onChange={(e) => onChange({ firstMiddle: e.target.value })}
              required
              className='rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none'
              placeholder='Nama depan'
            />
          </label>
          <label className='flex flex-col gap-1 text-sm'>
            <span className='text-gray-600'>Nama belakang</span>
            <input
              type='text'
              value={passenger.lastName}
              onChange={(e) => onChange({ lastName: e.target.value })}
              required
              className='rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none'
              placeholder='Nama keluarga'
            />
          </label>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          <DatePicker
            label='Tanggal lahir'
            value={passenger.birthDate || undefined}
            onChange={(val) => onChange({ birthDate: val || '' })}
          />
          <label className='flex flex-col gap-1 text-sm'>
            <span className='text-gray-600'>Kewarganegaraan</span>
            <select
              value={passenger.nationality}
              onChange={(e) => onChange({ nationality: e.target.value })}
              className='rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none'
            >
              {nationalities.map((nation) => (
                <option key={nation} value={nation}>
                  {nation}
                </option>
              ))}
            </select>
          </label>
          <label className='flex flex-col gap-1 text-sm lg:col-span-1 sm:col-span-2'>
            <span className='text-gray-600'>No. Identitas / Paspor</span>
            <input
              type='text'
              value={passenger.idNumber}
              onChange={(e) => onChange({ idNumber: e.target.value })}
              required
              className='rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none'
              placeholder='Masukkan nomor identitas'
            />
          </label>
        </div>
      </div>
    </div>
  )
}

