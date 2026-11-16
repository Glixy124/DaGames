import { useState } from 'react';
import { Check, Copy, Plus, Trash2, X } from 'lucide-react';
import { GameEntry } from '../types/game';

interface JsonRegistryModalProps {
  isOpen: boolean;
  games: GameEntry[];
  customIds: Set<string>;
  onClose: () => void;
  onAddCustomGame: (entry: GameEntry) => void;
  onRemoveCustomGame: (id: string) => void;
}

export function JsonRegistryModal({
  isOpen,
  games,
  customIds,
  onClose,
  onAddCustomGame,
  onRemoveCustomGame,
}: JsonRegistryModalProps) {
  const [copied, setCopied] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Arcade');
  const [iframeInput, setIframeInput] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const jsonPreview = JSON.stringify(games, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonPreview);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedIframe = iframeInput.trim();
    if (!trimmedTitle || !trimmedIframe) {
      setFormError('Title and iframe HTML or URL are required.');
      return;
    }

    let finalIframe = trimmedIframe;
    if (!trimmedIframe.toLowerCase().includes('<iframe')) {
      try {
        const parsed = new URL(trimmedIframe, window.location.origin);
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          setFormError('Only http, https, or relative paths are supported.');
          return;
        }
        finalIframe = `<iframe src="${trimmedIframe.replace(/"/g, '&quot;')}" title="${trimmedTitle.replace(/"/g, '&quot;')}" loading="lazy" allow="fullscreen" allowfullscreen></iframe>`;
      } catch {
        setFormError('Provide a valid <iframe ...> snippet or game URL.');
        return;
      }
    }

    const id = `${trimmedTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`;
    onAddCustomGame({
      id,
      title: trimmedTitle,
      category: category.trim() || 'Arcade',
      description: description.trim() || 'Custom iframe game added to your local JSON catalog.',
      controls: 'Keyboard / Mouse',
      players: '1 Player',
      iframe: finalIframe,
    });

    setTitle('');
    setIframeInput('');
    setDescription('');
    setFormError('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="registry-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
    >
      <div className="flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-white/12 bg-[#131924]">
        <div className="flex items-center justify-between gap-4 border-b border-white/8 px-5 py-4">
          <div>
            <h2 id="registry-modal-title" className="font-display text-lg font-bold text-slate-100">
              Iframe JSON Registry
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Games are stored as iframe entries in <code className="font-mono text-slate-300">/public/games.json</code>.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close JSON registry"
            className="rounded-lg border border-white/10 bg-[#0B0F17] p-2 text-slate-300 hover:text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          <form onSubmit={handleSubmit} className="space-y-3 border-b border-white/8 pb-5">
            <h3 className="text-sm font-semibold text-slate-200">Add Custom Iframe Entry</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Game title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-lg border border-white/10 bg-[#0B0F17] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Game category"
                className="rounded-lg border border-white/10 bg-[#0B0F17] px-3 py-2 text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
              >
                <option value="Action">Action</option>
                <option value="Arcade">Arcade</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Retro">Retro</option>
                <option value="Strategy">Strategy</option>
                <option value="Sports">Sports</option>
              </select>
            </div>
            <input
              type="text"
              placeholder='Iframe HTML (<iframe src="/games/..."></iframe>) or URL'
              value={iframeInput}
              onChange={(e) => setIframeInput(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#0B0F17] px-3 py-2 font-mono text-xs text-slate-100 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="text"
                placeholder="Short description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex-1 rounded-lg border border-white/10 bg-[#0B0F17] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-[#0B0F17] hover:bg-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Add Game</span>
              </button>
            </div>
            {formError && <p className="text-xs text-rose-400">{formError}</p>}
          </form>

          {customIds.size > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-200">Custom Session Games</h3>
              <div className="space-y-2">
                {games
                  .filter((g) => customIds.has(g.id))
                  .map((g) => (
                    <div
                      key={g.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-white/8 bg-[#0B0F17] px-3 py-2 text-xs"
                    >
                      <div className="min-w-0 truncate text-slate-200">
                        <span className="font-semibold">{g.title}</span>
                        <span className="mx-2 text-slate-500">·</span>
                        <span className="text-slate-400">{g.category}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveCustomGame(g.id)}
                        className="inline-flex items-center gap-1 text-rose-400 hover:text-rose-300 cursor-pointer shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Remove</span>
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200">Live JSON Payload</h3>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#0B0F17] px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/5 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
            </div>
            <pre className="max-h-72 overflow-auto rounded-lg border border-white/8 bg-[#0B0F17] p-4 font-mono text-xs leading-relaxed text-slate-300">
              {jsonPreview}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
