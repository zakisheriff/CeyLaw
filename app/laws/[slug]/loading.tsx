import styles from "./page.module.css";

export default function Loading() {
  return (
    <div className={styles.readerPage}>
      <header className={styles.readerHeader}>
        <div className="container" style={{ opacity: 0.1 }}>
          <div style={{ width: '100px', height: '20px', background: '#ccc', marginBottom: '1.5rem' }}></div>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ width: '80px', height: '30px', background: '#ccc' }}></div>
            <div style={{ width: '60px', height: '30px', background: '#ccc' }}></div>
          </div>
          <div style={{ width: '60%', height: '50px', background: '#ccc', marginBottom: '1rem' }}></div>
          <div style={{ width: '40%', height: '30px', background: '#ccc' }}></div>
        </div>
      </header>

      <div className={`container ${styles.readerLayout}`}>
        <aside className={styles.tocSidebar} style={{ opacity: 0.1 }}>
          <div style={{ width: '100%', height: '30px', background: '#ccc', marginBottom: '1rem' }}></div>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} style={{ width: '100%', height: '20px', background: '#ccc', marginBottom: '0.5rem' }}></div>
          ))}
        </aside>

        <main className={styles.mainContent} style={{ opacity: 0.1 }}>
          <div style={{ width: '100%', height: '100px', background: '#ccc', marginBottom: '3rem' }}></div>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ marginBottom: '3rem' }}>
              <div style={{ width: '30%', height: '30px', background: '#ccc', marginBottom: '1rem' }}></div>
              <div style={{ width: '100%', height: '200px', background: '#ccc' }}></div>
            </div>
          ))}
        </main>

        <aside className={styles.toolsSidebar} style={{ opacity: 0.1 }}>
          <div style={{ width: '100%', height: '300px', background: '#ccc' }}></div>
        </aside>
      </div>
    </div>
  );
}
