const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI();
ai.models.generateContent({
  model: 'gemini-3.6-flash',
  contents: 'Hello',
}).then(res => console.log(res.text)).catch(e => console.error("Error:", e.message));
