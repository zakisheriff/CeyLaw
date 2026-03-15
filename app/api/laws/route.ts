import { NextResponse } from 'next/server';
import { DataAPIClient } from "@datastax/astra-db-ts";

// Initialize Astra
const astraClient = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN as string);
const db = astraClient.db(process.env.ASTRA_DB_API_ENDPOINT as string, {
  keyspace: process.env.ASTRA_DB_NAMESPACE || "default_keyspace"
});

export async function GET() {
  try {
    const collection = db.collection("laws_vectors");
    
    // 1. Get total chunks count - skip expensive count if we already know we have many
    let count = 10000; 
    /* 
    try {
      count = await collection.countDocuments({}, 10000); 
    } catch (e) {
      console.warn("Count limit reached, defaulting to 10000+");
      count = 10000;
    }
    */

    // 2. Fetch metadata for discovery (scanning more items for coverage, but capped for speed)
    const cursor = collection.find({}, {
      limit: 1000,
      projection: { act_title: 1, act_year: 1, section: 1, category: 1 }
    });
    
    const chunks = await cursor.toArray();
    
    // Grouping chunks into "Laws" for the library view
    const lawsMap = new Map();
    
    chunks.forEach(chunk => {
      const rawTitle = chunk.act_title?.trim();
      const rawCategory = chunk.category?.trim() || "general law";
      
      if (rawTitle && !lawsMap.has(rawTitle.toLowerCase())) {
        lawsMap.set(rawTitle.toLowerCase(), {
          id: chunk._id ? chunk._id.toString() : Math.random().toString(),
          slug: rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: rawTitle.toLowerCase(), // keep strictly lowercase for brutalist aesthetic
          year: chunk.act_year || "n/a",
          act_number: chunk.section ? `act section ${chunk.section}` : "act",
          category: rawCategory.toLowerCase(),
          description: "read full act context..."
        });
      }
    });

    const laws = Array.from(lawsMap.values());

    return NextResponse.json({
      totalChunks: count,
      laws: laws
    });

  } catch (err) {
    console.error("Laws API Error:", err);
    return NextResponse.json({ error: 'Failed to fetch laws', details: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
