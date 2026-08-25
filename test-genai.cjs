const { GoogleGenAI } = require('@google/genai');
try {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  console.log("Success");
} catch(e) {
  console.error("Error:", e.message);
}
