"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import styles from "./CopyButton.module.css";

interface CopyButtonProps {
  text: string;
}

export default function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button 
      className={styles.copyBtn} 
      onClick={handleCopy}
      title={copied ? "Copied!" : "Copy Section"}
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  );
}
