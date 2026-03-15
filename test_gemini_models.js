const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env.local" });

async function testModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const models = ["gemini-embedding-2-preview", "gemini-embedding-001", "text-embedding-004", "embedding-001"];
  
  for (const modelName of models) {
    try {
      console.log(`Testing model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.embedContent("test query");
      console.log(`✅ Success with ${modelName}`);
      process.exit(0);
    } catch (err) {
      console.log(`❌ Failed with ${modelName}: ${err.message}`);
    }
  }
}

testModels();
