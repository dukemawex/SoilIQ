export default function ParameterCard({ title, value, status }: { title: string; value: string | number; status?: string }) {
  const border = status === 'high' || status === 'deficient' ? 'border-red-500' : status === 'low' || status === 'medium' ? 'border-amber-500' : 'border-green-600';
  return (
    <div className={`rounded-lg border-l-4 ${border} bg-white p-4 shadow-sm card-grain`}>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="font-mono text-xl font-semibold">{value}</p>
      {status && <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">{status}</p>}
    </div>
  );
}
