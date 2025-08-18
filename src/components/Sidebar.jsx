
import styles from './Sidebar.module.css';

export default function Sidebar({ open, onClose }) {           
  return (
    <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>  
      <div className={styles.mobileClose}>
        <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>  
      </div>

      <nav className={styles.nav}>
        <p className={styles.menuLabel}>Menu</p>
        <ul className={styles.menuList}>
          <li><button className={`${styles.navItem} ${styles.active}`} onClick={onClose}>🏠 Home</button></li>
          <li><button className={styles.navItem} onClick={onClose}>➕ Create New Transaction</button></li>
          <li><button className={styles.navItem} onClick={onClose}>↪ Login / Signup</button></li>
        </ul>
      </nav>

      <div className={styles.footer}>© 2025 Agnesa</div>
      
    </aside>
  );
}








// import styles from './Sidebar.module.css';

// export default function Sidebar({ open, onClose }) {
//   return (
//     <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
//       <div className={styles.mobileClose}>
//         <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
//       </div>

//       <nav className={styles.nav}>
//         <p className={styles.menuLabel}>Menu</p>
//         <ul className={styles.menuList}>
//           <li><button className={`${styles.navItem} ${styles.active}`}>🏠 Home</button></li>
//           <li><button className={styles.navItem}>➕ Create New Transaction</button></li>
//           <li><button className={styles.navItem} >↪  Login / Signup</button></li>
//         </ul>
//       </nav>

//       <div className={styles.footer}>© 2025 Agnesa</div>
//     </aside>
//   );
// }
