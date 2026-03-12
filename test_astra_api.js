const { DataAPIClient } = require("@datastax/astra-db-ts");
require("dotenv").config({ path: ".env.local" });

async function test() {
  try {
    const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN);
    const db = client.db(process.env.ASTRA_DB_API_ENDPOINT, {
      keyspace: process.env.ASTRA_DB_NAMESPACE || "default_keyspace"
    });
    
    console.log("Connecting to collection...");
    const collection = db.collection("laws_vectors");
    
    console.log("Counting documents...");
    const count = await collection.countDocuments({}, 1000);
    console.log("Count:", count);
    
    console.log("Fetching laws with new stable params...");
    const cursor = collection.find({}, {
      limit: 300,
      projection: { act_title: 1, act_year: 1, section: 1, category: 1 }
    });
    const docs = await cursor.toArray();
    console.log("Found docs:", docs.length);
    if (docs.length > 0) {
      console.log("First doc:", JSON.stringify(docs[0], null, 2));
    }
  } catch (err) {
    console.error("DEBUG ERROR:", err);
  }
}

test();
