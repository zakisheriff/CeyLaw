"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import { mockLaws } from "@/lib/mockData";
import { FileText } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  citations?: { act: string; section: string; slug: string }[];
};

function AskContext() {
  const searchParams = useSearchParams();
  const initialLawSlug = searchParams.get("law");
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content: "Hello! I am your AI Legal Assistant. How can I help you research Sri Lankan law today?",
    }
  ]);
  const [input, setInput] = useState("");
  const [selectedLaw, setSelectedLaw] = useState<string>(initialLawSlug || "all");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Mock AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: `This is a simulated AI response. Based on your query "${userMsg.content}", the relevant legal principles generally relate to the provisions found in the core statutes. Ensure you consult the exact sections for detailed reading.`,
        citations: [
          { act: "Penal Code", section: "Section 366", slug: "penal-code" }
        ]
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handlePromptClick = (promptText: string) => {
    setInput(promptText);
    // Focus the input would be better, but we can also auto send
  };

  return (
    <div className={styles.askContainer}>
      <div className={styles.sidebar}>
        <div className={styles.settingsGroup}>
          <label className={styles.settingsLabel}>Search Context</label>
          <select 
            className={styles.contextSelect} 
            value={selectedLaw}
            onChange={(e) => setSelectedLaw(e.target.value)}
          >
            <option value="all">Entire Library</option>
            {mockLaws.map(law => (
              <option key={law.id} value={law.slug}>{law.title}</option>
            ))}
          </select>
        </div>

        <div className={styles.promptsSection}>
          <h3 className={styles.promptsTitle}>Suggested Prompts</h3>
          <ul className={styles.promptsList}>
            <li>
              <button onClick={() => handlePromptClick("Explain the elements of theft under the Penal Code")}>
                Explain the elements of theft under the Penal Code
              </button>
            </li>
            <li>
              <button onClick={() => handlePromptClick("What are my fundamental rights regarding equality?")}>
                What are my fundamental rights regarding equality?
              </button>
            </li>
            <li>
              <button onClick={() => handlePromptClick("Summarize the Consumer Affairs Authority Act")}>
                Summarize the Consumer Affairs Authority Act
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.chatArea}>
        <div className={styles.messagesList}>
          {messages.map(msg => (
            <div key={msg.id} className={`${styles.messageWrapper} ${msg.role === "user" ? styles.userWrapper : styles.aiWrapper}`}>
              <div className={styles.messageBubble}>
                {msg.role === "ai" && <div className={styles.aiAvatar}>CeyLaw AI</div>}
                
                <div className={styles.messageContent}>
                  <p>{msg.content}</p>
                </div>

                {msg.citations && msg.citations.length > 0 && (
                  <div className={styles.citationsBlock}>
                    <h4 className={styles.citationsTitle}>Sources Cited:</h4>
                    <div className={styles.citationsQueue}>
                      {msg.citations.map((cite, i) => (
                        <Link key={i} href={`/laws/${cite.slug}#section-${cite.section}`} className={styles.citationLink}>
                          <FileText size={12} className={styles.inlineIcon} /> {cite.act}, {cite.section}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className={`${styles.messageWrapper} ${styles.aiWrapper}`}>
              <div className={`${styles.messageBubble} ${styles.loadingBubble}`}>
                <div className={styles.dotPulse}></div>
                <div className={styles.dotPulse}></div>
                <div className={styles.dotPulse}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.inputArea}>
          <form className={styles.inputForm} onSubmit={handleSend}>
            <input 
              type="text" 
              className={styles.chatInput}
              placeholder="Ask a legal question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className={styles.sendBtn}
              disabled={!input.trim() || isLoading}
            >
              Send
            </button>
          </form>
          <p className={styles.aiDisclaimer}>
            AI responses may not be accurate. Always verify with actual enacted law and consult a lawyer.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AskAIPage() {
  return (
    <div className={styles.pageWrapper}>
      <header className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.pageTitle}>AI Legal Assistant</h1>
          <p className={styles.pageSubtitle}>Research and understand Sri Lankan laws naturally.</p>
        </div>
      </header>
      
      <div className="container">
        <Suspense fallback={<div className={styles.loadingState}>Loading AI Interface...</div>}>
          <AskContext />
        </Suspense>
      </div>
    </div>
  );
}
