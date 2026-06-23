'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Users, Mic2, Calendar, FileText,
  BarChart2, Image, BookOpen, Bell, LogOut, MonitorPlay, Newspaper
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { clsx } from 'clsx'

const navItems = [
  { href: '/dashboard',      label: 'Bosh sahifa',          icon: LayoutDashboard },
  { href: '/media-requests', label: 'OAV So\'rovlari',       icon: Mic2 },
  { href: '/events',         label: 'Tadbirlar',             icon: Calendar },
  { href: '/coverage',       label: 'Faoliyatni yoritish',   icon: Newspaper },
  { href: '/monitoring',     label: 'Monitoring',            icon: MonitorPlay },
  { href: '/media-bank',     label: 'Media-bank',            icon: Image },
  { href: '/calendar',       label: 'Kontent kalendar',      icon: BookOpen },
  { href: '/ratings',        label: 'Reyting',               icon: BarChart2 },
  { href: '/reports',        label: 'Hisobotlar',            icon: FileText },
  { href: '/users',          label: 'Foydalanuvchilar',      icon: Users },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <aside className="w-64 min-h-screen bg-[#1E3A5F] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#2D5286]">
        <h1 className="text-white font-bold text-lg leading-tight">Adliya MediaHub</h1>
        <p className="text-blue-200 text-xs mt-1">Axborot-tahliliy platforma</p>
      </div>

      {/* User info */}
      <div className="px-4 py-3 border-b border-[#2D5286]">
        <p className="text-white text-sm font-medium truncate">{user?.fish}</p>
        <p className="text-blue-300 text-xs truncate">{user?.roleDisplayName}</p>
        <p className="text-blue-400 text-xs truncate">{user?.tashkilotNomi}</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition',
              pathname === href || pathname.startsWith(href + '/')
                ? 'bg-[#D4A017] text-white font-medium'
                : 'text-blue-100 hover:bg-[#2D5286] hover:text-white'
            )}
          >
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[#2D5286]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-blue-100 hover:bg-red-600 hover:text-white rounded-lg transition text-sm"
        >
          <LogOut size={18} />
          <span>Chiqish</span>
        </button>
      </div>
    </aside>
  )
}
