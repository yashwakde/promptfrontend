// src/context/ApiContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ApiContext = createContext();

// ✅ Use environment variable or default to Render backend
const BASE_URL = import.meta.env.VITE_API_URL || "https://promptbackend-rw73.onrender.com";
console.log("[PromptVault] API BASE_URL:", BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // needed if backend sets cookies
  headers: { "Content-Type": "application/json" },
});

// Attach token from localStorage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("pv_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const ApiProvider = ({ children }) => {
  // Restore user from localStorage on first load
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("currentUser");
      if (raw) return JSON.parse(raw);
      return null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // --- Auth functions ---
  const register = async (data) => {
    const res = await api.post("/user/register", data);
    return res.data;
  };

  const verifyEmail = async (data) => {
    const res = await api.post("/user/verify", data);
    return res.data;
  };

  const login = async (data) => {
    const res = await api.post("/user/login", data);
    const payload = res.data;

    const token = payload?.token || payload?.accessToken || payload?.data?.token;
    let userObj = payload?.user || payload?.data || payload;
    userObj = userObj?.user || userObj;

    if (token) localStorage.setItem("pv_token", token);
    if (userObj) localStorage.setItem("currentUser", JSON.stringify(userObj));
    setUser(userObj || null);

    return payload;
  };

  const logout = async () => {
    try {
      await api.post("/user/logout");
    } catch (e) {
      console.warn("logout: server call failed", e?.response?.data || e.message || e);
    }

    localStorage.removeItem("pv_token");
    localStorage.removeItem("currentUser");
    setUser(null);
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get("/user/profile");
      const payload = res.data;
      const userObj = payload?.user || payload?.data || payload;
      setUser(userObj);
      return userObj;
    } catch (error) {
      setUser(null);
      console.error("[ApiContext] fetchProfile failed:", error?.response || error);
      throw error.response?.data || error.message;
    } finally {
      setLoading(false);
    }
  
  };

  // --- Prompt functions ---
  const createprompt = async (data) => {
    const res = await api.post("/prompt/createprompt", data);
    return res.data;
  };

  const Allprompts = async () => {
    const res = await api.get("/prompt/allprompts"); // removed trailing slash
    const payload = res.data;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.prompts)) return payload.prompts;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
  };

  const myprompts = async (userId) => {
    if (!userId) throw new Error("myprompts requires userId");
    const res = await api.get(`/prompt/myprompts/${encodeURIComponent(userId)}`);
    const payload = res.data;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.prompts)) return payload.prompts;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
  };

  // Fetch profile on load, but only if token exists
  useEffect(() => {
    const token = localStorage.getItem("pv_token");
    if (token) {
      fetchProfile().catch((err) => console.error("[ApiContext] fetchProfile failed:", err));
    } else {
      setLoading(false);
    }
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
        myprompts,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
