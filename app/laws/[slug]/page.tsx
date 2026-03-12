import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./page.module.css";
import { mockLaws, mockSections } from "@/lib/mockData";
import { Copy } from "lucide-react";

interface PageProps {
  params: { slug: string };
}

export default function LawReaderPage({ params }: PageProps) {
  const law = mockLaws.find(l => l.slug === params.slug);
  
  if (!law) {
    notFound();
  }

  const sections = mockSections.filter(s => s.law_id === law.id);

  return (
    <div className={styles.readerPage}>
      <header className={styles.readerHeader}>
        <div className="container">
          <Link href="/laws" className={styles.backLink}>&larr; Back to Library</Link>
          <div className={styles.metaInfo}>
            <span className={styles.badge}>{law.category}</span>
            <span className={styles.year}>{law.year}</span>
          </div>
          <h1 className={styles.title}>{law.title}</h1>
          <p className={styles.subtitle}>{law.act_number}</p>
        </div>
      </header>

      <div className={`container ${styles.readerLayout}`}>
        {/* Left Sidebar - Table of Contents */}
        <aside className={styles.tocSidebar}>
          <div className={styles.stickyPanel}>
            <h3 className={styles.panelTitle}>Table of Contents</h3>
            <ul className={styles.tocList}>
              {sections.length > 0 ? sections.map(sec => (
                <li key={sec.id}>
                  <a href={`#section-${sec.section_number}`} className={styles.tocLink}>
                    <span className={styles.tocSecNum}>Sec {sec.section_number}.</span> {sec.heading}
                  </a>
                </li>
              )) : (
                <li className={styles.emptyToc}>No sections indexed yet for this act.</li>
              )}
            </ul>
          </div>
        </aside>

        {/* Main Content - Law Text */}
        <main className={styles.mainContent}>
          <div className={styles.lawDocument}>
            <div className={styles.docHeader}>
              <p className={styles.docDesc}>{law.description}</p>
            </div>
            
            <div className={styles.sectionsList}>
              {sections.length > 0 ? sections.map(sec => (
                <div key={sec.id} id={`section-${sec.section_number}`} className={styles.sectionBlock}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionHeading}>
                      <span className={styles.sectionNumber}>{sec.section_number}.</span> {sec.heading}
                    </h2>
                    <div className={styles.sectionActions}>
                      <button className={styles.iconBtn} title="Copy Link"><Copy size={16} /></button>
                    </div>
                  </div>
                  <div className={styles.sectionContent}>
                    <p>{sec.content}</p>
                  </div>
                </div>
              )) : (
                <div className={styles.emptyDoc}>
                  <p>The full text of this Act is currently being digitized.</p>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right Sidebar - AI Tools */}
        <aside className={styles.toolsSidebar}>
          <div className={styles.stickyPanel}>
            <h3 className={styles.panelTitle}>AI Legal Assistant</h3>
            <div className={styles.aiToolBox}>
              <p className={styles.aiHint}>Need help understanding this Act?</p>
              <Link href={`/ask?law=${law.slug}`} className={styles.askAiBtn}>
                Ask a Question &rarr;
              </Link>
              
              <div className={styles.quickPrompts}>
                <h4>Quick Prompts</h4>
                <button className={styles.promptBtn}>Summarize this Act</button>
                <button className={styles.promptBtn}>What are the key penalties?</button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
