'use client'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@/lib/api'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, X, UserCheck, UserX, Users, Shield } from 'lucide-react'

const inputCls = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition'

function getInitials(name?: string) {
  if (!name) return 'U'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

const AVATAR_GRADIENTS = [
  'from-blue-400 to-blue-600', 'from-purple-400 to-purple-600', 'from-emerald-400 to-emerald-600',
  'from-amber-400 to-amber-600', 'from-pink-400 to-pink-600', 'from-teal-400 to-teal-600',
]

export default function UsersPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ fish:'', lavozim:'', tashkilotId:'', rolId:'', email:'', password:'', telefon:'' })

  const { data, isLoading } = useQuery({ queryKey: ['users'], queryFn: () => usersApi.getAll() })
  const users = data?.data?.data || []

  const createMutation = useMutation({
    mutationFn: (d: any) => usersApi.create(d),
    onSuccess: () => { toast.success('Foydalanuvchi yaratildi'); qc.invalidateQueries({ queryKey: ['users'] }); setShowForm(false) },
    onError: () => toast.error('Xatolik'),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: any) => usersApi.updateStatus(id, status),
    onSuccess: () => { toast.success('Yangilandi'); qc.invalidateQueries({ queryKey: ['users'] }) },
  })

  const fields = [
    {k:'fish',l:'F.I.Sh.',t:'text',req:true}, {k:'lavozim',l:'Lavozim',t:'text',req:false},
    {k:'email',l:'Email',t:'email',req:true}, {k:'password',l:'Parol',t:'password',req:true},
    {k:'telefon',l:'Telefon',t:'text',req:false}, {k:'tashkilotId',l:'Tashkilot ID',t:'number',req:true},
    {k:'rolId',l:'Rol ID',t:'number',req:true},
  ]

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Foydalanuvchilar</h1>
            <p className="text-sm text-gray-500 mt-0.5">{users.length} ta foydalanuvchi</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-sm hover:opacity-90 transition"
            style={{ background: 'linear-gradient(135deg, #1a3a6b, #1e4d8c)' }}>
            <Plus size={16} /> Foydalanuvchi qo&apos;shish
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-900">Yangi Foydalanuvchi</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition">
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-5">
              <form onSubmit={e=>{e.preventDefault();createMutation.mutate({...form,tashkilotId:+form.tashkilotId,rolId:+form.rolId})}}
                className="grid grid-cols-2 gap-4">
                {fields.map(f => (
                  <div key={f.k}>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">{f.l}</label>
                    <input type={f.t} value={(form as any)[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})}
                      className={inputCls} required={f.req} />
                  </div>
                ))}
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
          <div className="h-64 bg-white rounded-2xl animate-pulse border border-gray-100" />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {users.length === 0 ? (
              <div className="py-16 text-center">
                <Users size={40} className="mx-auto mb-3 text-gray-200" />
                <p className="text-gray-500 font-medium">Foydalanuvchilar yo&apos;q</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50">
                    {['Foydalanuvchi','Email','Rol','Tashkilot','Holat','Amal'].map(h => (
                      <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u: any, i: number) => (
                    <tr key={u.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold bg-gradient-to-br ${AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]} flex-shrink-0`}>
                            {getInitials(u.fish)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{u.fish}</div>
                            {u.lavozim && <div className="text-xs text-gray-400">{u.lavozim}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 text-sm">{u.email}</td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          <Shield size={11} /> {u.roleDisplayName}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 text-xs max-w-[140px] truncate">{u.tashkilotNomi}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          u.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700'
                          : u.status === 'BLOCKED' ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-600'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'ACTIVE' ? 'bg-emerald-500' : u.status === 'BLOCKED' ? 'bg-red-500' : 'bg-gray-400'}`} />
                          {u.status === 'ACTIVE' ? 'Faol' : u.status === 'BLOCKED' ? 'Bloklangan' : u.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        {u.status === 'ACTIVE' ? (
                          <button onClick={() => statusMutation.mutate({id:u.id, status:'BLOCKED'})}
                            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-medium transition">
                            <UserX size={13} /> Bloklash
                          </button>
                        ) : (
                          <button onClick={() => statusMutation.mutate({id:u.id, status:'ACTIVE'})}
                            className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-800 font-medium transition">
                            <UserCheck size={13} /> Faollashtirish
                          </button>
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
