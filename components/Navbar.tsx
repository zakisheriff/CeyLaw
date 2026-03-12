"use client";

import Link from "next/link";
import styles from "./Navbar.module.css";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/search", label: "A-Z Search" },
    { href: "/laws", label: "Laws Library" },
    { href: "/ask", label: "Ask AI Assistant" }
  ];

  return (
    <header className={styles.header}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          CeyLaw 
          <span style={{fontSize: '0.6rem', marginLeft: '8px', verticalAlign: 'middle', backgroundColor: 'var(--color-primary)', color: 'white', padding: '2px 6px', borderRadius: '4px'}}>GOV</span>
        </Link>
        
        <nav className={styles.navLinks}>
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`${styles.navLink} ${pathname === link.href ? styles.active : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
