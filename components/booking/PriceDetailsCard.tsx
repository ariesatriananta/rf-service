import { cn, formatCurrencyIDR } from "@/lib/utils"

export default function PriceDetailsCard({
  pricePerPax,
  paxCount,
  totalPrice,
  className,
}: {
  pricePerPax: number
  paxCount: number
  totalPrice: number
  className?: string
}) {
  return (
    <div className={cn("bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm", className)}>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Rincian Harga</h3>
      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex justify-between">
          <span>Harga per penumpang</span>
          <span className="font-medium text-gray-900">{formatCurrencyIDR(pricePerPax)}</span>
        </div>
        <div className="flex justify-between">
          <span>Jumlah penumpang</span>
          <span className="font-medium text-gray-900">{paxCount}</span>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-semibold text-gray-900">
          <span>Total</span>
          <span>{formatCurrencyIDR(totalPrice)}</span>
        </div>
      </div>
    </div>
  )
}
