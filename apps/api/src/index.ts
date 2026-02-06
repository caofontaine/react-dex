import express from 'express';
import type { DexEntry, Region } from '@react-dex/shared';
import { checkDatabaseConnection, pool } from './db.js';
import { cache, DEFAULT_CACHE_TTL_MS } from './cache.js';

const app = express();

app.use(express.json());

type HealthResponse = {
  status: 'ok' | 'error';
  message?: string;
  regions?: Region[];
};

const clampNumber = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

app.get('/api/health', async (_req, res) => {
  try {
    await checkDatabaseConnection();
    const response: HealthResponse = { status: 'ok' };
    res.status(200).json(response);
  } catch (error) {
    const response: HealthResponse = { status: 'error', message: 'Database connection failed.' };
    res.status(500).json(response);
  }
});

app.get('/api/regions', async (_req, res) => {
  const cacheKey = 'regions';
  const cached = cache.get<Region[]>(cacheKey);
  if (cached) {
    res.status(200).json(cached);
    return;
  }

  try {
    const result = await pool.query<Region>('SELECT id, name FROM regions ORDER BY id ASC');
    cache.set(cacheKey, result.rows, DEFAULT_CACHE_TTL_MS);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch regions.' });
  }
});

app.get('/api/dex', async (req, res) => {
  const limitParam = Number(req.query.limit ?? 25);
  const offsetParam = Number(req.query.offset ?? 0);
  const region = typeof req.query.region === 'string' ? req.query.region : undefined;

  const maxLimit = process.env.DEX_LIMIT_MAX ? Number(process.env.DEX_LIMIT_MAX) : 200;
  const effectiveMaxLimit = Number.isFinite(maxLimit) ? maxLimit : 200;
  const limit = clampNumber(Number.isFinite(limitParam) ? limitParam : 25, 1, effectiveMaxLimit);
  const offset = Math.max(Number.isFinite(offsetParam) ? offsetParam : 0, 0);

  const cacheKey = `dex:${region ?? 'all'}:${limit}:${offset}`;
  const cached = cache.get<DexEntry[]>(cacheKey);
  if (cached) {
    res.status(200).json(cached);
    return;
  }

  try {
    const values: Array<string | number> = [limit, offset];
    let sql = `
      SELECT d."DexNum" AS dexnum,
             d."Name" AS name,
             d."Type1" AS type1,
             d."Type2" AS type2,
             r.name AS region
      FROM dex d
      JOIN regions r ON r.id = d."RegionID"
    `;

    if (region) {
      sql += ' WHERE LOWER(r.name) = LOWER($3)';
      values.push(region);
    }

    sql += ' ORDER BY d."DexNum" ASC LIMIT $1 OFFSET $2';

    const result = await pool.query<DexEntry>(sql, values);
    cache.set(cacheKey, result.rows, DEFAULT_CACHE_TTL_MS);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dex entries.' });
  }
});

app.get('/api/dex/:dexNum', async (req, res) => {
  const dexNum = Number(req.params.dexNum);
  if (!Number.isFinite(dexNum)) {
    res.status(400).json({ message: 'Invalid dex number.' });
    return;
  }

  const cacheKey = `dex:${dexNum}`;
  const cached = cache.get<DexEntry | null>(cacheKey);
  if (cached) {
    res.status(200).json(cached);
    return;
  }

  try {
    const result = await pool.query<DexEntry>(
      `
        SELECT d."DexNum" AS dexnum,
               d."Name" AS name,
               d."Type1" AS type1,
               d."Type2" AS type2,
               r.name AS region
        FROM dex d
        JOIN regions r ON r.id = d."RegionID"
        WHERE d."DexNum" = $1
      `,
      [dexNum]
    );

    const entry = result.rows[0];
    if (!entry) {
      res.status(404).json({ message: 'Dex entry not found.' });
      return;
    }

    cache.set(cacheKey, entry, DEFAULT_CACHE_TTL_MS);
    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dex entry.' });
  }
});

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
