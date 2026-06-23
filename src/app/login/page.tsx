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
        input[type=password]::-ms-reveal,input[type=password]::-ms-clear{display:none}
        .input-field{width:100%;padding:16px 20px;border-radius:14px;font-size:15px;outline:none;transition:all .2s;background:rgba(255,255,255,0.06);border:1.5px solid rgba(255,255,255,0.1);color:#fff;}
        .input-field::placeholder{color:rgba(148,163,184,0.45)}
        .input-field:focus{background:rgba(255,255,255,0.09);border-color:rgba(99,102,241,0.7);box-shadow:0 0 0 4px rgba(99,102,241,0.12)}
      `}</style>

      <div style={{minHeight:'100vh',display:'flex',background:'#080d1a'}}>

        {/* ── LEFT: fills entire half ── */}
        <div style={{
          flex:'0 0 50%',display:'flex',flexDirection:'column',justifyContent:'space-between',
          padding:'56px 64px',position:'relative',overflow:'hidden',
          background:'linear-gradient(150deg,#0a1628 0%,#0d1f3e 50%,#0a1a35 100%)'
        }}>
          {/* blobs */}
          <div style={{position:'absolute',top:-180,left:-120,width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(37,99,235,0.22) 0%,transparent 70%)',pointerEvents:'none'}}/>
          <div style={{position:'absolute',bottom:-120,right:-80,width:420,height:420,borderRadius:'50%',background:'radial-gradient(circle,rgba(124,58,237,0.18) 0%,transparent 70%)',pointerEvents:'none'}}/>
          {/* grid */}
          <div style={{position:'absolute',inset:0,pointerEvents:'none',backgroundImage:'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)',backgroundSize:'52px 52px'}}/>

          {/* Logo */}
          <div style={{position:'relative',zIndex:1,display:'flex',alignItems:'center',gap:14}}>
            <div style={{width:44,height:44,borderRadius:14,background:'linear-gradient(135deg,#2563eb,#7c3aed)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:20,color:'#fff',flexShrink:0}}>A</div>
            <div>
              <div style={{color:'#fff',fontWeight:700,fontSize:15,lineHeight:1}}>Adliya MediaHub</div>
              <div style={{color:'rgba(148,163,184,0.55)',fontSize:12,marginTop:4}}>Axborot-tahliliy platforma</div>
            </div>
          </div>

          {/* Center content */}
          <div style={{position:'relative',zIndex:1}}>
            {/* visual: stacked cards */}
            <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:48}}>
              {[
                {w:'100%',label:'OAV So\'rovlari',val:'247 ta faol',color:'rgba(37,99,235,0.25)',border:'rgba(37,99,235,0.4)'},
                {w:'85%',label:'Tadbirlar',val:'18 ta bugun',color:'rgba(124,58,237,0.2)',border:'rgba(124,58,237,0.35)'},
                {w:'70%',label:'Monitoring',val:'3 ta tanqidiy',color:'rgba(239,68,68,0.15)',border:'rgba(239,68,68,0.3)'},
              ].map(item=>(
                <div key={item.label} style={{width:item.w,padding:'16px 20px',borderRadius:16,background:item.color,border:`1px solid ${item.border}`,backdropFilter:'blur(8px)'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <span style={{color:'rgba(226,232,240,0.7)',fontSize:13}}>{item.label}</span>
                    <span style={{color:'#fff',fontWeight:600,fontSize:13}}>{item.val}</span>
                  </div>
                </div>
              ))}
            </div>

            <h2 style={{color:'#fff',fontSize:42,fontWeight:800,lineHeight:1.2,letterSpacing:'-0.02em',marginBottom:16}}>
              Media kontentni<br/>
              <span style={{background:'linear-gradient(90deg,#60a5fa,#a78bfa)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                professional
              </span>{' '}boshqaring
            </h2>
            <p style={{color:'rgba(148,163,184,0.65)',fontSize:15,lineHeight:1.7,maxWidth:360}}>
              OAV so'rovlari, tadbirlar, monitoring va hisobotlar — hammasi bir platformada.
            </p>
          </div>

          {/* Stats */}
          <div style={{position:'relative',zIndex:1,display:'flex',gap:40,paddingTop:32,borderTop:'1px solid rgba(255,255,255,0.07)'}}>
            {[['10K+','Foydalanuvchi'],['500+','Tashkilot'],['99.9%','Uptime']].map(([v,l])=>(
              <div key={l}>
                <div style={{color:'#fff',fontSize:24,fontWeight:800}}>{v}</div>
                <div style={{color:'rgba(148,163,184,0.5)',fontSize:12,marginTop:4}}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: form fills entire half ── */}
        <div style={{flex:'0 0 50%',display:'flex',flexDirection:'column',justifyContent:'center',padding:'56px 72px',background:'#f0f4ff'}}>

          <div style={{maxWidth:420,width:'100%'}}>
            <h1 style={{fontSize:34,fontWeight:800,color:'#0f172a',letterSpacing:'-0.02em',marginBottom:8}}>
              Xush kelibsiz 👋
            </h1>
            <p style={{color:'#64748b',fontSize:15,marginBottom:48}}>
              Davom etish uchun hisobingizga kiring
            </p>

            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:24}}>
              <div>
                <label style={{display:'block',fontSize:13,fontWeight:600,color:'#334155',marginBottom:10,letterSpacing:'0.01em'}}>
                  Email manzil
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e=>setForm({...form,email:e.target.value})}
                  placeholder="email@adliya.uz"
                  required
                  autoComplete="email"
                  style={{width:'100%',padding:'16px 20px',borderRadius:14,fontSize:15,outline:'none',transition:'all .2s',background:'#fff',border:'1.5px solid #e2e8f0',color:'#0f172a',boxSizing:'border-box'}}
                  onFocus={e=>{e.target.style.borderColor='#6366f1';e.target.style.boxShadow='0 0 0 4px rgba(99,102,241,0.1)'}}
                  onBlur={e=>{e.target.style.borderColor='#e2e8f0';e.target.style.boxShadow='none'}}
                />
              </div>

              <div>
                <label style={{display:'block',fontSize:13,fontWeight:600,color:'#334155',marginBottom:10,letterSpacing:'0.01em'}}>
                  Parol
                </label>
                <div style={{position:'relative'}}>
                  <input
                    type={showPw?'text':'password'}
                    value={form.password}
                    onChange={e=>setForm({...form,password:e.target.value})}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    style={{width:'100%',padding:'16px 52px 16px 20px',borderRadius:14,fontSize:15,outline:'none',transition:'all .2s',background:'#fff',border:'1.5px solid #e2e8f0',color:'#0f172a',boxSizing:'border-box'}}
                    onFocus={e=>{e.target.style.borderColor='#6366f1';e.target.style.boxShadow='0 0 0 4px rgba(99,102,241,0.1)'}}
                    onBlur={e=>{e.target.style.borderColor='#e2e8f0';e.target.style.boxShadow='none'}}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={()=>setShowPw(!showPw)}
                    style={{position:'absolute',top:'50%',right:18,transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'#94a3b8',padding:0,display:'flex',alignItems:'center'}}
                  >
                    {showPw?(
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ):(
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width:'100%',padding:'17px',borderRadius:14,fontSize:15,fontWeight:700,
                  color:'#fff',border:'none',cursor:loading?'not-allowed':'pointer',
                  background:'linear-gradient(135deg,#2563eb 0%,#7c3aed 100%)',
                  opacity:loading?0.7:1,transition:'opacity .2s',marginTop:8,
                  boxShadow:'0 8px 24px rgba(37,99,235,0.35)',
                }}
              >
                {loading?(
                  <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10}}>
                    <svg style={{animation:'spin 1s linear infinite'}} width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                      <path d="M12 2a10 10 0 0110 10" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    Kirilmoqda...
                  </span>
                ):'Kirish'}
              </button>
            </form>

            <p style={{marginTop:36,textAlign:'center',fontSize:13,color:'#94a3b8'}}>
              Muammo bo&apos;lsa{' '}
              <span style={{color:'#6366f1',cursor:'pointer',fontWeight:500}}>administrator bilan bog&apos;laning</span>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
