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
  const [showPw, setShowPw] = useState(false)

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
        @keyframes blob1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(60px,-40px) scale(1.1)} 66%{transform:translate(-30px,60px) scale(0.95)} }
        @keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-50px,60px) scale(1.08)} 66%{transform:translate(70px,-30px) scale(0.97)} }
        @keyframes blob3 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,50px) scale(1.05)} 66%{transform:translate(-60px,-20px) scale(1.1)} }
        .blob1 { animation: blob1 12s ease-in-out infinite; }
        .blob2 { animation: blob2 15s ease-in-out infinite; }
        .blob3 { animation: blob3 10s ease-in-out infinite; }
        input[type=password]::-ms-reveal,
        input[type=password]::-ms-clear { display:none; }
      `}</style>

      <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ background: '#070b14' }}>

        {/* Animated background blobs */}
        <div className="blob1 absolute rounded-full pointer-events-none"
          style={{ width: 700, height: 700, top: '-200px', left: '-200px', background: 'radial-gradient(circle, rgba(37,99,235,0.35) 0%, transparent 70%)' }} />
        <div className="blob2 absolute rounded-full pointer-events-none"
          style={{ width: 600, height: 600, bottom: '-150px', right: '-150px', background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)' }} />
        <div className="blob3 absolute rounded-full pointer-events-none"
          style={{ width: 400, height: 400, top: '50%', left: '55%', background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)' }} />

        {/* Noise texture overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />

        {/* Glass card */}
        <div className="relative z-10 w-full max-w-md mx-4 rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(40px)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}>

          {/* Top accent bar */}
          <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #2563eb, #7c3aed, #2563eb)' }} />

          <div className="px-10 py-12">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-lg flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>A</div>
              <div>
                <div className="text-white font-bold text-sm leading-none">Adliya MediaHub</div>
                <div className="text-xs mt-1" style={{ color: 'rgba(148,163,184,0.6)' }}>Axborot-tahliliy platforma</div>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white leading-tight mb-2">Xush kelibsiz</h1>
              <p className="text-sm" style={{ color: 'rgba(148,163,184,0.7)' }}>Hisobingizga kiring</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'rgba(203,213,225,0.8)' }}>
                  Email manzil
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="email@adliya.uz"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                  onFocus={e => { e.target.style.border = '1px solid rgba(99,102,241,0.7)'; e.target.style.background = 'rgba(255,255,255,0.07)' }}
                  onBlur={e => { e.target.style.border = '1px solid rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'rgba(203,213,225,0.8)' }}>
                  Parol
                </label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                    onFocus={e => { e.target.style.border = '1px solid rgba(99,102,241,0.7)'; e.target.style.background = 'rgba(255,255,255,0.07)' }}
                    onBlur={e => { e.target.style.border = '1px solid rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)' }}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPw(!showPw)}
                    className="absolute top-1/2 right-4 -translate-y-1/2 transition-colors"
                    style={{ color: 'rgba(148,163,184,0.5)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'rgba(148,163,184,1)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(148,163,184,0.5)')}
                  >
                    {showPw ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-50 relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' }}
                >
                  <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
                    style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }} />
                  <span className="relative flex items-center justify-center gap-2">
                    {loading && (
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                    )}
                    {loading ? 'Kirilmoqda...' : 'Kirish'}
                  </span>
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center text-xs" style={{ color: 'rgba(100,116,139,0.6)' }}>
              Muammo bo&apos;lsa{' '}
              <span className="text-blue-400 cursor-pointer hover:text-blue-300 transition-colors">
                administrator bilan bog&apos;laning
              </span>
            </div>
          </div>
        </div>

        {/* Bottom watermark */}
        <div className="absolute bottom-6 text-xs" style={{ color: 'rgba(100,116,139,0.3)' }}>
          © 2026 Adliya MediaHub
        </div>
      </div>
    </>
  )
}
