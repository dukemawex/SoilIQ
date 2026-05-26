import express from 'express';
import serverless from 'serverless-http';
import { withCors } from '../../src/utils/http.js';
import { requireAuth } from '../../src/middleware/auth.js';
import { supabaseAdmin } from '../../src/utils/supabase.js';

const app = express();
app.use(express.json());
withCors(app);
app.use(requireAuth);

app.post('/sensor/reading', async (req, res) => {
  const payload = req.body || {};
  const { data, error } = await supabaseAdmin.from('sensor_readings').insert(payload).select('*').single();
  if (error) return res.status(400).json({ error: error.message });

  const prev = await supabaseAdmin
    .from('sensor_readings')
    .select('*')
    .eq('farm_id', payload.farm_id)
    .neq('id', data.id)
    .order('recorded_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const trigger = Boolean(prev.data && (Math.abs((payload.ph || 0) - (prev.data.ph || 0)) > 0.5 || Number(payload.moisture || 0) < 20));
  res.status(201).json({ reading: data, trigger_analysis: trigger });
});

app.get('/sensor/readings/:farmId', async (req, res) => {
  const start = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
  const { data, error } = await supabaseAdmin
    .from('sensor_readings')
    .select('*')
    .eq('farm_id', req.params.farmId)
    .gte('recorded_at', start)
    .order('recorded_at', { ascending: true });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export const handler = serverless(app);
