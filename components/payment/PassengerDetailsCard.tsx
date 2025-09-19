import type { PassengerForm } from "@/lib/booking"

export default function PassengerDetailsCard({ passengers }: { passengers: PassengerForm[] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Detail Penumpang</h3>
      {passengers?.length ? (
        <ul className="space-y-2 text-sm text-gray-700">
          {passengers.map((p, idx) => (
            <li key={idx} className="flex justify-between">
              <span>
                {p.title === 'Nyonya' ? 'Ny.' : p.title === 'Nona' ? 'Nn.' : 'Tn.'} {p.firstMiddle} {p.lastName}
              </span>
              <span className="text-gray-500">Dewasa</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-500">Data penumpang tidak tersedia.</div>
      )}
    </div>
  )
}

