import Link from "next/link";
import styles from "./LawCard.module.css";
import { Law } from "@/lib/mockData";

interface LawCardProps {
  law: Law;
}

export default function LawCard({ law }: LawCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.categoryBadge}>{law.category}</span>
        <span className={styles.year}>{law.year}</span>
      </div>
      
      <h3 className={styles.title}>
        <Link href={`/laws/${law.slug}`} className={styles.titleLink}>
          {law.title}
        </Link>
      </h3>
      
      <p className={styles.actNumber}>{law.act_number}</p>
      <p className={styles.description}>{law.description}</p>
      
      <div className={styles.cardFooter}>
        <Link href={`/laws/${law.slug}`} className={styles.readButton}>
          Read Act &rarr;
        </Link>
      </div>
    </article>
  );
}
