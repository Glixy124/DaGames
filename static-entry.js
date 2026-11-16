(function () {
  if (window.__VAULTPLAY_MOUNTED__) return;
  var root = document.getElementById('root');
  if (!root) return;

  var COVERS = {
    'orbital-defender': './src/assets/images/cover_orbital_defender_1794797608125.jpg',
    'tile-merge': './src/assets/images/cover_tile_merge_1794797608940.jpg',
    'serpent-grid': './src/assets/images/cover_serpent_grid_1794797608573.jpg',
    'prism-breaker': './src/assets/images/cover_prism_breaker_1794797609511.jpg',
    'minefield-recon': './src/assets/images/cover_minefield_recon_1794797609611.jpg',
    'court-rally': './src/assets/images/cover_court_rally_1794797610406.jpg'
  };

  var style = document.createElement('style');
  style.textContent = [
    '*,*::before,*::after{box-sizing:border-box;}',
    'body{margin:0;background:#0B0F17;color:#F1F5F9;font-family:"Plus Jakarta Sans",system-ui,-apple-system,sans-serif;-webkit-font-smoothing:antialiased;}',
    '.vp-shell{min-height:100vh;display:flex;flex-direction:column;}',
    '.vp-header{position:sticky;top:0;z-index:30;border-bottom:1px solid rgba(255,255,255,0.08);background:rgba(11,15,23,0.95);backdrop-filter:blur(12px);}',
    '.vp-header-inner{max-width:72rem;margin:0 auto;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;gap:32px;}',
    '.vp-brand{font-family:"Bricolage Grotesque",sans-serif;font-size:20px;font-weight:700;letter-spacing:-0.02em;color:#f1f5f9;text-decoration:none;white-space:nowrap;}',
    '.vp-nav{display:flex;align-items:center;gap:24px;}',
    '.vp-nav-btn{background:none;border:none;color:#94a3b8;font-size:14px;font-weight:500;cursor:pointer;padding:4px 0;white-space:nowrap;font-family:inherit;}',
    '.vp-nav-btn:hover{color:#f1f5f9;text-decoration:underline;text-underline-offset:4px;}',
    '.vp-cta{background:#f59e0b;color:#0B0F17;border:none;border-radius:8px;padding:8px 16px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;}',
    '.vp-cta:hover{background:#fbbf24;}',
    '.vp-main{flex:1;max-width:72rem;width:100%;margin:0 auto;padding:32px 24px 64px;}',
    '.vp-theater{margin-bottom:32px;border:1px solid rgba(255,255,255,0.1);border-radius:12px;overflow:hidden;background:#131924;}',
    '.vp-theater-bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;padding:12px 20px;border-bottom:1px solid rgba(255,255,255,0.08);background:#161D2B;}',
    '.vp-theater-title{margin:0;font-family:"Bricolage Grotesque",sans-serif;font-size:18px;font-weight:700;color:#f1f5f9;}',
    '.vp-theater-meta{margin-top:2px;font-size:12px;color:#94a3b8;display:flex;gap:8px;flex-wrap:wrap;}',
    '.vp-theater-actions{display:flex;gap:8px;}',
    '.vp-btn-sec{background:#0B0F17;color:#e2e8f0;border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;}',
    '.vp-btn-sec:hover{background:rgba(255,255,255,0.06);}',
    '.vp-iframe-box{width:100%;height:560px;background:#080C14;}',
    '.vp-iframe-box iframe{width:100%;height:100%;border:0;display:block;}',
    '.vp-top{border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:28px;}',
    '.vp-title-row{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:12px;}',
    '.vp-h1{margin:0;font-family:"Bricolage Grotesque",sans-serif;font-size:34px;font-weight:700;letter-spacing:-0.02em;}',
    '.vp-sub{margin:8px 0 0;color:#94a3b8;font-size:15px;max-width:42rem;line-height:1.5;}',
    '.vp-count{font-family:"JetBrains Mono",monospace;font-size:12px;color:#94a3b8;font-variant-numeric:tabular-nums;}',
    '.vp-controls{margin-top:22px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px;}',
    '.vp-search-wrap{position:relative;flex:1;min-width:240px;max-width:36rem;}',
    '.vp-search{width:100%;border-radius:12px;border:1px solid rgba(255,255,255,0.1);background:#131924;padding:10px 36px 10px 14px;font-size:14px;color:#f1f5f9;font-family:inherit;outline:none;}',
    '.vp-search:focus{border-color:#f59e0b;}',
    '.vp-clear{position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;color:#94a3b8;cursor:pointer;font-size:14px;}',
    '.vp-tabs{display:flex;flex-wrap:wrap;gap:4px;background:#131924;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:4px;}',
    '.vp-tab{background:none;border:none;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:600;color:#94a3b8;cursor:pointer;font-family:inherit;}',
    '.vp-tab.active{background:#f59e0b;color:#0B0F17;}',
    '.vp-grid{margin-top:32px;display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:24px;}',
    '.vp-card{display:flex;flex-direction:column;overflow:hidden;border-radius:12px;border:1px solid rgba(255,255,255,0.08);background:#131924;color:inherit;text-align:left;cursor:pointer;padding:0;font-family:inherit;transition:border-color 0.15s ease;}',
    '.vp-card:hover{border-color:rgba(255,255,255,0.2);}',
    '.vp-card.active{border-color:rgba(245,158,11,0.75);}',
    '.vp-thumb{aspect-ratio:4/3;width:100%;background:#0D131D;overflow:hidden;}',
    '.vp-thumb img{width:100%;height:100%;object-fit:cover;display:block;}',
    '.vp-card-body{padding:20px;display:flex;flex-direction:column;justify-content:space-between;flex:1;width:100%;}',
    '.vp-card-head{display:flex;align-items:center;justify-content:space-between;gap:8px;}',
    '.vp-card-title{margin:0;font-family:"Bricolage Grotesque",sans-serif;font-size:18px;font-weight:700;color:#f1f5f9;}',
    '.vp-play-label{font-size:12px;font-weight:600;color:#fbbf24;}',
    '.vp-card-desc{margin:6px 0 0;font-size:14px;color:#94a3b8;line-height:1.5;}',
    '.vp-card-meta{margin-top:16px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.06);font-size:12px;color:#94a3b8;display:flex;gap:8px;}',
    '.vp-footer{border-top:1px solid rgba(255,255,255,0.08);padding:24px;font-size:12px;color:#64748b;}',
    '.vp-footer-inner{max-width:72rem;margin:0 auto;display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;}',
    '.vp-empty{margin-top:32px;border:1px solid rgba(255,255,255,0.08);background:#131924;border-radius:12px;padding:40px 24px;text-align:center;}',
    '.vp-modal-backdrop{position:fixed;inset:0;z-index:50;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;padding:16px;}',
    '.vp-modal{width:100%;max-width:48rem;max-height:85vh;display:flex;flex-direction:column;background:#131924;border:1px solid rgba(255,255,255,0.12);border-radius:12px;overflow:hidden;}',
    '.vp-modal pre{margin:0;padding:16px;overflow:auto;background:#0B0F17;font-family:"JetBrains Mono",monospace;font-size:12px;color:#cbd5e1;line-height:1.5;}',
    '@media (max-width:768px){.vp-nav{display:none;}.vp-iframe-box{height:440px;}}'
  ].join('');
  document.head.appendChild(style);

  var state = {
    games: [],
    basePrefix: '',
    search: '',
    category: 'All',
    activeGame: null,
    showRegistry: false,
    error: null
  };

  function parseIframeSrc(html) {
    var match = html.match(/src=["']([^"']+)["']/i);
    var src = match ? match[1] : '';
    if (src && state.basePrefix && !/^https?:\/\//i.test(src) && src.indexOf('./') !== 0 && src.indexOf('/') !== 0) {
      src = state.basePrefix + src;
    }
    return src;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getFiltered() {
    var q = state.search.trim().toLowerCase();
    return state.games.filter(function (g) {
      var catOk = state.category === 'All' || g.category === state.category;
      if (!catOk) return false;
      if (!q) return true;
      return g.title.toLowerCase().indexOf(q) !== -1 || g.category.toLowerCase().indexOf(q) !== -1;
    });
  }

  function renderGridOnly() {
    var gridWrap = document.getElementById('vp-grid-wrap');
    var countEl = document.getElementById('vp-count');
    if (!gridWrap || !countEl) return;
    var filtered = getFiltered();
    countEl.textContent = 'Showing ' + filtered.length + ' of ' + state.games.length + ' games';

    if (state.error) {
      gridWrap.innerHTML = '<div class="vp-empty"><p style="color:#fb7185">' + escapeHtml(state.error) + '</p></div>';
      return;
    }

    if (filtered.length === 0) {
      gridWrap.innerHTML =
        '<div class="vp-empty"><h2 style="margin:0 0 8px;font-size:18px;">No matching games found</h2>' +
        '<p style="color:#94a3b8;font-size:14px;margin:0 0 16px;">Try another title or category.</p>' +
        '<button type="button" class="vp-cta" id="vp-reset-filters">Reset Filters</button></div>';
      var resetBtn = document.getElementById('vp-reset-filters');
      if (resetBtn) {
        resetBtn.addEventListener('click', function () {
          state.search = '';
          state.category = 'All';
          render();
        });
      }
      return;
    }

    gridWrap.innerHTML =
      '<div class="vp-grid">' +
      filtered
        .map(function (g) {
          var active = state.activeGame && state.activeGame.id === g.id;
          var cover = COVERS[g.id] || g.thumbnail || '';
          return (
            '<button type="button" class="vp-card' +
            (active ? ' active' : '') +
            '" data-game-id="' +
            escapeHtml(g.id) +
            '">' +
            '<div class="vp-thumb">' +
            (cover ? '<img src="' + escapeHtml(cover) + '" alt="' + escapeHtml(g.title) + ' cover" referrerpolicy="no-referrer">' : '') +
            '</div>' +
            '<div class="vp-card-body">' +
            '<div>' +
            '<div class="vp-card-head"><h3 class="vp-card-title">' +
            escapeHtml(g.title) +
            '</h3><span class="vp-play-label">' +
            (active ? 'Playing' : 'Play') +
            '</span></div>' +
            '<p class="vp-card-desc">' +
            escapeHtml(g.description) +
            '</p>' +
            '</div>' +
            '<div class="vp-card-meta"><span style="color:#cbd5e1;font-weight:600;">' +
            escapeHtml(g.category) +
            '</span><span>·</span><span>' +
            escapeHtml(g.controls) +
            '</span></div>' +
            '</div>' +
            '</button>'
          );
        })
        .join('') +
      '</div>';

    gridWrap.querySelectorAll('[data-game-id]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-game-id');
        var found = state.games.find(function (item) {
          return item.id === id;
        });
        if (found) {
          state.activeGame = found;
          render();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  }

  function render() {
    var categories = ['All'].concat(
      Array.from(
        new Set(
          state.games.map(function (g) {
            return g.category;
          })
        )
      )
    );

    var theaterHtml = '';
    if (state.activeGame) {
      var src = parseIframeSrc(state.activeGame.iframe);
      theaterHtml =
        '<div class="vp-theater" id="vp-theater">' +
        '<div class="vp-theater-bar">' +
        '<div><h2 class="vp-theater-title">' +
        escapeHtml(state.activeGame.title) +
        '</h2><div class="vp-theater-meta"><span style="color:#fbbf24;font-weight:600;">' +
        escapeHtml(state.activeGame.category) +
        '</span><span>·</span><span>' +
        escapeHtml(state.activeGame.controls) +
        '</span><span>·</span><span>' +
        escapeHtml(state.activeGame.players) +
        '</span></div></div>' +
        '<div class="vp-theater-actions">' +
        '<button type="button" class="vp-btn-sec" id="vp-reload-frame">Restart</button>' +
        '<button type="button" class="vp-btn-sec" id="vp-fs-frame">Fullscreen</button>' +
        '<button type="button" class="vp-btn-sec" id="vp-close-frame">Close</button>' +
        '</div></div>' +
        '<div class="vp-iframe-box"><iframe id="vp-active-iframe" src="' +
        escapeHtml(src) +
        '" title="' +
        escapeHtml(state.activeGame.title) +
        '" allow="fullscreen" allowfullscreen></iframe></div>' +
        '</div>';
    }

    var modalHtml = '';
    if (state.showRegistry) {
      modalHtml =
        '<div class="vp-modal-backdrop" id="vp-modal-bg">' +
        '<div class="vp-modal">' +
        '<div class="vp-theater-bar"><h2 class="vp-theater-title">Iframe JSON Registry</h2>' +
        '<button type="button" class="vp-btn-sec" id="vp-close-modal">Close</button></div>' +
        '<pre>' +
        escapeHtml(JSON.stringify(state.games, null, 2)) +
        '</pre>' +
        '</div></div>';
    }

    root.innerHTML =
      '<div class="vp-shell">' +
      '<header class="vp-header"><div class="vp-header-inner">' +
      '<a href="#catalog" class="vp-brand" id="vp-brand-link">VaultPlay</a>' +
      '<nav class="vp-nav">' +
      '<button type="button" class="vp-nav-btn" data-nav-cat="All">All Games</button>' +
      '<button type="button" class="vp-nav-btn" data-nav-cat="Action">Action</button>' +
      '<button type="button" class="vp-nav-btn" data-nav-cat="Puzzle">Puzzle</button>' +
      '<button type="button" class="vp-nav-btn" data-nav-cat="Strategy">Strategy</button>' +
      '<button type="button" class="vp-nav-btn" id="vp-open-json">JSON Registry</button>' +
      '</nav>' +
      '<button type="button" class="vp-cta" id="vp-random-btn">Random Game</button>' +
      '</div></header>' +
      '<main class="vp-main">' +
      theaterHtml +
      '<section id="catalog">' +
      '<div class="vp-top">' +
      '<div class="vp-title-row">' +
      '<div><h1 class="vp-h1">Instant Browser Arcade</h1>' +
      '<p class="vp-sub">Play self-contained HTML5 games directly in your browser. Search instantaneously by title or category.</p></div>' +
      '<div class="vp-count" id="vp-count"></div>' +
      '</div>' +
      '<div class="vp-controls">' +
      '<div class="vp-search-wrap">' +
      '<input type="search" id="vp-search-input" class="vp-search" value="' +
      escapeHtml(state.search) +
      '" placeholder="Search games by title or category (press /)..." aria-label="Search games by title or category">' +
      (state.search ? '<button type="button" class="vp-clear" id="vp-clear-search" aria-label="Clear search">✕</button>' : '') +
      '</div>' +
      '<div class="vp-tabs">' +
      categories
        .map(function (c) {
          return (
            '<button type="button" class="vp-tab' +
            (state.category === c ? ' active' : '') +
            '" data-cat="' +
            escapeHtml(c) +
            '">' +
            escapeHtml(c) +
            '</button>'
          );
        })
        .join('') +
      '</div></div></div>' +
      '<div id="vp-grid-wrap"></div>' +
      '</section></main>' +
      '<footer class="vp-footer"><div class="vp-footer-inner">' +
      '<span>VaultPlay · Unblocked HTML5 Iframe Arcade</span>' +
      '<span>' +
      state.games.length +
      ' playable titles</span>' +
      '</div></footer>' +
      modalHtml +
      '</div>';

    var searchInput = document.getElementById('vp-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        state.search = e.target.value;
        renderGridOnly();
      });
    }

    var clearBtn = document.getElementById('vp-clear-search');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        state.search = '';
        render();
        var el = document.getElementById('vp-search-input');
        if (el) el.focus();
      });
    }

    root.querySelectorAll('[data-cat]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.category = btn.getAttribute('data-cat');
        render();
      });
    });

    root.querySelectorAll('[data-nav-cat]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.category = btn.getAttribute('data-nav-cat');
        render();
      });
    });

    var randomBtn = document.getElementById('vp-random-btn');
    if (randomBtn) {
      randomBtn.addEventListener('click', function () {
        var pool = getFiltered();
        if (!pool.length) pool = state.games;
        if (!pool.length) return;
        state.activeGame = pool[Math.floor(Math.random() * pool.length)];
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    var openJsonBtn = document.getElementById('vp-open-json');
    if (openJsonBtn) {
      openJsonBtn.addEventListener('click', function () {
        state.showRegistry = true;
        render();
      });
    }

    var closeModalBtn = document.getElementById('vp-close-modal');
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', function () {
        state.showRegistry = false;
        render();
      });
    }

    var reloadBtn = document.getElementById('vp-reload-frame');
    if (reloadBtn) {
      reloadBtn.addEventListener('click', function () {
        var iframe = document.getElementById('vp-active-iframe');
        if (iframe) iframe.src = iframe.src;
      });
    }

    var fsBtn = document.getElementById('vp-fs-frame');
    if (fsBtn) {
      fsBtn.addEventListener('click', function () {
        var theater = document.getElementById('vp-theater');
        if (theater && theater.requestFullscreen) theater.requestFullscreen();
      });
    }

    var closeBtn = document.getElementById('vp-close-frame');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        state.activeGame = null;
        render();
      });
    }

    renderGridOnly();
  }

  function loadCatalog() {
    fetch('./games.json')
      .then(function (res) {
        if (!res.ok) throw new Error('not found');
        state.basePrefix = '';
        return res.json();
      })
      .catch(function () {
        return fetch('./public/games.json').then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          state.basePrefix = './public/';
          return res.json();
        });
      })
      .then(function (data) {
        state.games = Array.isArray(data) ? data : [];
        render();
      })
      .catch(function () {
        state.error = 'Could not load games.json catalog.';
        render();
      });
  }

  loadCatalog();
})();
