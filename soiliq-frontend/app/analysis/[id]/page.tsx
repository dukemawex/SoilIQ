'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import SoilHealthRing from '@/components/SoilHealthRing';
import ParameterCard from '@/components/ParameterCard';
import RecommendationTable from '@/components/RecommendationTable';
import { api } from '@/lib/api';

export default function AnalysisDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    api.getAnalysis(id).then(setAnalysis).catch(() => undefined);
  }, [id]);

  if (!analysis) return <p className="animate-float">Loading analysis...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6 rounded-lg bg-white p-6 shadow-sm">
        <SoilHealthRing score={analysis.overall_health_score} size={180} />
        <div>
          <h1 className="font-heading text-3xl">Analysis Result</h1>
          <p>{new Date(analysis.analyzed_at || Date.now()).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <ParameterCard title="pH Estimate" value={analysis.ph_estimate} />
        <ParameterCard title="Nitrogen" value={analysis.nitrogen_level} status={analysis.nitrogen_level} />
        <ParameterCard title="Phosphorus" value={analysis.phosphorus_level} status={analysis.phosphorus_level} />
        <ParameterCard title="Potassium" value={analysis.potassium_level} status={analysis.potassium_level} />
        <ParameterCard title="Compaction" value={analysis.compaction_risk} status={analysis.compaction_risk} />
        <ParameterCard title="Organic Matter" value={analysis.organic_matter_estimate} status={analysis.organic_matter_estimate} />
        <ParameterCard title="Moisture" value={analysis.moisture_status} status={analysis.moisture_status} />
        <ParameterCard title="Confidence" value={`${Math.round((analysis.confidence || 0) * 100)}%`} />
      </div>

      <blockquote className="rounded-lg border-l-4 border-soil bg-white p-4 whitespace-pre-line">{analysis.analysis || analysis.ai_analysis}</blockquote>

      {!!analysis.warnings?.length && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4">
          <h3 className="font-semibold text-red-700">Warnings</h3>
          <ul className="list-disc pl-5 text-sm text-red-700">
            {analysis.warnings.map((w: string) => <li key={w}>{w}</li>)}
          </ul>
        </div>
      )}

      <section>
        <h2 className="mb-2 font-heading text-2xl">Fertilizer Recommendations</h2>
        <RecommendationTable rows={analysis.fertilizer_recommendations || []} />
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        {(analysis.amendment_recommendations || []).map((a: any, idx: number) => (
          <div key={idx} className="rounded-lg bg-white p-4 shadow-sm">
            <h3 className="font-medium">{a.amendment_type}</h3>
            <p className="text-sm">{a.description}</p>
            <p className="font-mono text-sm">{a.quantity_per_hectare} {a.unit}</p>
            <p className="text-xs text-gray-600">{a.benefit}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
