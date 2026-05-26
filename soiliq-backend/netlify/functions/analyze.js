import express from 'express';
import multer from 'multer';
import serverless from 'serverless-http';
import { v4 as uuidv4 } from 'uuid';
import { withCors } from '../../src/utils/http.js';
import { requireAuth } from '../../src/middleware/auth.js';
import { supabaseAdmin } from '../../src/utils/supabase.js';
import { getWeatherContext } from '../../src/services/weather.js';
import { prepareImageBase64, runSoilAnalysis } from '../../src/services/analyze.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });
const app = express();
withCors(app);
app.use(requireAuth);

app.get('/analyze/:id', async (req, res) => {
  const row = await supabaseAdmin.from('soil_analyses').select('*').eq('id', req.params.id).single();
  if (row.error) return res.status(404).json({ error: row.error.message });
  res.json(row.data);
});

app.post('/analyze', upload.single('image'), async (req, res) => {
  const { farm_id, input_method } = req.body || {};
  if (!farm_id || !input_method) return res.status(400).json({ error: 'farm_id and input_method are required' });

  const farm = await supabaseAdmin.from('farms').select('*').eq('id', farm_id).eq('user_id', req.user.id).single();
  if (farm.error) return res.status(404).json({ error: 'Farm not found' });

  let image_url = null;
  let imageBase64 = null;

  if (input_method === 'photo') {
    if (!req.file) return res.status(400).json({ error: 'image is required for photo analysis' });
    const fileName = `${farm_id}/${uuidv4()}.jpg`;

    const { error: uploadError } = await supabaseAdmin.storage.from('soil-images').upload(fileName, req.file.buffer, {
      contentType: req.file.mimetype || 'image/jpeg',
      upsert: false
    });
    if (uploadError) return res.status(400).json({ error: uploadError.message });

    image_url = supabaseAdmin.storage.from('soil-images').getPublicUrl(fileName).data.publicUrl;
    const prepared = await prepareImageBase64(req.file.buffer);
    imageBase64 = prepared.toString('base64');
  }

  const weather_context = await getWeatherContext(farm.data.latitude, farm.data.longitude);
  const manual_inputs = req.body.manual_inputs ? JSON.parse(req.body.manual_inputs) : null;
  const sensor_reading = req.body.sensor_reading ? JSON.parse(req.body.sensor_reading) : null;

  const analysis = await runSoilAnalysis({
    inputMethod: input_method,
    weatherContext: weather_context,
    manualInputs: manual_inputs,
    sensorReading: sensor_reading,
    imageBase64
  });

  const insertPayload = {
    farm_id,
    image_url,
    input_method,
    manual_inputs,
    ph_estimate: analysis.ph_estimate,
    nitrogen_level: analysis.nitrogen_level,
    phosphorus_level: analysis.phosphorus_level,
    potassium_level: analysis.potassium_level,
    compaction_risk: analysis.compaction_risk,
    organic_matter_estimate: analysis.organic_matter_estimate,
    moisture_status: analysis.moisture_status,
    overall_health_score: analysis.overall_health_score,
    ai_analysis: analysis.analysis,
    fertilizer_recommendations: analysis.fertilizer_recommendations,
    amendment_recommendations: analysis.amendment_recommendations,
    confidence: analysis.confidence,
    weather_context
  };

  const saved = await supabaseAdmin.from('soil_analyses').insert(insertPayload).select('*').single();
  if (saved.error) return res.status(400).json({ error: saved.error.message });

  const fert = analysis.fertilizer_recommendations || [];
  if (fert.length) {
    await supabaseAdmin.from('recommendations_history').insert(
      fert.map((item) => ({
        farm_id,
        analysis_id: saved.data.id,
        recommendation_type: 'fertilizer',
        product_name: item.product,
        quantity_per_hectare: item.quantity_per_hectare,
        unit: item.unit,
        estimated_cost_usd: item.estimated_cost_usd
      }))
    );
  }

  res.status(201).json({ id: saved.data.id, ...analysis, weather_context, image_url, analyzed_at: saved.data.analyzed_at });
});

export const handler = serverless(app);
