const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  const start = Date.now();
  console.log("Starting generation...");
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: 'Say hello',
    });
    console.log("Response:", response.text);
    console.log("Time:", Date.now() - start, "ms");
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
