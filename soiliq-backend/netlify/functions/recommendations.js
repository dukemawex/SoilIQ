import express from 'express';
import serverless from 'serverless-http';
import { withCors } from '../../src/utils/http.js';
import { requireAuth } from '../../src/middleware/auth.js';
import { supabaseAdmin } from '../../src/utils/supabase.js';

const app = express();
app.use(express.json());
withCors(app);
app.use(requireAuth);

app.get('/recommendations/:farmId', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('recommendations_history')
    .select('*')
    .eq('farm_id', req.params.farmId)
    .order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.patch('/recommendations/:id/applied', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('recommendations_history')
    .update({ applied: true, applied_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .select('*')
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export const handler = serverless(app);
