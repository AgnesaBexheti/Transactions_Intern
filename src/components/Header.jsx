import styles from './Header.module.css';

export default function Header({ onMenu }) {
  return (
    <header className={styles.header}>
      <button className={styles.menuButton} onClick={onMenu} aria-label="Toggle sidebar">☰</button>
      <div className={styles.brand}>
        <span className={styles.brandIcon}>💸</span>
        <h1 className={styles.brandTitle}>Transactions</h1>
      </div>
      <div className={styles.headerRight}>
        <span className={styles.subtitle}>First React Task</span>
      </div>
    </header>
  );
}