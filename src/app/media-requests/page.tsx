'use client'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mediaRequestsApi } from '@/lib/api'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  YANGI:               { label: 'Yangi',              color: 'bg-gray-100 text-gray-700' },
  YUBORILDI:           { label: 'Yuborildi',           color: 'bg-blue-100 text-blue-700' },
  KO_RIB_CHIQILMOQDA: { label: "Ko'rib chiqilmoqda",  color: 'bg-yellow-100 text-yellow-700' },
  EKSPERT_BIRIKTIRILDI:{ label: 'Ekspert biriktirildi',color: 'bg-purple-100 text-purple-700' },
  TASDIQLANDI:         { label: 'Tasdiqlandi',         color: 'bg-green-100 text-green-700' },
  RAD_ETILDI:          { label: 'Rad etildi',          color: 'bg-red-100 text-red-700' },
  OTKAZILDI:           { label: "O'tkazildi",          color: 'bg-indigo-100 text-indigo-700' },
  YAKUNLANDI:          { label: 'Yakunlandi',          color: 'bg-teal-100 text-teal-700' },
  KECHIKDI:            { label: 'Kechikdi',            color: 'bg-orange-100 text-orange-700' },
}

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

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">OAV So&apos;rovlari</h1>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#1E3A5F] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#2D5286]">
            <Plus size={16} /> So&apos;rov yaratish
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold mb-4">Yangi OAV So&apos;rovi</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              {[
                { key:'oavId', label:'OAV ID', type:'number' },
                { key:'mavzu', label:'Mavzu', type:'text' },
                { key:'yonalish', label:'Yo\'nalish', type:'text' },
                { key:'sana', label:'Sana va vaqt', type:'datetime-local' },
                { key:'joy', label:'Joy', type:'text' },
                { key:'tarkibiyTuzilmaId', label:'Tuzilma ID', type:'number' },
                { key:'taymerMuddatMinut', label:'Taymer (daqiqa)', type:'number' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm text-gray-600 mb-1">{f.label}</label>
                  <input type={f.type} value={(form as any)[f.key]}
                    onChange={e => setForm({...form, [f.key]: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none" required />
                </div>
              ))}
              <div className="col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Izoh</label>
                <textarea value={form.izoh} onChange={e => setForm({...form, izoh: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none" rows={2} />
              </div>
              <div className="col-span-2 flex gap-3 justify-end">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg text-sm">Bekor qilish</button>
                <button type="submit" disabled={createMutation.isPending}
                  className="px-4 py-2 bg-[#1E3A5F] text-white rounded-lg text-sm disabled:opacity-50">
                  {createMutation.isPending ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">{[...Array(5)].map((_,i) => <div key={i} className="h-16 bg-white rounded-xl animate-pulse"/>)}</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>{['#','OAV','Mavzu','Yo\'nalish','Sana','Status','Amal'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {requests.map((r: any, i: number) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400">{i+1}</td>
                    <td className="px-4 py-3 font-medium">{r.oav?.nomi || '—'}</td>
                    <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{r.mavzu}</td>
                    <td className="px-4 py-3 text-gray-500">{r.yonalish}</td>
                    <td className="px-4 py-3 text-gray-500">{r.sana ? new Date(r.sana).toLocaleDateString('uz') : '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_LABELS[r.status]?.color || 'bg-gray-100'}`}>
                        {STATUS_LABELS[r.status]?.label || r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3"><button className="text-[#1E3A5F] hover:underline text-xs">Ko&apos;rish</button></td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Ma&apos;lumot yo&apos;q</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
