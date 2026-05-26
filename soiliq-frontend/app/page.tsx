import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="space-y-14 pb-6">
      <section className="hero-organic topo-pattern relative overflow-hidden rounded-2xl border border-slate-100 p-8 shadow-card md:p-10">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="space-y-5">
            <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">AI-powered soil intelligence</span>
            <h1>Know your soil. Grow with confidence.</h1>
            <p className="max-w-xl text-lg">SoilIQ helps farmers make faster, data-backed soil decisions using photos, manual field observations, and sensor streams.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/auth/register" className="rounded-lg bg-primary px-4 py-2 font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-dark">Get Started</Link>
              <Link href="/dashboard" className="btn-outline">View Dashboard</Link>
            </div>
          </div>
          <div className="surface-card space-y-3 p-6">
            <h3 className="text-lg">Soil Layer Snapshot</h3>
            <div className="space-y-2">
              <div className="h-11 rounded-lg bg-[#6e4f3a]" />
              <div className="h-11 rounded-lg bg-[#927158]" />
              <div className="h-11 rounded-lg bg-[#baa089]" />
            </div>
            <p className="text-sm">Topsoil · Subsoil · Bedrock</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { metric: '40%', text: 'of farmland is nutrient depleted' },
          { metric: '$11B', text: 'lost annually to poor soil management' },
          { metric: '500M', text: 'smallholders without soil testing access' }
        ].map((item) => (
          <article key={item.metric} className="surface-card bg-slate-50/80 p-6">
            <p className="text-4xl font-semibold leading-none text-primary">{item.metric}</p>
            <p className="mt-2 text-sm">{item.text}</p>
          </article>
        ))}
      </section>

      <section>
        <h2 className="mb-5">How it works</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: 'Capture Inputs', body: 'Use farm photos, quick manual observations, or IoT sensor readings.' },
            { title: 'Run AI Analysis', body: 'Generate pH, nutrient, and soil health insights with weather context.' },
            { title: 'Act on Advice', body: 'Follow fertilizer and farm management recommendations with cost awareness.' }
          ].map((step, index) => (
            <article key={step.title} className="surface-card p-5">
              <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">{index + 1}</span>
              <h3>{step.title}</h3>
              <p className="mt-2 text-sm">{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-5">Features</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            'Photo Analysis',
            'Manual Input',
            'IoT Sensor Support',
            'Local Language UX',
            'Fertilizer Cost Calculator',
            'Weather-aware Insights'
          ].map((feature) => (
            <article key={feature} className="surface-card border-l-4 border-l-accent p-5">
              <h3>{feature}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <blockquote className="surface-card p-5">“SoilIQ helped me reduce fertilizer waste and improve maize yields.” — Farmer, Kenya</blockquote>
        <blockquote className="surface-card p-5">“The weather-aware advice reduced nutrient runoff in my field.” — Farmer, Ghana</blockquote>
      </section>

      <footer className="surface-card bg-slate-50 p-4 text-center text-sm">Grant acknowledgment placeholder · Built for impact partners.</footer>
    </div>
  );
}
