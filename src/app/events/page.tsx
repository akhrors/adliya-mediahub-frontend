'use client'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { eventsApi } from '@/lib/api'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, X, Calendar, MapPin, Send } from 'lucide-react'

const STATUS_STYLES: Record<string, string> = {
  QORALAMA:      'bg-gray-100 text-gray-600',
  YUBORILDI:     'bg-blue-100 text-blue-700',
  QABUL_QILINDI: 'bg-emerald-100 text-emerald-700',
  QAYTARILDI:    'bg-red-100 text-red-700',
  YAKUNLANDI:    'bg-teal-100 text-teal-700',
}
const STATUS_LABELS: Record<string, string> = {
  QORALAMA: 'Qoralama', YUBORILDI: 'Yuborildi',
  QABUL_QILINDI: 'Qabul qilindi', QAYTARILDI: 'Qaytarildi', YAKUNLANDI: 'Yakunlandi',
}
const EVENT_TYPES = ['MATBUOT_ANJUMANI','BRIFING','OCHIQ_MULOQOT','SEMINAR','KONFERENSIYA','FORUM','AKSIYA','BOSHQA']

const inputCls = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition'

export default function EventsPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nomi:'', turi:'MATBUOT_ANJUMANI', tashkilotchiId:'', hudud:'', sana:'', joy:'', masulId:'', fotoKerak:false, videoKerak:false, oavTaklif:false, izoh:'' })

  const { data, isLoading } = useQuery({ queryKey: ['events'], queryFn: () => eventsApi.getAll() })
  const events = data?.data?.data || []

  const createMutation = useMutation({
    mutationFn: (d: any) => eventsApi.create(d),
    onSuccess: () => { toast.success('Tadbir yaratildi'); qc.invalidateQueries({ queryKey: ['events'] }); setShowForm(false) },
    onError: () => toast.error('Xatolik'),
  })

  const submitMutation = useMutation({
    mutationFn: (id: number) => eventsApi.updateStatus(id, 'YUBORILDI'),
    onSuccess: () => { toast.success('Yuborildi'); qc.invalidateQueries({ queryKey: ['events'] }) },
  })

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Tadbirlar Reyestri</h1>
            <p className="text-sm text-gray-500 mt-0.5">{events.length} ta tadbir mavjud</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-sm transition hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #1a3a6b, #1e4d8c)' }}>
            <Plus size={16} /> Tadbir qo&apos;shish
          </button>
        </div>

        {/* Form panel */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-900">Yangi Tadbir</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition">
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-5">
              <form onSubmit={e => { e.preventDefault(); createMutation.mutate({...form, tashkilotchiId:+form.tashkilotchiId, masulId:+form.masulId}) }}
                className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Tadbir nomi</label>
                  <input value={form.nomi} onChange={e=>setForm({...form,nomi:e.target.value})} className={inputCls} required placeholder="Tadbir nomini kiriting" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Turi</label>
                  <select value={form.turi} onChange={e=>setForm({...form,turi:e.target.value})} className={inputCls}>
                    {EVENT_TYPES.map(t=><option key={t} value={t}>{t.replace(/_/g,' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Hudud</label>
                  <input value={form.hudud} onChange={e=>setForm({...form,hudud:e.target.value})} className={inputCls} placeholder="Viloyat / tuman" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Sana va vaqt</label>
                  <input type="datetime-local" value={form.sana} onChange={e=>setForm({...form,sana:e.target.value})} className={inputCls} required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Joy</label>
                  <input value={form.joy} onChange={e=>setForm({...form,joy:e.target.value})} className={inputCls} placeholder="Manzil" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Tashkilotchi ID</label>
                  <input type="number" value={form.tashkilotchiId} onChange={e=>setForm({...form,tashkilotchiId:e.target.value})} className={inputCls} required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Mas&apos;ul ID</label>
                  <input type="number" value={form.masulId} onChange={e=>setForm({...form,masulId:e.target.value})} className={inputCls} required />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-2">Qo&apos;shimcha talablar</label>
                  <div className="flex gap-4">
                    {[['fotoKerak','Foto kerak'],['videoKerak','Video kerak'],['oavTaklif','OAV taklif']].map(([k,l])=>(
                      <label key={k} className="flex items-center gap-2 text-sm cursor-pointer select-none">
                        <div
                          onClick={() => setForm({...form, [k]: !(form as any)[k]})}
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer transition ${(form as any)[k] ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}
                        >
                          {(form as any)[k] && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </div>
                        <span className="text-gray-700">{l}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="col-span-2 flex gap-3 justify-end pt-2 border-t border-gray-50">
                  <button type="button" onClick={()=>setShowForm(false)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition">Bekor qilish</button>
                  <button type="submit" disabled={createMutation.isPending}
                    className="px-5 py-2.5 text-white rounded-xl text-sm font-medium disabled:opacity-50 transition hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #1a3a6b, #1e4d8c)' }}>
                    {createMutation.isPending ? 'Saqlanmoqda...' : 'Saqlash'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_,i) => (
              <div key={i} className="h-16 bg-white rounded-2xl animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {events.length === 0 ? (
              <div className="py-16 text-center">
                <Calendar size={40} className="mx-auto mb-3 text-gray-200" />
                <p className="text-gray-500 font-medium">Tadbirlar yo'q</p>
                <p className="text-sm text-gray-400 mt-1">Yangi tadbir qo'shish uchun yuqoridagi tugmani bosing</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50">
                    {['#','Tadbir nomi','Turi','Sana','Joy','Holat','Amal'].map(h => (
                      <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {events.map((ev: any, i: number) => (
                    <tr key={ev.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3.5 text-gray-400 text-xs">{i+1}</td>
                      <td className="px-4 py-3.5 font-medium text-gray-900 max-w-[200px] truncate">{ev.nomi}</td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">{ev.turi?.replace(/_/g,' ')}</span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 text-xs">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          {ev.sana ? new Date(ev.sana).toLocaleDateString('uz') : '—'}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 text-xs max-w-[100px] truncate">
                        <div className="flex items-center gap-1">
                          <MapPin size={12} />
                          {ev.joy || '—'}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[ev.status] || 'bg-gray-100 text-gray-600'}`}>
                          {STATUS_LABELS[ev.status] || ev.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        {ev.status === 'QORALAMA' && (
                          <button onClick={() => submitMutation.mutate(ev.id)}
                            className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium transition">
                            <Send size={12} /> Yuborish
                          </button>
                        )}
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
