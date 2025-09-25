import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ApiContext } from '../context/Appcontext.jsx'

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const { register } = useContext(ApiContext)

  const sendVerification = async (e) => {
    e.preventDefault()
    setError('')
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Please fill username, email and password.')
      return
    }

    try {
      // Call backend register endpoint via ApiContext
      const payload = { username: username.trim(), email: email.trim(), password, phone: phone.trim() }
      const res = await register(payload)

      // If the backend responds OK, navigate to verify page.
      // Store pending email to prefill verify form (safe: only email)
  // store pending registration response so Verify page can display/prefill
  try { localStorage.setItem('pendingRegistration', JSON.stringify(res)) } catch (e) {}
  localStorage.setItem('pendingEmail', email.trim())
      navigate('/verify')
    } catch (err) {
      // err may be a string or object from ApiContext
      const msg = (err && (err.message || err.error || err.msg)) || JSON.stringify(err)
      setError(msg)
    }
  }

  return (
    <div className=" mt-30 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl">
        <div className="mx-auto flex flex-col md:flex-row items-stretch bg-white rounded-lg gap-6">
          {/* Left: marketing (hidden on small screens) */}
          <div className="hidden md:flex md:w-1/2 items-center">
            <div className="p-8">
              <h2 className="text-3xl font-extrabold text-black mb-3">Create your free account</h2>
              <p className="text-gray-500">Join PromptVault to save, organize and reuse prompts across projects and teams. Fast onboarding and simple verification.</p>

              <ul className="mt-6 space-y-3 text-sm">
                <li className="flex gap-3 items-start">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-yellow-400 font-bold text-black">✓</span>
                  <span className="text-gray-500">One-click copy</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-yellow-400 font-bold text-black">✓</span>
                  <span className="text-gray-500">Smart search & tags</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-yellow-400 font-bold text-black">✓</span>
                  <span className="text-gray-500">Share with your team</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: form card */}
          <div className="md:w-1/2 w-full flex items-center justify-center">
            <div className="bg-black rounded-r-lg  p-8  shadow-2xl w-full max-w-md">
              <h3 className="text-2xl font-semibold mb-4">Sign up</h3>
              {error && <div className="text-sm text-red-400 mb-2">{error}</div>}

              <form onSubmit={sendVerification} className="space-y-3">
                <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-500" />
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-500" />
                <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-500" />
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number" className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-500" />

                <div className="flex gap-3 mt-2">
                  <button type="submit" className="accent-yellow px-4 py-2 rounded-full font-semibold hover:brightness-95">Verify</button>
                  <button type="button" onClick={() => { setUsername(''); setEmail(''); setPassword(''); setPhone(''); setError('') }} className="px-4 py-2 rounded-full bg-gray-700">Clear</button>
                </div>
              </form>

              <p className="mt-4 text-sm text-gray-300">Already have an account? <Link to="/login" className="text-yellow-400">Login</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
