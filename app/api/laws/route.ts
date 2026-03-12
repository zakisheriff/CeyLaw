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
    
    // 1. Get total chunks count
    // Astra DB find().count() or estimatedDocumentCount
    const count = await collection.countDocuments({}, 10000); // Limit to 10k for speed

    // 2. Fetch metadata for discovery (scanning 300 items for unique acts for stability)
    const cursor = collection.find({}, {
      limit: 300,
      projection: { act_title: 1, act_year: 1, section: 1, category: 1 }
    });
    
    const chunks = await cursor.toArray();
    
    // Grouping chunks into "Laws" for the library view
    const lawsMap = new Map();
    
    chunks.forEach(chunk => {
      if (chunk.act_title && !lawsMap.has(chunk.act_title)) {
        lawsMap.set(chunk.act_title, {
          id: chunk._id ? chunk._id.toString() : Math.random().toString(),
          slug: chunk.act_title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: chunk.act_title,
          year: chunk.act_year || "n/a",
          act_number: chunk.section ? `act section ${chunk.section}` : "act",
          category: chunk.category || "general law",
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
