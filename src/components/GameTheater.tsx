import { useEffect, useRef, useState } from 'react';
import { Maximize2, Minimize2, RotateCw, X } from 'lucide-react';
import { GameEntry, parseIframeHtml } from '../types/game';

interface GameTheaterProps {
  game: GameEntry;
  onClose: () => void;
}

export function GameTheater({ game, onClose }: GameTheaterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const iframeProps = parseIframeHtml(game.iframe, game.title);

  useEffect(() => {
    setReloadKey(0);
    const timer = window.setTimeout(() => {
      iframeRef.current?.focus();
    }, 120);
    return () => window.clearTimeout(timer);
  }, [game.id]);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const handleToggleFullscreen = async () => {
    const target = containerRef.current;
    if (!target) return;
    try {
      if (!document.fullscreenElement) {
        await target.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
      iframeRef.current?.focus();
    } catch {
      // Fullscreen may be restricted by parent iframe permissions
    }
  };

  const handleReload = () => {
    setReloadKey((k) => k + 1);
    window.setTimeout(() => {
      iframeRef.current?.focus();
    }, 100);
  };

  return (
    <section
      aria-label={`Playing ${game.title}`}
      className="mx-auto max-w-6xl px-4 pt-6 pb-4 sm:px-6"
    >
      <div
        ref={containerRef}
        className="overflow-hidden rounded-xl border border-white/10 bg-[#131924]"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 bg-[#161D2B] px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <h2 className="font-display text-lg font-bold tracking-tight text-slate-100 truncate">
              {game.title}
            </h2>
            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="text-amber-400 font-medium">{game.category}</span>
              <span aria-hidden="true">·</span>
              <span>{game.controls}</span>
              <span aria-hidden="true">·</span>
              <span>{game.players}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleReload}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#0B0F17] px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/5 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Restart</span>
            </button>
            <button
              type="button"
              onClick={handleToggleFullscreen}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#0B0F17] px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/5 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Exit Fullscreen</span>
                </>
              ) : (
                <>
                  <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Fullscreen</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close game theater"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#0B0F17] px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Close</span>
            </button>
          </div>
        </div>

        <div className="relative w-full bg-[#080C14] h-[520px] sm:h-[580px] lg:h-[620px]">
          {iframeProps.src ? (
            <iframe
              key={`${game.id}-${reloadKey}`}
              ref={iframeRef}
              src={iframeProps.src}
              title={iframeProps.title}
              allow={iframeProps.allow}
              allowFullScreen={iframeProps.allowFullScreen}
              className="h-full w-full border-0 block"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-6 text-sm text-slate-400">
              Unable to load iframe source from JSON entry.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
