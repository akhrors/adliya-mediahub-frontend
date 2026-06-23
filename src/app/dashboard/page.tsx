'use client'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/api'
import { Mic2, Calendar, Newspaper, MonitorPlay, BarChart2, AlertTriangle } from 'lucide-react'

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value ?? '—'}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={22} className="text-white" />
        </div>
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
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-5 h-24 animate-pulse bg-gray-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard title="Bugungi tadbirlar" value={stats?.todayEvents} icon={Calendar} color="bg-blue-500" />
            <StatCard title="Haftalik OAV chiqishlari" value={stats?.weeklyRequests} icon={Mic2} color="bg-green-500" />
            <StatCard title="Tasdiqlashda materiallar" value={stats?.pendingMaterials} icon={Newspaper} color="bg-yellow-500" />
            <StatCard title="Tanqidiy materiallar" value={stats?.criticalItems} icon={MonitorPlay} color="bg-red-500" />
            <StatCard title="Muddati o'tganlar" value={stats?.overdue} icon={AlertTriangle} color="bg-orange-500" />
            <StatCard title="Jami reyting ballari" value={stats?.totalRatingScore} icon={BarChart2} color="bg-purple-500" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Eng faol hududlar TOP-10</h3>
            {stats?.topRegions?.length ? (
              <ol className="space-y-2">
                {stats.topRegions.map((r: any, i: number) => (
                  <li key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600"><span className="font-bold text-[#1E3A5F] mr-2">{i + 1}.</span>{r.name}</span>
                    <span className="font-semibold text-[#D4A017]">{r.score} ball</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-gray-400 text-sm">Ma'lumot yo'q</p>
            )}
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Eng faol ekspertlar</h3>
            {stats?.topExperts?.length ? (
              <ol className="space-y-2">
                {stats.topExperts.map((e: any, i: number) => (
                  <li key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600"><span className="font-bold text-[#1E3A5F] mr-2">{i + 1}.</span>{e.fish}</span>
                    <span className="font-semibold text-green-600">{e.count} chiqish</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-gray-400 text-sm">Ma'lumot yo'q</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
