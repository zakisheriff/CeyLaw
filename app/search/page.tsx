"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import { mockLaws, mockSections, Law, LawSection } from "@/lib/mockData";

type SearchResult = {
  type: "law" | "section";
  law: Law;
  section?: LawSection;
  excerpt: string;
  relevance: "High" | "Medium" | "Low";
};

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<"all" | "laws" | "sections">("all");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Auto-search for "constitution" if query is empty to avoid blank page
  useEffect(() => {
    if (!initialQuery) {
      performSearch("Constitution");
      setQuery("Constitution");
    }
  }, [initialQuery]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    
    setIsSearching(true);
    
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      
      if (data.results) {
        setResults(data.results);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const filteredResults = results.filter(r => activeTab === "all" || r.type === activeTab.slice(0, -1));

  return (
    <div className={styles.searchPage}>
      <header className={styles.searchHeader}>
        <div className="container">
          <h1 className={styles.title}>Legal Database Search</h1>
          <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              className={styles.searchInput}
              placeholder="Search by keyword, Act name, section, or topic..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className={styles.searchBtn}>Search</button>
          </form>
        </div>
      </header>

      <div className={`container ${styles.resultsLayout}`}>
        <aside className={styles.filtersSidebar}>
          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Result Type</h3>
            <div className={styles.tabs}>
              <button 
                className={`${styles.tabBtn} ${activeTab === "all" ? styles.activeTab : ""}`}
                onClick={() => setActiveTab("all")}
              >
                All Results ({results.length})
              </button>
              <button 
                className={`${styles.tabBtn} ${activeTab === "laws" ? styles.activeTab : ""}`}
                onClick={() => setActiveTab("laws")}
              >
                Acts / Laws ({results.filter(r => r.type === "law").length})
              </button>
              <button 
                className={`${styles.tabBtn} ${activeTab === "sections" ? styles.activeTab : ""}`}
                onClick={() => setActiveTab("sections")}
              >
                Specific Sections ({results.filter(r => r.type === "section").length})
              </button>
            </div>
          </div>
          
          <div className={styles.aiPromoBlock}>
            <h4>Need deeper analysis?</h4>
            <p>Our AI Assistant can read through these results and synthesize an answer for you.</p>
            <Link href={`/ask?q=${encodeURIComponent(query)}`} className={styles.aiBtn}>
              Ask AI about "{query || 'this'}"
            </Link>
          </div>
        </aside>

        <main className={styles.resultsMain}>
          {isSearching ? (
            <div className={styles.loadingState}>Searching the legal library...</div>
          ) : results.length > 0 ? (
            <div className={styles.resultsList}>
              {filteredResults.map((result, idx) => (
                <div key={idx} className={styles.resultCard}>
                  <div className={styles.resultMeta}>
                    <span className={styles.resultTypeBadge}>
                      {result.type === "law" ? "Act" : "Section"} Match
                    </span>
                    <span className={`${styles.relevanceBadge} ${styles[result.relevance.toLowerCase()]}`}>
                      {result.relevance} Match
                    </span>
                  </div>
                  
                  <h3 className={styles.resultTitle}>
                    {result.type === "law" ? (
                      <Link href={`/laws/${result.law.slug}`}>{result.law.title}</Link>
                    ) : (
                      <Link href={`/laws/${result.law.slug}#section-${result.section?.section_number}`}>
                        {result.law.title} - Section {result.section?.section_number}: {result.section?.heading}
                      </Link>
                    )}
                  </h3>
                  
                  <div className={styles.resultDetails}>
                    <span className={styles.actNum}>{result.law.act_number}</span>
                    <span className={styles.year}>{result.law.year}</span>
                    <span className={styles.category}>{result.law.category}</span>
                  </div>
                  
                  <p className={styles.excerpt}>
                    ... {result.excerpt.substring(0, 200)}{result.excerpt.length > 200 ? "..." : ""} ...
                  </p>
                </div>
              ))}
            </div>
          ) : query ? (
            <div className={styles.emptyState}>
              <p>No results found for "{query}". Try different keywords or browse the <Link href="/laws">Laws Library</Link>.</p>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>Enter a search term above to begin researching.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ padding: '5rem', textAlign: 'center' }}>Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
