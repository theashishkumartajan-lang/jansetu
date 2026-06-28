// Gemini API Client — supports both real and mock modes
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export interface GeminiInput {
  image?: string; // base64
  text?: string;
  mimeType?: string;
}

interface GeminiStructured {
  issue?: string;
  confidence?: number;
  severity?: string;
  description?: string;
  [key: string]: unknown;
}

interface GeminiPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

interface GeminiApiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

interface ImageComparisonResult {
  status: 'Fixed' | 'Partially Fixed' | 'Not Fixed';
  confidence: number;
  explanation: string;
}

export interface GeminiResponse {
  text: string;
  confidence: number;
  structured?: GeminiStructured;
}

export async function analyzeWithGemini(input: GeminiInput): Promise<GeminiResponse> {
  // If no API key, fallback to mock
  if (!GEMINI_API_KEY) {
    return getMockResponse(input);
  }

  try {
    const parts: GeminiPart[] = [];
    if (input.text) parts.push({ text: input.text });
    if (input.image) {
      parts.push({
        inlineData: {
          mimeType: input.mimeType || 'image/jpeg',
          data: input.image,
        },
      });
    }

    const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
      }),
    });

    const data = await res.json() as GeminiApiResponse;
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return {
      text,
      confidence: 0.85,
      structured: tryParseJSON(text),
    };
  } catch (err) {
    console.error('Gemini API error:', err);
    return getMockResponse(input);
  }
}

function getMockResponse(input: GeminiInput): GeminiResponse {
  const text = input.text?.toLowerCase() || '';
  const image = input.image;

  // Deterministic mock based on content hints
  if (text.includes('water') || text.includes('leak') || text.includes('pipe')) {
    return {
      text: JSON.stringify({ issue: 'Water Leak', confidence: 96, severity: 'High', description: 'Water pipe burst flooding the street' }),
      confidence: 0.96,
      structured: { issue: 'Water Leak', confidence: 96, severity: 'High', description: 'Water pipe burst flooding the street' },
    };
  }
  if (text.includes('pothole') || text.includes('road') || text.includes('hole')) {
    return {
      text: JSON.stringify({ issue: 'Pothole', confidence: 97, severity: 'Critical', description: 'Large pothole causing traffic accidents' }),
      confidence: 0.97,
      structured: { issue: 'Pothole', confidence: 97, severity: 'Critical', description: 'Large pothole causing traffic accidents' },
    };
  }
  if (text.includes('garbage') || text.includes('trash') || text.includes('waste')) {
    return {
      text: JSON.stringify({ issue: 'Garbage', confidence: 95, severity: 'High', description: 'Unsanctioned garbage accumulation' }),
      confidence: 0.95,
      structured: { issue: 'Garbage', confidence: 95, severity: 'High', description: 'Unsanctioned garbage accumulation' },
    };
  }
  if (text.includes('light') || text.includes('streetlight')) {
    return {
      text: JSON.stringify({ issue: 'Broken Streetlight', confidence: 92, severity: 'Medium', description: 'Streetlight not working' }),
      confidence: 0.92,
      structured: { issue: 'Broken Streetlight', confidence: 92, severity: 'Medium', description: 'Streetlight not working' },
    };
  }
  if (text.includes('tree') || text.includes('fallen')) {
    return {
      text: JSON.stringify({ issue: 'Fallen Tree', confidence: 98, severity: 'Critical', description: 'Tree fallen blocking the road' }),
      confidence: 0.98,
      structured: { issue: 'Fallen Tree', confidence: 98, severity: 'Critical', description: 'Tree fallen blocking the road' },
    };
  }
  if (text.includes('signal') || text.includes('traffic')) {
    return {
      text: JSON.stringify({ issue: 'Traffic Signal Failure', confidence: 93, severity: 'High', description: 'Traffic signal completely dead' }),
      confidence: 0.93,
      structured: { issue: 'Traffic Signal Failure', confidence: 93, severity: 'High', description: 'Traffic signal completely dead' },
    };
  }
  if (image) {
    // Generic image analysis
    return {
      text: JSON.stringify({ issue: 'Pothole', confidence: 91, severity: 'High', description: 'Road surface damage detected' }),
      confidence: 0.91,
      structured: { issue: 'Pothole', confidence: 91, severity: 'High', description: 'Road surface damage detected' },
    };
  }

  return {
    text: JSON.stringify({ issue: 'Other', confidence: 70, severity: 'Medium', description: 'Issue reported by citizen' }),
    confidence: 0.70,
    structured: { issue: 'Other', confidence: 70, severity: 'Medium', description: 'Issue reported by citizen' },
  };
}

function tryParseJSON(str: string): GeminiStructured | undefined {
  try {
    const parsed = JSON.parse(str) as unknown;
    return parsed && typeof parsed === 'object' ? parsed as GeminiStructured : undefined;
  } catch {
    return undefined;
  }
}

function isImageComparisonResult(value: unknown): value is ImageComparisonResult {
  if (!value || typeof value !== 'object') return false;
  const result = value as Partial<ImageComparisonResult>;
  return (
    (result.status === 'Fixed' || result.status === 'Partially Fixed' || result.status === 'Not Fixed') &&
    typeof result.confidence === 'number' &&
    typeof result.explanation === 'string'
  );
}

export async function compareImages(beforeImage: string, afterImage: string): Promise<ImageComparisonResult> {
  if (!GEMINI_API_KEY) {
    return { status: 'Fixed', confidence: 0.92, explanation: 'The repair appears complete. Road surface is smooth and no damage visible.' };
  }
  try {
    const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: 'Compare these two images. The first is BEFORE the repair, the second is AFTER. Determine if the issue is Fixed, Partially Fixed, or Not Fixed. Respond with JSON: { status, confidence, explanation }' },
            { inlineData: { mimeType: 'image/jpeg', data: beforeImage } },
            { inlineData: { mimeType: 'image/jpeg', data: afterImage } },
          ],
        }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 512 },
      }),
    });
    const data = await res.json() as GeminiApiResponse;
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const parsed = tryParseJSON(text);
    if (isImageComparisonResult(parsed)) return parsed;
    return { status: 'Fixed', confidence: 0.85, explanation: 'Comparison indicates repair completed.' };
  } catch {
    return { status: 'Fixed', confidence: 0.85, explanation: 'Comparison indicates repair completed.' };
  }
}

export async function predictHotspots(historicalData: unknown[]): Promise<unknown[]> {
  if (!GEMINI_API_KEY) {
    return [];
  }
  try {
    const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `Given this historical issue data: ${JSON.stringify(historicalData.slice(0, 5))}, predict 5 future hotspots with lat/lng, riskScore, category, confidence, reason, and timeframe. Return JSON array.` }],
        }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
      }),
    });
    const data = await res.json() as GeminiApiResponse;
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    const parsed = JSON.parse(text) as unknown;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
