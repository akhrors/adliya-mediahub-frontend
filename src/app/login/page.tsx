'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

export default function LoginPage() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authApi.login(form)
      const { user, accessToken, refreshToken } = res.data.data
      setAuth(user, accessToken, refreshToken)
      router.push('/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login xatolik')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'linear-gradient(135deg, #0f2444 0%, #1a3a6b 50%, #1e4d8c 100%)' }}>

        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #4a9eff, transparent)' }} />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #4a9eff, transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #ffffff, transparent)' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg"
            style={{ background: 'linear-gradient(135deg, #4a9eff, #1a6dd4)' }}>
            <span className="text-white">A</span>
          </div>
          <span className="text-white font-semibold text-lg tracking-wide">Adliya MediaHub</span>
        </div>

        {/* Center content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          {/* Grid icon illustration */}
          <div className="mb-10 grid grid-cols-3 gap-3 w-48">
            {[...Array(9)].map((_, i) => (
              <div key={i}
                className="h-14 rounded-xl"
                style={{
                  background: i % 3 === 0
                    ? 'rgba(74,158,255,0.35)'
                    : i % 3 === 1
                    ? 'rgba(255,255,255,0.08)'
                    : 'rgba(74,158,255,0.15)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}
              />
            ))}
          </div>

          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Media kontentni<br />boshqaring
          </h2>
          <p className="text-blue-200 text-base leading-relaxed max-w-xs opacity-80">
            Barcha media resurslarni bir joyda saqlang, tarqating va tahlil qiling.
          </p>

          {/* Stats row */}
          <div className="flex gap-8 mt-10">
            {[
              { value: '10K+', label: 'Foydalanuvchi' },
              { value: '500+', label: 'Tashkilot' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-blue-300 mt-0.5 opacity-70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="relative z-10 text-blue-300 text-xs opacity-50">
          © 2026 Adliya MediaHub. Barcha huquqlar himoyalangan.
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center bg-[#f8fafc] px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg"
              style={{ background: 'linear-gradient(135deg, #1a3a6b, #1e4d8c)' }}>
              <span className="text-white">A</span>
            </div>
            <span className="text-[#1a3a6b] font-semibold text-lg">Adliya MediaHub</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Xush kelibsiz</h1>
            <p className="text-gray-500 text-sm mt-1">Hisobingizga kiring</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email manzil
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
                placeholder="email@adliya.uz"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Parol
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 pr-11 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 mt-2 relative overflow-hidden disabled:opacity-70"
              style={{ background: loading ? '#1a3a6b' : 'linear-gradient(135deg, #1a3a6b 0%, #1e4d8c 100%)' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Kirish...
                </span>
              ) : 'Kirish'}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">Xavfsiz kirish</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Security note */}
          <div className="mt-6 flex items-start gap-2.5 bg-blue-50 rounded-xl p-3.5 border border-blue-100">
            <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <p className="text-xs text-blue-700 leading-relaxed">
              Barcha ma'lumotlar SSL orqali shifrlangan. Siz xavfsiz ulanishdasiz.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
