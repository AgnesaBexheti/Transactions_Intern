const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/**
 * Small fetch wrapper with JSON handling and cookie support.
 * Callers can specify the response type via <T>.
 */
async function request<T = unknown>(
  path: string,
  options: { method?: string; body?: any; headers?: Record<string, string> } = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const { method = 'GET', body, headers = {} } = options;

  const res = await fetch(url, {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json', ...headers } : headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const ct = res.headers.get('content-type') || '';
  const isJson = ct.includes('application/json');
  const payload = isJson ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    const msg = (isJson && (payload?.message || payload?.error)) || `${res.status} ${res.statusText}`;
    const error = new Error(msg) as Error & { status?: number; data?: unknown };
    error.status = res.status;
    error.data = payload;
    throw error;
  }

  if (res.status === 204) return null as T;
  if (isJson) return payload as T;

  throw new Error(`Expected JSON but got ${ct || 'unknown content-type'} from ${url}`);
}

export const api = {
  // Auth
  signup: (payload: { email: string; password: string }) =>
    request('/signup', { method: 'POST', body: payload }),

  login: (payload: { email: string; password: string }) =>
    request('/login', { method: 'POST', body: payload }),

  logout: () => request('/logout', { method: 'POST' }),

  // Data
  categories: () => request('/categories'),
  getExpenses: () => request('/expenses'),
  getExpense: (id: string | number) => request(`/expense/${id}`),
  createExpense: (p: { title: string; value: number; categoryId: number }) =>
    request('/expenses', { method: 'POST', body: p }),
  updateExpense: (id: string | number, p: { title: string; value: number; categoryId: number }) =>
    request(`/expenses/${id}`, { method: 'PUT', body: p }),
  deleteExpense: (id: string | number) =>
    request(`/expenses/${id}`, { method: 'DELETE' }),
};



// src/lib/api.js
// const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// // Generic fetch wrapper that includes cookies and parses JSON safely
// async function request(path, { method = 'GET', body, headers = {} } = {}) {
//   const url = `${BASE_URL}${path}`;
//   const opts = {
//     method,
//     credentials: 'include',                // send/receive httpOnly cookie
//     headers: { ...headers }
//   };
//   if (body !== undefined) {                                         // Attach JSON body when provided 
//     opts.headers['Content-Type'] = 'application/json';
//     opts.body = JSON.stringify(body);
//   }

//   const res = await fetch(url, opts);
//   const ct = res.headers.get('content-type') || '';
//   const isJson = ct.includes('application/json');
//   const payload = isJson ? await res.json().catch(() => null) : await res.text();

//   if (!res.ok) {
//     const msg = (isJson && (payload?.message || payload?.error)) || `${res.status} ${res.statusText}`;
//     const err = new Error(msg);
//     err.status = res.status;
//     err.data = payload;
//     throw err;
//   }

//   if (res.status === 204) return null;      // No Content

//   if (!isJson) throw new Error(`Expected JSON but got ${ct || 'unknown'} from ${url}`);
//   return payload;
// }

// export const api = {
//   // Auth (cookie-based)
//   signup:        (payload)   => request('/signup',  { method: 'POST', body: payload }),
//   login:         (payload)   => request('/login',   { method: 'POST', body: payload }),
//   logout:                    () => request('/logout',{ method: 'POST' }),

//   // Public
//   categories:               () => request('/categories', { method: 'GET' }),

//   // Expenses
//   getExpenses:              () => request('/expenses',          { method: 'GET' }),
//   getExpense:     (id)      => request(`/expense/${id}`,         { method: 'GET' }),
//   createExpense:  (p)       => request('/expenses',              { method: 'POST', body: p }),
//   updateExpense:  (id, p)   => request(`/expenses/${id}`,        { method: 'PUT',  body: p }),
//   deleteExpense:  (id)      => request(`/expenses/${id}`,        { method: 'DELETE' }) 
// };

// export default api; 