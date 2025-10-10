import styles from './TransactionCard.module.css';
import type { TransactionCardData } from '@/types';
import { useAuth } from '@/context/AuthContext';

type Props = TransactionCardData & {
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
};

export default function TransactionCard({
  id,
  title,
  category,
  amount,
  date,
  onEdit,
  onDelete
}: Props) {
  const isIncome = amount >= 0;
  const amountStr = `${isIncome ? '+' : '-'}${Math.abs(amount).toFixed(2)}€`;

  const { isAuthed } = useAuth();

  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <div className={styles.meta}>
          <h3 className={styles.title} title={title}>
            {title}
          </h3>
          <span className={styles.chip}>{category}</span>
        </div>

        <div className={styles.right}>
          <div
            className={`${styles.amount} ${
              isIncome ? styles.income : styles.expense
            }`}
          >
            {amountStr}
          </div>
          <div className={styles.date}>{formatDate(date)}</div>
        </div>
      </div>

      {isAuthed && (
        <div className={styles.actions}>
          <button
            className={styles.btnGhost}
            onClick={() => onEdit?.(id!)}
            aria-label="Edit transaction"
          >
            ✎ Edit
          </button>
          <button
            className={styles.btnGhost}
            onClick={() => onDelete?.(id!)}
            aria-label="Delete transaction"
          >
            🗑 Delete
          </button>
        </div>
      )}
    </article>
  );
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  } catch {
    return iso;
  }

  
}







// import styles from './TransactionCard.module.css';
// import { useAuth } from '../../context/AuthContext.js';

// export default function TransactionCard({
//   id,                // handy for callbacks later
//   title,
//   category,
//   amount,
//   date,
//   onEdit,            
//   onDelete
// }) {
//   const { isAuthed } = useAuth();          // are we logged in?

//   const isIncome = amount >= 0;
//   const amountStr = `${isIncome ? '+' : '-'}${Math.abs(amount).toFixed(2)}€`;

//   return (
//     <article className={styles.card}>
//       <div className={styles.top}>
//         <div className={styles.meta}>
//           <h3 className={styles.title} title={title}>{title}</h3>
//           <span className={styles.chip}>{category}</span>
//         </div>
//         <div className={styles.right}>
//           <div className={`${styles.amount} ${isIncome ? styles.income : styles.expense}`}>{amountStr}</div>
//           <div className={styles.date}>{formatDate(date)}</div>
//         </div>
//       </div>

//       {/* Show Edit/Delete only for logged-in users */}
//       {isAuthed && (
//         <div className={styles.actions}>
//           <button className="btn btn-ghost" onClick={() => onEdit?.(id)}>✎ Edit</button>
//           <button className="btn btn-ghost" onClick={() => onDelete?.(id)}>🗑 Delete</button>
//         </div>
//       )}
//     </article>
//   );
// }

// function formatDate(iso) {
//   try {
//     const d = new Date(iso + 'T00:00:00');
//     return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
//   } catch { return iso; }
// }
