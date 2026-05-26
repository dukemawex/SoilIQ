# SoilIQ

AI-powered soil health intelligence platform for African smallholder farmers.

## Problem Statement
Smallholder farmers often lack affordable soil diagnostics, causing nutrient depletion, poor yields, and fertilizer waste. SoilIQ enables low-cost analysis from photos, manual observations, and sensor readings to guide better agronomic decisions.

## Solution Overview
- **Frontend**: Next.js 14 App Router deployed to Vercel (`soiliq-frontend`)
- **Backend**: Node.js Netlify Functions deployed to Netlify (`soiliq-backend`)
- **Database/Auth/Storage**: Supabase
- **AI**: Claude Sonnet model for structured soil analysis
- **Weather**: OpenWeatherMap integration for context-aware recommendations

## Architecture Diagram (ASCII)
```
Farmer App (Next.js) --> Netlify Functions API --> Supabase (Auth, Postgres, Storage)
                         |                      \
                         |                       -> OpenWeatherMap API
                         -> Anthropic Claude API
```

## API Endpoints
| Method | Path | Description | Auth |
|---|---|---|---|
| POST | /auth/register | Register user and profile | No |
| POST | /auth/login | Login user | No |
| POST | /auth/logout | Logout user session | Yes |
| GET | /farms | List user farms | Yes |
| POST | /farms | Create farm | Yes |
| GET | /farms/:id | Get farm and latest analysis summary | Yes |
| PUT | /farms/:id | Update farm | Yes |
| DELETE | /farms/:id | Delete farm | Yes |
| GET | /analyze/:id | Get analysis by id | Yes |
| POST | /analyze | Run AI soil analysis | Yes |
| POST | /sensor/reading | Ingest sensor reading | Yes |
| GET | /sensor/readings/:farmId | Last 30 days sensor data | Yes |
| GET | /recommendations/:farmId | List recommendations for farm | Yes |
| PATCH | /recommendations/:id/applied | Mark recommendation applied | Yes |
| GET | /insights/:farmId | Trends and farm insights | Yes |
| GET | /weather/:farmId | 7-day forecast and advisories | Yes |
| GET | /reports/:farmId | Farm health report payload | Yes |

## Environment Variables
| Name | Required | Used By |
|---|---|---|
| SUPABASE_URL | Yes | Backend |
| SUPABASE_SERVICE_KEY | Yes | Backend |
| ANTHROPIC_API_KEY | Yes | Backend |
| OPENWEATHERMAP_API_KEY | Yes | Backend |
| NEXT_PUBLIC_SUPABASE_URL | Yes | Frontend |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Yes | Frontend |
| NEXT_PUBLIC_API_BASE | Yes | Frontend |

## Local Development Setup
1. Install dependencies:
   - `cd soiliq-backend && npm install`
   - `cd soiliq-frontend && npm install`
2. Configure `.env` files for frontend and backend.
3. Run backend: `cd soiliq-backend && npx netlify dev`
4. Run frontend: `cd soiliq-frontend && npm run dev`

## Deployment Guide
### Frontend (Vercel)
- Workflow: `.github/workflows/deploy-frontend.yml`
- Requires `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

### Backend (Netlify)
- Workflow: `.github/workflows/deploy-backend.yml`
- Requires `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`

## Award Eligibility Alignment
- **World Bank**: Boosts smallholder productivity and resilience
- **FAO**: Supports sustainable soil and nutrient management
- **CGIAR**: Enables digital agronomy for climate-smart agriculture
- **Rockefeller Foundation**: Advances food security through practical innovation
