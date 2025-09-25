import React, { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import { ApiContext } from '../context/Appcontext.jsx'

const Navbar = () => {
  // context first so we can call logout from context if provided
  const { user: ctxUser, logout: ctxLogout } = useContext(ApiContext)

  const [currentUser, setCurrentUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = () => {
    // prefer context-provided logout which should update context.user and clear storage
    if (typeof ctxLogout === 'function') {
      ctxLogout()
    } else {
      localStorage.removeItem('pv_token')
      localStorage.removeItem('currentUser')
      setIsLoggedIn(false)
    }
    // close mobile menu
    setMobileOpen(false)
  }

  const toggleMobile = () => setMobileOpen(v => !v);

  const linkClass = ({ isActive }) => (isActive ? "text-black font-semibold" : "text-black/80");

  // initialize from localStorage on mount
  useEffect(() => {
    try {
      const token = localStorage.getItem('pv_token')
      const localUser = localStorage.getItem('currentUser')
      if (localUser) setCurrentUser(JSON.parse(localUser))
      setIsLoggedIn(!!token || !!localUser)
    } catch (err) {
      console.warn('Navbar: failed to read localStorage user', err)
    }
  }, [])

  // sync context user -> local state and persist
  useEffect(() => {
    if (ctxUser) {
      const ctxNormalized = ctxUser?.user || ctxUser
      setCurrentUser(ctxNormalized)
      try { localStorage.setItem('currentUser', JSON.stringify(ctxNormalized)) } catch(e){}
      setIsLoggedIn(true)
    } else {
      // if context user is cleared, reflect that in UI
      setCurrentUser(null)
      setIsLoggedIn(!!localStorage.getItem('pv_token'))
    }
  }, [ctxUser])

  return (
    <nav className="w-full px-7 py-8">
      <div className="  flex items-center justify-between">
        <div className="flex items-center gap-4">
          <NavLink to="/" className=" animate-pulse text-4xl font-extrabold text-white">PromptVault<span className="text-yellow-400">.AI</span></NavLink>
          <p className="hidden md:block text-sm text-gray-300">Save · Organize · Reuse</p>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" className="text-sm text-white/90">Home</NavLink>
          <NavLink to="/allprompts" className="text-sm text-white/90">Allprompts</NavLink>
          <NavLink to="/myprompts" className="text-sm text-white/90">Myprompts</NavLink>

          {isLoggedIn ? (
            <>
              <NavLink to="/profile" className="px-3 py-2 rounded-full bg-white/10 text-white">Profile</NavLink>
              <button onClick={logout} className="px-3 py-2 rounded-full bg-red-600 text-white">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/register" className="px-4 py-2 rounded-full bg-yellow-400 text-black font-semibold">Get Started</NavLink>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-3">
          <button onClick={toggleMobile} aria-label="Toggle menu" className="p-2 rounded-md bg-white/10">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}></path></svg>
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="md:hidden mt-3 px-2">
            <div className="bg-black/40 p-4 rounded-lg space-y-3">
            <NavLink to="/" className="block text-white">Home</NavLink>
            <NavLink to="/allprompts" className="block text-white">Allprompts</NavLink>
            <NavLink to="/myprompts" className="block text-white">Myprompts</NavLink>
            {isLoggedIn ? (
              <>
                <NavLink to="/profile" className="block text-white">Profile</NavLink>
                <button onClick={logout} className="w-full text-left text-white">Logout</button>
              </>
            ) : (
              <NavLink to="/register" className="block text-white">Get Started</NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
