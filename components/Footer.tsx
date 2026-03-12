import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.brandSection}>
          <Link href="/" className={styles.logo}>CeyLaw</Link>
          <p className={styles.description}>
            The modern Sri Lankan legal platform. Search, read, and understand laws with AI-powered assistance.
          </p>
        </div>
        
        <div className={styles.linksSection}>
          <div className={styles.linkGroup}>
            <h4>Platform</h4>
            <Link href="/laws">A-Z Laws Library</Link>
            <Link href="/search">Advanced Search</Link>
            <Link href="/ask">Ask AI</Link>
          </div>
          <div className={styles.linkGroup}>
            <h4>Legal</h4>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/disclaimer">Disclaimer</Link>
          </div>
        </div>
      </div>
      
      <div className={styles.bottomBar}>
        <div className="container">
          <p className={styles.disclaimer}>
            <strong>Disclaimer:</strong> CeyLaw provides legal information, legal text access, and AI-assisted research support for general informational purposes only. It does not constitute professional legal advice, legal representation, or a guaranteed legal opinion. Always verify the cited law and consult a qualified lawyer for case-specific advice.
          </p>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} CeyLaw. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
