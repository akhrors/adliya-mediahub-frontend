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
    <>
      <style>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear,
        input[type="password"]::-webkit-contacts-auto-fill-button,
        input[type="password"]::-webkit-credentials-auto-fill-button { display: none !important; }
      `}</style>

      <div className="min-h-screen flex bg-slate-950">
        {/* ── Left branding panel ─────────────────────────────── */}
        <div className="hidden lg:flex w-[55%] relative overflow-hidden flex-col p-12"
          style={{ background: 'linear-gradient(145deg, #0a1628 0%, #0f2444 60%, #112d52 100%)' }}>

          {/* Glowing orbs */}
          <div className="pointer-events-none absolute" style={{
            top: '-120px', left: '-80px', width: '500px', height: '500px',
            background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
          }} />
          <div className="pointer-events-none absolute" style={{
            bottom: '-100px', right: '-60px', width: '400px', height: '400px',
            background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          }} />
          <div className="pointer-events-none absolute" style={{
            top: '45%', left: '55%', width: '300px', height: '300px',
            background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)',
          }} />

          {/* Subtle grid lines */}
          <div className="pointer-events-none absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }} />

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-3 mb-auto">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-base"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>A</div>
            <span className="text-white font-semibold tracking-wide">Adliya MediaHub</span>
          </div>

          {/* Center hero */}
          <div className="relative z-10 flex-1 flex flex-col justify-center max-w-md">
            {/* Abstract icon cluster */}
            <div className="mb-12 flex items-end gap-3">
              <div className="flex flex-col gap-3">
                <div className="w-12 h-12 rounded-2xl" style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)' }} />
                <div className="w-12 h-20 rounded-2xl" style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.2)' }} />
              </div>
              <div className="flex flex-col gap-3 mb-3">
                <div className="w-12 h-24 rounded-2xl" style={{ background: 'rgba(59,130,246,0.25)', border: '1px solid rgba(59,130,246,0.35)' }} />
                <div className="w-12 h-8 rounded-2xl" style={{ background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.3)' }} />
              </div>
              <div className="flex flex-col gap-3 mb-6">
                <div className="w-12 h-14 rounded-2xl" style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.25)' }} />
                <div className="w-12 h-16 rounded-2xl" style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.2)' }} />
              </div>
              <div className="flex flex-col gap-3 mb-2">
                <div className="w-12 h-10 rounded-2xl" style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.2)' }} />
                <div className="w-12 h-28 rounded-2xl" style={{ background: 'rgba(59,130,246,0.3)', border: '1px solid rgba(59,130,246,0.4)' }} />
              </div>
            </div>

            <h2 className="text-5xl font-bold text-white leading-[1.15] tracking-tight mb-5">
              Media kontentni<br />
              <span style={{ color: '#60a5fa' }}>professional</span><br />
              boshqaring
            </h2>
            <p style={{ color: 'rgba(148,163,184,0.8)' }} className="text-base leading-relaxed">
              OAV so'rovlari, tadbirlar, monitoring va hisobotlar — hammasi bir platformada.
            </p>

            {/* Stats */}
            <div className="flex gap-8 mt-10 pt-10" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {[['10K+', "Foydalanuvchi"], ['500+', 'Tashkilot'], ['99.9%', 'Uptime']].map(([v, l]) => (
                <div key={l}>
                  <div className="text-2xl font-bold text-white">{v}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'rgba(148,163,184,0.6)' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 text-xs" style={{ color: 'rgba(100,116,139,0.5)' }}>
            © 2026 Adliya MediaHub
          </div>
        </div>

        {/* ── Right form panel ────────────────────────────────── */}
        <div className="flex-1 flex items-center justify-center px-8 py-12"
          style={{ background: '#f8fafc' }}>
          <div className="w-full max-w-[360px]">

            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-2.5 mb-10">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ background: 'linear-gradient(135deg, #1a3a6b, #2563eb)' }}>A</div>
              <span className="font-semibold text-slate-800">Adliya MediaHub</span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-1">Xush kelibsiz</h1>
            <p className="text-sm text-slate-400 mb-8">Davom etish uchun hisobingizga kiring</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  style={{ background: 'white', border: '1.5px solid #e2e8f0' }}
                  placeholder="email@adliya.uz"
                  required
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                  Parol
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    style={{ background: 'white', border: '1.5px solid #e2e8f0' }}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3.5 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white mt-2 transition-opacity disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Kirish...
                  </span>
                ) : 'Kirish'}
              </button>
            </form>

            <p className="text-center text-xs text-slate-400 mt-8">
              Muammo bo&apos;lsa administrator bilan bog&apos;laning
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
