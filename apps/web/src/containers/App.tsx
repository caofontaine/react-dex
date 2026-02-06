import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { DexEntry } from '@react-dex/shared';
import DexList from '../components/DexList/DexList';
import Search from '../components/Search/Search';

const PAGE_SIZE = 25;
const FULL_FETCH_LIMIT = 1000;
const REGION = 'kanto';
const API_BASE_URL = (import.meta as ImportMeta).env?.VITE_API_BASE_URL ?? '';

const buildApiUrl = (path: string) => {
  if (!API_BASE_URL) return path;
  return `${API_BASE_URL.replace(/\/$/, '')}${path}`;
};
const TYPE_OPTIONS = [
  'Normal',
  'Fire',
  'Water',
  'Grass',
  'Electric',
  'Ice',
  'Fighting',
  'Poison',
  'Ground',
  'Flying',
  'Psychic',
  'Bug',
  'Rock',
  'Ghost',
  'Dragon'
];

const App = () => {
  const [dex, setDex] = useState<DexEntry[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [caughtDex, setCaughtDex] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();
    try {
      const stored = localStorage.getItem('caughtDex');
      if (!stored) return new Set();
      const parsed = JSON.parse(stored) as string[];
      return new Set(parsed);
    } catch (error) {
      return new Set();
    }
  });
  const [filtersOpen, setFiltersOpen] = useState(true);
  const hasActiveFilters = search.trim().length > 0 || selectedTypes.size > 0;

  const isMountedRef = useRef(true);
  const loadingRef = useRef(false);
  const pendingLoadRef = useRef(false);
  const offsetRef = useRef(0);
  const hasMoreRef = useRef(true);
  const hasUserScrolledRef = useRef(false);
  const didInitRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const values = Array.from(caughtDex.values());
    localStorage.setItem('caughtDex', JSON.stringify(values));
  }, [caughtDex]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      abortRef.current?.abort();
      observerRef.current?.disconnect();
    };
  }, []);

  const toggleCaught = useCallback((dexNum: string) => {
    setCaughtDex((prev) => {
      const next = new Set(prev);
      if (next.has(dexNum)) {
        next.delete(dexNum);
      } else {
        next.add(dexNum);
      }

      const values = Array.from(next.values());
      localStorage.setItem('caughtDex', JSON.stringify(values));

      return next;
    });
  }, []);

  const normalizeEntry = useCallback((entry: DexEntry): DexEntry => {
    const dexnum = String(entry.dexnum).padStart(4, '0');
    return {
      ...entry,
      dexnum,
      type2: entry.type2 ?? null
    };
  }, []);

  const fetchAllDex = useCallback(async () => {
    if (loadingRef.current) {
      abortRef.current?.abort();
      loadingRef.current = false;
    }
    loadingRef.current = true;
    setIsLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
        const response = await fetch(
          buildApiUrl(`/api/dex?region=${REGION}&limit=${FULL_FETCH_LIMIT}&offset=0`),
          { signal: controller.signal }
        );

      if (!response.ok) {
        throw new Error(`Dex request failed: ${response.status}`);
      }

      const data = (await response.json()) as DexEntry[];
      if (!Array.isArray(data)) {
        throw new Error('Dex response was not an array.');
      }

      const normalized = data.map(normalizeEntry);
      setDex(normalized);
      offsetRef.current = normalized.length;
      setHasMore(false);
      hasMoreRef.current = false;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }
      setDex([]);
      setHasMore(false);
      hasMoreRef.current = false;
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
      loadingRef.current = false;
    }
  }, [normalizeEntry]);

  const fetchDexPage = useCallback(
    async ({ reset }: { reset: boolean }) => {
      if (loadingRef.current && !reset) return;
      if (!hasMoreRef.current && !reset) return;
      if (reset && loadingRef.current) {
        abortRef.current?.abort();
        loadingRef.current = false;
      }
      loadingRef.current = true;
      setIsLoading(true);

      if (reset) {
        abortRef.current?.abort();
      }

      const controller = new AbortController();
      abortRef.current = controller;

      const nextOffset = reset ? 0 : offsetRef.current;

      try {
        const response = await fetch(
          buildApiUrl(`/api/dex?region=${REGION}&limit=${PAGE_SIZE}&offset=${nextOffset}`),
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`Dex request failed: ${response.status}`);
        }

        const data = (await response.json()) as DexEntry[];
        if (!Array.isArray(data)) {
          throw new Error('Dex response was not an array.');
        }

        const normalized = data.map(normalizeEntry);

        setDex((prev) => {
          const map = new Map(prev.map((entry) => [entry.dexnum, entry]));
          normalized.forEach((entry) => map.set(entry.dexnum, entry));
          return reset ? normalized : Array.from(map.values());
        });

        const nextHasMore = normalized.length === PAGE_SIZE;
        hasMoreRef.current = nextHasMore;
        setHasMore(nextHasMore);
        offsetRef.current = reset ? normalized.length : offsetRef.current + normalized.length;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
        if (reset) {
          setDex([]);
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
        loadingRef.current = false;
        if (pendingLoadRef.current && hasMoreRef.current) {
          pendingLoadRef.current = false;
          fetchDexPage({ reset: false });
        }
      }
    },
    [normalizeEntry]
  );

  useEffect(() => {
    if (!didInitRef.current) {
      didInitRef.current = true;
      fetchDexPage({ reset: true });
      return;
    }

    setDex([]);
    offsetRef.current = 0;
    setHasMore(true);
    hasMoreRef.current = true;
    pendingLoadRef.current = false;
    if (hasActiveFilters) {
      fetchAllDex();
    } else {
      fetchDexPage({ reset: true });
    }
  }, [search, selectedTypes, fetchDexPage, fetchAllDex, hasActiveFilters]);

  useEffect(() => {
    if (!sentinelRef.current) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const isIntersecting = Boolean(entry?.isIntersecting);
        if (isIntersecting) {
          if (!hasUserScrolledRef.current) {
            return;
          }
          if (loadingRef.current) {
            pendingLoadRef.current = true;
          } else {
            fetchDexPage({ reset: false });
          }
        }
      },
      { rootMargin: '200px' }
    );

    observerRef.current.observe(sentinelRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [fetchDexPage]);

  useEffect(() => {
    const handleScroll = () => {
      hasUserScrolledRef.current = true;
      const sentinel = sentinelRef.current;
      if (!sentinel || loadingRef.current || !hasMoreRef.current) return;
      const rect = sentinel.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top <= viewportHeight + 200) {
        fetchDexPage({ reset: false });
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchDexPage]);

  const filteredDex = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return dex.filter((entry) => {
      const matchesSearch = normalizedSearch
        ? entry.name.toLowerCase().includes(normalizedSearch) || entry.dexnum.includes(normalizedSearch)
        : true;

      if (!matchesSearch) return false;

      if (selectedTypes.size === 0) return true;

      const types = [entry.type1, entry.type2].filter(Boolean) as string[];
      return types.some((type) => selectedTypes.has(type));
    });
  }, [dex, search, selectedTypes]);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">Kanto Region</p>
            <h1 className="text-5xl font-bold text-pokedex-yellow drop-shadow-sm sm:text-6xl">
              <span className="font-display tracking-wide text-pokedex-yellow">React Dex</span>
            </h1>
            <p className="max-w-2xl text-sm text-white/90">
              Browse the original 151 Pokémon, track your catches locally, and filter by type as you explore.
            </p>
          </div>
          <Search value={search} onChange={setSearch} />
        </div>
      </header>

      <main className="flex-1 px-6 pb-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row">
          <aside className="lg:w-64">
            <button
              type="button"
              onClick={() => setFiltersOpen((open) => !open)}
              className="mb-4 flex w-full items-center justify-between rounded-xl border border-white/40 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur"
              aria-expanded={filtersOpen}
            >
              <span>Type Filters</span>
              <span className="text-xs text-white/70">{filtersOpen ? 'Hide' : 'Show'}</span>
            </button>
            {filtersOpen && (
              <div className="rounded-2xl border border-white/30 bg-white/10 p-4 backdrop-blur">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                  Select Types
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {TYPE_OPTIONS.map((type) => (
                    <label key={type} className="flex items-center gap-2 text-sm text-white">
                      <input
                        type="checkbox"
                        checked={selectedTypes.has(type)}
                        onChange={() => toggleType(type)}
                        className="h-4 w-4 accent-pokedex-gold"
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
                {selectedTypes.size > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedTypes(new Set())}
                    className="mt-4 w-full rounded-full border border-white/40 bg-white/20 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-white/30"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </aside>

          <section className="flex-1">
            <div className="flex items-center justify-between pb-3 text-sm text-white/80">
              <span>{filteredDex.length} Pokémon shown</span>
              <span>{caughtDex.size} caught</span>
            </div>

            <DexList dex={filteredDex} caughtDex={caughtDex} onToggleCaught={toggleCaught} />

            <div className="mt-6 flex flex-col items-center gap-2 text-sm text-white">
              {isLoading && (
                <div role="status" aria-live="polite" className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-pokedex-yellow" />
                  <span>{hasActiveFilters ? 'Loading filtered Pokémon…' : 'Loading more Pokémon…'}</span>
                </div>
              )}
              {!hasMore && !isLoading && filteredDex.length > 0 && (
                <span className="text-white/70">You’ve reached the end of the Pokédex.</span>
              )}
              <div ref={sentinelRef} className="h-4 w-full" />
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/20 bg-white/10 px-6 py-4 text-center text-xs text-white/80">
        © 2026. This website is a fan-made, non-profit project. Pokémon is a trademark of Nintendo, The Pokémon
        Company International, Game Freak, and Creatures. All images, characters, and branding are property of their
        respective owners. No copyright infringement is intended, and this site is not affiliated with, authorized,
        or endorsed by the official parties. The content provided is for informational and entertainment purposes
        only.
      </footer>
    </div>
  );
};

export default App;
