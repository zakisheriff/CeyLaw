"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { mockLaws, Law } from "@/lib/mockData";

export default function AdminPage() {
  const [laws, setLaws] = useState<Law[]>(mockLaws);
  
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to carefully delete this record?")) {
      setLaws(laws.filter(l => l.id !== id));
    }
  };

  return (
    <div className={styles.adminPage}>
      <header className={styles.adminHeader}>
        <div className="container">
          <h1 className={styles.adminTitle}>Admin Console</h1>
          <p className={styles.adminSubtitle}>Manage laws and platform content</p>
        </div>
      </header>

      <div className={`container ${styles.adminLayout}`}>
        <aside className={styles.sidebar}>
          <ul className={styles.adminNav}>
            <li><button className={styles.activeNav}>Laws Library</button></li>
            <li><button>Upload New Act</button></li>
            <li><button>Categories</button></li>
            <li><button>User Management</button></li>
            <li><button>System Settings</button></li>
          </ul>
        </aside>

        <main className={styles.mainContent}>
          <div className={styles.contentHeader}>
            <h2 className={styles.sectionTitle}>Manage Laws Library</h2>
            <button className={styles.primaryBtn}>+ Upload New Law</button>
          </div>

          <div className={styles.searchBar}>
            <input type="text" placeholder="Search laws by ID, title, or category..." className={styles.searchInput} />
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Act / Year</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {laws.map(law => (
                  <tr key={law.id}>
                    <td>{law.id}</td>
                    <td className={styles.titleCell}>
                      <Link href={`/laws/${law.slug}`} target="_blank">{law.title}</Link>
                    </td>
                    <td>{law.act_number} ({law.year})</td>
                    <td><span className={styles.badge}>{law.category}</span></td>
                    <td><span className={styles.statusLive}>Published</span></td>
                    <td className={styles.actionsCell}>
                      <button className={styles.actionBtn} title="Edit">✎</button>
                      <button className={styles.actionBtnDelete} title="Delete" onClick={() => handleDelete(law.id)}>🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
