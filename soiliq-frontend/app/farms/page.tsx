'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import FarmMapPin from '@/components/FarmMapPin';

export default function FarmsPage() {
  const [farms, setFarms] = useState<any[]>([]);
  const [form, setForm] = useState<any>({});

  async function load() {
    try { setFarms(await api.getFarms()); } catch {}
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-4">
      <h1>Farms</h1>
      <div className="surface-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50"><tr><th className="p-2">Name</th><th>Crop</th><th>Area</th><th>Location</th><th>Actions</th></tr></thead>
          <tbody>
            {farms.map((farm) => (
              <tr key={farm.id} className="border-t"><td className="p-2">{farm.name}</td><td>{farm.crop_type}</td><td>{farm.area_hectares}</td><td>{farm.country}</td><td><Link href={`/farms/${farm.id}`} className="font-medium text-primary hover:text-primary-dark">View</Link></td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="surface-card p-4">
        <h2 className="mb-2 text-xl">Add Farm</h2>
        <div className="grid gap-2 md:grid-cols-2">
          {['name', 'crop_type', 'area_hectares', 'country', 'state_province'].map((field) => (
            <input key={field} aria-label={field.replaceAll('_', ' ')} className="rounded border p-2" placeholder={field} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
          ))}
        </div>
        <div className="mt-2"><FarmMapPin onChange={(coords) => setForm({ ...form, latitude: coords.lat, longitude: coords.lng })} /></div>
        <button className="mt-2" onClick={async () => { await api.createFarm(form); await load(); }}>Create Farm</button>
      </div>
    </div>
  );
}
