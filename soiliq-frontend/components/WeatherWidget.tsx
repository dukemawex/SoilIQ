export default function WeatherWidget({ weather }: { weather?: any }) {
  if (!weather) return <div className="surface-card p-4">Weather unavailable</div>;
  return (
    <div className="surface-card card-grain border-l-4 border-l-primary p-4">
      <h3 className="font-semibold">7-day Forecast</h3>
      <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-7">
        {(weather.forecast || []).map((d: any) => (
          <div key={d.date} className="rounded-lg bg-slate-50 p-2 text-xs">
            <p>{new Date(d.date).toLocaleDateString()}</p>
            <p className="font-mono">{Math.round(d.temp)}°C</p>
            <p>{d.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
