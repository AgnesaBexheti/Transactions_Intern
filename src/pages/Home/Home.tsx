import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Expense, TransactionCardData } from '@/types';
import TransactionCard from '@/components/TransactionCard/TransactionCard';

export default function Home() {
  const [items, setItems] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getExpenses() as Expense[];
        setItems(data);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: 'crimson' }}>Error: {error}</p>;
  if (!items.length) return <p>No transactions yet.</p>;

  return (
    <section className="stack gap-2">
      {items.map((e) => {
        const card: TransactionCardData = {
          title: e.title,
          category: e.category?.name ?? '—',
          amount: e.value,
          date: (typeof e.createdAt === 'string'
            ? e.createdAt
            : e.createdAt?.toString()) ?? '',
        };
        return <TransactionCard key={e.id} {...card} />;
      })}
    </section>
  );
}



// import { useEffect, useState } from 'react';
// import { NavLink,useNavigate } from 'react-router-dom';
// import { api } from '../../lib/api.js';
// import { useAuth } from '../../context/AuthContext.js';
// import TransactionCard from '../../components/TransactionCard/TransactionCard.js';
// import styles from './Home.module.css';
// console.log('api functions:', Object.keys(api));


// export default function Home() {
//   const { isAuthed } = useAuth();
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState('');
//   const nav = useNavigate();

//   useEffect(() => {
//     let ignore = false;
//     (async () => {
//       try {
//         const data = await api.getExpenses(); // GET /api/expenses
//         if (!ignore) setItems(Array.isArray(data) ? data : []);
//       } catch (e) {
//         if (!ignore) setErr(e.message || 'Failed to load transactions');
//       } finally {
//         if (!ignore) setLoading(false);
//       }
//     })();
//     return () => { ignore = true; };
//   }, []);
//     async function handleDelete(id) {
//     if (!confirm('Delete this transaction?')) return;
//     setErr('');
//     // optimistic update with rollback
//     const backup = items;
//     setItems(items.filter(t => t.id !== id));
//     try {
//       await api.deleteExpense(id);             // DELETE /api/expenses/:id
//     } catch (e) {
//       setItems(backup);                        // rollback on error
//       setErr(e.message || 'Failed to delete');
//     }
//   }

//   return (
//     <section className={styles.page}>
//       <div className={styles.pageHeader}>
//         <h2 className={styles.pageTitle}>Recent Transactions</h2>

//         {/* Show "New" only when logged in */}
//         {isAuthed && (
//           <NavLink to="/create" className="btn">New</NavLink>
//         )}
//       </div>

//       {loading && <p style={{ padding: 12 }}>Loading…</p>}
//       {err && <p style={{ padding: 12, color: 'crimson' }}>{err}</p>}

//       {!loading && !err && (
//         <div className={styles.txGrid}>
//           {items.length === 0 ? (
//             <p style={{ padding: 12 }}>No transactions yet.</p>
//           ) : (
//             items.map((t) => (
//               <TransactionCard
//                 key={`tx-${t.id}`}
//                 id={t.id}
//                 title={t.title}
//                 category={t?.category?.name ?? '—'}
//                 amount={Number(t.value)}           // backend uses "value"
//                 date={(t.createdAt || '').slice(0, 10)} // show YYYY-MM-DD
//                 onEdit={(id) => nav(`/edit/${id}`, { state: { item: t } })}
//                 onDelete={handleDelete} 
//               />
//             ))
//           )}
//         </div>
//       )}

//       <div style={{ height: 48 }} />
//     </section>
//   );

// }


// // The old version wuth static data:
// // import TransactionCard from '../components/TransactionCard.jsx';
// // import { transactions } from '../data/transactions.js';
// // import styles from './Home.module.css';

// // export default function Home() {
// //   return (
// //     <section className={styles.page}>
// //       <div className={styles.pageHeader}>
// //         <h2 className={styles.pageTitle}>Recent Transactions</h2>
// //         <button className="btn">New</button>
// //       </div>
      

// //       <div className={styles.txGrid}>
// //         {transactions.map(t => <TransactionCard key={t.id} {...t} />)}
// //       </div>
// //       <div style={{ height: 48 }} />
// //     </section>
// //   );
// // }