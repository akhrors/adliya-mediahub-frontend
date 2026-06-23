'use client'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { coverageApi } from '@/lib/api'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Check, X } from 'lucide-react'

const PLATFORMS = ['TV','RADIO','TELEGRAM','INSTAGRAM','FACEBOOK','YOUTUBE','VEBSAYT','GAZETA','JURNAL','BOSHQA']
const MATERIAL_TYPES = ['FAOLIYATNI_YORITISH','HUQUQIY_TARG\'IBOT','INTERVYU','REPORTAJ','BOSHQA']

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
          <h1 className="text-xl font-bold text-gray-900">Faoliyatni Yoritish</h1>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#1E3A5F] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#2D5286]">
            <Plus size={16}/> Material kiritish
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold mb-4">Yangi Material</h2>
            <form onSubmit={e=>{e.preventDefault();createMutation.mutate({...form,korishlarSoni:+form.korishlarSoni})}} className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><label className="block text-sm text-gray-600 mb-1">Nomi</label>
                <input value={form.nomi} onChange={e=>setForm({...form,nomi:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none" required/></div>
              <div><label className="block text-sm text-gray-600 mb-1">Material turi</label>
                <select value={form.materialTuri} onChange={e=>setForm({...form,materialTuri:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none">
                  {MATERIAL_TYPES.map(t=><option key={t} value={t}>{t.replace(/_/g,' ')}</option>)}
                </select></div>
              <div><label className="block text-sm text-gray-600 mb-1">Platforma</label>
                <select value={form.platforma} onChange={e=>setForm({...form,platforma:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none">
                  {PLATFORMS.map(p=><option key={p} value={p}>{p}</option>)}
                </select></div>
              <div className="col-span-2"><label className="block text-sm text-gray-600 mb-1">Havola (link)</label>
                <input value={form.havola} onChange={e=>setForm({...form,havola:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none" placeholder="https://..."/></div>
              <div><label className="block text-sm text-gray-600 mb-1">Sana</label>
                <input type="date" value={form.sana} onChange={e=>setForm({...form,sana:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none" required/></div>
              <div><label className="block text-sm text-gray-600 mb-1">Ko&apos;rishlar soni</label>
                <input type="number" value={form.korishlarSoni} onChange={e=>setForm({...form,korishlarSoni:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"/></div>
              <div className="col-span-2 flex gap-3 justify-end">
                <button type="button" onClick={()=>setShowForm(false)} className="px-4 py-2 border rounded-lg text-sm">Bekor</button>
                <button type="submit" disabled={createMutation.isPending} className="px-4 py-2 bg-[#1E3A5F] text-white rounded-lg text-sm disabled:opacity-50">
                  {createMutation.isPending?'Saqlanmoqda...':'Yuborish'}
                </button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? <div className="space-y-3">{[...Array(4)].map((_,i)=><div key={i} className="h-16 bg-white rounded-xl animate-pulse"/>)}</div> : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>{['#','Nomi','Platforma','Sana','Ko\'rishlar','Status','Amal'].map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {materials.map((m:any,i:number)=>(
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400">{i+1}</td>
                    <td className="px-4 py-3 font-medium max-w-xs truncate">
                      {m.havola?<a href={m.havola} target="_blank" className="text-blue-600 hover:underline">{m.nomi}</a>:m.nomi}
                    </td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-gray-100 rounded text-xs">{m.platforma}</span></td>
                    <td className="px-4 py-3 text-gray-500">{m.sana?new Date(m.sana).toLocaleDateString('uz'):'—'}</td>
                    <td className="px-4 py-3 text-gray-500">{m.korishlarSoni?.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        m.status==='TASDIQLANDI'?'bg-green-100 text-green-700':m.status==='QAYTARILDI'?'bg-red-100 text-red-700':'bg-yellow-100 text-yellow-700'
                      }`}>{m.status}</span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      {m.status==='TASDIQLASHDA'&&<>
                        <button onClick={()=>approveMutation.mutate(m.id)} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check size={14}/></button>
                        <button onClick={()=>rejectMutation.mutate({id:m.id,reason:'Sifatsiz material'})} className="p-1 text-red-600 hover:bg-red-50 rounded"><X size={14}/></button>
                      </>}
                    </td>
                  </tr>
                ))}
                {materials.length===0&&<tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Ma&apos;lumot yo&apos;q</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
