import axios from 'axios';
import { env } from '../utils/env.js';

export async function getWeatherContext(lat, lon) {
  if (!env.OPENWEATHERMAP_API_KEY || lat == null || lon == null) {
    return { unavailable: true, reason: 'Missing API key or coordinates' };
  }

  const current = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
    params: { lat, lon, appid: env.OPENWEATHERMAP_API_KEY, units: 'metric' }
  });

  const forecast = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
    params: { lat, lon, appid: env.OPENWEATHERMAP_API_KEY, units: 'metric' }
  });

  const rainfallEstimate = (forecast.data.list || []).reduce((sum, item) => sum + (item?.rain?.['3h'] || 0), 0);

  return {
    temperature_c: current.data?.main?.temp,
    humidity: current.data?.main?.humidity,
    condition: current.data?.weather?.[0]?.description,
    wind_speed: current.data?.wind?.speed,
    rainfall_last_7d_estimate_mm: Number(rainfallEstimate.toFixed(2)),
    fetched_at: new Date().toISOString()
  };
}

export function buildWeatherAdvisories(forecastList = []) {
  const advisories = [];
  const maxPop = Math.max(...forecastList.map((item) => item.pop || 0), 0);
  const minTemp = Math.min(...forecastList.map((item) => item.main?.temp_min ?? 99), 99);

  if (maxPop > 0.75) advisories.push('Heavy rain likely in coming days. Delay fertilizer application to reduce runoff.');
  if (minTemp < 8) advisories.push('Possible cold stress risk. Consider mulching and delayed planting.');
  if (advisories.length === 0) advisories.push('Conditions are generally stable for routine field operations.');

  return advisories;
}
