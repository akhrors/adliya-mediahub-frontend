'use client'
import { Bell, Search } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { notificationsApi } from '@/lib/api'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

const pageNames: Record<string, { name: string; desc: string }> = {
  '/dashboard':      { name: 'Bosh sahifa',          desc: 'Umumiy ko\'rsatkichlar' },
  '/media-requests': { name: "OAV So'rovlari",        desc: 'Media so\'rovlarni boshqarish' },
  '/events':         { name: 'Tadbirlar',              desc: 'Tadbirlar reyestri' },
  '/coverage':       { name: 'Faoliyatni yoritish',   desc: 'Material kiritish va tasdiqlash' },
  '/monitoring':     { name: 'Monitoring',             desc: 'Tanqidiy materiallar kuzatuvi' },
  '/media-bank':     { name: 'Media-bank',             desc: 'Fayl ombori' },
  '/calendar':       { name: 'Kontent Kalendar',       desc: 'Rejalashtirilgan kontentlar' },
  '/ratings':        { name: 'Reyting',                desc: 'Faoliyat baholash tizimi' },
  '/reports':        { name: 'Hisobotlar',             desc: 'Hisobot generatsiyasi' },
  '/users':          { name: 'Foydalanuvchilar',       desc: 'Foydalanuvchilarni boshqarish' },
}

function getInitials(name?: string) {
  if (!name) return 'U'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function Topbar() {
  const pathname = usePathname()
  const user = useAuthStore((s) => s.user)
  const pageKey = Object.keys(pageNames).find((k) => pathname.startsWith(k)) || '/dashboard'
  const page = pageNames[pageKey]

  const { data } = useQuery({
    queryKey: ['notifications-unread'],
    queryFn: () => notificationsApi.getAll(),
    refetchInterval: 30000,
  })

  const unreadCount = data?.data?.data?.filter((n: any) => !n.isRead).length || 0

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0">
      {/* Page title */}
      <div>
        <h2 className="font-bold text-gray-900 text-base leading-tight">{page?.name}</h2>
        <p className="text-xs text-gray-400 mt-0.5">{page?.desc}</p>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Qidirish..."
            className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition w-52"
          />
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 transition">
          <Bell size={16} className="text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1 font-medium">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            {getInitials(user?.fish)}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-800 leading-tight">{user?.fish || '—'}</p>
            <p className="text-xs text-gray-400 leading-tight">{user?.tashkilotNomi}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
