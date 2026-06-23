'use client'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useMutation } from '@tanstack/react-query'
import { reportsApi } from '@/lib/api'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Download, FileText, FileSpreadsheet, FileType } from 'lucide-react'

const REPORT_TYPES = [
  { value:'OAV_CHIQISHLARI',      label:"OAV chiqishlari hisoboti",        icon: '📰' },
  { value:'TADBIRLAR',            label:"Tadbirlar hisoboti",               icon: '📅' },
  { value:'FAOLIYATNI_YORITISH',  label:"Faoliyatni yoritish hisoboti",     icon: '📡' },
  { value:'TANQIDIY_MATERIALLAR', label:"Tanqidiy materiallar hisoboti",    icon: '⚠️' },
  { value:'REYTING',              label:"Reyting hisoboti",                 icon: '📊' },
]

const FORMAT_META: Record<string, { icon: any; label: string; desc: string; color: string }> = {
  EXCEL: { icon: FileSpreadsheet, label: 'Excel',  desc: '.xlsx',  color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  WORD:  { icon: FileText,        label: 'Word',   desc: '.docx',  color: 'text-blue-600 bg-blue-50 border-blue-200' },
  PDF:   { icon: FileType,        label: 'PDF',    desc: '.pdf',   color: 'text-red-600 bg-red-50 border-red-200' },
}

export default function ReportsPage() {
  const [form, setForm] = useState({ hisobotTuri:'OAV_CHIQISHLARI', davrBoshi:'', davrOxiri:'', format:'EXCEL' })

  const generateMutation = useMutation({
    mutationFn: (d: any) => reportsApi.generate(d),
    onSuccess: () => toast.success("Hisobot yaratilmoqda..."),
    onError: () => toast.error('Xatolik'),
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Hisobotlar</h1>
          <p className="text-sm text-gray-500 mt-0.5">Hisobot yarating va yuklab oling</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Generator */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-50">
              <h2 className="font-semibold text-gray-900">Hisobot generatsiyasi</h2>
              <p className="text-xs text-gray-400 mt-0.5">Hisobot turini va davrini tanlang</p>
            </div>
            <div className="px-6 py-5 space-y-5">
              {/* Report type */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2.5">Hisobot turi</label>
                <div className="grid grid-cols-1 gap-2">
                  {REPORT_TYPES.map(t => (
                    <label key={t.value}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition ${form.hisobotTuri === t.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                      <input type="radio" name="hisobotTuri" value={t.value} checked={form.hisobotTuri === t.value}
                        onChange={() => setForm({...form, hisobotTuri: t.value})} className="sr-only" />
                      <span className="text-xl">{t.icon}</span>
                      <span className={`text-sm font-medium ${form.hisobotTuri === t.value ? 'text-blue-700' : 'text-gray-700'}`}>{t.label}</span>
                      {form.hisobotTuri === t.value && (
                        <span className="ml-auto w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Date range */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2.5">Davr</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Boshi</label>
                    <input type="date" value={form.davrBoshi} onChange={e=>setForm({...form,davrBoshi:e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Oxiri</label>
                    <input type="date" value={form.davrOxiri} onChange={e=>setForm({...form,davrOxiri:e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition" />
                  </div>
                </div>
              </div>

              {/* Format */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2.5">Format</label>
                <div className="flex gap-3">
                  {Object.entries(FORMAT_META).map(([key, meta]) => {
                    const Icon = meta.icon
                    const active = form.format === key
                    return (
                      <label key={key}
                        className={`flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 cursor-pointer transition ${active ? meta.color + ' border-opacity-100' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                        <input type="radio" name="format" value={key} checked={active}
                          onChange={() => setForm({...form, format: key})} className="sr-only" />
                        <Icon size={20} className={active ? meta.color.split(' ')[0] : 'text-gray-400'} />
                        <span className={`text-xs font-semibold ${active ? meta.color.split(' ')[0] : 'text-gray-500'}`}>{meta.label}</span>
                        <span className="text-xs text-gray-400">{meta.desc}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              <button
                onClick={() => generateMutation.mutate({ hisobotTuri:form.hisobotTuri, davrBoshi:form.davrBoshi||null, davrOxiri:form.davrOxiri||null, format:form.format })}
                disabled={generateMutation.isPending}
                className="w-full flex items-center justify-center gap-2 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition"
                style={{ background: 'linear-gradient(135deg, #1a3a6b, #1e4d8c)' }}>
                {generateMutation.isPending ? (
                  <><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Yaratilmoqda...</>
                ) : (
                  <><Download size={16} /> Hisobot olish</>
                )}
              </button>
            </div>
          </div>

          {/* Recent reports placeholder */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <h3 className="font-semibold text-gray-900">Oxirgi hisobotlar</h3>
            </div>
            <div className="py-16 px-5 text-center">
              <FileText size={36} className="mx-auto mb-3 text-gray-200" />
              <p className="text-sm font-medium text-gray-500">Hisobotlar yo&apos;q</p>
              <p className="text-xs text-gray-400 mt-1">Hisobot yaratgach bu yerda ko&apos;rinadi</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
