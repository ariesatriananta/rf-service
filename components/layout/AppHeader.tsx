"use client"
import Image from "next/image"
import Link from "next/link"
import { User, LogOut, Settings as SettingsIcon } from "lucide-react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function AppHeader({
  title,
  userName = "User",
  onSignOut,
}: {
  title?: string
  userName?: string
  onSignOut?: () => void
}) {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  return (
    <header
      className={
        (scrolled
          ? "bg-white/60 backdrop-blur-md shadow-sm"
          : "bg-white border-b border-gray-200") +
        " sticky top-0 z-50 transition-colors"
      }
    >
      <div className={"max-w-7xl mx-auto px-3"}>
        <div className={"flex items-center justify-between min-h-[60px] py-1 gap-3"}>
        <div className="flex items-center gap-3">
          <Link href="/" className="relative h-12 w-[200px] flex items-center">
            <Image src="/logo-red-feng.png" alt="Red Feng" fill className="object-contain" sizes="200px" priority />
          </Link>
          {title ? (
            <span className="text-lg font-semibold text-gray-900">{title}</span>
          ) : null}
        </div>

        {/* Center nav (dummy links) */}
        <nav className="hidden md:flex items-center gap-6">
          {[
            "Promo",
            "Pesanan",
            "Jadi Agen",
            "Bantuan",
            "Language",
          ].map((item) => (
            <span
              key={item}
              className="text-sm font-medium text-gray-700 hover:text-gray-900 cursor-default select-none"
              aria-disabled="true"
            >
              {item}
            </span>
          ))}
        </nav>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 hover:bg-gray-50 border border-transparent hover:border-gray-200 transition">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700">
                <User className="w-5 h-5" />
              </span>
              <span className="hidden sm:block text-sm font-medium text-gray-900">{userName}</span>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end" sideOffset={8} className="z-50 min-w-44 rounded-md border bg-white p-1 shadow-lg">
            <DropdownMenu.Label className="px-2 py-1.5 text-xs text-gray-500">Signed in as</DropdownMenu.Label>
            <div className="px-2 pb-1 text-sm font-medium text-gray-900">{userName}</div>
            <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
            <DropdownMenu.Item
              className="px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none cursor-pointer hover:bg-gray-50 inline-flex items-center gap-2"
              onSelect={(e) => {
                e.preventDefault()
                router.push("/profile")
              }}
            >
              <User className="w-4 h-4" /> Profile
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none cursor-pointer hover:bg-gray-50 inline-flex items-center gap-2"
              onSelect={(e) => {
                e.preventDefault()
                router.push("/settings")
              }}
            >
              <SettingsIcon className="w-4 h-4" /> Settings
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
            <DropdownMenu.Item
              className="px-2 py-1.5 text-sm text-red-600 rounded-md outline-none cursor-pointer hover:bg-red-50 inline-flex items-center gap-2"
              onSelect={(e) => {
                e.preventDefault()
                if (onSignOut) onSignOut()
                else router.push("/login")
              }}
            >
              <LogOut className="w-4 h-4" /> Sign out
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
        </div>
      </div>
    </header>
  )
}
