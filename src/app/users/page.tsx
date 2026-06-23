'use client'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@/lib/api'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, UserCheck, UserX } from 'lucide-react'

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

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Foydalanuvchilar</h1>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#1E3A5F] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#2D5286]">
            <Plus size={16}/> Foydalanuvchi qo&apos;shish
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="font-semibold mb-4">Yangi Foydalanuvchi</h2>
            <form onSubmit={e=>{e.preventDefault();createMutation.mutate({...form,tashkilotId:+form.tashkilotId,rolId:+form.rolId})}} className="grid grid-cols-2 gap-4">
              {[{k:'fish',l:'F.I.Sh.'},{k:'lavozim',l:'Lavozim'},{k:'email',l:'Email',t:'email'},{k:'password',l:'Parol',t:'password'},{k:'telefon',l:'Telefon'},{k:'tashkilotId',l:'Tashkilot ID',t:'number'},{k:'rolId',l:'Rol ID',t:'number'}].map(f=>(
                <div key={f.k}><label className="block text-sm text-gray-600 mb-1">{f.l}</label>
                  <input type={f.t||'text'} value={(form as any)[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                    required={['fish','email','password','tashkilotId','rolId'].includes(f.k)}/></div>
              ))}
              <div className="col-span-2 flex gap-3 justify-end">
                <button type="button" onClick={()=>setShowForm(false)} className="px-4 py-2 border rounded-lg text-sm">Bekor</button>
                <button type="submit" disabled={createMutation.isPending} className="px-4 py-2 bg-[#1E3A5F] text-white rounded-lg text-sm disabled:opacity-50">
                  {createMutation.isPending?'Saqlanmoqda...':'Saqlash'}
                </button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? <div className="h-64 bg-white rounded-xl animate-pulse"/> : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>{['#','F.I.Sh.','Email','Rol','Tashkilot','Status','Amal'].map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u:any,i:number)=>(
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400">{i+1}</td>
                    <td className="px-4 py-3 font-medium">{u.fish}</td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">{u.roleDisplayName}</span></td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{u.tashkilotNomi}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${u.status==='ACTIVE'?'bg-green-100 text-green-700':u.status==='BLOCKED'?'bg-red-100 text-red-700':'bg-gray-100 text-gray-600'}`}>{u.status}</span></td>
                    <td className="px-4 py-3 flex gap-2">
                      {u.status==='ACTIVE'
                        ?<button onClick={()=>statusMutation.mutate({id:u.id,status:'BLOCKED'})} title="Bloklash" className="p-1 text-red-500 hover:bg-red-50 rounded"><UserX size={14}/></button>
                        :<button onClick={()=>statusMutation.mutate({id:u.id,status:'ACTIVE'})} title="Faollashtirish" className="p-1 text-green-500 hover:bg-green-50 rounded"><UserCheck size={14}/></button>
                      }
                    </td>
                  </tr>
                ))}
                {users.length===0&&<tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Foydalanuvchilar yo&apos;q</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
