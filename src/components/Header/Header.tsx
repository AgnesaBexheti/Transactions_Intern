import styles from './Header.module.css';
type HeaderProps = {
  onMenu?: () => void;
};

export default function Header({ onMenu }: HeaderProps) {
  return (
    <header className={styles.header}>
      <button className={styles.iconBtn} onClick={onMenu} aria-label="Open sidebar">☰</button>
      <h1>Transactions</h1>
      <div style={{ marginLeft: 'auto' }}>First React Task</div>
    </header>
  );
}







// import styles from './Header.module.css';

// export default function Header({ onMenu }) {
//   return (
//     <header className={styles.header}>
//       <button className={styles.menuButton} onClick={onMenu} aria-label="Toggle sidebar">☰</button>
//       <div className={styles.brand}>
//         <span className={styles.brandIcon}>💸</span>
//         <h1 className={styles.brandTitle}>Transactions</h1>
//       </div>
//       <div className={styles.headerRight}>
//         <span className={styles.subtitle}>First React Task</span>
//       </div>
//     </header>
//   );
// }