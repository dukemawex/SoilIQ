import Link from 'next/link';
import { Analysis } from '@/lib/types';

export default function AnalysisCard({ analysis }: { analysis: Analysis }) {
  return (
    <Link href={`/analysis/${analysis.id}`} className="block rounded-lg border border-soil/20 bg-white p-4 shadow-sm hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="font-medium">Health Score: {analysis.overall_health_score}</p>
        <span className="rounded-full bg-soil/10 px-2 py-1 text-xs">pH {analysis.ph_estimate}</span>
      </div>
      <p className="mt-2 text-sm text-gray-600">{analysis.analyzed_at ? new Date(analysis.analyzed_at).toLocaleString() : 'Recent analysis'}</p>
    </Link>
  );
}
