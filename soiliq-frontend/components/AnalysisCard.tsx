import Link from 'next/link';
import { Analysis } from '@/lib/types';

export default function AnalysisCard({ analysis }: { analysis: Analysis }) {
  return (
    <Link href={`/analysis/${analysis.id}`} className="surface-card block p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="font-medium text-text">Health Score: {analysis.overall_health_score}</p>
        <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">pH {analysis.ph_estimate}</span>
      </div>
      <p className="mt-2 text-sm">{analysis.analyzed_at ? new Date(analysis.analyzed_at).toLocaleString() : 'Recent analysis'}</p>
    </Link>
  );
}
