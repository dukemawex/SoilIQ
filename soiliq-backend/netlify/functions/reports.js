import express from 'express';
import serverless from 'serverless-http';
import { withCors } from '../../src/utils/http.js';
import { requireAuth } from '../../src/middleware/auth.js';
import { supabaseAdmin } from '../../src/utils/supabase.js';

const app = express();
withCors(app);
app.use(requireAuth);

app.get('/reports/:farmId', async (req, res) => {
  const [farm, analyses, recs] = await Promise.all([
    supabaseAdmin.from('farms').select('*').eq('id', req.params.farmId).single(),
    supabaseAdmin.from('soil_analyses').select('*').eq('farm_id', req.params.farmId).order('analyzed_at', { ascending: false }),
    supabaseAdmin.from('recommendations_history').select('*').eq('farm_id', req.params.farmId).order('created_at', { ascending: false })
  ]);

  if (farm.error) return res.status(404).json({ error: farm.error.message });

  res.json({
    farm: farm.data,
    analyses: analyses.data || [],
    recommendations: recs.data || [],
    summary: {
      analyses_count: analyses.data?.length || 0,
      applied_recommendations: (recs.data || []).filter((r) => r.applied).length,
      pending_recommendations: (recs.data || []).filter((r) => !r.applied).length,
      latest_health_score: analyses.data?.[0]?.overall_health_score ?? null
    }
  });
});

export const handler = serverless(app);
