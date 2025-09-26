import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiContext } from '../context/Appcontext.jsx'
import { toast } from 'react-toastify'

const CreateOrRegisterButton = () => {
  const { user } = useContext(ApiContext)
  const navigate = useNavigate()
  const onClick = (e) => {
    e.preventDefault()
    if (user) navigate('/create')
    else navigate('/register')
  }
  return (
    <button onClick={onClick} className="px-5 py-3 rounded-full bg-white/10">Create</button>
  )
}

const Home = () => {
  // Demo/test: show a toast on mount to confirm backend is connected
  React.useEffect(() => {
    fetch('/').then(() => {
      // If backend is up, do nothing
    }).catch(() => {
      toast.error('Backend not reachable!')
    })
  }, [])
  return (
    <div className="min-h-screen flex flex-col px-4 sm:px-6 lg:px-8">
      {/* HERO */}
      <header className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">PromptVault — save & reuse your best prompts</h1>
            <p className="mt-4 text-gray-200 text-lg">Capture effective prompts, organize them by project or tag, and reuse them across AI tools. Built for speed and simplicity.</p>

            <div className="mt-6 flex gap-3">
              <Link to="/register" className="accent-yellow px-5 py-3 rounded-full font-semibold">Get Started</Link>
              <CreateOrRegisterButton />
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="glass p-3 rounded-lg">
                <h4 className="font-semibold">Save</h4>
                <p className="text-gray-300 text-xs">Quickly store prompts with titles and notes.</p>
              </div>
              <div className="glass p-3 rounded-lg">
                <h4 className="font-semibold">Organize</h4>
                <p className="text-gray-300 text-xs">Search, tag and categorize prompts for fast reuse.</p>
              </div>
              <div className="glass p-3 rounded-lg">
                <h4 className="font-semibold">Share</h4>
                <p className="text-gray-300 text-xs">Copy or export prompts to collaborate with your team.</p>
              </div>
            </div>
          </div>

          <aside className="glass p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-2">Why PromptVault?</h3>
            <p className="text-gray-200">Centralize your best prompts so you never lose a high-performing idea. Use tags, quick copies, and organized lists to make your workflow faster.</p>

            <div className="mt-6">
              <h4 className="font-semibold">Quick Preview</h4>
              <div className="mt-3 bg-white/6 p-3 rounded-md">
                <p className="text-sm text-gray-100">Example: "Write a friendly onboarding email for new users highlighting the 3 main benefits of our product."</p>
              </div>
            </div>
          </aside>
        </div>
      </header>

      {/* FEATURES */}
      <section id="features" className="py-12 ">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Features that speed up your workflow</h2>
          <p className="text-gray-300 mb-6">From one-click copy to smart search, PromptVault helps you find and reuse your best prompts instantly.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <article className="glass p-6 rounded-lg transform transition hover:-translate-y-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
                  {/* search icon */}
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"></path></svg>
                </div>
                <div>
                  <h4 className="font-semibold">Smart Search</h4>
                  <p className="text-gray-300 text-sm">Find prompts by title, content or tag in milliseconds.</p>
                </div>
              </div>
            </article>

            <article className="glass p-6 rounded-lg transform transition hover:-translate-y-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
                  {/* copy icon */}
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="13" height="13" x="9" y="9" rx="2" /><path d="M5 15V5a2 2 0 012-2h8"/></svg>
                </div>
                <div>
                  <h4 className="font-semibold">One-click Copy</h4>
                  <p className="text-gray-300 text-sm">Copy any prompt to your clipboard with a single click.</p>
                </div>
              </div>
            </article>

            <article className="glass p-6 rounded-lg transform transition hover:-translate-y-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
                  {/* folder icon */}
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 7a2 2 0 012-2h3l2 2h7a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/></svg>
                </div>
                <div>
                  <h4 className="font-semibold">Organized Collections</h4>
                  <p className="text-gray-300 text-sm">Group prompts into collections per project or topic.</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS / SOCIAL PROOF */}
      <section className="py-12 sm:py-16 px-0">
        <div className="max-w-6xl mx-auto px-0">
          <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-6">Loved by creators</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <blockquote className="glass p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <p className="text-gray-100">"PromptVault saved me hours of rewriting—my best prompts are always at hand."</p>
              <footer className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center font-bold text-black">A</div>
                <div>
                  <span className="block font-semibold">Aisha</span>
                  <span className="text-xs text-gray-300">Content Strategist</span>
                </div>
              </footer>
            </blockquote>

            <blockquote className="glass p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <p className="text-gray-100">"Easy to use and fast. Perfect for prototyping AI prompts."</p>
              <footer className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center font-bold text-black">M</div>
                <div>
                  <span className="block font-semibold">Marcus</span>
                  <span className="text-xs text-gray-300">Developer</span>
                </div>
              </footer>
            </blockquote>

            <blockquote className="glass p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <p className="text-gray-100">"The search and copy workflow is a lifesaver for our team."</p>
              <footer className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center font-bold text-black">L</div>
                <div>
                  <span className="block font-semibold">Lina</span>
                  <span className="text-xs text-gray-300">Product Designer</span>
                </div>
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

     
      {/* FOOTER */}
      <footer className="mt-auto border-t border-white/5">
        <div className="max-w-6xl mx-auto px-0 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h5 className="text-lg font-bold text-black">PromptVault</h5>
            <p className="text-xs text-gray-900">© {new Date().getFullYear()} PromptVault — All rights reserved.</p>
          </div>

          <div className="flex gap-4 items-center">
            <Link to="/" className="text-sm text-gray-900">Privacy</Link>
            <Link to="/" className="text-sm text-gray-900">Terms</Link>
            <a href="mailto:hello@promptvault.example" className="text-sm text-gray-900">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
