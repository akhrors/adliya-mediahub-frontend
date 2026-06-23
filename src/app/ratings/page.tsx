'use client'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ratingsApi } from '@/lib/api'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Pencil, Save, X, BarChart2, TrendingUp, TrendingDown } from 'lucide-react'

export default function RatingsPage() {
  const qc = useQueryClient()
  const [editId, setEditId] = useState<number|null>(null)
  const [editBall, setEditBall] = useState('')

  const { data, isLoading } = useQuery({ queryKey: ['rating-rules'], queryFn: () => ratingsApi.getRules() })
  const rules = data?.data?.data || []

  const updateMutation = useMutation({
    mutationFn: ({ id, ball }: any) => ratingsApi.updateRule(id, ball),
    onSuccess: () => { toast.success('Yangilandi'); qc.invalidateQueries({ queryKey: ['rating-rules'] }); setEditId(null) },
    onError: () => toast.error('Xatolik'),
  })

  const positive = rules.filter((r: any) => r.ball >= 0)
  const negative = rules.filter((r: any) => r.ball < 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Reyting Tizimi</h1>
          <p className="text-sm text-gray-500 mt-0.5">Faoliyat ko&apos;rsatkichlari uchun ball sozlamalari</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Jami ko&apos;rsatkichlar</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{rules.length}</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                <BarChart2 size={20} className="text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Musbat balllar</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">{positive.length}</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                <TrendingUp size={20} className="text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Manfiy balllar</p>
                <p className="text-3xl font-bold text-red-500 mt-1">{negative.length}</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
                <TrendingDown size={20} className="text-red-500" />
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="h-64 bg-white rounded-2xl animate-pulse border border-gray-100" />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50">
              <h3 className="font-semibold text-gray-900">Barcha ko&apos;rsatkichlar</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Ko&apos;rsatkich</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Ball</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Holat</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Amal</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule: any) => (
                  <tr key={rule.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-medium text-gray-900">{rule.korsatkich.replace(/_/g,' ')}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      {editId === rule.id ? (
                        <input type="number" value={editBall} onChange={e => setEditBall(e.target.value)}
                          className="w-24 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 text-sm font-bold ${rule.ball < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                            {rule.ball < 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                            {rule.ball > 0 ? '+' : ''}{rule.ball}
                          </span>
                          <div className={`h-1.5 w-12 rounded-full ${rule.ball < 0 ? 'bg-red-100' : 'bg-emerald-100'}`}>
                            <div className={`h-full rounded-full ${rule.ball < 0 ? 'bg-red-400' : 'bg-emerald-400'}`}
                              style={{ width: `${Math.min(100, Math.abs(rule.ball) * 5)}%` }} />
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${rule.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${rule.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                        {rule.isActive ? 'Faol' : 'Nofaol'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {editId === rule.id ? (
                        <div className="flex gap-1.5">
                          <button onClick={() => updateMutation.mutate({ id: rule.id, ball: +editBall })}
                            className="w-8 h-8 flex items-center justify-center text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition">
                            <Save size={14} />
                          </button>
                          <button onClick={() => setEditId(null)}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => { setEditId(rule.id); setEditBall(String(rule.ball)) }}
                          className="w-8 h-8 flex items-center justify-center text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition">
                          <Pencil size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
