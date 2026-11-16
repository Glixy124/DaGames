interface HeaderProps {
  onSelectCategory: (category: string) => void;
  onPlayRandom: () => void;
  onOpenRegistry: () => void;
}

export function Header({ onSelectCategory, onPlayRandom, onOpenRegistry }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-[#0B0F17]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6">
        <a
          href="#catalog"
          onClick={(e) => {
            e.preventDefault();
            onSelectCategory('All');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-display text-xl font-bold tracking-tight text-slate-100 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-md"
        >
          VaultPlay
        </a>

        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400"
        >
          <button
            type="button"
            onClick={() => onSelectCategory('All')}
            className="hover:text-slate-100 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
          >
            All Games
          </button>
          <button
            type="button"
            onClick={() => onSelectCategory('Action')}
            className="hover:text-slate-100 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
          >
            Action
          </button>
          <button
            type="button"
            onClick={() => onSelectCategory('Puzzle')}
            className="hover:text-slate-100 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
          >
            Puzzle
          </button>
          <button
            type="button"
            onClick={() => onSelectCategory('Strategy')}
            className="hover:text-slate-100 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
          >
            Strategy
          </button>
          <button
            type="button"
            onClick={onOpenRegistry}
            className="hover:text-slate-100 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
          >
            JSON Registry
          </button>
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onPlayRandom}
            className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-[#0B0F17] hover:bg-amber-400 active:scale-[0.98] transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0F17]"
          >
            Random Game
          </button>
        </div>
      </div>
    </header>
  );
}
