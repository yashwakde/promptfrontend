import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiContext } from '../context/Appcontext.jsx'

const Verify = () => {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [pending, setPending] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { verifyEmail, fetchProfile } = useContext(ApiContext)

  useEffect(() => {
    // try to prefill email from pendingEmail saved at registration
    const pendingEmail = localStorage.getItem('pendingEmail')
    if (pendingEmail) setEmail(pendingEmail)
    const p = localStorage.getItem('pendingRegistration')
    if (p) {
      try {
        const parsed = JSON.parse(p)
        // support server returning nested shapes or plain strings
        setPending(parsed)
      } catch (e) {
        setPending(p)
      }
    }
  }, [])

  const complete = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = { email: email.trim(), code: code.trim() }
      const res = await verifyEmail(payload)

      // expected server to return token and user data
      const token = res.token || res.accessToken || res.data?.token
      let user = res.user || res.data?.user || res
      user = user?.user || user
      if (token) localStorage.setItem('pv_token', token)
      if (user) localStorage.setItem('currentUser', JSON.stringify(user))

      // cleanup local pending keys
      localStorage.removeItem('pendingRegistration')
      localStorage.removeItem('pendingEmail')

      // refresh context profile so Navbar/Profile update
      try { await fetchProfile() } catch (e) {}

      // navigate to home
      navigate('/login')
    } catch (err) {
      const msg = (err && (err.message || err.error || err.msg)) || JSON.stringify(err)
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  if (!pending) return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="glass p-6 rounded-lg">No pending registration found. Please register first.</div>
    </div>
  )

  return (
    <div className=" flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full glass p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Verify your account</h2>
        <p className="text-sm text-gray-300 mb-3">We've sent a verification code to your email (demo: check console).</p>

        {/* show pending registration details (helpful for demo) */}
        {pending && (
          <div className="mb-3 text-sm text-gray-300">
            <div className="font-semibold">Pending registration</div>
            <div>Email: {pending?.email || pending?.data?.email || ''}</div>
            {pending?.username && <div>Username: {pending.username}</div>}
          </div>
        )}

        <form onSubmit={complete} className="space-y-3">
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" className="w-full px-3 py-2 rounded-md text-gray-300" />
          <input value={code} onChange={e => setCode(e.target.value)} placeholder="Verification code" className="w-full px-3 py-2 rounded-md text-gray-300" />

          {error && <div className="text-sm text-red-400">{error}</div>}
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="accent-yellow px-4 py-2 rounded-full font-semibold disabled:opacity-60">{loading ? 'Verifying...' : 'Complete Registration'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Verify
