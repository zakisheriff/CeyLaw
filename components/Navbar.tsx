"use client";

import Link from "next/link";
import styles from "./Navbar.module.css";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { href: "/search", label: "A-Z Search" },
    { href: "/laws", label: "Laws Library" },
    { href: "/ask", label: "Ask AI Assistant" }
  ];

  return (
    <header className={styles.header}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          ceylaw
          {/* <span style={{fontSize: '0.6rem', marginLeft: '8px', verticalAlign: 'middle', backgroundColor: 'var(--color-primary)', color: 'white', padding: '2px 6px', borderRadius: '0px'}}>GOV</span> */}
        </Link>
        
        <button 
          className={`${styles.mobileMenuBtn} ${isMobileMenuOpen ? styles.open : ""}`} 
          onClick={toggleMobileMenu} 
          aria-label="Toggle menu"
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>

        <nav className={`${styles.navLinks} ${isMobileMenuOpen ? styles.mobileOpen : ""}`}>
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`${styles.navLink} ${pathname === link.href ? styles.active : ""}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
