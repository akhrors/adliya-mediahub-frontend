'use client'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { monitoringApi } from '@/lib/api'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, X, MonitorPlay, ExternalLink, Clock, ShieldAlert } from 'lucide-react'

const DARAJA_STYLES: Record<string, string> = {
  PAST:       'bg-emerald-100 text-emerald-700',
  ORTA:       'bg-amber-100 text-amber-700',
  YUQORI:     'bg-orange-100 text-orange-700',
  REZONANSLI: 'bg-red-100 text-red-700',
}
const DARAJA_DOTS: Record<string, string> = {
  PAST: 'bg-emerald-500', ORTA: 'bg-amber-500', YUQORI: 'bg-orange-500', REZONANSLI: 'bg-red-500',
}

const inputCls = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition'

export default function MonitoringPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ turi:'TANQIDIY', link:'', platforma:'TELEGRAM', muallifManba:'', mavzu:'', daraja:'ORTA', masulOrgId:'', deadline:'' })

  const { data, isLoading } = useQuery({ queryKey: ['monitoring'], queryFn: () => monitoringApi.getAll() })
  const items = data?.data?.data || []

  const createMutation = useMutation({
    mutationFn: (d: any) => monitoringApi.create(d),
    onSuccess: () => { toast.success('Kiritildi'); qc.invalidateQueries({ queryKey: ['monitoring'] }); setShowForm(false) },
    onError: () => toast.error('Xatolik'),
  })

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Monitoring</h1>
            <p className="text-sm text-gray-500 mt-0.5">{items.length} ta material kuzatilmoqda</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-sm hover:opacity-90 transition"
            style={{ background: 'linear-gradient(135deg, #1a3a6b, #1e4d8c)' }}>
            <Plus size={16} /> Tanqidiy material
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-900">Yangi Monitoring Item</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition">
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-5">
              <form onSubmit={e=>{e.preventDefault();createMutation.mutate({...form,masulOrgId:form.masulOrgId?+form.masulOrgId:null,deadline:form.deadline||null})}}
                className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Turi</label>
                  <select value={form.turi} onChange={e=>setForm({...form,turi:e.target.value})} className={inputCls}>
                    <option value="TANQIDIY">Tanqidiy material</option>
                    <option value="NHH">Yangi NHH</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Platforma</label>
                  <select value={form.platforma} onChange={e=>setForm({...form,platforma:e.target.value})} className={inputCls}>
                    {['TELEGRAM','FACEBOOK','INSTAGRAM','YOUTUBE','OAV','BOSHQA'].map(p=><option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Mavzu</label>
                  <input value={form.mavzu} onChange={e=>setForm({...form,mavzu:e.target.value})} className={inputCls} required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Havola</label>
                  <input value={form.link} onChange={e=>setForm({...form,link:e.target.value})} className={inputCls} placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Muallif / Manba</label>
                  <input value={form.muallifManba} onChange={e=>setForm({...form,muallifManba:e.target.value})} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Daraja</label>
                  <select value={form.daraja} onChange={e=>setForm({...form,daraja:e.target.value})} className={inputCls}>
                    {['PAST','ORTA','YUQORI','REZONANSLI'].map(d=><option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Javob muddati</label>
                  <input type="datetime-local" value={form.deadline} onChange={e=>setForm({...form,deadline:e.target.value})} className={inputCls} />
                </div>
                <div className="col-span-2 flex gap-3 justify-end pt-2 border-t border-gray-50">
                  <button type="button" onClick={()=>setShowForm(false)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition">Bekor</button>
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
          <div className="space-y-3">{[...Array(4)].map((_,i) => <div key={i} className="h-16 bg-white rounded-2xl animate-pulse border border-gray-100" />)}</div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {items.length === 0 ? (
              <div className="py-16 text-center">
                <MonitorPlay size={40} className="mx-auto mb-3 text-gray-200" />
                <p className="text-gray-500 font-medium">Monitoring uchun materiallar yo'q</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50">
                    {['#','Mavzu','Platforma','Daraja','Muddat','Holat','Amal'].map(h => (
                      <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: any, i: number) => (
                    <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3.5 text-gray-400 text-xs">{i+1}</td>
                      <td className="px-4 py-3.5 max-w-[200px]">
                        <div className="font-medium text-gray-900 truncate">{item.mavzu}</div>
                        {item.link && (
                          <a href={item.link} target="_blank" className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1 mt-0.5">
                            <ExternalLink size={10} /> Havola
                          </a>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{item.platforma}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${DARAJA_STYLES[item.daraja] || 'bg-gray-100 text-gray-600'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${DARAJA_DOTS[item.daraja] || 'bg-gray-400'}`} />
                          {item.daraja}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 text-xs">
                        {item.deadline ? (
                          <div className="flex items-center gap-1">
                            <Clock size={11} />
                            {new Date(item.deadline).toLocaleString('uz')}
                          </div>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${item.status === 'KECHIKDI' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <button className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium transition">
                          <ShieldAlert size={12} /> Ko&apos;rish
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
