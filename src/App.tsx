import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { GameCard } from './components/GameCard';
import { GameTheater } from './components/GameTheater';
import { Header } from './components/Header';
import { JsonRegistryModal } from './components/JsonRegistryModal';
import { GameEntry } from './types/game';

const CUSTOM_GAMES_STORAGE_KEY = 'vp_custom_iframe_games';

export default function App() {
  const [baseGames, setBaseGames] = useState<GameEntry[]>([]);
  const [customGames, setCustomGames] = useState<GameEntry[]>(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_GAMES_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as GameEntry[]) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeGame, setActiveGame] = useState<GameEntry | null>(null);
  const [isRegistryOpen, setIsRegistryOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const theaterAnchorRef = useRef<HTMLDivElement>(null);

  const loadGames = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('./games.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as GameEntry[];
      setBaseGames(Array.isArray(data) ? data : []);
    } catch {
      setError('Could not load games.json catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA' &&
        document.activeElement?.tagName !== 'SELECT'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const allGames = useMemo(() => [...baseGames, ...customGames], [baseGames, customGames]);
  const customIds = useMemo(() => new Set(customGames.map((g) => g.id)), [customGames]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(allGames.map((g) => g.category)));
    return ['All', ...unique];
  }, [allGames]);

  // Instant zero-latency filtering by title or category
  const filteredGames = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allGames.filter((game) => {
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        game.title.toLowerCase().includes(q) ||
        game.category.toLowerCase().includes(q)
      );
    });
  }, [allGames, searchQuery, activeCategory]);

  const handlePlayGame = (game: GameEntry) => {
    setActiveGame(game);
    window.setTimeout(() => {
      theaterAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 40);
  };

  const handlePlayRandom = () => {
    const pool = filteredGames.length > 0 ? filteredGames : allGames;
    if (pool.length === 0) return;
    const candidates = pool.length > 1 && activeGame ? pool.filter((g) => g.id !== activeGame.id) : pool;
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    handlePlayGame(pick);
  };

  const handleSelectCategoryFromNav = (category: string) => {
    setActiveCategory(category);
    const el = document.getElementById('catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleAddCustomGame = (entry: GameEntry) => {
    const updated = [...customGames, entry];
    setCustomGames(updated);
    try {
      localStorage.setItem(CUSTOM_GAMES_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage quota errors
    }
  };

  const handleRemoveCustomGame = (id: string) => {
    const updated = customGames.filter((g) => g.id !== id);
    setCustomGames(updated);
    if (activeGame?.id === id) setActiveGame(null);
    try {
      localStorage.setItem(CUSTOM_GAMES_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage quota errors
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F17] text-slate-100">
      <Header
        onSelectCategory={handleSelectCategoryFromNav}
        onPlayRandom={handlePlayRandom}
        onOpenRegistry={() => setIsRegistryOpen(true)}
      />

      <main className="flex-1">
        <div ref={theaterAnchorRef} className="scroll-mt-16" />

        {activeGame && (
          <GameTheater game={activeGame} onClose={() => setActiveGame(null)} />
        )}

        <section
          id="catalog"
          aria-label="Game catalog and instant search"
          className="mx-auto max-w-6xl px-4 pt-8 pb-16 sm:px-6"
        >
          <div className="flex flex-col gap-6 border-b border-white/8 pb-7">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl text-balance">
                  Instant Browser Arcade
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
                  Play self-contained HTML5 games directly in your browser. Search instantaneously by title or category.
                </p>
              </div>
              <div className="font-mono text-xs text-slate-400 tabular-nums whitespace-nowrap shrink-0">
                Showing {filteredGames.length} of {allGames.length} games
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative flex-1 max-w-xl">
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search games by title or category (press /)..."
                  aria-label="Search games by title or category"
                  className="w-full rounded-xl border border-white/10 bg-[#131924] py-2.5 pl-10 pr-10 text-sm text-slate-100 placeholder:text-slate-500 transition-colors focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-100 cursor-pointer"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>

              <div
                role="tablist"
                aria-label="Filter by category"
                className="flex flex-wrap items-center gap-1 rounded-xl border border-white/8 bg-[#131924] p-1"
              >
                {categories.map((cat) => {
                  const selected = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setActiveCategory(cat)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                        selected
                          ? 'bg-amber-500 text-[#0B0F17]'
                          : 'text-slate-400 hover:text-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-8">
            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-72 rounded-xl border border-white/8 bg-[#131924] p-4"
                  >
                    <div className="h-40 w-full rounded-lg bg-[#1A2232]" />
                    <div className="mt-4 h-4 w-1/2 rounded bg-[#1A2232]" />
                    <div className="mt-2 h-3 w-4/5 rounded bg-[#1A2232]" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="rounded-xl border border-white/10 bg-[#131924] p-8 text-center">
                <p className="text-sm text-rose-400">{error}</p>
                <button
                  type="button"
                  onClick={loadGames}
                  className="mt-4 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-[#0B0F17] hover:bg-amber-400 cursor-pointer"
                >
                  Retry
                </button>
              </div>
            ) : filteredGames.length === 0 ? (
              <div className="rounded-xl border border-white/8 bg-[#131924] px-6 py-12 text-center">
                <h2 className="font-display text-lg font-semibold text-slate-100">
                  No matching games found
                </h2>
                <p className="mt-1.5 text-sm text-slate-400">
                  No games matched &ldquo;{searchQuery || activeCategory}&rdquo;. Try another title or category.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('All');
                  }}
                  className="mt-5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-[#0B0F17] hover:bg-amber-400 cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    isActive={activeGame?.id === game.id}
                    onPlay={handlePlayGame}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/8 bg-[#0B0F17] py-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 text-xs text-slate-500 sm:px-6">
          <span>VaultPlay · Unblocked HTML5 Iframe Arcade</span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsRegistryOpen(true)}
              className="text-slate-400 hover:text-slate-200 hover:underline underline-offset-4 cursor-pointer"
            >
              Inspect games.json
            </button>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{allGames.length} playable titles</span>
          </div>
        </div>
      </footer>

      <JsonRegistryModal
        isOpen={isRegistryOpen}
        games={allGames}
        customIds={customIds}
        onClose={() => setIsRegistryOpen(false)}
        onAddCustomGame={handleAddCustomGame}
        onRemoveCustomGame={handleRemoveCustomGame}
      />
    </div>
  );
}
