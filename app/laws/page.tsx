"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import LawCard from "@/components/LawCard";

// Client-side cache for session-wide stability
let cachedLaws: any[] | null = null;
let cachedTotalChunks: number = 0;

function LawsLibraryContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [liveLaws, setLiveLaws] = useState<any[]>(cachedLaws || []);
  const [totalChunks, setTotalChunks] = useState<number>(cachedTotalChunks);
  const [isLoading, setIsLoading] = useState(!cachedLaws);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    async function fetchLaws() {
      if (cachedLaws) return; // Skip if already have data
      
      try {
        const res = await fetch('/api/laws');
        const data = await res.json();
        if (data.laws) {
          setLiveLaws(data.laws);
          setTotalChunks(data.totalChunks);
          // Update global cache
          cachedLaws = data.laws;
          cachedTotalChunks = data.totalChunks;
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLaws();
  }, []);

  const categories = ["All", ...Array.from(new Set(liveLaws.map(law => law.category.trim().toLowerCase())))];

  const filteredLaws = liveLaws.filter(law => {
    const titleMatch = (law.title || "").toLowerCase().includes(searchQuery.toLowerCase());
    const actMatch = (law.act_number || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = titleMatch || actMatch;
    const matchesCategory = selectedCategory === "All" || law.category.toLowerCase().trim() === selectedCategory.toLowerCase().trim();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={styles.libraryPage}>
      <header className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.pageTitle}>laws library</h1>
          <p className={styles.pageSubtitle}>
            {totalChunks > 0 ? `browsing ${totalChunks} verified legal sections discovered in astra db.` : 'searching and indexing sri lankan acts in real-time...'}
          </p>
        </div>
      </header>

      <div className={`container ${styles.libraryLayout}`}>
        <aside className={styles.sidebar}>
          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>search</h3>
            <div className={styles.searchBox}>
              <input 
                type="text" 
                placeholder="search an act by name..." 
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>categories</h3>
            <ul className={styles.categoryList}>
              {categories.map(cat => (
                <li key={cat}>
                  <button 
                    className={`${styles.categoryBtn} ${selectedCategory === cat ? styles.active : ""}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className={styles.mainContent}>
          <div className={styles.resultsHeader}>
            <p className={styles.countText}>
              found <strong>{filteredLaws.length}</strong> unique acts 
              {totalChunks > 0 && <span className={styles.chunkCount}> (across {totalChunks} sections)</span>}
            </p>
            <div className={styles.sortBox}>
              <select className={styles.sortSelect} defaultValue="relevance">
                <option value="relevance">sort by relevance</option>
                <option value="newest">newest (year)</option>
                <option value="oldest">oldest (year)</option>
                <option value="az">a-z</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className={styles.loadingContainer}>
              <p>syncing with law database...</p>
            </div>
          ) : (
            <div className={styles.lawsGrid}>
              {filteredLaws.map(law => (
                <LawCard key={law.id} law={law} />
              ))}
              
              {filteredLaws.length === 0 && (
                <div className={styles.emptyState}>
                  <p>no laws found in the system yet.</p>
                  <button 
                    className={styles.clearFiltersBtn}
                    onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                  >
                    clear filters
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function LawsLibrary() {
  return (
    <Suspense fallback={<div style={{ padding: '5rem', textAlign: 'center' }}>syncing legal database...</div>}>
      <LawsLibraryContent />
    </Suspense>
  );
}
