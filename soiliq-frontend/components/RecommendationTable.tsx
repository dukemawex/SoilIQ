'use client';

export default function RecommendationTable({ rows, onApply }: { rows: any[]; onApply?: (id: string) => void }) {
  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-linen text-left">
          <tr>
            <th className="p-3">Product</th>
            <th className="p-3">NPK</th>
            <th className="p-3">Qty/ha</th>
            <th className="p-3">Timing</th>
            <th className="p-3">Cost</th>
            <th className="p-3">Local Alt</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.id || idx} className="border-t">
              <td className="p-3">{row.product || row.product_name}</td>
              <td className="p-3">{row.npk_ratio || '-'}</td>
              <td className="p-3">{row.quantity_per_hectare} {row.unit}</td>
              <td className="p-3">{row.timing || '-'}</td>
              <td className="p-3">${row.estimated_cost_usd || 0}</td>
              <td className="p-3">{row.locally_available_alternative || '-'}</td>
              <td className="p-3">
                {!row.applied && onApply ? (
                  <button className="rounded bg-leaf px-2 py-1 text-white" onClick={() => onApply(row.id)}>Mark as Applied</button>
                ) : (
                  <span className="text-green-700">Applied</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
