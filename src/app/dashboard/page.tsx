'use client'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/api'
import { Mic2, Calendar, Newspaper, MonitorPlay, BarChart2, AlertTriangle, TrendingUp, Medal } from 'lucide-react'

const statConfig = [
  { key: 'todayEvents',       title: "Bugungi tadbirlar",        icon: Calendar,      gradient: 'from-blue-500 to-blue-600',    light: 'bg-blue-50 text-blue-600' },
  { key: 'weeklyRequests',    title: "Haftalik OAV chiqishlari", icon: Mic2,          gradient: 'from-emerald-500 to-emerald-600', light: 'bg-emerald-50 text-emerald-600' },
  { key: 'pendingMaterials',  title: "Tasdiqlashda materiallar", icon: Newspaper,     gradient: 'from-amber-500 to-amber-600',  light: 'bg-amber-50 text-amber-600' },
  { key: 'criticalItems',     title: "Tanqidiy materiallar",     icon: MonitorPlay,   gradient: 'from-red-500 to-red-600',      light: 'bg-red-50 text-red-600' },
  { key: 'overdue',           title: "Muddati o'tganlar",        icon: AlertTriangle, gradient: 'from-orange-500 to-orange-600', light: 'bg-orange-50 text-orange-600' },
  { key: 'totalRatingScore',  title: "Jami reyting ballari",     icon: BarChart2,     gradient: 'from-purple-500 to-purple-600', light: 'bg-purple-50 text-purple-600' },
]

const medalColors = ['text-yellow-500', 'text-slate-400', 'text-amber-600']

function StatCard({ title, value, icon: Icon, light, gradient }: any) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value ?? '—'}</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp size={12} className="text-emerald-500" />
            <span className="text-xs text-emerald-600 font-medium">Faol</span>
          </div>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradient}`}>
          <Icon size={22} className="text-white" />
        </div>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-3 w-28 bg-gray-200 rounded" />
          <div className="h-8 w-16 bg-gray-200 rounded" />
          <div className="h-3 w-12 bg-gray-200 rounded" />
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-xl" />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.getStats(),
  })
  const stats = data?.data?.data

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Platformaning umumiy holati</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading
            ? [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
            : statConfig.map(({ key, title, icon, gradient, light }) => (
                <StatCard key={key} title={title} value={stats?.[key]} icon={icon} gradient={gradient} light={light} />
              ))
          }
        </div>

        {/* Leaderboard rows */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Top regions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Eng faol hududlar</h3>
                <p className="text-xs text-gray-400 mt-0.5">TOP-10 reyting</p>
              </div>
              <BarChart2 size={18} className="text-gray-300" />
            </div>
            <div className="px-6 py-4">
              {stats?.topRegions?.length ? (
                <ol className="space-y-3">
                  {stats.topRegions.map((r: any, i: number) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className={`w-6 text-sm font-bold flex-shrink-0 ${medalColors[i] || 'text-gray-400'}`}>
                        {i < 3 ? <Medal size={16} /> : `${i + 1}.`}
                      </span>
                      <span className="flex-1 text-sm text-gray-700 truncate">{r.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
                            style={{ width: `${Math.min(100, (r.score / (stats.topRegions[0]?.score || 1)) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-amber-600 w-14 text-right">{r.score} ball</span>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="py-8 text-center">
                  <BarChart2 size={32} className="mx-auto mb-2 text-gray-200" />
                  <p className="text-sm text-gray-400">Ma'lumot yo'q</p>
                </div>
              )}
            </div>
          </div>

          {/* Top experts */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Eng faol ekspertlar</h3>
                <p className="text-xs text-gray-400 mt-0.5">Chiqishlar soni bo'yicha</p>
              </div>
              <Mic2 size={18} className="text-gray-300" />
            </div>
            <div className="px-6 py-4">
              {stats?.topExperts?.length ? (
                <ol className="space-y-3">
                  {stats.topExperts.map((e: any, i: number) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className={`w-6 text-sm font-bold flex-shrink-0 ${medalColors[i] || 'text-gray-400'}`}>
                        {i < 3 ? <Medal size={16} /> : `${i + 1}.`}
                      </span>
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-blue-600">{e.fish?.[0]}</span>
                      </div>
                      <span className="flex-1 text-sm text-gray-700 truncate">{e.fish}</span>
                      <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                        {e.count} chiqish
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="py-8 text-center">
                  <Mic2 size={32} className="mx-auto mb-2 text-gray-200" />
                  <p className="text-sm text-gray-400">Ma'lumot yo'q</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
