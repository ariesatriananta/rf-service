"use client"

export default function NotesSection({ className }: { className?: string }) {
  return (
    <section className={`bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm ${className ?? ''}`}>
      <h2 className='text-lg font-semibold text-gray-900 mb-3'>Catatan Tambahan</h2>
      <textarea
        rows={4}
        className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none'
        placeholder='Tambahkan permintaan khusus (opsional)'
      />
    </section>
  )
}

