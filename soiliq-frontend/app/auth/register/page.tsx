'use client';

import { useState } from 'react';

export default function RegisterPage() {
  const [form, setForm] = useState<any>({ language: 'en' });

  async function register() {
    const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8888/.netlify/functions';
    await fetch(`${base}/auth/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
  }

  return (
    <div className="mx-auto max-w-lg space-y-3 rounded bg-white p-6 shadow-sm">
      <h1 className="font-heading text-3xl">Create Account</h1>
      {['email', 'password', 'full_name', 'phone', 'country', 'state_province'].map((f) => (
        <input key={f} className="w-full rounded border p-2" type={f === 'password' ? 'password' : 'text'} placeholder={f} onChange={(e) => setForm({ ...form, [f]: e.target.value })} />
      ))}
      <button className="rounded bg-soil px-4 py-2 text-white" onClick={register}>Register</button>
    </div>
  );
}
