'use client'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { calendarApi } from '@/lib/api'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, X, BookOpen, Play, Megaphone } from 'lucide-react'

const STATUS_STYLES: Record<string, string> = {
  REJADA:          'bg-gray-100 text-gray-600',
  TAYYORLANMOQDA:  'bg-amber-100 text-amber-700',
  KELISHUVDA:      'bg-blue-100 text-blue-700',
  ELON_QILINDI:    'bg-emerald-100 text-emerald-700',
  BEKOR_QILINDI:   'bg-red-100 text-red-700',
}
const FORMATS = ['POST','VIDEO','REELS','INFOGRAFIKA','INTERVYU','PRESS_RELIZ']
const PLATFORMS = ['TELEGRAM','INSTAGRAM','FACEBOOK','YOUTUBE','VEBSAYT','OAV']

const FORMAT_COLORS: Record<string, string> = {
  POST: 'bg-blue-100 text-blue-700', VIDEO: 'bg-purple-100 text-purple-700',
  REELS: 'bg-pink-100 text-pink-700', INFOGRAFIKA: 'bg-teal-100 text-teal-700',
  INTERVYU: 'bg-amber-100 text-amber-700', PRESS_RELIZ: 'bg-indigo-100 text-indigo-700',
}

const inputCls = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition'

export default function CalendarPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ kontentNomi:'', format:'POST', platforma:'TELEGRAM', muddat:'', izoh:'' })

  const { data, isLoading } = useQuery({ queryKey: ['calendar'], queryFn: () => calendarApi.getAll() })
  const items = data?.data?.data || []

  const createMutation = useMutation({
    mutationFn: (d: any) => calendarApi.create(d),
    onSuccess: () => { toast.success('Kiritildi'); qc.invalidateQueries({ queryKey: ['calendar'] }); setShowForm(false) },
    onError: () => toast.error('Xatolik'),
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: any) => calendarApi.updateStatus(id, status),
    onSuccess: () => { toast.success('Yangilandi'); qc.invalidateQueries({ queryKey: ['calendar'] }) },
  })

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Kontent Kalendar</h1>
            <p className="text-sm text-gray-500 mt-0.5">{items.length} ta kontent rejalashtirilgan</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-sm hover:opacity-90 transition"
            style={{ background: 'linear-gradient(135deg, #1a3a6b, #1e4d8c)' }}>
            <Plus size={16} /> Kontent qo&apos;shish
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden max-w-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-900">Yangi Kontent</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition">
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-5">
              <form onSubmit={e=>{e.preventDefault();createMutation.mutate(form)}} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Kontent nomi</label>
                  <input value={form.kontentNomi} onChange={e=>setForm({...form,kontentNomi:e.target.value})} className={inputCls} required placeholder="Kontent sarlavhasi" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Format</label>
                    <select value={form.format} onChange={e=>setForm({...form,format:e.target.value})} className={inputCls}>
                      {FORMATS.map(f=><option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Platforma</label>
                    <select value={form.platforma} onChange={e=>setForm({...form,platforma:e.target.value})} className={inputCls}>
                      {PLATFORMS.map(p=><option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">E&apos;lon sanasi</label>
                  <input type="date" value={form.muddat} onChange={e=>setForm({...form,muddat:e.target.value})} className={inputCls} required />
                </div>
                <div className="flex gap-3 justify-end pt-2 border-t border-gray-50">
                  <button type="button" onClick={()=>setShowForm(false)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition">Bekor</button>
                  <button type="submit" disabled={createMutation.isPending}
                    className="px-5 py-2.5 text-white rounded-xl text-sm font-medium disabled:opacity-50 hover:opacity-90 transition"
                    style={{ background: 'linear-gradient(135deg, #1a3a6b, #1e4d8c)' }}>
                    {createMutation.isPending ? '...' : 'Saqlash'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="h-64 bg-white rounded-2xl animate-pulse border border-gray-100" />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {items.length === 0 ? (
              <div className="py-16 text-center">
                <BookOpen size={40} className="mx-auto mb-3 text-gray-200" />
                <p className="text-gray-500 font-medium">Kontentlar yo'q</p>
                <p className="text-sm text-gray-400 mt-1">Birinchi kontentni rejalashtiring</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50">
                    {['#','Nomi','Format','Platforma','Muddat','Holat','Amal'].map(h => (
                      <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: any, i: number) => (
                    <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3.5 text-gray-400 text-xs">{i+1}</td>
                      <td className="px-4 py-3.5 font-medium text-gray-900 max-w-[180px] truncate">{item.kontentNomi}</td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${FORMAT_COLORS[item.format] || 'bg-gray-100 text-gray-600'}`}>
                          {item.format}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2.5 py-1 rounded-lg text-xs bg-gray-100 text-gray-600">{item.platforma}</span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 text-xs">
                        {item.muddat ? new Date(item.muddat).toLocaleDateString('uz') : '—'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[item.status] || 'bg-gray-100'}`}>
                          {item.status?.replace(/_/g,' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        {item.status === 'REJADA' && (
                          <button onClick={() => updateStatusMutation.mutate({id:item.id,status:'TAYYORLANMOQDA'})}
                            className="flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-800 font-medium transition">
                            <Play size={12} /> Boshlash
                          </button>
                        )}
                        {item.status === 'TAYYORLANMOQDA' && (
                          <button onClick={() => updateStatusMutation.mutate({id:item.id,status:'ELON_QILINDI'})}
                            className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-800 font-medium transition">
                            <Megaphone size={12} /> E&apos;lon
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
