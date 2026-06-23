'use client'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mediaFilesApi } from '@/lib/api'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Upload, Image, Video, Music, FileText, Trash2 } from 'lucide-react'

const FILE_TYPE_ICONS: Record<string, any> = { FOTO:Image, VIDEO:Video, AUDIO:Music, PRESS_RELIZ:FileText, INFOGRAFIKA:Image, DIZAYN_MAKETI:Image }
const FILE_TYPES = ['FOTO','VIDEO','AUDIO','PRESS_RELIZ','INFOGRAFIKA','DIZAYN_MAKETI']

export default function MediaBankPage() {
  const qc = useQueryClient()
  const [filterType, setFilterType] = useState('')
  const [uploading, setUploading] = useState(false)

  const { data, isLoading } = useQuery({ queryKey: ['media-files', filterType], queryFn: () => mediaFilesApi.getAll(filterType ? { fileType: filterType } : {}) })
  const files = data?.data?.data || []

  const deleteMutation = useMutation({
    mutationFn: (id: number) => mediaFilesApi.delete(id),
    onSuccess: () => { toast.success("O'chirildi"); qc.invalidateQueries({ queryKey: ['media-files'] }) },
  })

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('fileType', 'FOTO')
      await mediaFilesApi.upload(formData)
      toast.success('Yuklandi'); qc.invalidateQueries({ queryKey: ['media-files'] })
    } catch { toast.error('Xatolik') } finally { setUploading(false) }
  }

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Media-bank</h1>
          <label className={`flex items-center gap-2 bg-[#1E3A5F] text-white px-4 py-2 rounded-lg text-sm cursor-pointer hover:bg-[#2D5286] ${uploading?'opacity-50 cursor-not-allowed':''}`}>
            <Upload size={16}/> {uploading?'Yuklanmoqda...':'Fayl yuklash'}
            <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} accept="image/*,video/*,audio/*,.pdf,.doc,.docx"/>
          </label>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button onClick={()=>setFilterType('')} className={`px-3 py-1.5 rounded-full text-xs font-medium ${!filterType?'bg-[#1E3A5F] text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Barchasi</button>
          {FILE_TYPES.map(t=>(
            <button key={t} onClick={()=>setFilterType(t)} className={`px-3 py-1.5 rounded-full text-xs font-medium ${filterType===t?'bg-[#1E3A5F] text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{t}</button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-3 gap-4">{[...Array(6)].map((_,i)=><div key={i} className="h-40 bg-white rounded-xl animate-pulse"/>)}</div>
        ) : files.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border">
            <Image size={48} className="mx-auto mb-3 text-gray-300"/>
            <p className="text-gray-400">Hozircha fayllar yo&apos;q</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file:any)=>{
              const Icon = FILE_TYPE_ICONS[file.fileType] || FileText
              return (
                <div key={file.id} className="bg-white rounded-xl shadow-sm border overflow-hidden group">
                  <div className="h-32 bg-gray-50 flex items-center justify-center">
                    {file.fileType==='FOTO'&&file.url ? (
                      <img src={file.url} alt={file.originalName} className="w-full h-full object-cover"/>
                    ) : (
                      <Icon size={36} className="text-gray-300"/>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-medium text-gray-700 truncate">{file.originalName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{file.fileType} · {file.fileSize ? Math.round(file.fileSize/1024)+'KB' : '—'}</p>
                    <div className="flex gap-2 mt-2">
                      <a href={file.url} target="_blank" className="text-xs text-blue-600 hover:underline">Ko&apos;rish</a>
                      <button onClick={()=>deleteMutation.mutate(file.id)} className="text-xs text-red-500 hover:underline ml-auto">
                        <Trash2 size={12}/>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
