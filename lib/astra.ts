import { DataAPIClient } from "@datastax/astra-db-ts";

// Determine if we should use the mock client (useful for UI development before linking a real DB)
const ASTRA_DB_API_ENDPOINT = process.env.ASTRA_DB_API_ENDPOINT || "";
const ASTRA_DB_APPLICATION_TOKEN = process.env.ASTRA_DB_APPLICATION_TOKEN || "";

// Initialize Astra Client
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);

// Connect to the specific database
export const db = client.db(ASTRA_DB_API_ENDPOINT);

/**
 * Helper definition of the Collections we will use in Astra DB.
 * Astra DB is a NoSQL document database built on Apache Cassandra, 
 * perfect for JSON documents and Vector Embeddings.
 */

// We will have three primary collections:
// 1. "categories" - Simple documents defining law categories (e.g., {"name": "Criminal Law"})
// 2. "laws" - Documents defining the Acts (e.g., {"title": "Penal Code", "year": 1883})
// 3. "law_sections" - Documents containing the actual text and the $vector field for AI search.

export const collections = {
  categories: db.collection("categories"),
  laws: db.collection("laws"),
  lawSections: db.collection("law_sections"),
};
