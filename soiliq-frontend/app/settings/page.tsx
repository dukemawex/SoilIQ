'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [profile, setProfile] = useState({ full_name: '', phone: '', country: '', language: 'en', notifications: true });

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl">Settings</h1>
      <div className="grid gap-3 rounded-lg bg-white p-4 shadow-sm md:grid-cols-2">
        <input className="rounded border p-2" placeholder="Full name" onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
        <input className="rounded border p-2" placeholder="Phone" onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
        <input className="rounded border p-2" placeholder="Country" onChange={(e) => setProfile({ ...profile, country: e.target.value })} />
        <select className="rounded border p-2" value={profile.language} onChange={(e) => setProfile({ ...profile, language: e.target.value })}>
          <option value="en">English</option><option value="fr">French</option><option value="ha">Hausa</option><option value="yo">Yoruba</option><option value="sw">Swahili</option><option value="am">Amharic</option>
        </select>
        <label className="flex items-center gap-2"><input type="checkbox" checked={profile.notifications} onChange={(e) => setProfile({ ...profile, notifications: e.target.checked })} /> Notifications enabled</label>
      </div>
    </div>
  );
}
