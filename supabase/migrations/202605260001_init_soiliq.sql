create table profiles (
  id uuid primary key references auth.users,
  full_name text,
  phone text,
  country text,
  state_province text,
  language text default 'en',
  created_at timestamptz default now()
);

create table farms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  name text not null,
  crop_type text,
  area_hectares float,
  latitude float,
  longitude float,
  country text,
  state_province text,
  created_at timestamptz default now()
);

create table soil_analyses (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid references farms(id),
  image_url text,
  input_method text check (input_method in ('photo','manual','sensor')),
  manual_inputs jsonb,
  ph_estimate float,
  nitrogen_level text check (nitrogen_level in ('deficient','low','adequate','high')),
  phosphorus_level text check (phosphorus_level in ('deficient','low','adequate','high')),
  potassium_level text check (potassium_level in ('deficient','low','adequate','high')),
  compaction_risk text check (compaction_risk in ('low','medium','high')),
  organic_matter_estimate text check (organic_matter_estimate in ('very_low','low','medium','high')),
  moisture_status text check (moisture_status in ('dry','optimal','waterlogged')),
  overall_health_score integer check (overall_health_score between 0 and 100),
  ai_analysis text,
  fertilizer_recommendations jsonb,
  amendment_recommendations jsonb,
  confidence float,
  weather_context jsonb,
  analyzed_at timestamptz default now()
);

create table sensor_readings (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid references farms(id),
  sensor_id text,
  ph float,
  moisture float,
  temperature float,
  nitrogen_ppm float,
  phosphorus_ppm float,
  potassium_ppm float,
  recorded_at timestamptz default now()
);

create table recommendations_history (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid references farms(id),
  analysis_id uuid references soil_analyses(id),
  recommendation_type text,
  product_name text,
  quantity_per_hectare float,
  unit text,
  estimated_cost_usd float,
  applied boolean default false,
  applied_at timestamptz,
  created_at timestamptz default now()
);
