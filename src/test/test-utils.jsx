import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext.jsx'

// Custom render function that includes providers
export function renderWithProviders(ui, { 
  initialAuth = { isAuthed: false },
  ...renderOptions 
} = {}) {
  function Wrapper({ children }) {
    return (
      <BrowserRouter>
        <AuthProvider>
          {children}
        </AuthProvider>
      </BrowserRouter>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Mock API responses
export const mockApiResponses = {
  loginSuccess: { message: 'Login successful' },
  loginError: { message: 'Invalid credentials' },
  signupSuccess: { message: 'User created successfully' },
  signupError: { message: 'Email already exists' },
  expenses: [
    {
      id: 1,
      title: 'Coffee',
      value: -5.50,
      category: { name: 'Food' },
      createdAt: '2025-01-15T10:00:00Z'
    },
    {
      id: 2,
      title: 'Salary',
      value: 3000.00,
      category: { name: 'Income' },
      createdAt: '2025-01-01T09:00:00Z'
    }
  ],
  categories: [
    { id: 1, name: 'Food' },
    { id: 2, name: 'Transport' },
    { id: 3, name: 'Income' }
  ]
}

// Helper to mock fetch responses
export function mockFetchResponse(data, status = 200) {
  global.fetch.mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data))
  })
}

// Helper to mock fetch errors
export function mockFetchError(message = 'Network error', status = 500) {
  global.fetch.mockRejectedValueOnce(new Error(message))
}
