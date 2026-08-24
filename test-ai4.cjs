const { GoogleGenAI } = require('@google/genai');
async function test() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: 'Hello',
    });
    console.log('AI Response:', response.text);
  } catch (err) {
    console.error('AI Error:', err.message || JSON.stringify(err));
  }
}
test();
