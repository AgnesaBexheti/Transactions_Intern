import { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../lib/api.js';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  // Persist a simple boolean; cookie is on the browser and used by the server
  const [isAuthed, setIsAuthed] = useState(() => localStorage.getItem('auth:flag') === '1');

  async function login({ email, password }) {
    await api.login({ email, password }); // sets httpOnly cookie server-side
    setIsAuthed(true);
    localStorage.setItem('auth:flag', '1'); // remember across refreshes
  }

  async function signup({ email, password }) {
    await api.signup({ email, password });  // creates user; no cookie returned
    // user must log in after signup (your backend does not auto-login)
  }

  async function logout() {
    try { await api.logout(); } catch (_) {}
    setIsAuthed(false);
    localStorage.removeItem('auth:flag');
  }

  const value = useMemo(() => ({ isAuthed, login, signup, logout }), [isAuthed]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
