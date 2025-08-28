import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import TransactionCard from '../components/TransactionCard.jsx';
import styles from './Home.module.css';

export default function Home() {
  const { isAuthed } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const data = await api.getExpenses(); // GET /api/expenses
        if (!ignore) setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!ignore) setErr(e.message || 'Failed to load transactions');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  return (
    <section className={styles.page}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Recent Transactions</h2>

        {/* Show "New" only when logged in */}
        {isAuthed && (
          <NavLink to="/create" className="btn">New</NavLink>
        )}
      </div>

      {loading && <p style={{ padding: 12 }}>Loading…</p>}
      {err && <p style={{ padding: 12, color: 'crimson' }}>{err}</p>}

      {!loading && !err && (
        <div className={styles.txGrid}>
          {items.length === 0 ? (
            <p style={{ padding: 12 }}>No transactions yet.</p>
          ) : (
            items.map((t) => (
              <TransactionCard
                key={`tx-${t.id}`}
                id={t.id}
                title={t.title}
                category={t?.category?.name ?? '—'}
                amount={Number(t.value)}           // backend uses "value"
                date={(t.createdAt || '').slice(0, 10)} // show YYYY-MM-DD
              />
            ))
          )}
        </div>
      )}

      <div style={{ height: 48 }} />
    </section>
  );

}


// The old version wuth static data:
// import TransactionCard from '../components/TransactionCard.jsx';
// import { transactions } from '../data/transactions.js';
// import styles from './Home.module.css';

// export default function Home() {
//   return (
//     <section className={styles.page}>
//       <div className={styles.pageHeader}>
//         <h2 className={styles.pageTitle}>Recent Transactions</h2>
//         <button className="btn">New</button>
//       </div>
      

//       <div className={styles.txGrid}>
//         {transactions.map(t => <TransactionCard key={t.id} {...t} />)}
//       </div>
//       <div style={{ height: 48 }} />
//     </section>
//   );
// }