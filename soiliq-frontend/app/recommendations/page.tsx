'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import RecommendationTable from '@/components/RecommendationTable';

export default function RecommendationsPage() {
  const [farmId, setFarmId] = useState('');
  const [farms, setFarms] = useState<any[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'applied' | 'pending'>('all');

  useEffect(() => { api.getFarms().then(setFarms).catch(() => undefined); }, []);
  useEffect(() => { if (farmId) api.getRecommendations(farmId).then(setRows).catch(() => undefined); }, [farmId]);

  const filtered = useMemo(() => rows.filter((r) => filter === 'all' ? true : filter === 'applied' ? r.applied : !r.applied), [rows, filter]);
  const totalCost = filtered.filter((r) => !r.applied).reduce((sum, r) => sum + (r.estimated_cost_usd || 0), 0);

  return (
    <div className="space-y-4">
      <h1>Recommendations</h1>
      <div className="surface-card flex flex-wrap items-center gap-2 p-4">
        <select className="rounded border p-2" value={farmId} onChange={(e) => setFarmId(e.target.value)}><option value="">Select farm</option>{farms.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}</select>
        <select className="rounded border p-2" value={filter} onChange={(e) => setFilter(e.target.value as any)}><option value="all">All</option><option value="applied">Applied</option><option value="pending">Pending</option></select>
        <div className="rounded-lg bg-accent/15 px-3 py-2 text-sm font-medium text-accent-dark">Pending Estimated Cost: ${totalCost.toFixed(2)}</div>
      </div>
      <RecommendationTable rows={filtered} onApply={async (id) => { await api.markRecommendationApplied(id); if (farmId) setRows(await api.getRecommendations(farmId)); }} />
    </div>
  );
}
