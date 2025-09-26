import React, { useState, useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiContext } from '../context/Appcontext.jsx'
import { animate } from 'motion'
import { toast } from 'react-toastify'

const Create = () => {
  const { createprompt, user } = useContext(ApiContext)
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tag, setTag] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showOverlay, setShowOverlay] = useState(false)
  const overlayRef = useRef(null)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!title.trim() || !description.trim()) {
      setError('Please provide title and description')
      toast.error('Please provide title and description')
      return
    }
    setLoading(true)
    try {
      setShowOverlay(true)
      const start = Date.now()
      const payload = { title: title.trim(), description: description.trim(), tag: tag.trim(), author: user?._id || user?.id }
      await createprompt(payload)
      const elapsed = Date.now() - start
      const min = 2200
      const wait = Math.max(0, min - elapsed)
      if (wait > 0) await new Promise(r => setTimeout(r, wait))
      if (overlayRef.current) animate(overlayRef.current, { opacity: [1, 0], transform: ['scale(1)', 'scale(0.98)'] }, { duration: 300 })
      setTitle(''); setDescription(''); setTag('');
      toast.success('Prompt created successfully!')
      navigate('/myprompts')
    } catch (err) {
      setError((err && (err.message || err.error)) || String(err))
      toast.error((err && (err.message || err.error)) || String(err))
    } finally {
      setLoading(false)
      setTimeout(() => setShowOverlay(false), 320)
    }
  }

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-3xl mx-auto glass p-6 rounded-lg">
        <h2 className="text-2xl font-semibold text-white mb-4">Create Prompt</h2>
        {error && <div className="text-red-400 mb-3">{error}</div>}
        <form onSubmit={submit} className="space-y-3">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full px-4 py-3 rounded bg-black/40 text-white" />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description / prompt text" className="w-full px-4 py-3 rounded bg-black/40 text-white min-h-[120px]" />
          <input value={tag} onChange={e => setTag(e.target.value)} placeholder="Tag (optional)" className="w-full px-4 py-3 rounded bg-black/40 text-white" />

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="accent-yellow px-4 py-2 rounded-full font-semibold">{loading ? 'Creating...' : 'Create'}</button>
            <button type="button" onClick={() => { setTitle(''); setDescription(''); setTag(''); setError('') }} className="px-4 py-2 rounded-full bg-gray-700">Clear</button>
          </div>
        </form>
      </div>

      {/* AI generation overlay */}
      {showOverlay && (
        <div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gradient-to-br from-black/80 to-black/60 p-8 rounded-lg text-center glass">
            <div className="mb-4 text-white font-semibold text-lg">Generating prompt with AI...</div>
            <div className="flex items-center justify-center gap-3">
              <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />
              <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse delay-75" />
              <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse delay-150" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Create
