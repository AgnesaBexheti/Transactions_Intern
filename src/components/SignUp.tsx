import { FormEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function SignUp() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<boolean>(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setBusy(true);
      setError(null);
      await signup(email, password);
      navigate('/');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="form stack gap-2" onSubmit={onSubmit}>
      <h2>Create Account</h2>
      {error && <div className="alert error">{error}</div>}

      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </label>

      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
      </label>

      <button type="submit" disabled={busy}>{busy ? 'Creating…' : 'Sign Up'}</button>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </form>
  );
}


// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext.js';

// export default function SignUp() {
//   const { signup } = useAuth();
//   const nav = useNavigate();

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [err, setErr] = useState('');
//   const [loading, setLoading] = useState(false);

//   async function onSubmit(e) {
//     e.preventDefault();
//     setErr('');
//     setLoading(true);
//     try {
//       await signup({ email, password });
//       nav('/login'); 
//     } catch (e) {
//       setErr(e.message || 'Signup failed');
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div style={{ padding: 24 }}>
//       <h2>Sign Up</h2>
//       <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
//         <label>Email
//           <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
//         </label>
//         <label>Password
//           <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
//         </label>
//         <button type="submit" disabled={loading}>{loading ? 'Please wait…' : 'Create account'}</button>
//         {err && <div style={{ color: 'crimson' }}>{err}</div>}
//       </form>
//       <p style={{ marginTop: 8 }}>Already have an account? <Link to="/login">Log in</Link></p>
//     </div>
//   );
// }
