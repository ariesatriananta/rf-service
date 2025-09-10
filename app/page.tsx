import Link from "next/link"
import { Button } from "@/components/ui/button"
import AppHeader from "@/components/layout/AppHeader"
import SearchForm from "@/components/search/SearchForm"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Home",
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <AppHeader />

      {/* Hero with background image */}
      <section
        className="relative border-b"
        style={{
          backgroundImage: "url(/images/hero-flight-1.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
          <div className="min-h-[420px] flex items-center justify-center">
            <div className="max-w-7xl w-full text-center bg-white/40 rounded-xl p-6 sm:p-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
                Temukan Tiket Terbaik untuk Perjalananmu
              </h1>
              <p className="mt-4 text-gray-900 text-base sm:text-lg">
                Satu tempat untuk membandingkan penerbangan, bus, dan kapal. Hemat waktu, hemat biaya, tanpa ribet.
              </p>

              <div className="mt-6 flex items-center justify-center gap-3">
                <Link href="/flight">
                  <Button className="bg-black hover:bg-gray-800 text-white rounded-full px-6">Mulai Booking</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Floating SearchForm overlapping hero & highlights */}
        <div className="hidden lg:block absolute -bottom-24 left-0 right-0">
          <div className="max-w-7xl mx-auto px-6 flex justify-center">
            <div className="w-full max-w-7xl drop-shadow-2xl">
              <SearchForm inline={false} />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Search (non-floating) */}
      <div className="lg:hidden -mt-6 px-6">
        <div className="max-w-7xl mx-auto">
          <SearchForm inline={false} />
        </div>
      </div>

      {/* Highlights (add top padding to clear floating form) */}
      <section className="max-w-7xl mx-auto px-6 pt-40 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[{
            title: "Bandingkan Sekejap",
            desc: "Harga real‑time dari ratusan maskapai & operator",
          },{
            title: "Harga Transparan",
            desc: "Tanpa biaya tersembunyi, apa yang kamu lihat itu yang dibayar",
          },{
            title: "Bayar Sesukamu",
            desc: "VA, kartu kredit, e‑wallet, cicilan",
          },{
            title: "Bantuan 24/7",
            desc: "Tim support siap bantu kapan saja",
          }].map((f) => (
            <div key={f.title} className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="text-lg font-semibold text-gray-900">{f.title}</div>
              <div className="mt-1 text-gray-600 text-sm">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular routes */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Rute Populer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {["Jakarta – Bali", "Jakarta – Singapore", "Surabaya – Jakarta", "Medan – Jakarta", "Jakarta – Yogyakarta", "Bali – Labuan Bajo"].map((r) => (
            <Link key={r} href="/flight" className="group rounded-xl border border-gray-200 bg-white p-4 hover:shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-900 font-medium">{r}</span>
                <span className="text-sm text-gray-500 group-hover:text-gray-700">Cek tiket →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Partners */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Partner Kami</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-4">
              <img src="/placeholder-logo.png" alt="Partner logo" className="h-10 w-auto opacity-80" />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Apa kata mereka</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Nadia",
              text: "Checkout cepat, harga bersaing. Sudah jadi andalan tiap dinas!",
            },
            {
              name: "Rizky",
              text: "Suka banget fitur bandingkan rutenya. Hemat waktu banget.",
            },
            {
              name: "Ayu",
              text: "Support responsif. Perubahan jadwal diurus sampai tuntas.",
            },
          ].map((t) => (
            <div key={t.name} className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex items-center gap-3 mb-3">
                <img src="/placeholder-user.jpg" alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                <div className="font-medium text-gray-900">{t.name}</div>
              </div>
              <p className="text-gray-700">{t.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
