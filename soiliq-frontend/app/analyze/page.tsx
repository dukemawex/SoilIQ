'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function AnalyzePage() {
  const [farms, setFarms] = useState<any[]>([]);
  const [farmId, setFarmId] = useState('');
  const [inputMethod, setInputMethod] = useState<'photo' | 'manual' | 'sensor'>('photo');
  const [file, setFile] = useState<File | null>(null);
  const [manual, setManual] = useState<any>({});
  const [sensor, setSensor] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);
  const router = useRouter();

  const statuses = useMemo(() => ['Uploading sample...', 'Checking weather conditions...', 'Running AI analysis...', 'Generating recommendations...'], []);

  useEffect(() => { api.getFarms().then(setFarms).catch(() => undefined); }, []);

  async function submit() {
    setLoading(true);
    const timer = setInterval(() => setStatusIdx((i) => (i + 1) % statuses.length), 1200);
    try {
      const fd = new FormData();
      fd.append('farm_id', farmId);
      fd.append('input_method', inputMethod);
      if (file) fd.append('image', file);
      if (inputMethod === 'manual') fd.append('manual_inputs', JSON.stringify(manual));
      if (inputMethod === 'sensor') fd.append('sensor_reading', JSON.stringify(sensor));
      const result = await api.analyzeFarm(fd);
      router.push(`/analysis/${result.id}`);
    } finally {
      clearInterval(timer);
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl">New Soil Analysis</h1>

      <div className="rounded bg-white p-4 shadow-sm">
        <label className="mb-1 block text-sm">Select Farm</label>
        <select className="w-full rounded border p-2" value={farmId} onChange={(e) => setFarmId(e.target.value)}>
          <option value="">Select farm</option>
          {farms.map((farm) => <option key={farm.id} value={farm.id}>{farm.name}</option>)}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { key: 'photo', label: '📸 Photo Analysis' },
          { key: 'manual', label: '✏️ Manual Input' },
          { key: 'sensor', label: '📡 Sensor Data' }
        ].map((m) => (
          <button key={m.key} className={`rounded-lg border p-4 text-left ${inputMethod === m.key ? 'border-soil bg-soil/5' : 'bg-white'}`} onClick={() => setInputMethod(m.key as any)}>{m.label}</button>
        ))}
      </div>

      {inputMethod === 'photo' && (
        <div className="rounded bg-white p-4 shadow-sm">
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <details className="mt-3 text-sm text-gray-600">
            <summary>Tips for a good soil photo</summary>
            <ul className="list-disc pl-5">
              <li>Use daylight without flash glare.</li>
              <li>Capture soil close-up and in focus.</li>
              <li>Avoid plant residue covering the sample.</li>
              <li>Include representative area of the field.</li>
            </ul>
          </details>
        </div>
      )}

      {inputMethod === 'manual' && (
        <div className="grid gap-2 rounded bg-white p-4 shadow-sm md:grid-cols-2">
          {['color', 'texture', 'smell', 'drainage', 'previous_crop', 'months_since_last_fertilized'].map((field) => (
            <input
              key={field}
              aria-label={{
                color: 'Soil color',
                texture: 'Soil texture',
                smell: 'Soil smell',
                drainage: 'Drainage condition',
                previous_crop: 'Previous crop',
                months_since_last_fertilized: 'Number of months since last fertilization'
              }[field]}
              className="rounded border p-2"
              placeholder={field.replaceAll('_', ' ')}
              onChange={(e) => setManual({ ...manual, [field]: e.target.value })}
            />
          ))}
        </div>
      )}

      {inputMethod === 'sensor' && (
        <div className="grid gap-2 rounded bg-white p-4 shadow-sm md:grid-cols-3">
          {['ph', 'moisture', 'temperature', 'nitrogen_ppm', 'phosphorus_ppm', 'potassium_ppm'].map((field) => (
            <input key={field} aria-label={field} className="rounded border p-2" type="number" placeholder={field} onChange={(e) => setSensor({ ...sensor, [field]: Number(e.target.value) })} />
          ))}
        </div>
      )}

      <button disabled={loading || !farmId} onClick={submit} className="rounded bg-soil px-4 py-2 text-white disabled:opacity-50">{loading ? statuses[statusIdx] : 'Run Analysis'}</button>
    </div>
  );
}
