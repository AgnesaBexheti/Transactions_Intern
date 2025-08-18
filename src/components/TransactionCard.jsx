import styles from './TransactionCard.module.css';

export default function TransactionCard({ title, category, amount, date }) {
  const isIncome = amount >= 0;
  const amountStr = `${isIncome ? '+' : '-'}${Math.abs(amount).toFixed(2)}€`;

  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <div className={styles.meta}>
          <h3 className={styles.title} title={title}>{title}</h3>
          <span className={styles.chip}>{category}</span>
        </div>
        <div className={styles.right}>
          <div className={`${styles.amount} ${isIncome ? styles.income : styles.expense}`}>{amountStr}</div>
          <div className={styles.date}>{formatDate(date)}</div>
        </div>
      </div>

      <div className={styles.actions}>
        <button className="btn btn-ghost">✎ Edit</button>
        <button className="btn btn-ghost">🗑 Delete</button>
      </div>
    </article>
  );
}

function formatDate(iso) {
  try {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
  } catch { return iso; }
}