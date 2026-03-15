import { DataAPIClient } from "@datastax/astra-db-ts";
import { GoogleGenerativeAI } from "@google/generative-ai";

export type Citation = {
  act: string;
  section: string;
  slug: string;
};

export type RetrievalResult = {
  context: string;
  citations: Citation[];
};

// Initialize Astra
const astraClient = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN as string);
const db = astraClient.db(process.env.ASTRA_DB_API_ENDPOINT as string, {
  keyspace: process.env.ASTRA_DB_NAMESPACE || "default_keyspace"
});

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function retrieveLegalContext(query: string, limit: number = 5): Promise<RetrievalResult> {
  try {
    // 1. Generate Query Embedding
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-2-preview" });
    const result = await model.embedContent(query);
    const embedding = result.embedding.values;

    // 2. Query Astra DB Vector Search
    const collection = db.collection("laws_vectors");
    const cursor = collection.find(
      {},
      {
        sort: { $vector: embedding },
        limit
      }
    );
    
    const documents = await cursor.toArray();

    // 3. Format result
    let contextText = "";
    let citations: Citation[] = [];

    for (const doc of documents) {
      contextText += `---\nAct: ${doc.act_title} (${doc.act_year})\nSection ${doc.section}:\n${doc.content}\n\n`;
      citations.push({
        act: doc.act_title,
        section: `Section ${doc.section}`,
        slug: doc.act_title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      });
    }

    return {
      context: contextText || "No directly relevant sections found in the current database.",
      citations
    };
  } catch (error) {
    console.error("Vector retrieval error:", error);
    return {
      context: "Error retrieving legal context.",
      citations: []
    };
  }
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
5. DO NOT use emojis. Ever.
6. Use **double asterisks** for bolding key terms, section numbers, and act names.
7. Use clear paragraph breaks (empty lines) between sections of your response.

--- CONTEXT EXCERPTS ---
${retrievedContext}
------------------------

USER QUERY:
"${userQuery}"

Provide your summarized answer, detailed explanation, and then list citations precisely.
`;
}
