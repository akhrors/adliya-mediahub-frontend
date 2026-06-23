'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Users, Mic2, Calendar, FileText,
  BarChart2, Image, BookOpen, LogOut, MonitorPlay, Newspaper,
  ChevronRight
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { clsx } from 'clsx'

const navGroups = [
  {
    label: 'Asosiy',
    items: [
      { href: '/dashboard',      label: 'Bosh sahifa',        icon: LayoutDashboard },
    ]
  },
  {
    label: 'OAV & Tadbirlar',
    items: [
      { href: '/media-requests', label: "OAV So'rovlari",     icon: Mic2 },
      { href: '/events',         label: 'Tadbirlar',           icon: Calendar },
      { href: '/coverage',       label: 'Faoliyatni yoritish', icon: Newspaper },
      { href: '/monitoring',     label: 'Monitoring',          icon: MonitorPlay },
    ]
  },
  {
    label: 'Kontent',
    items: [
      { href: '/media-bank',     label: 'Media-bank',         icon: Image },
      { href: '/calendar',       label: 'Kontent kalendar',   icon: BookOpen },
    ]
  },
  {
    label: 'Tahlil',
    items: [
      { href: '/ratings',        label: 'Reyting',            icon: BarChart2 },
      { href: '/reports',        label: 'Hisobotlar',         icon: FileText },
    ]
  },
  {
    label: 'Boshqaruv',
    items: [
      { href: '/users',          label: 'Foydalanuvchilar',   icon: Users },
    ]
  },
]

function getInitials(name?: string) {
  if (!name) return 'U'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <aside className="w-64 min-h-screen flex flex-col" style={{ background: '#0f2444' }}>
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
            <span className="text-white">A</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-sm leading-tight">Adliya MediaHub</h1>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(148,163,184,0.8)' }}>Axborot platformasi</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            {getInitials(user?.fish)}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.fish || '—'}</p>
            <p className="text-xs truncate" style={{ color: 'rgba(148,163,184,0.75)' }}>{user?.roleDisplayName}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1 text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'rgba(100,116,139,0.8)' }}>
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(href + '/')
                return (
                  <Link
                    key={href}
                    href={href}
                    className={clsx(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group',
                      active
                        ? 'text-white font-medium'
                        : 'hover:bg-white/5'
                    )}
                    style={active ? { background: 'rgba(59,130,246,0.18)' } : undefined}
                  >
                    <Icon size={16} className={clsx(
                      'flex-shrink-0 transition-colors',
                      active ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'
                    )} />
                    <span className={clsx(
                      'flex-1 transition-colors',
                      active ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    )}>{label}</span>
                    {active && <ChevronRight size={14} className="text-blue-400 opacity-60" />}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group"
          style={{ color: 'rgba(148,163,184,0.75)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.12)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <LogOut size={16} className="text-slate-500 group-hover:text-red-400 transition-colors" />
          <span className="text-sm group-hover:text-red-400 transition-colors">Chiqish</span>
        </button>
      </div>
    </aside>
  )
}
