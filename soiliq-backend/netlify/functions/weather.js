import express from 'express';
import serverless from 'serverless-http';
import axios from 'axios';
import { withCors } from '../../src/utils/http.js';
import { requireAuth } from '../../src/middleware/auth.js';
import { supabaseAdmin } from '../../src/utils/supabase.js';
import { env } from '../../src/utils/env.js';
import { buildWeatherAdvisories } from '../../src/services/weather.js';

const app = express();
withCors(app);
app.use(requireAuth);

app.get('/weather/:farmId', async (req, res) => {
  const farm = await supabaseAdmin.from('farms').select('latitude,longitude,name').eq('id', req.params.farmId).single();
  if (farm.error) return res.status(404).json({ error: farm.error.message });

  const forecast = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
    params: {
      lat: farm.data.latitude,
      lon: farm.data.longitude,
      appid: env.OPENWEATHERMAP_API_KEY,
      units: 'metric'
    }
  });

  const sevenDay = (forecast.data.list || []).slice(0, 56).filter((_, idx) => idx % 8 === 0).map((entry) => ({
    date: entry.dt_txt,
    temp: entry.main.temp,
    humidity: entry.main.humidity,
    rain_prob: entry.pop,
    description: entry.weather?.[0]?.description
  }));

  res.json({
    farm: farm.data.name,
    forecast: sevenDay,
    advisories: buildWeatherAdvisories(forecast.data.list || [])
  });
});

export const handler = serverless(app);
