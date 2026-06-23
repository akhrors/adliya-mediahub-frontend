'use client'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mediaRequestsApi } from '@/lib/api'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, X, Mic2, Calendar, Eye } from 'lucide-react'

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  YANGI:                { label: 'Yangi',               cls: 'bg-gray-100 text-gray-600' },
  YUBORILDI:            { label: 'Yuborildi',            cls: 'bg-blue-100 text-blue-700' },
  KO_RIB_CHIQILMOQDA:  { label: "Ko'rib chiqilmoqda",   cls: 'bg-amber-100 text-amber-700' },
  EKSPERT_BIRIKTIRILDI:{ label: 'Ekspert biriktirildi',  cls: 'bg-purple-100 text-purple-700' },
  TASDIQLANDI:          { label: 'Tasdiqlandi',           cls: 'bg-emerald-100 text-emerald-700' },
  RAD_ETILDI:           { label: 'Rad etildi',            cls: 'bg-red-100 text-red-700' },
  OTKAZILDI:            { label: "O'tkazildi",            cls: 'bg-indigo-100 text-indigo-700' },
  YAKUNLANDI:           { label: 'Yakunlandi',            cls: 'bg-teal-100 text-teal-700' },
  KECHIKDI:             { label: 'Kechikdi',              cls: 'bg-orange-100 text-orange-700' },
}

const inputCls = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition'

export default function MediaRequestsPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ oavId:'', mavzu:'', yonalish:'', sana:'', joy:'', tarkibiyTuzilmaId:'', taymerMuddatMinut:'60', izoh:'' })

  const { data, isLoading } = useQuery({ queryKey: ['media-requests'], queryFn: () => mediaRequestsApi.getAll() })
  const requests = data?.data?.data || []

  const createMutation = useMutation({
    mutationFn: (d: any) => mediaRequestsApi.create(d),
    onSuccess: () => { toast.success("So'rov yaratildi"); qc.invalidateQueries({ queryKey: ['media-requests'] }); setShowForm(false) },
    onError: () => toast.error('Xatolik yuz berdi'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate({ ...form, oavId: +form.oavId, tarkibiyTuzilmaId: +form.tarkibiyTuzilmaId, taymerMuddatMinut: +form.taymerMuddatMinut })
  }

  const fields = [
    { key:'oavId', label:'OAV ID', type:'number' },
    { key:'mavzu', label:'Mavzu', type:'text' },
    { key:'yonalish', label:"Yo'nalish", type:'text' },
    { key:'sana', label:'Sana va vaqt', type:'datetime-local' },
    { key:'joy', label:'Joy', type:'text' },
    { key:'tarkibiyTuzilmaId', label:'Tuzilma ID', type:'number' },
    { key:'taymerMuddatMinut', label:'Taymer (daqiqa)', type:'number' },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">OAV So&apos;rovlari</h1>
            <p className="text-sm text-gray-500 mt-0.5">{requests.length} ta so&apos;rov</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-sm transition hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #1a3a6b, #1e4d8c)' }}>
            <Plus size={16} /> So&apos;rov yaratish
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-900">Yangi OAV So&apos;rovi</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition">
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-5">
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                {fields.map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">{f.label}</label>
                    <input type={f.type} value={(form as any)[f.key]}
                      onChange={e => setForm({...form, [f.key]: e.target.value})}
                      className={inputCls} required />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Izoh</label>
                  <textarea value={form.izoh} onChange={e => setForm({...form, izoh: e.target.value})}
                    className={inputCls + ' resize-none'} rows={2} />
                </div>
                <div className="col-span-2 flex gap-3 justify-end pt-2 border-t border-gray-50">
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition">Bekor qilish</button>
                  <button type="submit" disabled={createMutation.isPending}
                    className="px-5 py-2.5 text-white rounded-xl text-sm font-medium disabled:opacity-50 hover:opacity-90 transition"
                    style={{ background: 'linear-gradient(135deg, #1a3a6b, #1e4d8c)' }}>
                    {createMutation.isPending ? 'Saqlanmoqda...' : 'Saqlash'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_,i) => <div key={i} className="h-16 bg-white rounded-2xl animate-pulse border border-gray-100" />)}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {requests.length === 0 ? (
              <div className="py-16 text-center">
                <Mic2 size={40} className="mx-auto mb-3 text-gray-200" />
                <p className="text-gray-500 font-medium">So&apos;rovlar yo&apos;q</p>
                <p className="text-sm text-gray-400 mt-1">Birinchi so&apos;rovni yarating</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50">
                    {['#','OAV','Mavzu',"Yo'nalish",'Sana','Holat','Amal'].map(h => (
                      <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r: any, i: number) => (
                    <tr key={r.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3.5 text-gray-400 text-xs">{i+1}</td>
                      <td className="px-4 py-3.5 font-medium text-gray-900">{r.oav?.nomi || '—'}</td>
                      <td className="px-4 py-3.5 text-gray-700 max-w-[180px] truncate">{r.mavzu}</td>
                      <td className="px-4 py-3.5 text-gray-500 text-xs">{r.yonalish || '—'}</td>
                      <td className="px-4 py-3.5 text-gray-500 text-xs">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          {r.sana ? new Date(r.sana).toLocaleDateString('uz') : '—'}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_MAP[r.status]?.cls || 'bg-gray-100 text-gray-600'}`}>
                          {STATUS_MAP[r.status]?.label || r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <button className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium transition">
                          <Eye size={12} /> Ko&apos;rish
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
