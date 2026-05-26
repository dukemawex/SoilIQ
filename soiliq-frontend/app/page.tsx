import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="space-y-16">
      <section className="grid gap-8 rounded-2xl bg-white p-8 shadow-sm md:grid-cols-2">
        <div className="space-y-4">
          <h1 className="font-heading text-5xl font-bold text-soil">Know your soil. Feed your community.</h1>
          <p className="text-lg text-gray-700">AI-powered soil intelligence for African smallholder farmers using photos, field observations, and sensor data.</p>
          <div className="flex gap-3">
            <Link href="/auth/register" className="rounded bg-soil px-4 py-2 text-white">Get Started</Link>
            <Link href="/dashboard" className="rounded border border-soil px-4 py-2">View Dashboard</Link>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl bg-linen p-6">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-wheat/30" />
          <div className="space-y-2">
            <div className="h-12 rounded bg-[#5c3925]" />
            <div className="h-12 rounded bg-[#7a5138]" />
            <div className="h-12 rounded bg-[#9f7a5e]" />
          </div>
          <p className="mt-3 text-sm text-gray-600">Topsoil · Subsoil · Bedrock</p>
        </div>
      </section>

      <section className="grid gap-4 rounded-xl bg-soil p-6 text-white md:grid-cols-3">
        <p>40% of African farmland is nutrient depleted</p>
        <p>$11B lost annually to poor soil management</p>
        <p>500M smallholders with no soil testing access</p>
      </section>

      <section>
        <h2 className="mb-4 font-heading text-3xl">How it works</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {['Photo/Input', 'AI Analysis', 'Actionable Recommendations'].map((step) => (
            <div key={step} className="rounded-lg bg-white p-4 shadow-sm">{step}</div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-heading text-3xl">Features</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {['Photo Analysis', 'Manual Input', 'IoT Sensor Support', 'Local Language', 'Fertilizer Cost Calculator', 'Weather Integration'].map((f) => (
            <div key={f} className="rounded-lg border-l-4 border-leaf bg-white p-4 shadow-sm">{f}</div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <blockquote className="rounded-lg bg-white p-4 shadow-sm">“SoilIQ helped me reduce fertilizer waste and improve maize yields.” — Farmer, Kenya</blockquote>
        <blockquote className="rounded-lg bg-white p-4 shadow-sm">“The weather-aware advice reduced nutrient runoff in my field.” — Farmer, Ghana</blockquote>
      </section>

      <footer className="rounded-lg bg-linen p-4 text-center text-sm">Grant acknowledgment placeholder · Built for impact partners.</footer>
    </div>
  );
}
