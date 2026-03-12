import { mockLaws, mockSections } from "@/lib/mockData";

export type Citation = {
  act: string;
  section: string;
  slug: string;
};

export type RetrievalResult = {
  context: string;
  citations: Citation[];
};

/**
 * Mocks a vector or full-text search retrieval against Astra DB.
 * In production, this would use DataAPI vector search capabilities.
 */
export async function retrieveLegalContext(query: string, limit: number = 3, lawSlug?: string): Promise<RetrievalResult> {
  const q = query.toLowerCase();
  let relevantSections = mockSections.filter(sec => 
    sec.heading.toLowerCase().includes(q) || 
    sec.content.toLowerCase().includes(q)
  );

  // If filtered by specific law context
  if (lawSlug && lawSlug !== "all") {
    const targetLaw = mockLaws.find(l => l.slug === lawSlug);
    if (targetLaw) {
      relevantSections = relevantSections.filter(sec => sec.law_id === targetLaw.id);
    }
  }

  // Take top N
  const topSections = relevantSections.slice(0, limit);

  // Formatting context string for LLM
  let contextText = "";
  let citations: Citation[] = [];

  for (const ts of topSections) {
    const law = mockLaws.find(l => l.id === ts.law_id);
    if (law) {
      contextText += `---\nAct: ${law.title} (${law.year})\nSection ${ts.section_number}: ${ts.heading}\nText:\n${ts.content}\n\n`;
      citations.push({
        act: law.title,
        section: `Section ${ts.section_number}`,
        slug: law.slug
      });
    }
  }

  return {
    context: contextText || "No directly relevant sections found in the immediate retrieval set.",
    citations
  };
}

/**
 * Utility to construct the prompt sent to the LLM (e.g. Gemini 2.5 Flash).
 */
export function constructLegalPrompt(userQuery: string, retrievedContext: string) {
  return `
You are CeyLaw, a Sri Lankan AI Legal Assistant. Your role is to help users understand Sri Lankan laws.
You MUST follow these rules:
1. Answer strictly based on the provided context below. Do not hallucinate laws.
2. If the answer is not in the context, clearly state that you do not have enough specific legal text to answer.
3. Keep your explanation simple, clear, and easy to understand for a layperson.
4. Always cite exactly the Act and Section number referenced in the context.

--- CONTEXT EXCERPTS ---
${retrievedContext}
------------------------

USER QUERY:
"${userQuery}"

Provide your summarized answer, detailed explanation, and then list citations precisely.
`;
}
