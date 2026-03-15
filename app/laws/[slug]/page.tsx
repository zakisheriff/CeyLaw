import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./page.module.css";
import { mockLaws, mockSections } from "@/lib/mockData";
import { Copy } from "lucide-react";
import { collections } from "@/lib/astra";
import CopyButton from "@/components/CopyButton";

interface PageProps {
  params: { slug: string };
}

export default async function LawReaderPage({ params }: PageProps) {
  const { slug } = await params;
  
  // 1. Try to find in mock data first (for existing demos)
  let law = mockLaws.find((l: any) => l.slug === slug);
  let sections = mockSections.filter((s: any) => s.law_id === (law?.id || ""));

  // 2. If not found in mock, check Astra DB
  if (!law) {
    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
      const model = genAI.getGenerativeModel({ model: "gemini-embedding-2-preview" });
      
      // 1. Convert slug back to a searchable query and get embedding
      const searchQuery = slug.replace(/-/g, ' ');
      const embedResult = await model.embedContent(searchQuery);
      const embedding = embedResult.embedding.values;

      // 2. Use vector search to find the most relevant chunk (to get the exact act_title)
      const vectorMatch = await collections.lawsVectors.findOne(
        {},
        {
          sort: { $vector: embedding },
          projection: { act_title: 1 }
        }
      );

      if (vectorMatch && vectorMatch.act_title) {
        const exactTitle = vectorMatch.act_title;
        
        // 3. Query for ALL chunks with this exact title
        const cursor = collections.lawsVectors.find(
          { act_title: exactTitle },
          {
            projection: { act_title: 1, act_year: 1, section: 1, content: 1, category: 1 }
          }
        );
        const matchingChunks = await cursor.toArray();

        if (matchingChunks.length > 0) {
          const first = matchingChunks[0];
          law = {
            id: first._id ? first._id.toString() : Math.random().toString(),
            slug: slug,
            title: first.act_title,
            year: first.act_year || "n/a",
            act_number: first.section ? `act section ${first.section}` : "act",
            category: first.category || "general law",
            description: ""
          } as any;

          // Group chunks as sections, sorted by section identifier if possible
          sections = matchingChunks.map((c, idx) => ({
            id: c._id ? c._id.toString() : `${idx}`,
            law_id: law?.id || "",
            section_number: c.section || `${idx + 1}`,
            heading: c.act_title,
            content: c.content
          })) as any;
        }
      }
    } catch (err) {
      console.error("Astra Reader Error:", err);
    }
  }
  
  if (!law) {
    notFound();
  }

  return (
    <div className={`${styles.readerPage} hide-footer`}>
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
                      <CopyButton text={`${typeof window !== 'undefined' ? window.location.origin : ''}/laws/${law.slug}#section-${sec.section_number}`} />
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
