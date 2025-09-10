import AppHeader from "@/components/layout/AppHeader"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Settings" />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Halaman pengaturan (stub). Tambahkan form/opsi pengaturan di sini.</p>
      </main>
    </div>
  )
}
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Setting",
}
