const https = require('https');
require("dotenv").config({ path: ".env.local" });

const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(data);
      if (parsedData.models) {
        const embeddingModels = parsedData.models.filter(m => m.supportedGenerationMethods.includes('embedContent'));
        console.log("Supported Embedding Models:");
        console.log(JSON.stringify(embeddingModels, null, 2));
      } else {
        console.log("No models found or error:");
        console.log(JSON.stringify(parsedData, null, 2));
      }
    } catch (e) {
      console.log("Error parsing response:", e.message);
      console.log("Raw Response:", data);
    }
  });
}).on('error', (err) => {
  console.log("Error:", err.message);
});
