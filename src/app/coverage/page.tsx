'use client'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { coverageApi } from '@/lib/api'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, X, Check, XCircle, Newspaper, ExternalLink } from 'lucide-react'

const PLATFORMS = ['TV','RADIO','TELEGRAM','INSTAGRAM','FACEBOOK','YOUTUBE','VEBSAYT','GAZETA','JURNAL','BOSHQA']
const MATERIAL_TYPES = ['FAOLIYATNI_YORITISH',"HUQUQIY_TARG'IBOT",'INTERVYU','REPORTAJ','BOSHQA']

const PLATFORM_COLORS: Record<string, string> = {
  TELEGRAM: 'bg-sky-100 text-sky-700', INSTAGRAM: 'bg-pink-100 text-pink-700',
  FACEBOOK: 'bg-blue-100 text-blue-700', YOUTUBE: 'bg-red-100 text-red-700',
  TV: 'bg-purple-100 text-purple-700', RADIO: 'bg-orange-100 text-orange-700',
  VEBSAYT: 'bg-teal-100 text-teal-700', GAZETA: 'bg-amber-100 text-amber-700',
}

const inputCls = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition'

export default function CoveragePage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nomi:'', materialTuri:'FAOLIYATNI_YORITISH', platforma:'TELEGRAM', havola:'', sana:'', mavzu:'', korishlarSoni:'0', izoh:'' })

  const { data, isLoading } = useQuery({ queryKey: ['coverage'], queryFn: () => coverageApi.getAll() })
  const materials = data?.data?.data || []

  const createMutation = useMutation({
    mutationFn: (d: any) => coverageApi.create(d),
    onSuccess: () => { toast.success('Material kiritildi'); qc.invalidateQueries({ queryKey: ['coverage'] }); setShowForm(false) },
    onError: () => toast.error('Xatolik'),
  })
  const approveMutation = useMutation({
    mutationFn: (id: number) => coverageApi.approve(id),
    onSuccess: () => { toast.success('Tasdiqlandi'); qc.invalidateQueries({ queryKey: ['coverage'] }) },
  })
  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: any) => coverageApi.reject(id, reason),
    onSuccess: () => { toast.success('Qaytarildi'); qc.invalidateQueries({ queryKey: ['coverage'] }) },
  })

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Faoliyatni Yoritish</h1>
            <p className="text-sm text-gray-500 mt-0.5">{materials.length} ta material</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-sm hover:opacity-90 transition"
            style={{ background: 'linear-gradient(135deg, #1a3a6b, #1e4d8c)' }}>
            <Plus size={16} /> Material kiritish
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-900">Yangi Material</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition">
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-5">
              <form onSubmit={e=>{e.preventDefault();createMutation.mutate({...form,korishlarSoni:+form.korishlarSoni})}}
                className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Material nomi</label>
                  <input value={form.nomi} onChange={e=>setForm({...form,nomi:e.target.value})} className={inputCls} required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Material turi</label>
                  <select value={form.materialTuri} onChange={e=>setForm({...form,materialTuri:e.target.value})} className={inputCls}>
                    {MATERIAL_TYPES.map(t=><option key={t} value={t}>{t.replace(/_/g,' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Platforma</label>
                  <select value={form.platforma} onChange={e=>setForm({...form,platforma:e.target.value})} className={inputCls}>
                    {PLATFORMS.map(p=><option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Havola (link)</label>
                  <input value={form.havola} onChange={e=>setForm({...form,havola:e.target.value})} className={inputCls} placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Sana</label>
                  <input type="date" value={form.sana} onChange={e=>setForm({...form,sana:e.target.value})} className={inputCls} required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Ko&apos;rishlar soni</label>
                  <input type="number" value={form.korishlarSoni} onChange={e=>setForm({...form,korishlarSoni:e.target.value})} className={inputCls} />
                </div>
                <div className="col-span-2 flex gap-3 justify-end pt-2 border-t border-gray-50">
                  <button type="button" onClick={()=>setShowForm(false)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition">Bekor</button>
                  <button type="submit" disabled={createMutation.isPending}
                    className="px-5 py-2.5 text-white rounded-xl text-sm font-medium disabled:opacity-50 hover:opacity-90 transition"
                    style={{ background: 'linear-gradient(135deg, #1a3a6b, #1e4d8c)' }}>
                    {createMutation.isPending ? 'Saqlanmoqda...' : 'Yuborish'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">{[...Array(4)].map((_,i) => <div key={i} className="h-16 bg-white rounded-2xl animate-pulse border border-gray-100" />)}</div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {materials.length === 0 ? (
              <div className="py-16 text-center">
                <Newspaper size={40} className="mx-auto mb-3 text-gray-200" />
                <p className="text-gray-500 font-medium">Materiallar yo'q</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50">
                    {['#','Nomi','Platforma','Sana',"Ko'rishlar",'Holat','Amal'].map(h => (
                      <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {materials.map((m: any, i: number) => (
                    <tr key={m.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3.5 text-gray-400 text-xs">{i+1}</td>
                      <td className="px-4 py-3.5 font-medium text-gray-900 max-w-[200px]">
                        <div className="truncate">
                          {m.havola
                            ? <a href={m.havola} target="_blank" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                                {m.nomi} <ExternalLink size={11} />
                              </a>
                            : m.nomi}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${PLATFORM_COLORS[m.platforma] || 'bg-gray-100 text-gray-600'}`}>
                          {m.platforma}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 text-xs">
                        {m.sana ? new Date(m.sana).toLocaleDateString('uz') : '—'}
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 text-xs font-medium">
                        {m.korishlarSoni?.toLocaleString() || '—'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          m.status === 'TASDIQLANDI' ? 'bg-emerald-100 text-emerald-700'
                          : m.status === 'QAYTARILDI' ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                        }`}>{m.status}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        {m.status === 'TASDIQLASHDA' && (
                          <div className="flex gap-1.5">
                            <button onClick={() => approveMutation.mutate(m.id)}
                              className="w-7 h-7 flex items-center justify-center text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition">
                              <Check size={14} />
                            </button>
                            <button onClick={() => rejectMutation.mutate({ id: m.id, reason: 'Sifatsiz material' })}
                              className="w-7 h-7 flex items-center justify-center text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition">
                              <XCircle size={14} />
                            </button>
                          </div>
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
