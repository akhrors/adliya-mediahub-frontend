'use client'
import { Bell } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { notificationsApi } from '@/lib/api'
import { usePathname } from 'next/navigation'

const pageNames: Record<string, string> = {
  '/dashboard': 'Bosh sahifa',
  '/media-requests': "OAV So'rovlari",
  '/events': 'Tadbirlar',
  '/coverage': 'Faoliyatni yoritish',
  '/monitoring': 'Monitoring',
  '/media-bank': 'Media-bank',
  '/calendar': 'Kontent Kalendar',
  '/ratings': 'Reyting',
  '/reports': 'Hisobotlar',
  '/users': 'Foydalanuvchilar',
}

export default function Topbar() {
  const pathname = usePathname()
  const pageKey = Object.keys(pageNames).find((k) => pathname.startsWith(k)) || '/dashboard'

  const { data } = useQuery({
    queryKey: ['notifications-unread'],
    queryFn: () => notificationsApi.getAll(),
    refetchInterval: 30000,
  })

  const unreadCount = data?.data?.data?.filter((n: any) => !n.isRead).length || 0

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h2 className="font-semibold text-gray-800">{pageNames[pageKey]}</h2>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-500 hover:text-gray-700">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
