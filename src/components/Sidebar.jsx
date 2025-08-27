import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import styles from './Sidebar.module.css';

export default function Sidebar({ open, onClose }) {
  const { isAuthed, logout } = useAuth();

  return (
    <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
      <div className={styles.mobileClose}>
        <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
      </div>

      <nav className={styles.nav}>
        <p className={styles.menuLabel}>Menu</p>
        <ul className={styles.menuList}>
          <li>
            <NavLink
              to="/"
              onClick={onClose}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              🏠 Home
            </NavLink>
          </li>

          {/* 👇 Only when logged in */}
          {isAuthed && (
            <li>
              <NavLink
                to="/create"
                onClick={onClose}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.active : ''}`
                }
              >
                ➕ Create New Transaction
              </NavLink>
            </li>
          )}

          {/* Auth links */}
          {!isAuthed ? (
            <>
              <li>
                <NavLink
                  to="/login"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `${styles.navItem} ${isActive ? styles.active : ''}`
                  }
                >
                  ↪ Login / Signup
                </NavLink>
              </li>
            </>
          ) : (
            <li>
              <button
                className={styles.navItem}
                onClick={() => { logout(); onClose(); }}
              >
                🚪 Logout
              </button>
            </li>
          )}
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
