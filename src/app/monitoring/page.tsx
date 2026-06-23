'use client'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { monitoringApi } from '@/lib/api'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, AlertTriangle } from 'lucide-react'

const DARAJA_COLORS: Record<string,string> = {
  PAST:'bg-green-100 text-green-700', ORTA:'bg-yellow-100 text-yellow-700',
  YUQORI:'bg-orange-100 text-orange-700', REZONANSLI:'bg-red-100 text-red-700',
}

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
          <h1 className="text-xl font-bold text-gray-900">Monitoring</h1>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#1E3A5F] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#2D5286]">
            <Plus size={16}/> Tanqidiy material
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="font-semibold mb-4">Yangi Monitoring Item</h2>
            <form onSubmit={e=>{e.preventDefault();createMutation.mutate({...form,masulOrgId:form.masulOrgId?+form.masulOrgId:null,deadline:form.deadline||null})}} className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm text-gray-600 mb-1">Turi</label>
                <select value={form.turi} onChange={e=>setForm({...form,turi:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none">
                  <option value="TANQIDIY">Tanqidiy material</option>
                  <option value="NHH">Yangi NHH</option>
                </select></div>
              <div><label className="block text-sm text-gray-600 mb-1">Platforma</label>
                <select value={form.platforma} onChange={e=>setForm({...form,platforma:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none">
                  {['TELEGRAM','FACEBOOK','INSTAGRAM','YOUTUBE','OAV','BOSHQA'].map(p=><option key={p} value={p}>{p}</option>)}
                </select></div>
              <div className="col-span-2"><label className="block text-sm text-gray-600 mb-1">Mavzu</label>
                <input value={form.mavzu} onChange={e=>setForm({...form,mavzu:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none" required/></div>
              <div><label className="block text-sm text-gray-600 mb-1">Havola</label>
                <input value={form.link} onChange={e=>setForm({...form,link:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none" placeholder="https://..."/></div>
              <div><label className="block text-sm text-gray-600 mb-1">Muallif/Manba</label>
                <input value={form.muallifManba} onChange={e=>setForm({...form,muallifManba:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"/></div>
              <div><label className="block text-sm text-gray-600 mb-1">Daraja</label>
                <select value={form.daraja} onChange={e=>setForm({...form,daraja:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none">
                  {['PAST','ORTA','YUQORI','REZONANSLI'].map(d=><option key={d} value={d}>{d}</option>)}
                </select></div>
              <div><label className="block text-sm text-gray-600 mb-1">Javob muddati</label>
                <input type="datetime-local" value={form.deadline} onChange={e=>setForm({...form,deadline:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"/></div>
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
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>{['#','Mavzu','Platforma','Daraja','Muddat','Status','Amal'].map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((item:any,i:number)=>(
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400">{i+1}</td>
                    <td className="px-4 py-3 font-medium max-w-xs">
                      <div className="truncate">{item.mavzu}</div>
                      {item.link&&<a href={item.link} target="_blank" className="text-xs text-blue-500 hover:underline truncate block">Havola</a>}
                    </td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-gray-100 rounded text-xs">{item.platforma}</span></td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${DARAJA_COLORS[item.daraja]||''}`}>{item.daraja}</span></td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{item.deadline?new Date(item.deadline).toLocaleString('uz'):'—'}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status==='KECHIKDI'?'bg-red-100 text-red-700':'bg-blue-100 text-blue-700'}`}>{item.status}</span></td>
                    <td className="px-4 py-3"><button className="text-xs text-[#1E3A5F] hover:underline">Ko&apos;rish</button></td>
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
