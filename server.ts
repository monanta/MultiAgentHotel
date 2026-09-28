import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Initialize Google GenAI client if GEMINI_API_KEY is available
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Server-side Gemini AI generation endpoint (if client requests dynamic LLM response)
app.post('/api/gemini/generate', async (req: Request, res: Response) => {
  try {
    const { prompt, systemInstruction } = req.body;
    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    if (!ai) {
      // Fallback if no API key provided
      res.json({
        text: 'Fallback mode active (GEMINI_API_KEY is not configured or in mock mode). Sistem customer service tetap beroperasi secara autonomous menggunakan rule-based specialized agents.',
        source: 'fallback',
      });
      return;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || 'Anda adalah AI Customer Service Concierge untuk Hotel Bintang 5 Grand Horizon.',
        temperature: 0.7,
      },
    });

    res.json({
      text: response.text,
      source: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({
      error: error.message || 'Internal server error during AI synthesis',
      source: 'error',
    });
  }
});

// Mount Vite middleware in development mode
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const port = process.env.PORT || 3000;

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true, port: 3000, host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Grand Horizon Multi-Agent Hotel Server running at http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
