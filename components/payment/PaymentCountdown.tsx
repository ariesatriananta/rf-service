"use client"

import { useEffect, useRef, useState } from "react"

const KEY = "rf_payment_exp"
const DURATION_MS = 30 * 60 * 1000

const pad = (n: number) => String(n).padStart(2, "0")

export default function PaymentCountdown({ onExpire }: { onExpire?: () => void }) {
  const [remaining, setRemaining] = useState<number>(DURATION_MS)
  const expiredRef = useRef(false)

  useEffect(() => {
    let exp = 0
    try {
      const s = sessionStorage.getItem(KEY)
      if (s) exp = Number(s)
    } catch {}
    if (!exp || exp < Date.now()) {
      exp = Date.now() + DURATION_MS
      try {
        sessionStorage.setItem(KEY, String(exp))
      } catch {}
    }

    const tick = () => {
      const ms = Math.max(0, exp - Date.now())
      setRemaining(ms)
      if (ms === 0 && !expiredRef.current) {
        expiredRef.current = true
        try {
          sessionStorage.removeItem(KEY)
        } catch {}
        onExpire?.()
      }
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const minutes = Math.floor(remaining / 60000)
  const seconds = Math.floor((remaining % 60000) / 1000)

  return (
    <span className="font-semibold text-[#0ea5e9] tabular-nums">
      {pad(minutes)}:{pad(seconds)}
    </span>
  )
}
