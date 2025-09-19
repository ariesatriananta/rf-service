"use client"

import { useEffect, useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export type BookingProgressProps = {
  currentStep: 'details' | 'payment'
}

const STEPS: { key: BookingProgressProps['currentStep']; label: string }[] = [
  { key: 'details', label: 'Detail Penerbangan' },
  { key: 'payment', label: 'Pembayaran' },
]

export default function BookingProgress({ currentStep }: BookingProgressProps) {
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
    <div className='relative mb-8'>
      <div className='absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 bg-gray-200'>
        <div
          className='h-1 bg-primary transition-all duration-700 ease-out'
          style={{ width: animate ? `${progress}%` : 0 }}
        />
      </div>
      <div className='relative flex justify-between'>
        {STEPS.map((step, index) => {
          const state = index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'upcoming'
          return (
            <div key={step.key} className='flex flex-col items-center gap-2 text-center'>
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition-all duration-500',
                  state === 'done' && 'bg-primary text-primary-foreground border-primary',
                  state === 'current' && 'bg-primary text-primary-foreground border-primary shadow-lg scale-105',
                  state === 'upcoming' && 'bg-white text-gray-500 border-gray-300'
                )}
              >
                {state === 'done' ? <Check className='w-4 h-4' /> : index + 1}
              </div>
              <span
                className={cn(
                  'text-xs font-medium uppercase tracking-wide transition-colors duration-300',
                  state !== 'upcoming' ? 'text-primary' : 'text-gray-500'
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

