import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from '@/components/Header/Header';
import Sidebar from '@/components/Sidebar/Sidebar';
import Home from '@/pages/Home/Home';
import TransactionFormPage from '@/pages/TransactionForm/TransactionFormPage';
import Login from '@/components/Login';
import SignUp from '@/components/SignUp';
import { useSidebar } from '@/hooks/useSidebar';
import { AuthProvider } from '@/context/AuthContext';

export default function App() {
  const { open, toggle, close } = useSidebar(false);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Header onMenu={toggle} />
        <Sidebar open={open} onClose={close} />

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new" element={<TransactionFormPage />} />
            <Route path="/edit/:id" element={<TransactionFormPage isEditing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}








// import { useEffect } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import Header from './components/Header/Header.js';
// import Sidebar from './components/Sidebar/Sidebar.js';
// import Home from './pages/Home/Home.js';
// import { useSidebar } from './hooks/useSidebar.js';
// import styles from './App.module.css';
// import Login from './components/Login.js';
// import SignUp from './components/SignUp.js';
// import TransactionFormPage from './pages/TransactionForm/TransactionFormPage.js';
// import ProtectedRoute from './routes/ProtectedRoute.js';

// export default function App() {
//   const { open, toggle, close } = useSidebar(false);

//   // the chat test
//   useEffect(() => {
//     const base = import.meta.env.VITE_API_URL; // should be http://localhost:8080/api
//     console.log('API base =', base);

//     // quick ping to prove backend is reachable
//     fetch(`${base}/categories`)
//       .then(r => (r.ok ? r.json() : Promise.reject(`${r.status} ${r.statusText}`)))
//       .then(data => console.log('Ping OK (/categories):', data))
//       .catch(err => console.error('Ping FAILED:', err));
//   }, []);


//   return (
//     <div className={styles.appShell}>
//       <Header onMenu={toggle} />
//       <Sidebar open={open} onClose={close} />
//       <main className={styles.appMain}>
//         <div className={styles.appScroll}>
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/signup" element={<SignUp />} />
//             <Route element={<ProtectedRoute />}>
//               <Route path="/create" element={<TransactionFormPage isEditing={false} />} />
//               <Route path="/edit/:id" element={<TransactionFormPage isEditing={true} />} />
//             </Route>

//           <Route path="*" element={<Navigate to="/" replace />} />
//           </Routes>

//         </div>
//       </main>
//     </div>
//   );
// }
