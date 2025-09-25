// src/context/ApiContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ApiContext = createContext();

// Allow configuring the API URL via Vite env (VITE_API_URL).
// Default to the Render deployment URL you mentioned. To override for local dev,
// set VITE_API_URL in an .env file (or leave unset to use this default).
const BASE_URL = import.meta.env.VITE_API_URL || "https://promptbackend-rw73.onrender.com/promptvault"

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // if your backend uses cookies/sessions
  headers: { 'Content-Type': 'application/json' },
});

// attach token from localStorage to each request if present
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('pv_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  } catch (e) {
    // ignore
  }
  return config
})

export const ApiProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Auth functions ---

  // Register
  const register = async (data) => {
    try {
      const res = await api.post("/user/register", data);
      return res.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };

  // Verify Email
  const verifyEmail = async (data) => {
    try {
      const res = await api.post("/user/verify", data);
      return res.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };

  const createprompt = async (data) => {
    try {
      const res = await api.post("/prompt/createprompt", data);
      return res.data;
    }catch(err){
      throw err.response?.data || err.message;
    }
  }
  const Allprompts = async () => {
    try {
      const res = await api.get("/prompt/allprompts/");
      const payload = res.data
      // normalize common shapes -> return an array
      if (Array.isArray(payload)) return payload
      if (Array.isArray(payload?.prompts)) return payload.prompts
      if (Array.isArray(payload?.data)) return payload.data
      // otherwise return empty array to be safe
      return []
    }catch(err){
      throw err.response?.data || err.message;
    }
  }
  // fetch prompts for a specific user
  const myprompts = async (userId) => {
    if (!userId) throw new Error('myprompts requires userId')
    try {
      const res = await api.get(`/prompt/myprompts/${encodeURIComponent(userId)}`);
      const payload = res.data
      if (Array.isArray(payload)) return payload
      if (Array.isArray(payload?.prompts)) return payload.prompts
      if (Array.isArray(payload?.data)) return payload.data
      return []
    }catch(err){
      throw err.response?.data || err.message;
    }
  }
  // Login
  const login = async (data) => {
    try {
      const res = await api.post("/user/login", data);
      const payload = res.data
      // payload may contain { token, user } or user directly
      const token = payload?.token || payload?.accessToken || payload?.data?.token
      let userObj = payload?.user || payload?.data || payload
      // unwrap nested user if server returned { user: { ... } }
      userObj = userObj?.user || userObj

      if (token) localStorage.setItem('pv_token', token)
      if (userObj) localStorage.setItem('currentUser', JSON.stringify(userObj))
      setUser(userObj || null)
      return payload;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };

  // Logout: call backend endpoint then clear client state
  const logout = async () => {
    try {
      // attempt to notify server (invalidate cookie/session or token server-side)
      await api.post('/user/logout')
    } catch (e) {
      // ignore errors — we still clear client state
      console.warn('logout: server call failed', e?.response?.data || e.message || e)
    }

    try {
      localStorage.removeItem('pv_token')
      localStorage.removeItem('currentUser')
    } catch (e) {}
    setUser(null)
  }

  // Get Profile
  const fetchProfile = async () => {

    try {
      const res = await api.get("/user/profile");
      // normalize common server shapes: { user: { ... } } or direct user object
      const payload = res.data
      const userObj = payload?.user || payload?.data || payload
      setUser(userObj)
      return userObj
    } catch (error) {
      setUser(null);
      throw error.response?.data || error.message;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <ApiContext.Provider
      value={{
        user,
        loading,
        register,
        verifyEmail,
        login,
        logout,
        fetchProfile,
        createprompt,
        Allprompts,
        myprompts
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
