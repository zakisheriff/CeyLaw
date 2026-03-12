import Link from "next/link";
import styles from "./LawCard.module.css";
import { Law } from "@/lib/mockData";

interface LawCardProps {
  law: Law;
}

export default function LawCard({ law }: LawCardProps) {
  return (
    <Link href={`/laws/${law.slug}`} className={styles.cardLink}>
      <article className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.categoryBadge}>{law.category}</span>
          <span className={styles.year}>{law.year}</span>
        </div>
        
        <h3 className={styles.title}>
          {law.title}
        </h3>
        
        <p className={styles.actNumber}>{law.act_number}</p>
        <p className={styles.description}>{law.description}</p>
        
        <div className={styles.cardFooter}>
          <span className={styles.readButton}>
            Read Act &rarr;
          </span>
        </div>
      </article>
    </Link>
  );
}
