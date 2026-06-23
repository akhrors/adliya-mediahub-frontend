'use client'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useMutation } from '@tanstack/react-query'
import { reportsApi } from '@/lib/api'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { FileText, Download } from 'lucide-react'

const REPORT_TYPES = [
  { value:'OAV_CHIQISHLARI', label:"OAV chiqishlari hisoboti" },
  { value:'TADBIRLAR', label:"Tadbirlar hisoboti" },
  { value:'FAOLIYATNI_YORITISH', label:"Faoliyatni yoritish hisoboti" },
  { value:'TANQIDIY_MATERIALLAR', label:"Tanqidiy materiallar hisoboti" },
  { value:'REYTING', label:"Reyting hisoboti" },
]

export default function ReportsPage() {
  const [form, setForm] = useState({ hisobotTuri:'OAV_CHIQISHLARI', davrBoshi:'', davrOxiri:'', format:'EXCEL' })

  const generateMutation = useMutation({
    mutationFn: (d: any) => reportsApi.generate(d),
    onSuccess: () => toast.success("Hisobot yaratilmoqda..."),
    onError: () => toast.error('Xatolik'),
  })

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <h1 className="text-xl font-bold text-gray-900">Hisobotlar</h1>

        <div className="bg-white rounded-xl p-6 shadow-sm border max-w-xl">
          <h2 className="font-semibold mb-4">Hisobot generatsiyasi</h2>
          <div className="space-y-4">
            <div><label className="block text-sm text-gray-600 mb-1">Hisobot turi</label>
              <select value={form.hisobotTuri} onChange={e=>setForm({...form,hisobotTuri:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none">
                {REPORT_TYPES.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
              </select></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-sm text-gray-600 mb-1">Davr boshi</label>
                <input type="date" value={form.davrBoshi} onChange={e=>setForm({...form,davrBoshi:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"/></div>
              <div><label className="block text-sm text-gray-600 mb-1">Davr oxiri</label>
                <input type="date" value={form.davrOxiri} onChange={e=>setForm({...form,davrOxiri:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"/></div>
            </div>
            <div><label className="block text-sm text-gray-600 mb-1">Format</label>
              <div className="flex gap-3">
                {['EXCEL','WORD','PDF'].map(f=>(
                  <label key={f} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value={f} checked={form.format===f} onChange={()=>setForm({...form,format:f})} className="w-4 h-4"/>
                    <span className="text-sm">{f}</span>
                  </label>
                ))}
              </div>
            </div>
            <button onClick={()=>generateMutation.mutate({hisobotTuri:form.hisobotTuri,davrBoshi:form.davrBoshi||null,davrOxiri:form.davrOxiri||null,format:form.format})}
              disabled={generateMutation.isPending}
              className="flex items-center gap-2 bg-[#1E3A5F] text-white px-5 py-2.5 rounded-lg text-sm disabled:opacity-50 hover:bg-[#2D5286]">
              <Download size={16}/> {generateMutation.isPending ? 'Yaratilmoqda...' : 'Hisobot olish'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="font-semibold mb-4">Oldingi hisobotlar</h2>
          <div className="text-center py-8 text-gray-400">
            <FileText size={40} className="mx-auto mb-2 opacity-30"/>
            <p className="text-sm">Hozircha hisobotlar yo&apos;q</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
