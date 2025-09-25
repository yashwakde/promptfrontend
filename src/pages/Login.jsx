import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ApiContext } from '../context/Appcontext.jsx'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const { login } = useContext(ApiContext)
  const { fetchProfile } = useContext(ApiContext)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const payload = { email: email.trim(), password }
      const res = await login(payload)

      // ensure token/user are persisted by context.login, but tolerate server shapes
  const token = res?.token || res?.accessToken || res?.data?.token
  let user = res?.user || res?.data?.user || res
  user = user?.user || user
  try { if (token) localStorage.setItem('pv_token', token) } catch(e){}
  try { if (user) localStorage.setItem('currentUser', JSON.stringify(user)) } catch(e){}

      // refresh profile in context and redirect home
      try { await fetchProfile() } catch (e) { /* ignore - fetchProfile logs */ }
      navigate('/')
    } catch (err) {
      const msg = (err && (err.message || err.error || err.msg)) || JSON.stringify(err)
      setError(msg)
    }
  }

  return (
    <div className="mt-30 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl">
        <div className="mx-auto flex flex-col md:flex-row items-stretch gap-6">
          {/* Left: marketing (hidden on small screens) */}
          <div className="hidden md:flex md:w-1/2 items-center bg-black rounded-l-lg">
            <div className="p-8">
              <h2 className="text-3xl font-extrabold text-white mb-3">Welcome back</h2>
              <p className="text-gray-300">Log in to access your saved prompts and continue your workflow.</p>

              <ul className="mt-6 space-y-3 text-sm">
                <li className="flex gap-3 items-start">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-yellow-400 font-bold text-black">✓</span>
                  <span className="text-gray-200">Fast access to your prompts</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-yellow-400 font-bold text-black">✓</span>
                  <span className="text-gray-200">Sync across devices</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-yellow-400 font-bold text-black">✓</span>
                  <span className="text-gray-200">Team sharing</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: form card */}
          <div className="md:w-1/2 w-full flex items-center justify-center">
            <div className="p-8 rounded-r-lg w-full max-w-md">
              <h3 className="text-2xl text-black font-semibold mb-4">Log in</h3>
              {error && <div className="text-sm text-red-400 mb-2">{error}</div>}

              <form onSubmit={submit} className="space-y-3">
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-900" />
                <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-900" />

                <div className="flex gap-3 mt-2">
                  <button type="submit" className="accent-yellow px-4 py-2 rounded-full font-semibold hover:brightness-95">Login</button>
                </div>
              </form>

              <p className="mt-4 text-sm text-gray-700">Don't have an account? <Link to="/register" className="text-yellow-400">Create new account</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
