"use client"

import { Users } from 'lucide-react'
import type { PassengerForm } from '@/lib/booking'
import PassengerFormCard from './PassengerFormCard'

export default function PassengersSection({
  passengers,
  nationalities,
  onChangePassenger,
  className,
}: {
  passengers: PassengerForm[]
  nationalities: string[]
  onChangePassenger: (index: number, patch: Partial<PassengerForm>) => void
  className?: string
}) {
  return (
    <section className={`bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm ${className ?? ''}`}>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-lg font-semibold text-gray-900'>Data Penumpang</h2>
        <span className='text-sm text-gray-500 inline-flex items-center gap-2'>
          <Users className='w-4 h-4' /> {passengers.length} penumpang
        </span>
      </div>
      <div className='space-y-6'>
        {passengers.map((p, idx) => (
          <PassengerFormCard
            key={idx}
            passenger={p}
            index={idx}
            nationalities={nationalities}
            onChange={(patch) => onChangePassenger(idx, patch)}
          />
        ))}
      </div>
    </section>
  )
}

