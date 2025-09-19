"use client"

import type { ContactForm } from "@/lib/booking"

export default function ContactFormSection({
  value,
  onChange,
  className,
}: {
  value: ContactForm
  onChange: (patch: Partial<ContactForm>) => void
  className?: string
}) {
  return (
    <section className={`bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm ${className ?? ""}`}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Pemesan</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-gray-600">Nama depan & tengah (jika ada)</span>
          <input
            type="text"
            value={value.firstMiddle}
            onChange={(e) => onChange({ firstMiddle: e.target.value })}
            required
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            placeholder="Nama depan"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-gray-600">Nama belakang/keluarga</span>
          <input
            type="text"
            value={value.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
            required
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            placeholder="Nama keluarga"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-gray-600">Email</span>
          <input
            type="email"
            value={value.email}
            onChange={(e) => onChange({ email: e.target.value })}
            required
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            placeholder="contoh@email.com"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-gray-600">Nomor Telepon</span>
          <input
            type="tel"
            value={value.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            required
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            placeholder="08xxxxxxxxxx"
          />
        </label>
      </div>
    </section>
  )
}

