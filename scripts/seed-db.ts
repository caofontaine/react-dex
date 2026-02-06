import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'csv-parse/sync';
import { Pool } from 'pg';

const defaultDexCsvPath = path.resolve(process.cwd(), 'scripts', 'data', 'dex.csv');
const defaultRegionsCsvPath = path.resolve(process.cwd(), 'scripts', 'data', 'regions.csv');
const dexCsvPath = process.env.DEX_CSV_PATH ? path.resolve(process.env.DEX_CSV_PATH) : defaultDexCsvPath;
const regionsCsvPath = process.env.REGIONS_CSV_PATH
  ? path.resolve(process.env.REGIONS_CSV_PATH)
  : defaultRegionsCsvPath;

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : undefined
});

type DexCsvRow = {
  DexNum?: string;
  Name?: string;
  Type1?: string;
  Type2?: string;
  RegionID?: string;
};

type RegionsCsvRow = {
  Name?: string;
};

const loadCsv = <T extends object>(csvPath: string) => {
  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV not found at ${csvPath}. Set DEX_CSV_PATH/REGIONS_CSV_PATH to the file location.`);
  }

  const csv = fs.readFileSync(csvPath, 'utf-8');
  return parse(csv, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  }) as T[];
};

const ensureSchema = async (client: Pool) => {
  const schemaPath = path.resolve(process.cwd(), 'scripts', 'schema.sql');
  const ddl = fs.readFileSync(schemaPath, 'utf-8');
  await client.query(ddl);
};

const seedDatabase = async () => {
  const regionsRows = loadCsv<RegionsCsvRow>(regionsCsvPath);
  const dexRows = loadCsv<DexCsvRow>(dexCsvPath);
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await ensureSchema(client);

    const regionIndexToName = regionsRows
      .map((row) => row.Name?.trim())
      .filter((name): name is string => Boolean(name));

    if (regionIndexToName.length === 0) {
      throw new Error('No regions found in regions.csv');
    }

    for (const regionName of regionIndexToName) {
      await client.query(
        'INSERT INTO regions (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name',
        [regionName]
      );
    }

    const regionRows = await client.query('SELECT id, name FROM regions WHERE name = ANY($1)', [
      regionIndexToName
    ]);

    const regionNameToId = new Map<string, number>();
    for (const row of regionRows.rows) {
      regionNameToId.set(row.name, row.id);
    }

    const regionIndexToId = new Map<number, number>();
    regionIndexToName.forEach((name, index) => {
      const id = regionNameToId.get(name);
      if (id) {
        regionIndexToId.set(index + 1, id);
      }
    });

    for (const row of dexRows) {
      const dexNum = Number(row.DexNum ?? '');
      if (!Number.isFinite(dexNum)) {
        continue;
      }

      const name = row.Name?.trim();
      const type1 = row.Type1?.trim();
      const type2 = row.Type2?.trim() || null;
      const regionIndex = Number(row.RegionID ?? '');

      if (!name || !type1 || !Number.isFinite(regionIndex)) {
        continue;
      }

      const regionId = regionIndexToId.get(regionIndex);
      if (!regionId) {
        throw new Error(`Region index ${regionIndex} not found in regions.csv`);
      }

      await client.query(
        'INSERT INTO dex ("DexNum", "Name", "Type1", "Type2", "RegionID") VALUES ($1, $2, $3, $4, $5) ON CONFLICT ("DexNum") DO UPDATE SET "Name" = EXCLUDED."Name", "Type1" = EXCLUDED."Type1", "Type2" = EXCLUDED."Type2", "RegionID" = EXCLUDED."RegionID"',
        [dexNum, name, type1, type2, regionId]
      );
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

seedDatabase()
  .then(() => {
    console.log('Seed completed successfully.');
    return pool.end();
  })
  .catch((error) => {
    console.error('Seed failed:', error);
    return pool.end().finally(() => {
      process.exitCode = 1;
    });
  });
