# IVSDSA Analytics Dashboard - React Frontend

A production-ready, feature-rich analytics dashboard for the International Vehicle & Digital Systems Data Analytics platform. Built with React 19, TypeScript, Tailwind CSS, and modern state management.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Configuration](#environment-configuration)
- [Features](#features)
- [Development](#development)
- [Build & Deployment](#build--deployment)
- [API Integration](#api-integration)
- [State Management](#state-management)
- [Data Fetching](#data-fetching)

## 🏗️ Architecture Overview

This application follows a **modern, scalable React architecture** with clear separation of concerns:

```
Frontend (React)
    ↓
Routes & Pages (React Router)
    ↓
Layout Components (Sidebar, Header, MainLayout)
    ↓
Feature Pages (Dashboard, Data Ingestion, User Management)
    ↓
React Query Hooks (Data Fetching & Caching)
    ↓
Zustand Store (Global Filter State)
    ↓
API Client (Axios + Type-safe Endpoints)
    ↓
Backend API (Environment-configurable)
```

### Key Architectural Principles

1. **Reactive Data Flow**: Zustand filters automatically trigger React Query refetches
2. **Type Safety**: Full TypeScript coverage with strict mode enabled
3. **Performance Optimization**: Stale-while-revalidate patterns with configurable cache times
4. **Responsive Design**: 12-column fluid grid layout (TailwindCSS)
5. **Minimal Dependencies**: shadcn/ui, Zustand, React Query only - no bloated frameworks

## 🛠️ Tech Stack

### Core

- **React 19.2** - UI library with latest hooks
- **TypeScript 6.0** - Type safety and DX
- **Vite 8** - Lightning-fast bundler with HMR
- **React Router DOM** - Client-side navigation

### State & Data

- **Zustand** - Lightweight global state (filters)
- **@tanstack/react-query** - Server state management
- **Axios** - Type-safe HTTP client

### Styling

- **Tailwind CSS 4.3** - Utility-first CSS
- **shadcn/ui** - Accessible component library
- **Material Symbols** - Icon library

### Development

- **ESLint** - Code quality
- **Tailwind CSS Vite** - Hot reload support

## 📁 Project Structure

```
src/
├── api/
│   ├── client.ts           # Axios instance & API endpoints
│   ├── queryClient.ts      # React Query configuration
│   └── README.md           # API documentation
│
├── store/
│   └── useFilterStore.ts   # Zustand filter store (Region, Income, Residence)
│
├── hooks/
│   └── useQueries.ts       # React Query hooks for all data fetching
│
├── types/
│   └── index.ts            # Global TypeScript interfaces
│
├── layouts/
│   ├── Sidebar.tsx         # Navigation & global filters
│   ├── Header.tsx          # Top app bar with search
│   ├── MainLayout.tsx      # Wrapper combining Sidebar + Header
│   └── index.ts            # Barrel exports
│
├── pages/
│   ├── DashboardPage.tsx       # KPI cards, charts, heatmap, survey table
│   ├── DataIngestionPage.tsx   # File upload & processing history
│   ├── UserManagementPage.tsx  # User CRUD with modal form
│   └── index.ts                # Barrel exports
│
├── components/
│   └── ui/
│       └── button.tsx      # shadcn/ui button (pre-installed)
│
├── lib/
│   └── utils.ts            # TailwindCSS utilities (cn helper)
│
├── App.tsx                 # React Router setup
├── main.tsx                # React 19 root
├── index.css               # Global styles + fonts + animations
└── vite-env.d.ts           # Vite env types
```

## 🚀 Setup & Installation

### 1. **Clone & Install Dependencies**

```bash
cd client
npm install
```

This installs:

- React 19, React Router, TypeScript
- Zustand, @tanstack/react-query, Axios
- Tailwind CSS, shadcn/ui, Material Symbols

### 2. **Configure Environment**

```bash
# Copy the example and fill in your API endpoint
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 3. **Start Development Server**

```bash
npm run dev
```

Opens at `http://localhost:5173` with HMR enabled.

## 🔧 Environment Configuration

### Available Variables

| Variable            | Description          | Example                     |
| ------------------- | -------------------- | --------------------------- |
| `VITE_API_BASE_URL` | Backend API endpoint | `http://localhost:3000/api` |

**Why Vite prefix?** Vite automatically exposes variables prefixed with `VITE_` to `import.meta.env` for security (prevents leaking secrets).

### Local vs Production

```bash
# Development (.env.local)
VITE_API_BASE_URL=http://localhost:3000/api

# Production (.env.production)
VITE_API_BASE_URL=https://api.example.com/api
```

## ✨ Features

### 1. **Analytics Dashboard** (`/dashboard`)

- **KPI Cards** (4 metrics with trend indicators)
- **Regional Distribution Map** (placeholder with density legend)
- **Service Usage Trends Chart** (12-month line chart simulation)
- **Activity Heatmap** (72-cell grid showing activity intensity)
- **Recent Survey Responses Table** (sortable, paginated)

All data is **reactive to filter changes** in the sidebar.

### 2. **Data Ingestion** (`/data-ingestion`)

- **Drag-and-drop file upload** with drag state feedback
- **File type selector** (Survey, Household, Connectivity, Regional)
- **Optional file description** field
- **Processing history table** with status badges
- **Auto-cache invalidation** - uploading a file refreshes dashboard metrics

### 3. **User Management** (`/user-management`)

- **User listing table** with role, department, status, last login
- **Add new user modal** with validation
- **Edit user inline** via modal
- **Delete user** with confirmation
- **Role-based filtering** support

### 4. **Responsive Design**

- **Desktop** (1440px+): 4-column KPI layout, 2-column chart grid
- **Tablet** (768px+): 2-column KPI layout, stacked charts
- **Mobile** (640px): 1-column stacked layout
- **Sidebar collapses** on mobile (future enhancement: hamburger menu)

## 💻 Development

### Development Workflow

```bash
# Watch mode with hot reload
npm run dev

# Type check
npx tsc -b

# Lint code
npm run lint

# Format code (recommended: use Prettier)
npx prettier --write "src/**/*.{ts,tsx}"
```

### Adding New Pages

1. Create file in `src/pages/NewPage.tsx`
2. Wrap with `<MainLayout pageTitle="...">`
3. Add route in `src/App.tsx`
4. Link from Sidebar navigation

Example:

```tsx
// src/pages/ReportsPage.tsx
import { MainLayout } from '@/layouts/MainLayout'

export const ReportsPage: React.FC = () => {
  return (
    <MainLayout pageTitle='Reports'>
      <div>Your content here</div>
    </MainLayout>
  )
}

// In App.tsx
;<Route path='/reports' element={<ReportsPage />} />
```

### Adding New API Endpoints

1. Add function to `src/api/client.ts`
2. Create React Query hook in `src/hooks/useQueries.ts`
3. Use in components

Example:

```typescript
// api/client.ts
export const analyticsAPI = {
  getReport: async (id: string) => {
    const { data } = await apiClient.get(`/reports/${id}`)
    return data
  },
}

// hooks/useQueries.ts
export const useReport = (id: string) => {
  return useQuery({
    queryKey: ['reports', id],
    queryFn: () => analyticsAPI.getReport(id),
    staleTime: 10 * 60 * 1000,
  })
}

// In component
const { data: report } = useReport('report-1')
```

## 🔨 Build & Deployment

### Build for Production

```bash
npm run build
```

Outputs optimized bundle to `dist/` ready for deployment.

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Set environment variable in Vercel dashboard:

```
VITE_API_BASE_URL=https://api.example.com/api
```

### Deploy to Other Platforms

```bash
# Build
npm run build

# Upload dist/ folder to your host
# (Netlify, GitHub Pages, AWS S3, etc.)
```

## 🔌 API Integration

### Axios Configuration

The API client (`src/api/client.ts`) includes:

1. **Base URL** from environment variable
2. **Request interceptor** for auth tokens
3. **Response interceptor** for error handling (401 → redirect to login)
4. **30s timeout** on all requests

### API Endpoints

All endpoints assume base URL of `VITE_API_BASE_URL`.

#### Dashboard

```
GET /api/dashboard/metrics          → DashboardMetrics
GET /api/dashboard/regional         → RegionalData[]
GET /api/dashboard/trends           → ServiceUsageTrend[]
GET /api/dashboard/activity         → number[][]
GET /api/dashboard/surveys?limit=10 → SurveyResponse[]
```

#### Data Ingestion

```
POST /api/ingestion/upload              → FileUploadResponse
GET  /api/ingestion/status/:fileId      → FileUploadResponse
GET  /api/ingestion/history?limit=20    → FileUploadResponse[]
```

#### User Management

```
GET    /api/users                  → UserData[]
GET    /api/users/:userId          → UserData
POST   /api/users                  → UserData
PUT    /api/users/:userId          → UserData
DELETE /api/users/:userId          → void
```

### Query Parameters

Endpoints support filter query params:

```
?region=Metropolitan Area&incomeLevel=All Tiers&residenceType=Apartment/Condo
```

These are automatically added by React Query hooks when filters change.

## 📊 State Management

### Zustand Filter Store

Located at `src/store/useFilterStore.ts`.

**State:**

```typescript
{
  region: string // 'Metropolitan Area' | 'Rural North' | 'Coastal East'
  incomeLevel: string // 'All Tiers' | 'Low Income' | 'Middle Income' | 'High Income'
  residenceType: string // 'Apartment/Condo' | 'Single Family' | 'Social Housing'
}
```

**Actions:**

```typescript
setRegion(region) // Update region filter
setIncome(incomeLevel) // Update income level filter
setResidence(residenceType) // Update residence type filter
updateFilters(partial) // Batch update filters
resetFilters() // Reset to defaults
```

**Usage in Components:**

```tsx
import { useFilterStore } from '@/store/useFilterStore'

const MyComponent = () => {
  const { region, setRegion } = useFilterStore()
  // ...
}
```

### Auto-Refetch on Filter Change

When you update a filter via Zustand, React Query hooks automatically refetch because they depend on filter values in their queryKey:

```typescript
export const useDashboardMetrics = () => {
  const { region, incomeLevel, residenceType } = useFilterStore()

  return useQuery<DashboardMetrics>({
    // Filter values in key = automatic refetch on change
    queryKey: [...queryKeys.metrics(), { region, incomeLevel, residenceType }],
    queryFn: () =>
      dashboardAPI.getMetrics({
        region,
        incomeLevel,
        residenceType,
      }),
  })
}
```

## 🔄 Data Fetching

### React Query Configuration

```typescript
// src/api/queryClient.ts
{
  staleTime: 5 * 60 * 1000,    // 5 minutes
  gcTime: 10 * 60 * 1000,      // 10 minutes (formerly cacheTime)
  refetchOnWindowFocus: false,  // Don't refetch on tab switch
  retry: 1,                      // Retry failed requests once
}
```

### Overriding Cache Times

For different data freshness needs:

```typescript
// Always keep fresh (1 second)
staleTime: 1000

// Cache forever (1 hour)
staleTime: 60 * 60 * 1000

// Aggressive refetch (5 seconds)
staleTime: 5 * 1000
```

### Cache Invalidation

**Automatic** on file upload:

```typescript
export const useFileUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => dataIngestionAPI.uploadFile(...),
    onSuccess: (data) => {
      // Automatically invalidate & refetch dashboard
      queryClient.invalidateQueries({ queryKey: queryKeys.metrics() });
    },
  });
};
```

**Manual** cache invalidation:

```typescript
const queryClient = useQueryClient()

// Invalidate single query
queryClient.invalidateQueries({ queryKey: queryKeys.metrics() })

// Invalidate all dashboard queries
queryClient.invalidateQueries({ queryKey: queryKeys.all })
```

## 📱 Responsive Grid System

Built with **TailwindCSS 12-column grid**:

```tsx
// 1 col on mobile, 2 on tablet, 4 on desktop
<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
  {/* Items */}
</div>
```

Breakpoints:

- `sm` (640px) - Mobile
- `md` (768px) - Tablet
- `lg` (1024px) - Desktop
- `xl` (1280px) - Large desktop

## 🎨 Design Tokens

Extracted from design system:

**Colors:**

- Primary: `#004ac6` (Blue)
- Secondary: `#565e74` (Slate)
- Tertiary: `#006242` (Green)
- Surface: `#f7f9fb` (Lightest)
- On-surface: `#191c1e` (Darkest)

**Typography:**

- Display: 48px, weight 700
- Headline: 32px, weight 600
- Body: 16px, weight 400
- Label: 14px, weight 500 (mono)

**Spacing:**

- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

All available as TailwindCSS utilities.

## 🐛 Troubleshooting

### Issue: API calls returning 404

**Solution:** Verify `VITE_API_BASE_URL` is set correctly in `.env.local`

### Issue: React Query cache not updating

**Solution:** Check that filter values are in the `queryKey` array so refetch triggers on change

### Issue: Sidebar filters not reactive

**Solution:** Ensure components are using hooks like `useDashboardMetrics()` that depend on Zustand store

### Issue: Build fails with TypeScript errors

**Solution:** Run `npm run lint` and fix errors, or check `tsconfig.json` settings

## 📚 Additional Resources

- [React Docs](https://react.dev)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Query Documentation](https://tanstack.com/query)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [shadcn/ui Component Guide](https://ui.shadcn.com)

## 📄 License

ISC

---

**Built with ❤️ for the IVSDSA project**
