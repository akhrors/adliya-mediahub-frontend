# Adliya MediaHub — Frontend

Next.js 14 + TailwindCSS + React Query + Zustand

## Stack
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- TanStack React Query v5
- Zustand (auth state)
- Axios (API client with interceptors + token refresh)
- React Hook Form + Zod
- Lucide React (icons)
- Recharts (charts)
- React Hot Toast (notifications)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set env:
```bash
cp .env.local.example .env.local
# Edit NEXT_PUBLIC_API_URL=http://localhost:8080
```

3. Run:
```bash
npm run dev
```

Open http://localhost:3000

## Pages
| Route | Description |
|-------|-------------|
| `/login` | Login page |
| `/dashboard` | Bosh sahifa — stats, top regions, experts |
| `/media-requests` | OAV So'rovlari CRUD |
| `/events` | Tadbirlar reyestri |
| `/coverage` | Faoliyatni yoritish |
| `/monitoring` | Tanqidiy materiallar |
| `/media-bank` | Fayl saqlash |
| `/calendar` | Kontent kalendar |
| `/ratings` | Reyting qoidalari |
| `/reports` | Hisobot generatsiyasi |
| `/users` | Foydalanuvchilar (admin) |
