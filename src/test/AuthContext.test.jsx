import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '../context/AuthContext.jsx'

// Mock the API module
vi.mock('../lib/api.js', () => ({
  api: {
    login: vi.fn(),
    signup: vi.fn(),
    logout: vi.fn()
  }
}))

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should provide authentication context', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    expect(result.current).toHaveProperty('isAuthed')
    expect(result.current).toHaveProperty('login')
    expect(result.current).toHaveProperty('signup')
    expect(result.current).toHaveProperty('logout')
  })

  it('should initialize as not authenticated', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    expect(result.current.isAuthed).toBe(false)
  })

  it('should handle successful login', async () => {
    const { api } = await import('../lib/api.js')
    api.login.mockResolvedValueOnce({ message: 'Login successful' })

    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login({ email: 'test@example.com', password: 'password' })
    })

    expect(result.current.isAuthed).toBe(true)
    expect(api.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' })
  })

  it('should handle login failure', async () => {
    const { api } = await import('../lib/api.js')
    api.login.mockRejectedValueOnce(new Error('Invalid credentials'))

    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      try {
        await result.current.login({ email: 'test@example.com', password: 'wrong' })
      } catch (error) {
        expect(error.message).toBe('Invalid credentials')
      }
    })

    expect(result.current.isAuthed).toBe(false)
  })
})
