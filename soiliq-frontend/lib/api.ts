import { Analysis, Farm } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8888/.netlify/functions';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('soiliq_token') : null;
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      ...(token ? { Authorization: 'Bearer ' + token } : {})
    }
  });
  if (!res.ok) {
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await res.json();
      throw new Error(body?.error || body?.message || 'Request failed');
    }
    throw new Error(await res.text());
  }
  return res.json();
}

export const api = {
  getFarms: () => request<Farm[]>('/farms/farms'),
  createFarm: (body: Partial<Farm>) => request<Farm>('/farms/farms', { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } }),
  analyzeFarm: (formData: FormData) => request<Analysis>('/analyze/analyze', { method: 'POST', body: formData }),
  getAnalysis: (id: string) => request<Analysis>(`/analyze/analyze/${id}`),
  getSensorReadings: (farmId: string) => request<any[]>(`/sensor/sensor/readings/${farmId}`),
  getInsights: (farmId: string) => request<any>(`/insights/insights/${farmId}`),
  getWeather: (farmId: string) => request<any>(`/weather/weather/${farmId}`),
  getRecommendations: (farmId: string) => request<any[]>(`/recommendations/recommendations/${farmId}`),
  markRecommendationApplied: (id: string) => request<any>(`/recommendations/recommendations/${id}/applied`, { method: 'PATCH' })
};
