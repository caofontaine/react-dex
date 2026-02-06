# React Dex API

A lightweight REST API for the React Dex frontend. The API is read‑heavy and optimized for fast list retrieval with pagination.

## Architecture

- Express + TypeScript
- PostgreSQL as the source of truth
- Simple in-memory caching (`apps/api/src/cache.ts`)
- Stateless JSON endpoints

## Endpoints

### `GET /api/health`

Checks DB connectivity.

Response:
```json
{ "status": "ok" }
```

### `GET /api/regions`

Returns the list of regions.

### `GET /api/dex?region=kanto&limit=25&offset=0`

Returns paginated dex entries for a region.

Response shape:
```json
[
  {
    "dexnum": "0001",
    "name": "Bulbasaur",
    "type1": "Grass",
    "type2": "Poison",
    "region": "Kanto"
  }
]
```

### `GET /api/dex/:dexNum`

Fetches a single Pokémon by dex number.

## Features

- Pagination with `limit` + `offset`
- Region filtering via `region` query param
- Deterministic ordering by dex number
- Read-through cache for list endpoints

## Caching Strategy

The API uses a simple in-memory cache (`apps/api/src/cache.ts`) with a short TTL to avoid repeat database reads for read-heavy endpoints.

Invalidation rules:
- Cache entries expire automatically after 5 minutes (TTL).
- Any data mutation (for example, reseeding or future admin tools) should call `cache.invalidate()` to purge stale data.
- For future pagination endpoints, use cache keys that include the region, limit, and offset so entries remain deterministic.

This keeps behavior transparent to clients while reducing redundant queries.

## Environment Variables

Create an `.env` file (or export variables in your shell) using these keys:

- `PORT` (default: `4000`)
- `PGHOST`
- `PGPORT`
- `PGUSER`
- `PGPASSWORD`
- `PGDATABASE`
- `DEX_LIMIT_MAX` (default: `200`) — max `limit` allowed for `/api/dex`
