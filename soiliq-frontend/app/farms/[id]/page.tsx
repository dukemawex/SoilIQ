'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api } from '@/lib/api';
import WeatherWidget from '@/components/WeatherWidget';

const mapLevel = (x: string) => ({ deficient: 1, low: 2, adequate: 3, high: 4 }[x] || 0);

export default function FarmDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [insights, setInsights] = useState<any>();
  const [weather, setWeather] = useState<any>();
  const [sensors, setSensors] = useState<any[]>([]);

  useEffect(() => {
    api.getInsights(id).then(setInsights).catch(() => undefined);
    api.getWeather(id).then(setWeather).catch(() => undefined);
    api.getSensorReadings(id).then(setSensors).catch(() => undefined);
  }, [id]);

  const npk = (insights?.healthTrend || []).map((p: any) => ({ ...p, n: mapLevel('low'), phos: mapLevel('adequate'), k: mapLevel('adequate') }));

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl">Farm Details</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded bg-white p-4 shadow-sm"><h2>Soil Health Trend</h2><div className="h-64"><ResponsiveContainer width="100%" height="100%"><LineChart data={insights?.healthTrend || []}><XAxis dataKey="date" hide /><YAxis /><Tooltip /><Line dataKey="value" stroke="#4a7c59" /></LineChart></ResponsiveContainer></div></div>
        <div className="rounded bg-white p-4 shadow-sm"><h2>pH Trend</h2><div className="h-64"><ResponsiveContainer width="100%" height="100%"><LineChart data={insights?.phTrend || []}><XAxis dataKey="date" hide /><YAxis /><Tooltip /><Line dataKey="value" stroke="#3d1f0d" /></LineChart></ResponsiveContainer></div></div>
        <div className="rounded bg-white p-4 shadow-sm"><h2>NPK Trend</h2><div className="h-64"><ResponsiveContainer width="100%" height="100%"><LineChart data={npk}><XAxis dataKey="date" hide /><YAxis /><Tooltip /><Line dataKey="n" stroke="#dc2626" /><Line dataKey="phos" stroke="#f59e0b" /><Line dataKey="k" stroke="#16a34a" /></LineChart></ResponsiveContainer></div></div>
        <div className="rounded bg-white p-4 shadow-sm"><h2>Sensor Readings</h2><div className="h-64"><ResponsiveContainer width="100%" height="100%"><LineChart data={sensors}><XAxis dataKey="recorded_at" hide /><YAxis /><Tooltip /><Line dataKey="moisture" stroke="#2563eb" /><Line dataKey="ph" stroke="#7c3aed" /></LineChart></ResponsiveContainer></div></div>
      </div>
      <WeatherWidget weather={weather} />
    </div>
  );
}
