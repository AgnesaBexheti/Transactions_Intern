import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import Home from './pages/Home.jsx';
import { useSidebar } from './hooks/useSidebar.js';
import styles from './App.module.css';

export default function App() {
  const { open, toggle, close } = useSidebar(false);

  return (
    <div className={styles.appShell}>
      <Header onMenu={toggle} />
      <Sidebar open={open} onClose={close} />

      {/* Main content pane */}
      <main className={styles.appMain}>
        <div className={styles.appScroll}>
          <Home />
        </div>
      </main>
    </div>
  );
}