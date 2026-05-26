export type Farm = {
  id: string;
  name: string;
  crop_type?: string;
  area_hectares?: number;
  latitude?: number;
  longitude?: number;
  country?: string;
  state_province?: string;
  created_at?: string;
  latest_analysis?: Analysis;
};

export type Analysis = {
  id: string;
  farm_id?: string;
  ph_estimate: number;
  nitrogen_level: string;
  phosphorus_level: string;
  potassium_level: string;
  compaction_risk: string;
  organic_matter_estimate: string;
  moisture_status: string;
  overall_health_score: number;
  ai_analysis?: string;
  confidence?: number;
  warnings?: string[];
  fertilizer_recommendations?: any[];
  amendment_recommendations?: any[];
  weather_context?: Record<string, unknown>;
  analyzed_at?: string;
};
