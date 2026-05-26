import express from 'express';
import serverless from 'serverless-http';
import { withCors } from '../../src/utils/http.js';
import { requireAuth } from '../../src/middleware/auth.js';
import { supabaseAdmin } from '../../src/utils/supabase.js';

const app = express();
app.use(express.json());
withCors(app);
app.use(requireAuth);

app.get('/farms', async (req, res) => {
  const { data, error } = await supabaseAdmin.from('farms').select('*').eq('user_id', req.user.id).order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post('/farms', async (req, res) => {
  const payload = { ...req.body, user_id: req.user.id };
  const { data, error } = await supabaseAdmin.from('farms').insert(payload).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

app.get('/farms/:id', async (req, res) => {
  const farm = await supabaseAdmin.from('farms').select('*').eq('id', req.params.id).eq('user_id', req.user.id).single();
  if (farm.error) return res.status(404).json({ error: farm.error.message });

  const latest = await supabaseAdmin
    .from('soil_analyses')
    .select('id,overall_health_score,ph_estimate,nitrogen_level,compaction_risk,analyzed_at')
    .eq('farm_id', req.params.id)
    .order('analyzed_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  res.json({ ...farm.data, latest_analysis: latest.data || null });
});

app.put('/farms/:id', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('farms')
    .update(req.body)
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .select('*')
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.delete('/farms/:id', async (req, res) => {
  const { error } = await supabaseAdmin.from('farms').delete().eq('id', req.params.id).eq('user_id', req.user.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

export const handler = serverless(app);
