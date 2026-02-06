# React Dex

A web-based Pokédex focused on the original 151 Pokémon from Kanto. The app supports browsing, search, type filters, infinite scroll, and local “caught” tracking.

## Tech Stack

- Frontend: React + Vite + TypeScript + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL
- Testing: Vitest (unit), Playwright (E2E)
- Monorepo: npm workspaces

## Repository Structure

```
react-dex/
├── apps/
│   ├── web/          # Vite + React frontend
│   └── api/          # Express backend
├── packages/
│   └── shared/       # Shared types
├── scripts/          # DB schema + seed scripts
└── docs/             # Specs and setup docs
```

## Local Development

### 1) Install prerequisites

- Node.js (use nvm)
- PostgreSQL (see `docs/postgres-setup.md`)

### 2) Install dependencies

```bash
nvm use
npm install
```

### 3) Configure environment variables

Create `.env.local` in the repo root (or export in your shell). Example values:

```
PORT=4000
DEX_LIMIT_MAX=200
PGHOST=localhost
PGPORT=3838
PGUSER=react_dex_user
PGPASSWORD=react_dex_password
PGDATABASE=react_dex
PGSSLMODE=
DEX_CSV_PATH=
REGIONS_CSV_PATH=
```

### 4) Seed the database

```bash
npm run seed:db
```

### 5) Run the app

```bash
npm run dev:api
npm run dev:web
```

- API: `http://localhost:4000`
- Web: `http://localhost:5173`

## Useful Scripts

```bash
npm run build        # Build shared + api + web
npm run test:unit    # Vitest
npm run test:e2e     # Playwright
```

## Notes

- Caught state is stored in `localStorage`.
- Filtering/search fetches all Kanto entries and filters client-side.

## Disclaimer

This website is a fan-made, non-profit project. Pokémon is a trademark of Nintendo, The Pokémon Company International, Game Freak, and Creatures. All images, characters, and branding are property of their respective owners. No copyright infringement is intended, and this site is not affiliated with, authorized, or endorsed by the official parties. The content provided is for informational and entertainment purposes only.
