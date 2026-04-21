// ⚠️  Replace with your real Anthropic API key
// Get one free at: https://console.anthropic.com
const ANTHROPIC_API_KEY = 'YOUR_ANTHROPIC_API_KEY_HERE';

export async function generateAIPrediction(asset, priceData) {
  const priceInfo = priceData
    ? `Current price: $${priceData.price?.toFixed(2)}, 24h change: ${priceData.change24h?.toFixed(2)}%, High: $${priceData.high?.toFixed(2)}, Low: $${priceData.low?.toFixed(2)}, Volume: $${(priceData.volume / 1e9).toFixed(2)}B`
    : 'Live price data unavailable — use general knowledge';

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `You are ChainStock AI, an expert market analysis assistant. Analyze ${asset.name} (${asset.symbol}) and provide a short-term prediction.

Market Data: ${priceInfo}
Asset Type: ${asset.type}

Respond ONLY with a valid JSON object (no markdown, no backticks, no extra text). Use this exact structure:
{
  "summary": "2-3 sentence market analysis explaining current conditions and near-term outlook",
  "signal": "BUY",
  "confidence": "High",
  "timeframe": "24h",
  "change_24h": "+3.2%",
  "change_7d": "+8.5%",
  "support": "$85,000",
  "resistance": "$92,000",
  "reasoning": "One sentence technical/fundamental reasoning",
  "riskLevel": "Medium",
  "catalysts": ["catalyst 1", "catalyst 2", "catalyst 3"]
}

signal must be exactly: BUY, SELL, or HOLD
confidence must be exactly: High, Medium, or Low
riskLevel must be exactly: Low, Medium, or High`,
      }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const text = data.content.map(b => b.text || '').join('');
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}
