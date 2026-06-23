'use client'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ratingsApi } from '@/lib/api'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Pencil, Save, X } from 'lucide-react'

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

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <h1 className="text-xl font-bold text-gray-900">Reyting Tizimi</h1>
        <p className="text-gray-500 text-sm">Har bir faoliyat ko&apos;rsatkichi uchun ball sozlamalari. Faqat Super Admin o&apos;zgartira oladi.</p>

        {isLoading ? <div className="h-64 bg-white rounded-xl animate-pulse"/> : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ko&apos;rsatkich</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ball</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Holat</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rules.map((rule: any) => (
                  <tr key={rule.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium">{rule.korsatkich.replace(/_/g,' ')}</td>
                    <td className="px-5 py-3">
                      {editId === rule.id ? (
                        <input type="number" value={editBall} onChange={e => setEditBall(e.target.value)}
                          className="w-20 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"/>
                      ) : (
                        <span className={`font-bold text-lg ${rule.ball < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {rule.ball > 0 ? '+' : ''}{rule.ball}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${rule.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {rule.isActive ? 'Faol' : 'Nofaol'}
                      </span>
                    </td>
                    <td className="px-5 py-3 flex gap-2">
                      {editId === rule.id ? (
                        <>
                          <button onClick={() => updateMutation.mutate({ id: rule.id, ball: +editBall })}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"><Save size={14}/></button>
                          <button onClick={() => setEditId(null)} className="p-1 text-gray-500 hover:bg-gray-100 rounded"><X size={14}/></button>
                        </>
                      ) : (
                        <button onClick={() => { setEditId(rule.id); setEditBall(String(rule.ball)) }}
                          className="p-1 text-[#1E3A5F] hover:bg-blue-50 rounded"><Pencil size={14}/></button>
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
