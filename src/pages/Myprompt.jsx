import React, { useContext, useEffect, useState } from 'react'
import { ApiContext } from '../context/Appcontext.jsx'
import { jsPDF } from 'jspdf'

const PromptCard = ({ prompt }) => (
  <article className="glass p-4 rounded-lg shadow-sm hover:shadow-md transition">
    <div className="flex justify-between items-start gap-4">
      <div className="flex-1">
        <h4 className="font-semibold text-lg text-white">{prompt.title}</h4>
        <p className="text-sm text-gray-300 mt-2 whitespace-pre-wrap">{prompt.description}</p>
      </div>
      <div className="ml-4 text-right">
        <div className="text-xs text-gray-400 mb-2">{new Date(prompt.createdAt || prompt.created || Date.now()).toLocaleDateString()}</div>
        <div className="flex flex-col items-end gap-2">
          <button onClick={() => navigator.clipboard.writeText(prompt.description)} className="px-3 py-1 rounded bg-yellow-400 text-black text-sm">Copy</button>
          <button onClick={() => downloadPromptPdf(prompt)} className="px-3 py-1 rounded bg-blue-500 text-white text-sm">Download PDF</button>
        </div>
      </div>
    </div>
  </article>
)

function downloadPromptPdf(prompt) {
  try {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const margin = 40
    const pageWidth = doc.internal.pageSize.getWidth()
    const usableWidth = pageWidth - margin * 2

    doc.setFontSize(18)
    doc.text(prompt.title || 'Prompt', margin, 80)

    doc.setFontSize(12)
    const text = prompt.description || ''
    const lines = doc.splitTextToSize(text, usableWidth)
    doc.text(lines, margin, 110)

    if (prompt.tag) {
      doc.setFontSize(10)
      doc.text(`Tag: ${prompt.tag}`, margin, 110 + lines.length * 14 + 20)
    }

    const safeTitle = (prompt.title || 'prompt').replace(/[^a-z0-9\-_ ]/gi, '').slice(0, 50)
    doc.save(`${safeTitle || 'prompt'}.pdf`)
  } catch (err) {
    console.error('Failed to generate PDF', err)
    alert('Failed to generate PDF. See console for details.')
  }
}

const Myprompt = () => {
  const { user, myprompts } = useContext(ApiContext)
  const [prompts, setPrompts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const uid = user?._id || user?.id || user
        if (!uid) throw new Error('Not logged in')
  const data = await myprompts(uid)
  // normalise server shapes
  let list = []
  if (Array.isArray(data)) list = data
  else if (Array.isArray(data?.prompts)) list = data.prompts
  else if (Array.isArray(data?.data)) list = data.data
  if (mounted) setPrompts(list)
      } catch (err) {
        setError((err && (err.message || err.error)) || String(err))
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [user, myprompts])

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-white mb-6">My Prompts</h2>
        {loading && <div className="text-gray-300">Loading your prompts...</div>}
        {error && <div className="text-red-400">{error}</div>}
        {!loading && !error && (
          <>
            {prompts.length === 0 ? (
              <div className="text-gray-300">You don't have any prompts yet.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {prompts.map(p => (
                  <div key={p._id || p.id}>
                    <PromptCard prompt={p} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Myprompt
