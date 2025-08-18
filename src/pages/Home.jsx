import TransactionCard from '../components/TransactionCard.jsx';
import { transactions } from '../data/transactions.js';
import styles from './Home.module.css';

export default function Home() {
  return (
    <section className={styles.page}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Recent Transactions</h2>
        <button className="btn">New</button>
      </div>

      <div className={styles.txGrid}>
        {transactions.map(t => <TransactionCard key={t.id} {...t} />)}
      </div>
      <div style={{ height: 48 }} />
    </section>
  );
}