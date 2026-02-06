# Local PostgreSQL Setup (Postgres.app)

These steps assume macOS with Postgres.app installed.

## 1) Start Postgres.app

1. Open Postgres.app.
2. Click **Initialize** if it’s a fresh install.
3. Ensure it shows **Running** and note the **Server Settings**.

By default, Postgres.app runs on:
- Host: `localhost`
- Port: `5432`
- Username: your macOS user

## 2) Create a Database and User (Optional but Recommended)

Open a terminal and run:

```bash
createdb react_dex
```

If you prefer a dedicated user (recommended for clarity):

```bash
createuser react_dex_user
psql -d postgres -c "ALTER USER react_dex_user WITH PASSWORD 'react_dex_pass';"
psql -d postgres -c "ALTER USER react_dex_user WITH CREATEDB;"
psql -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE react_dex TO react_dex_user;"
```

## 3) Configure Environment Variables

Set these in your shell before running the API or seed script:

```bash
export PGHOST=localhost
export PGPORT=3838
export PGUSER=react_dex_user
export PGPASSWORD=react_dex_pass
export PGDATABASE=react_dex
```

If you use your macOS user instead of a dedicated user, set `PGUSER` accordingly and omit `PGPASSWORD` if not required.

## 4) Seed the Database

From the repo root:

```bash
nvm use
npm install
npm run seed:db
```

By default the seed script reads:
- `scripts/data/regions.csv`
- `scripts/data/dex.csv`

If you want to supply different files:

```bash
export REGIONS_CSV_PATH=/absolute/path/to/regions.csv
export DEX_CSV_PATH=/absolute/path/to/dex.csv
npm run seed:db
```

## 5) Verify the Data

```bash
psql -d react_dex -c "SELECT COUNT(*) FROM regions;"
psql -d react_dex -c "SELECT COUNT(*) FROM dex;"
```

You should see non-zero counts after seeding.

## 6) Run the API

```bash
npm run dev:api
```

Test the health endpoint:

```bash
curl http://localhost:4000/api/health
```

If it returns `{ "status": "ok" }`, your DB connection is good.
