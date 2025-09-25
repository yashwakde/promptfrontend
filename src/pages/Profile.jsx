import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiContext } from '../context/Appcontext.jsx'

const Profile = () => {
  const { user: ctxUser, fetchProfile, logout: ctxLogout } = useContext(ApiContext)
  const navigate = useNavigate()

  const [profile, setProfile] = useState(() => {
    try {
      const raw = localStorage.getItem('currentUser')
      const parsed = raw ? JSON.parse(raw) : null
      // unwrap nested shapes like { user: { ... } }
      const localUser = parsed?.user || parsed
      const ctxNormalized = ctxUser?.user || ctxUser
      return ctxNormalized || localUser || null
    } catch (e) {
      return ctxUser || null
    }
  })
  const [loading, setLoading] = useState(false)

  // keep in sync with context user
  useEffect(() => {
    if (ctxUser) {
      const ctxNormalized = ctxUser?.user || ctxUser
      setProfile(ctxNormalized)
      try { localStorage.setItem('currentUser', JSON.stringify(ctxNormalized)) } catch(e){}
    }
  }, [ctxUser])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const data = await fetchProfile()
        if (mounted && data) setProfile(data)
      } catch (err) {
        // keep local profile if server refresh fails
        console.warn('Profile: fetchProfile failed', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [fetchProfile])

  if (!profile && loading) return <div className="p-6">Loading profile...</div>
  if (!profile && !loading) return <div className="p-6">No profile found — please login.</div>

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-3xl mx-auto glass p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold mb-1">{profile?.username || profile?.name || 'Profile'}</h2>
            <p className="text-sm text-gray-300">{profile?.email}</p>
          </div>
          <div />
        </div>

        <div className="mt-6">
          <h3 className="font-semibold">Account details</h3>
          <p className="text-sm text-gray-300 mt-2">Email: {profile?.email}</p>
          {profile?.phone && <p className="text-sm text-gray-300">Phone: {profile?.phone}</p>}

          
        </div>
      </div>
    </div>
  )
}

export default Profile