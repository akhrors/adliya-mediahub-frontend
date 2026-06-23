'use client'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { eventsApi } from '@/lib/api'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, CheckSquare } from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
  QORALAMA:'bg-gray-100 text-gray-700', YUBORILDI:'bg-blue-100 text-blue-700',
  QABUL_QILINDI:'bg-green-100 text-green-700', QAYTARILDI:'bg-red-100 text-red-700',
  YAKUNLANDI:'bg-teal-100 text-teal-700',
}

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

  const EVENT_TYPES = ['MATBUOT_ANJUMANI','BRIFING','OCHIQ_MULOQOT','SEMINAR','KONFERENSIYA','FORUM','AKSIYA','BOSHQA']

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Tadbirlar Reyestri</h1>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#1E3A5F] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#2D5286]">
            <Plus size={16}/> Tadbir qo&apos;shish
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold mb-4">Yangi Tadbir</h2>
            <form onSubmit={e => { e.preventDefault(); createMutation.mutate({...form, tashkilotchiId:+form.tashkilotchiId, masulId:+form.masulId}) }} className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm text-gray-600 mb-1">Nomi</label>
                <input value={form.nomi} onChange={e=>setForm({...form,nomi:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1E3A5F] focus:outline-none" required/></div>
              <div><label className="block text-sm text-gray-600 mb-1">Turi</label>
                <select value={form.turi} onChange={e=>setForm({...form,turi:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none">
                  {EVENT_TYPES.map(t=><option key={t} value={t}>{t.replace(/_/g,' ')}</option>)}
                </select></div>
              <div><label className="block text-sm text-gray-600 mb-1">Tashkilotchi ID</label>
                <input type="number" value={form.tashkilotchiId} onChange={e=>setForm({...form,tashkilotchiId:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none" required/></div>
              <div><label className="block text-sm text-gray-600 mb-1">Hudud</label>
                <input value={form.hudud} onChange={e=>setForm({...form,hudud:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"/></div>
              <div><label className="block text-sm text-gray-600 mb-1">Sana</label>
                <input type="datetime-local" value={form.sana} onChange={e=>setForm({...form,sana:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none" required/></div>
              <div><label className="block text-sm text-gray-600 mb-1">Joy</label>
                <input value={form.joy} onChange={e=>setForm({...form,joy:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none" required/></div>
              <div><label className="block text-sm text-gray-600 mb-1">Mas&apos;ul ID</label>
                <input type="number" value={form.masulId} onChange={e=>setForm({...form,masulId:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none" required/></div>
              <div className="flex gap-4 items-end pb-2">
                {[['fotoKerak','Foto'],['videoKerak','Video'],['oavTaklif','OAV']].map(([k,l])=>(
                  <label key={k} className="flex items-center gap-1 text-sm cursor-pointer">
                    <input type="checkbox" checked={(form as any)[k]} onChange={e=>setForm({...form,[k]:e.target.checked})} className="w-4 h-4"/> {l}
                  </label>
                ))}
              </div>
              <div className="col-span-2 flex gap-3 justify-end">
                <button type="button" onClick={()=>setShowForm(false)} className="px-4 py-2 border rounded-lg text-sm">Bekor</button>
                <button type="submit" disabled={createMutation.isPending} className="px-4 py-2 bg-[#1E3A5F] text-white rounded-lg text-sm disabled:opacity-50">
                  {createMutation.isPending?'Saqlanmoqda...':'Saqlash'}
                </button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? <div className="space-y-3">{[...Array(4)].map((_,i)=><div key={i} className="h-16 bg-white rounded-xl animate-pulse"/>)}</div> : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>{['#','Nomi','Turi','Sana','Joy','Status','Amal'].map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {events.map((ev:any, i:number)=>(
                  <tr key={ev.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400">{i+1}</td>
                    <td className="px-4 py-3 font-medium max-w-xs truncate">{ev.nomi}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{ev.turi?.replace(/_/g,' ')}</td>
                    <td className="px-4 py-3 text-gray-500">{ev.sana?new Date(ev.sana).toLocaleDateString('uz'):'—'}</td>
                    <td className="px-4 py-3 text-gray-500 truncate max-w-[100px]">{ev.joy}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[ev.status]||'bg-gray-100'}`}>{ev.status}</span></td>
                    <td className="px-4 py-3">
                      {ev.status==='QORALAMA' && (
                        <button onClick={()=>submitMutation.mutate(ev.id)} className="text-xs text-blue-600 hover:underline">Yuborish</button>
                      )}
                    </td>
                  </tr>
                ))}
                {events.length===0&&<tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Ma&apos;lumot yo&apos;q</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
