import express from 'express';
import serverless from 'serverless-http';
import { withCors } from '../../src/utils/http.js';
import { requireAuth } from '../../src/middleware/auth.js';
import { supabaseAdmin } from '../../src/utils/supabase.js';

const app = express();
withCors(app);
app.use(requireAuth);

app.get('/insights/:farmId', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('soil_analyses')
    .select('id,ph_estimate,overall_health_score,nitrogen_level,analyzed_at')
    .eq('farm_id', req.params.farmId)
    .order('analyzed_at', { ascending: true });

  if (error) return res.status(400).json({ error: error.message });

  const deficiencyCounts = data.reduce((acc, row) => {
    acc[row.nitrogen_level] = (acc[row.nitrogen_level] || 0) + 1;
    return acc;
  }, {});

  const mostCommonDeficiency = Object.entries(deficiencyCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'none';
  const first = data[0]?.overall_health_score ?? 0;
  const last = data[data.length - 1]?.overall_health_score ?? 0;

  res.json({
    phTrend: data.map((item) => ({ date: item.analyzed_at, value: item.ph_estimate })),
    healthTrend: data.map((item) => ({ date: item.analyzed_at, value: item.overall_health_score })),
    mostCommonDeficiency,
    improvementRate: first ? Number((((last - first) / first) * 100).toFixed(2)) : 0
  });
});

export const handler = serverless(app);
