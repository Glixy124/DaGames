export interface GameEntry {
  id: string;
  title: string;
  category: string;
  description: string;
  controls: string;
  players: string;
  iframe: string;
  thumbnail?: string;
}

export interface ParsedIframeProps {
  src: string;
  title: string;
  allow: string;
  allowFullScreen: boolean;
}

export function parseIframeHtml(iframeHtml: string, fallbackTitle: string): ParsedIframeProps {
  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    const doc = new DOMParser().parseFromString(iframeHtml, 'text/html');
    const el = doc.querySelector('iframe');
    if (el) {
      return {
        src: el.getAttribute('src') || '',
        title: el.getAttribute('title') || fallbackTitle,
        allow: el.getAttribute('allow') || 'fullscreen',
        allowFullScreen: el.hasAttribute('allowfullscreen') || true,
      };
    }
  }

  const srcMatch = iframeHtml.match(/src=["']([^"']+)["']/i);
  const titleMatch = iframeHtml.match(/title=["']([^"']+)["']/i);
  return {
    src: srcMatch ? srcMatch[1] : '',
    title: titleMatch ? titleMatch[1] : fallbackTitle,
    allow: 'fullscreen',
    allowFullScreen: true,
  };
}
