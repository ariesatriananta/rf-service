import { Mail, Phone } from 'lucide-react'

export default function SupportCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Butuh Bantuan?</h3>
      <p className="text-sm text-gray-600 mb-3">
        Jika mengalami kendala pembayaran atau belum menerima email konfirmasi,
        tim kami siap membantu. Hubungi kami melalui kontak berikut:
      </p>
      <div className="space-y-2 text-sm">
        <a href="mailto:contact@redfeng.co" className="inline-flex items-center gap-2 text-primary hover:underline">
          <Mail className="w-4 h-4" /> contact@redfeng.co
        </a><br></br>
        <a href="tel:+6285821931344" className="block inline-flex items-center gap-2 text-primary hover:underline">
          <Phone className="w-4 h-4" /> +62 858-2193-1344
        </a>
      </div>
      <p className="text-xs text-gray-500 mt-3">
        Cantumkan nomor pesanan Anda (jika ada) untuk mempercepat proses bantuan.
      </p>
    </div>
  )
}

