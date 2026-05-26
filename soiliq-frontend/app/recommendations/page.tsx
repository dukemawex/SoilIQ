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
      <h1 className="font-heading text-3xl">Recommendations</h1>
      <div className="flex flex-wrap gap-2">
        <select className="rounded border p-2" value={farmId} onChange={(e) => setFarmId(e.target.value)}><option value="">Select farm</option>{farms.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}</select>
        <select className="rounded border p-2" value={filter} onChange={(e) => setFilter(e.target.value as any)}><option value="all">All</option><option value="applied">Applied</option><option value="pending">Pending</option></select>
        <div className="rounded bg-wheat/20 px-3 py-2 text-sm">Pending Estimated Cost: ${totalCost.toFixed(2)}</div>
      </div>
      <RecommendationTable rows={filtered} onApply={async (id) => { await api.markRecommendationApplied(id); if (farmId) setRows(await api.getRecommendations(farmId)); }} />
    </div>
  );
}
