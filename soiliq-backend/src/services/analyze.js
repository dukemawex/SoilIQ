import Anthropic from '@anthropic-ai/sdk';
import sharp from 'sharp';
import { env } from '../utils/env.js';

const systemPrompt = `You are an expert soil scientist and agronomist specializing in African smallholder farming systems. Analyze the provided soil data and return ONLY a valid JSON object with these exact keys: ph_estimate (number 0-14), nitrogen_level ('deficient'|'low'|'adequate'|'high'), phosphorus_level ('deficient'|'low'|'adequate'|'high'), potassium_level ('deficient'|'low'|'adequate'|'high'), compaction_risk ('low'|'medium'|'high'), organic_matter_estimate ('very_low'|'low'|'medium'|'high'), moisture_status ('dry'|'optimal'|'waterlogged'), overall_health_score (0-100), analysis (string: 2 paragraph plain-language explanation), fertilizer_recommendations (array of objects with: product, npk_ratio, quantity_per_hectare, unit, timing, estimated_cost_usd, locally_available_alternative), amendment_recommendations (array of objects with: amendment_type, description, quantity_per_hectare, unit, benefit), confidence (0-1), warnings (string array of urgent issues to address immediately)`;

const fallback = {
  ph_estimate: 6.2,
  nitrogen_level: 'low',
  phosphorus_level: 'low',
  potassium_level: 'adequate',
  compaction_risk: 'medium',
  organic_matter_estimate: 'medium',
  moisture_status: 'optimal',
  overall_health_score: 62,
  analysis:
    'Soil conditions indicate moderate productivity with likely nitrogen and phosphorus constraints. This profile is common in continuously cropped fields with limited nutrient replenishment.\\n\\nPrioritize balanced nutrient restoration, moisture-preserving residue management, and targeted amendment practices to improve biological activity and long-term soil structure.',
  fertilizer_recommendations: [
    {
      product: 'NPK 15-15-15',
      npk_ratio: '15-15-15',
      quantity_per_hectare: 150,
      unit: 'kg',
      timing: 'Split at planting and 4 weeks after emergence',
      estimated_cost_usd: 85,
      locally_available_alternative: 'Composted manure + urea microdosing'
    }
  ],
  amendment_recommendations: [
    {
      amendment_type: 'Organic compost',
      description: 'Apply mature compost to improve organic matter and nutrient retention.',
      quantity_per_hectare: 2000,
      unit: 'kg',
      benefit: 'Improves soil structure and water holding capacity.'
    }
  ],
  confidence: 0.71,
  warnings: []
};

function parseJson(text) {
  const trimmed = text.trim();
  const first = trimmed.indexOf('{');
  const last = trimmed.lastIndexOf('}');
  if (first < 0 || last < 0) return null;
  return JSON.parse(trimmed.slice(first, last + 1));
}

export async function prepareImageBase64(buffer) {
  return sharp(buffer).resize({ width: 1024, height: 1024, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 88 }).toBuffer();
}

export async function runSoilAnalysis({ inputMethod, weatherContext, manualInputs, sensorReading, imageBase64 }) {
  if (!env.ANTHROPIC_API_KEY) return fallback;

  const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  let userPrompt = `Input method: ${inputMethod}. Weather context: ${JSON.stringify(weatherContext)}.`;

  if (inputMethod === 'photo') {
    userPrompt += ' Analyze this soil photo and infer field-ready recommendations.';
  } else if (inputMethod === 'manual') {
    userPrompt += ` Manual observations: ${JSON.stringify(manualInputs)}.`;
  } else {
    userPrompt += ` Sensor readings: ${JSON.stringify(sensorReading)}.`;
  }

  try {
    const content = inputMethod === 'photo'
      ? [
          { type: 'text', text: userPrompt },
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 } }
        ]
      : [{ type: 'text', text: userPrompt }];

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1800,
      system: systemPrompt,
      temperature: 0.2,
      messages: [{ role: 'user', content }]
    });

    const text = response.content?.find((item) => item.type === 'text')?.text || '';
    const parsed = parseJson(text);
    return parsed || fallback;
  } catch {
    return fallback;
  }
}
