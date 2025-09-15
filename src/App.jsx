import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header.jsx';
import Sidebar from './components/Sidebar/Sidebar.jsx';
import Home from './pages/Home/Home.jsx';
import { useSidebar } from './hooks/useSidebar.js';
import styles from './App.module.css';
import Login from './components/Login.jsx';
import SignUp from './components/SignUp.jsx';
import TransactionFormPage from './pages/TransactionForm/TransactionFormPage.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

export default function App() {
  const { open, toggle, close } = useSidebar(false);

  // the chat test
  useEffect(() => {
    const base = import.meta.env.VITE_API_URL; // should be http://localhost:8080/api
    console.log('API base =', base);

    // quick ping to prove backend is reachable
    fetch(`${base}/categories`)
      .then(r => (r.ok ? r.json() : Promise.reject(`${r.status} ${r.statusText}`)))
      .then(data => console.log('Ping OK (/categories):', data))
      .catch(err => console.error('Ping FAILED:', err));
  }, []);


  return (
    <div className={styles.appShell}>
      <Header onMenu={toggle} />
      <Sidebar open={open} onClose={close} />
      <main className={styles.appMain}>
        <div className={styles.appScroll}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/create" element={<TransactionFormPage isEditing={false} />} />
              <Route path="/edit/:id" element={<TransactionFormPage isEditing={true} />} />
            </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

        </div>
      </main>
    </div>
  );
}
