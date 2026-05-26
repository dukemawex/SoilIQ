export default function WeatherWidget({ weather }: { weather?: any }) {
  if (!weather) return <div className="rounded-lg bg-white p-4 shadow-sm">Weather unavailable</div>;
  return (
    <div className="rounded-lg border-l-4 border-leaf bg-white p-4 shadow-sm card-grain">
      <h3 className="font-semibold">7-day Forecast</h3>
      <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-7">
        {(weather.forecast || []).map((d: any) => (
          <div key={d.date} className="rounded bg-linen p-2 text-xs">
            <p>{new Date(d.date).toLocaleDateString()}</p>
            <p className="font-mono">{Math.round(d.temp)}°C</p>
            <p>{d.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
