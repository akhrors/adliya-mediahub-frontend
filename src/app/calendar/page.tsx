'use client'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { calendarApi } from '@/lib/api'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Plus } from 'lucide-react'

const STATUS_COLORS: Record<string,string> = {
  REJADA:'bg-gray-100 text-gray-700', TAYYORLANMOQDA:'bg-yellow-100 text-yellow-700',
  KELISHUVDA:'bg-blue-100 text-blue-700', ELON_QILINDI:'bg-green-100 text-green-700',
  BEKOR_QILINDI:'bg-red-100 text-red-700',
}
const FORMATS = ['POST','VIDEO','REELS','INFOGRAFIKA','INTERVYU','PRESS_RELIZ']
const PLATFORMS = ['TELEGRAM','INSTAGRAM','FACEBOOK','YOUTUBE','VEBSAYT','OAV']

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
          <h1 className="text-xl font-bold text-gray-900">Kontent Kalendar</h1>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#1E3A5F] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#2D5286]">
            <Plus size={16}/> Kontent qo&apos;shish
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl p-6 shadow-sm border max-w-xl">
            <h2 className="font-semibold mb-4">Yangi Kontent</h2>
            <form onSubmit={e=>{e.preventDefault();createMutation.mutate(form)}} className="space-y-3">
              <div><label className="block text-sm text-gray-600 mb-1">Kontent nomi</label>
                <input value={form.kontentNomi} onChange={e=>setForm({...form,kontentNomi:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none" required/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm text-gray-600 mb-1">Format</label>
                  <select value={form.format} onChange={e=>setForm({...form,format:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none">
                    {FORMATS.map(f=><option key={f} value={f}>{f}</option>)}
                  </select></div>
                <div><label className="block text-sm text-gray-600 mb-1">Platforma</label>
                  <select value={form.platforma} onChange={e=>setForm({...form,platforma:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none">
                    {PLATFORMS.map(p=><option key={p} value={p}>{p}</option>)}
                  </select></div>
              </div>
              <div><label className="block text-sm text-gray-600 mb-1">Muddat</label>
                <input type="date" value={form.muddat} onChange={e=>setForm({...form,muddat:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none" required/></div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={()=>setShowForm(false)} className="px-4 py-2 border rounded-lg text-sm">Bekor</button>
                <button type="submit" disabled={createMutation.isPending} className="px-4 py-2 bg-[#1E3A5F] text-white rounded-lg text-sm disabled:opacity-50">
                  {createMutation.isPending?'...':'Saqlash'}
                </button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? <div className="h-64 bg-white rounded-xl animate-pulse"/> : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>{['#','Nomi','Format','Platforma','Muddat','Status','Amal'].map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((item:any,i:number)=>(
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400">{i+1}</td>
                    <td className="px-4 py-3 font-medium max-w-xs truncate">{item.kontentNomi}</td>
                    <td className="px-4 py-3 text-gray-500">{item.format}</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-gray-100 rounded text-xs">{item.platforma}</span></td>
                    <td className="px-4 py-3 text-gray-500">{item.muddat?new Date(item.muddat).toLocaleDateString('uz'):'—'}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[item.status]||'bg-gray-100'}`}>{item.status?.replace(/_/g,' ')}</span></td>
                    <td className="px-4 py-3">
                      {item.status==='REJADA'&&<button onClick={()=>updateStatusMutation.mutate({id:item.id,status:'TAYYORLANMOQDA'})} className="text-xs text-blue-600 hover:underline">Boshlash</button>}
                      {item.status==='TAYYORLANMOQDA'&&<button onClick={()=>updateStatusMutation.mutate({id:item.id,status:'ELON_QILINDI'})} className="text-xs text-green-600 hover:underline">E&apos;lon</button>}
                    </td>
                  </tr>
                ))}
                {items.length===0&&<tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Ma&apos;lumot yo&apos;q</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
