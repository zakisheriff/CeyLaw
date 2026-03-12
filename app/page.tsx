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
            Official Sri Lanka <br/> Law Database & AI Explorer
          </h1>
          <p className={styles.heroSubtitle}>
            The comprehensive A-Z public repository of all Sri Lankan legislation. Search, read, and understand our nation's laws instantly.
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
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><Search size={32} /></div>
              <h3>1. A-Z Library</h3>
              <p>Explore every officially enacted Act, Ordinance, and Amendment in the complete structured public database.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><BookText size={32} /></div>
              <h3>2. Read & Analyze</h3>
              <p>Enjoy a clean, professional reading interface optimized for long-form legal documents.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><Bot size={32} /></div>
              <h3>3. Ask the AI</h3>
              <p>Get simple explanations with exact contextual citations to the relevant sections and Acts.</p>
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
