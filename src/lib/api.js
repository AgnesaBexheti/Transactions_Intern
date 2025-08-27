const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Generic fetch wrapper that includes cookies and parses JSON safely
async function request(path, { method = 'GET', body, headers = {}, auth = false } = {}) {
  const url = `${BASE_URL}${path}`;
  const opts = {
    method,
    credentials: 'include',                  // send/receive httpOnly cookie
    headers: { ...headers },
  };
  if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }

  const res = await fetch(url, opts);
  const ct = res.headers.get('content-type') || '';
  const isJson = ct.includes('application/json');
  const payload = isJson ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    const msg = (isJson && (payload?.message || payload?.error)) || `${res.status} ${res.statusText}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = payload;
    throw err;
  }

  // 204 No Content (e.g., logout) -> return null
  if (res.status === 204) return null;

  if (!isJson) {
    // guard anyway
    throw new Error(`Expected JSON but got ${ct || 'unknown content-type'} from ${url}`);
  }
  return payload;
}

export const api = {
  // Auth (cookie-based)
  signup: (payload) => request('/signup', { method: 'POST', body: payload }),
  login:  (payload) => request('/login',  { method: 'POST', body: payload }),
  logout: ()         => request('/logout', { method: 'POST' }),

  
  categories: () => request('/categories', { method: 'GET' }),

  
};
