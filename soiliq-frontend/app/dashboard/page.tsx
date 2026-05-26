'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import SoilHealthRing from '@/components/SoilHealthRing';
import WeatherWidget from '@/components/WeatherWidget';
import AnalysisCard from '@/components/AnalysisCard';

export default function DashboardPage() {
  const [farms, setFarms] = useState<any[]>([]);
  const [weather, setWeather] = useState<any>();

  useEffect(() => {
    api.getFarms().then(async (f) => {
      setFarms(f);
      if (f[0]?.id) setWeather(await api.getWeather(f[0].id));
    }).catch(() => undefined);
  }, []);

  const avgScore = farms.length ? Math.round(farms.reduce((s, f) => s + (f.latest_analysis?.overall_health_score || 0), 0) / farms.length) : 0;

  return (
    <div className="space-y-6">
      <h1>Dashboard</h1>
      <WeatherWidget weather={weather} />
      <div className="grid gap-4 md:grid-cols-4">
        <div className="surface-card p-4">Total Farms <p className="font-mono text-2xl text-text">{farms.length}</p></div>
        <div className="surface-card p-4">Avg Soil Health <p className="font-mono text-2xl text-text">{avgScore}</p></div>
        <div className="surface-card p-4">Analyses This Month <p className="font-mono text-2xl text-text">{farms.filter((f) => f.latest_analysis).length}</p></div>
        <div className="surface-card p-4">Recommendations Applied <p className="font-mono text-2xl text-text">0</p></div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {farms.map((farm) => (
          <div key={farm.id} className="surface-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{farm.name}</h3>
                <p className="text-sm">{farm.crop_type}</p>
              </div>
              <SoilHealthRing score={farm.latest_analysis?.overall_health_score || 0} size={100} />
            </div>
          </div>
        ))}
      </div>

      <section>
        <h2 className="mb-3">Recent Analyses</h2>
        <div className="space-y-3">
          {farms.flatMap((f) => (f.latest_analysis ? [{ ...f.latest_analysis }] : [])).slice(0, 5).map((a, idx) => <AnalysisCard key={a.id || idx} analysis={a} />)}
        </div>
      </section>
    </div>
  );
}
