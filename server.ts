import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Initialize Plaid (will error on use if missing env vars, but won't crash startup)
let plaidClient: PlaidApi | null = null;
function getPlaidClient() {
  if (!plaidClient) {
    if (!process.env.PLAID_CLIENT_ID || !process.env.PLAID_SECRET) {
      throw new Error("Plaid credentials missing. Please configure PLAID_CLIENT_ID and PLAID_SECRET.");
    }
    const configuration = new Configuration({
      basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
          'PLAID-SECRET': process.env.PLAID_SECRET,
        },
      },
    });
    plaidClient = new PlaidApi(configuration);
  }
  return plaidClient;
}

// API Routes
app.post('/api/ai/classify', async (req, res) => {
  try {
    const { transactionName, amount } = req.body;
    const prompt = `Classify this financial transaction into a category (e.g., Food, Transport, Entertainment, Utilities, Housing, Income, Other).
Transaction: "${transactionName}"
Amount: ${amount}
Only return the category name, nothing else.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });
    
    res.json({ category: response.text?.trim() || 'Other' });
  } catch (error: any) {
    console.error('Gemini Classification Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai/insights', async (req, res) => {
  try {
    const { transactions } = req.body;
    const prompt = `Act as an expert financial advisor. Here is a list of my recent transactions (JSON format):
${JSON.stringify(transactions)}

Provide 3 personalized, actionable insights about my spending habits and budget in Portuguese (Brazil). Keep them concise and professional.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });
    
    res.json({ insights: response.text });
  } catch (error: any) {
    console.error('Gemini Insights Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/plaid/create_link_token', async (req, res) => {
  try {
    const client = getPlaidClient();
    const { userId } = req.body;
    
    const tokenResponse = await client.linkTokenCreate({
      user: { client_user_id: userId },
      client_name: 'FinDash',
      products: ['transactions'] as any,
      country_codes: ['US'] as any,
      language: 'en',
    });
    
    res.json(tokenResponse.data);
  } catch (error: any) {
    const errMsg = error.response?.data || error.message;
    if (typeof errMsg === 'string' && errMsg.includes('Plaid credentials missing')) {
      res.status(400).json({ error: errMsg });
    } else {
      console.error('Plaid Link Token Error:', errMsg);
      res.status(500).json({ error: errMsg });
    }
  }
});

app.post('/api/plaid/exchange_and_sync', async (req, res) => {
  try {
    const client = getPlaidClient();
    const { public_token } = req.body;
    
    // 1. Exchange the public token for an access token
    const exchangeResponse = await client.itemPublicTokenExchange({
      public_token,
    });
    const accessToken = exchangeResponse.data.access_token;
    
    // 2. Fetch the last 30 days of transactions
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    const transactionsResponse = await client.transactionsGet({
      access_token: accessToken,
      start_date: thirtyDaysAgo.toISOString().split('T')[0],
      end_date: now.toISOString().split('T')[0],
    });
    
    res.json({ transactions: transactionsResponse.data.transactions });
  } catch (error: any) {
    console.error('Plaid Sync Error:', error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
