import { useState } from 'react';
import { Gamepad2, Play } from 'lucide-react';
import { GAME_COVERS } from '../assets/covers';
import { GameEntry } from '../types/game';

interface GameCardProps {
  game: GameEntry;
  isActive: boolean;
  onPlay: (game: GameEntry) => void;
}

export function GameCard({ game, isActive, onPlay }: GameCardProps) {
  const [imgError, setImgError] = useState(false);
  const coverSrc = GAME_COVERS[game.id] || game.thumbnail || '';

  return (
    <button
      type="button"
      onClick={() => onPlay(game)}
      className={`group flex flex-col overflow-hidden rounded-xl border text-left transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
        isActive
          ? 'border-amber-500/70 bg-[#182030]'
          : 'border-white/8 bg-[#131924] hover:border-white/20 hover:bg-[#161E2C]'
      }`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0D131D]">
        {coverSrc && !imgError ? (
          <img
            src={coverSrc}
            alt={`${game.title} game cover`}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#161E2C] to-[#0B0F17] p-6 text-slate-400">
            <Gamepad2 className="h-8 w-8 text-amber-500/80" aria-hidden="true" />
            <span className="font-display text-sm font-semibold text-slate-200">{game.title}</span>
          </div>
        )}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#131924]/70 via-transparent to-transparent"
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-lg font-bold tracking-tight text-slate-100 group-hover:text-amber-400 transition-colors">
              {game.title}
            </h3>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 opacity-90 group-hover:opacity-100 whitespace-nowrap shrink-0">
              <Play className="h-3 w-3 fill-current" aria-hidden="true" />
              <span>{isActive ? 'Playing' : 'Play'}</span>
            </span>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-400 line-clamp-2">
            {game.description}
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-white/6 pt-3 text-xs text-slate-400">
          <span className="font-medium text-slate-300">{game.category}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate">{game.controls}</span>
        </div>
      </div>
    </button>
  );
}
