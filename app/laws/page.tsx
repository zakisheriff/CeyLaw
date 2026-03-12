"use client";

import { useState } from "react";
import styles from "./page.module.css";
import LawCard from "@/components/LawCard";
import { mockLaws } from "@/lib/mockData";

export default function LawsLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(mockLaws.map(law => law.category)))];

  const filteredLaws = mockLaws.filter(law => {
    const matchesSearch = law.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          law.act_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || law.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={styles.libraryPage}>
      <header className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.pageTitle}>Laws Library</h1>
          <p className={styles.pageSubtitle}>Browse, search, and read all acts and ordinances of Sri Lanka.</p>
        </div>
      </header>

      <div className={`container ${styles.libraryLayout}`}>
        <aside className={styles.sidebar}>
          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>Search</h3>
            <div className={styles.searchBox}>
              <input 
                type="text" 
                placeholder="Search an Act by name..." 
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>Categories</h3>
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
            <p>Showing <strong>{filteredLaws.length}</strong> laws</p>
            <div className={styles.sortBox}>
              <select className={styles.sortSelect} defaultValue="relevance">
                <option value="relevance">Sort by Relevance</option>
                <option value="newest">Newest First (Year)</option>
                <option value="oldest">Oldest First (Year)</option>
                <option value="az">A-Z</option>
              </select>
            </div>
          </div>

          <div className={styles.lawsGrid}>
            {filteredLaws.map(law => (
              <LawCard key={law.id} law={law} />
            ))}
            
            {filteredLaws.length === 0 && (
              <div className={styles.emptyState}>
                <p>No laws found matching your search and category filters.</p>
                <button 
                  className={styles.clearFiltersBtn}
                  onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
