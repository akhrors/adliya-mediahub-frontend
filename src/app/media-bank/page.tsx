'use client'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mediaFilesApi } from '@/lib/api'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Upload, Image, Video, Music, FileText, Trash2, Eye, CloudUpload } from 'lucide-react'

const FILE_TYPE_META: Record<string, { icon: any; color: string; bg: string }> = {
  FOTO:          { icon: Image,    color: 'text-blue-600',   bg: 'bg-blue-50' },
  VIDEO:         { icon: Video,    color: 'text-purple-600', bg: 'bg-purple-50' },
  AUDIO:         { icon: Music,    color: 'text-pink-600',   bg: 'bg-pink-50' },
  PRESS_RELIZ:   { icon: FileText, color: 'text-amber-600',  bg: 'bg-amber-50' },
  INFOGRAFIKA:   { icon: Image,    color: 'text-teal-600',   bg: 'bg-teal-50' },
  DIZAYN_MAKETI: { icon: Image,    color: 'text-indigo-600', bg: 'bg-indigo-50' },
}
const FILE_TYPES = Object.keys(FILE_TYPE_META)

function formatSize(bytes?: number) {
  if (!bytes) return '—'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export default function MediaBankPage() {
  const qc = useQueryClient()
  const [filterType, setFilterType] = useState('')
  const [uploading, setUploading] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['media-files', filterType],
    queryFn: () => mediaFilesApi.getAll(filterType ? { fileType: filterType } : {}),
  })
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
      toast.success('Yuklandi')
      qc.invalidateQueries({ queryKey: ['media-files'] })
    } catch { toast.error('Xatolik') } finally { setUploading(false) }
  }

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Media-bank</h1>
            <p className="text-sm text-gray-500 mt-0.5">{files.length} ta fayl saqlangan</p>
          </div>
          <label className={`flex items-center gap-2 text-white px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer shadow-sm hover:opacity-90 transition ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{ background: 'linear-gradient(135deg, #1a3a6b, #1e4d8c)' }}>
            <Upload size={16} />
            {uploading ? 'Yuklanmoqda...' : 'Fayl yuklash'}
            <input type="file" className="hidden" onChange={handleUpload} disabled={uploading}
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx" />
          </label>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilterType('')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${!filterType ? 'text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            style={!filterType ? { background: 'linear-gradient(135deg, #1a3a6b, #1e4d8c)' } : undefined}>
            Barchasi
          </button>
          {FILE_TYPES.map(t => {
            const meta = FILE_TYPE_META[t]
            return (
              <button key={t} onClick={() => setFilterType(t)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${filterType === t ? 'text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                style={filterType === t ? { background: 'linear-gradient(135deg, #1a3a6b, #1e4d8c)' } : undefined}>
                {t}
              </button>
            )
          })}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(8)].map((_,i) => <div key={i} className="h-44 bg-white rounded-2xl animate-pulse border border-gray-100" />)}
          </div>
        ) : files.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 border-dashed py-20 text-center">
            <CloudUpload size={48} className="mx-auto mb-4 text-gray-200" />
            <p className="text-gray-500 font-medium">Hozircha fayllar yo&apos;q</p>
            <p className="text-sm text-gray-400 mt-1">Fayl yuklash uchun yuqoridagi tugmani bosing</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {files.map((file: any) => {
              const meta = FILE_TYPE_META[file.fileType] || { icon: FileText, color: 'text-gray-400', bg: 'bg-gray-50' }
              const Icon = meta.icon
              return (
                <div key={file.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                  {/* Preview */}
                  <div className={`h-32 ${meta.bg} flex items-center justify-center relative`}>
                    {file.fileType === 'FOTO' && file.url ? (
                      <img src={file.url} alt={file.originalName} className="w-full h-full object-cover" />
                    ) : (
                      <Icon size={36} className={meta.color + ' opacity-40'} />
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <a href={file.url} target="_blank"
                        className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow text-gray-700 hover:text-blue-600 transition">
                        <Eye size={14} />
                      </a>
                      <button onClick={() => deleteMutation.mutate(file.id)}
                        className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow text-gray-700 hover:text-red-500 transition">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-3">
                    <p className="text-xs font-medium text-gray-800 truncate">{file.originalName}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-xs font-medium ${meta.color}`}>{file.fileType}</span>
                      <span className="text-xs text-gray-400">{formatSize(file.fileSize)}</span>
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
