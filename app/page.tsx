import Link from "next/link";
import styles from "./page.module.css";
import { Search, BookText, Bot, FileText } from "lucide-react";

export default function Home() {
  const categories = [
    "Criminal Law", "Civil Law", "Labour Law", "Land Law", 
    "Family Law", "Commercial Law", "Consumer Law", "Constitutional Law", 
    "Traffic / Road-related", "Procedure / Evidence"
  ];

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={`container ${styles.heroContainer}`}>
          <h1 className={styles.heroTitle}>
            official sri lanka law database. <br/>ai explorer.
          </h1>
          <p className={styles.heroSubtitle}>
            the complete sri lankan legislation. search, read, and understand our nation's laws.
          </p>
          
          <div className={styles.searchBox}>
            <input 
              type="text" 
              placeholder="Search by keyword, Act name, or topic..." 
              className={styles.searchInput}
            />
            <button className={styles.searchButton}>Search Laws</button>
          </div>

          <div className={styles.heroActions}>
            <Link href="/ask" className={styles.primaryBtn}>Ask AI Assistant</Link>
            <Link href="/laws" className={styles.secondaryBtn}>Browse Library</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>how it works.</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><Search size={32} /></div>
              <h3>1. a-z library.</h3>
              <p>explore every officially enacted act, ordinance, and amendment.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><BookText size={32} /></div>
              <h3>2. read and analyze.</h3>
              <p>enjoy a clean, professional interface optimized for legal documents.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><Bot size={32} /></div>
              <h3>3. ask the ai.</h3>
              <p>get simple explanations with exact contextual citations to the acts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className={styles.categoriesSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Browse by Category</h2>
            <Link href="/laws" className={styles.viewAllLink}>View All &rarr;</Link>
          </div>
          <div className={styles.categoriesGrid}>
            {categories.map(cat => (
              <Link key={cat} href={`/laws?category=${encodeURIComponent(cat)}`} className={styles.categoryCard}>
                <span className={styles.categoryName}>{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Preview Section */}
      <section className={styles.aiPreviewSection}>
        <div className={`container ${styles.aiPreviewContainer}`}>
          <div className={styles.aiPreviewContent}>
            <h2 className={styles.sectionTitle}>Meet Your AI Legal Assistant</h2>
            <p className={styles.aiPreviewDesc}>
              Stuck on complex legal jargon? Ask a question and get a precise answer cited directly from the source acts.
            </p>
            <div className={styles.promptsList}>
              <div className={styles.promptItem}>Explain this section in simple English</div>
              <div className={styles.promptItem}>Which section applies to theft?</div>
              <div className={styles.promptItem}>What laws relate to employment termination?</div>
            </div>
            <Link href="/ask" className={styles.primaryBtn}>Try the AI Assistant</Link>
          </div>
          <div className={styles.aiPreviewMock}>
            <div className={styles.mockChat}>
              <div className={styles.mockUserMsg}>What does the Penal Code say about theft?</div>
              <div className={styles.mockAiMsg}>
                <p>According to <strong>Section 366 of the Penal Code (1883)</strong>, whoever intending to take dishonestly any movable property out of the possession of any person without that person's consent, moves that property, is said to commit theft.</p>
                <div className={styles.mockCitation}>
                <div className={styles.mockCitationHeader}>
                  <span className={styles.mockCitationIcon}><FileText size={16} /></span>
                  Reference
                </div>
                  Penal Code, Section 366
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
