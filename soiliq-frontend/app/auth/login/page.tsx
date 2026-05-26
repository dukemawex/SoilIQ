'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function login() {
    const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8888/.netlify/functions';
    const res = await fetch(`${base}/auth/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    const data = await res.json();
    if (data?.session?.access_token) localStorage.setItem('soiliq_token', data.session.access_token);
  }

  return (
    <div className="mx-auto max-w-md space-y-3 rounded bg-white p-6 shadow-sm">
      <h1 className="font-heading text-3xl">Login</h1>
      <input className="w-full rounded border p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full rounded border p-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="rounded bg-soil px-4 py-2 text-white" onClick={login}>Login</button>
    </div>
  );
}
