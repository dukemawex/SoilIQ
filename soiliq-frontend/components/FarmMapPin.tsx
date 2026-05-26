'use client';

import { useState } from 'react';

export default function FarmMapPin({ onChange }: { onChange: (coords: { lat: number; lng: number }) => void }) {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  return (
    <div className="space-y-2 rounded-lg bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-600">Map pin selector (numeric fallback)</p>
      <div className="grid grid-cols-2 gap-2">
        <input className="rounded border p-2" placeholder="Latitude" value={lat} onChange={(e) => setLat(e.target.value)} />
        <input className="rounded border p-2" placeholder="Longitude" value={lng} onChange={(e) => setLng(e.target.value)} />
      </div>
      <button className="rounded bg-soil px-3 py-2 text-white" onClick={() => onChange({ lat: Number(lat), lng: Number(lng) })}>Set Location</button>
    </div>
  );
}
