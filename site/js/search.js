(function () {
  'use strict';

  const PARAM    = 'query';
  const trigger  = document.getElementById('search-trigger');
  const modal    = document.getElementById('search-modal');
  const backdrop = document.getElementById('search-backdrop');
  const closeBtn = document.getElementById('search-close');
  const input    = document.getElementById('search-input');
  const results  = document.getElementById('search-results');
  const status   = document.getElementById('search-status');

  if (!trigger || !modal || !input || !results) return;

  let pagefind   = null;
  let isOpen     = false;
  let loadPromise = null;

  /* ── Load Pagefind headless API once ───────────────────────────────────── */

  function loadPagefind() {
    if (loadPromise) return loadPromise;
    loadPromise = import('/pagefind/pagefind.js')
      .then(pf => { pagefind = pf; return pf; })
      .catch(err => {
        console.warn('Pagefind not available — run bash scripts/build.sh first.', err);
        status.textContent = lang() === 'fr'
          ? 'Index de recherche non disponible. Lancez d\'abord scripts/build.sh.'
          : 'Search index not available. Run scripts/build.sh first.';
        return null;
      });
    return loadPromise;
  }

  function lang() {
    return document.documentElement.lang === 'fr-ca' ? 'fr' : 'en';
  }

  /* ── Modal open / close ─────────────────────────────────────────────────── */

  function openModal() {
    modal.hidden    = false;
    backdrop.hidden = false;
    isOpen          = true;
    trigger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    input.focus();
    loadPagefind();
    // Restore ?query= if present
    const q = new URL(window.location).searchParams.get(PARAM);
    if (q && !input.value) {
      input.value = q;
      runSearch(q);
    }
  }

  function closeModal() {
    modal.hidden    = true;
    backdrop.hidden = true;
    isOpen          = false;
    trigger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    const url = new URL(window.location);
    if (url.searchParams.has(PARAM)) {
      url.searchParams.delete(PARAM);
      history.replaceState({}, '', url);
    }
    trigger.focus();
  }

  /* ── Search ─────────────────────────────────────────────────────────────── */

  function esc(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  async function runSearch(query) {
    const q = query.trim();

    // Update URL
    const url = new URL(window.location);
    if (q) url.searchParams.set(PARAM, q);
    else   url.searchParams.delete(PARAM);
    history.replaceState({}, '', url);

    if (!q) {
      results.innerHTML  = '';
      status.textContent = '';
      return;
    }

    if (!pagefind) {
      await loadPagefind();
      if (!pagefind) return;
    }

    const search = await pagefind.search(q);

    if (!search || search.results.length === 0) {
      results.innerHTML = '';
      status.textContent = lang() === 'fr'
        ? `Aucun résultat pour « ${esc(q)} »`
        : `No results for "${esc(q)}"`;
      return;
    }

    status.textContent = lang() === 'fr'
      ? `${search.results.length} résultat${search.results.length > 1 ? 's' : ''}`
      : `${search.results.length} result${search.results.length > 1 ? 's' : ''}`;

    // Load first 8 results in parallel
    const data = await Promise.all(
      search.results.slice(0, 8).map(r => r.data())
    );

    results.innerHTML = data.map(r => {
      const section = r.meta?.section || r.meta?.title || '';
      const excerpt = r.excerpt || '';
      return `<li>
        <a href="${esc(r.url)}" class="search-result-link">
          <span class="search-result-title">${esc(r.meta?.title || r.url)}</span>
          ${section && section !== r.meta?.title
            ? `<span class="search-section">${esc(section)}</span>`
            : ''}
          ${excerpt
            ? `<span class="search-result-desc">${excerpt}</span>`
            : ''}
        </a>
      </li>`;
    }).join('');
  }

  /* ── Debounce ────────────────────────────────────────────────────────────── */

  const debounce = (fn, ms) => {
    let t;
    return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
  };

  /* ── Keyboard navigation inside results ─────────────────────────────────── */

  function getLinks() { return [...results.querySelectorAll('a')]; }

  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); getLinks()[0]?.focus(); }
    if (e.key === 'Escape')    { closeModal(); }
  });

  results.addEventListener('keydown', e => {
    const links = getLinks();
    const idx   = links.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); (links[idx + 1] ?? links[0]).focus(); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); idx <= 0 ? input.focus() : links[idx - 1].focus(); }
    if (e.key === 'Escape')    { closeModal(); }
  });

  /* ── Event wiring ────────────────────────────────────────────────────────── */

  input.addEventListener('input', debounce(e => runSearch(e.target.value), 200));

  trigger.addEventListener('click',   () => isOpen ? closeModal() : openModal());
  closeBtn.addEventListener('click',  closeModal);
  backdrop.addEventListener('click',  closeModal);

  // / or s to open from anywhere
  document.addEventListener('keydown', e => {
    if (e.target.matches('input,textarea,select,[contenteditable]')) return;
    if (!isOpen && (e.key === '/' || e.key === 's')) { e.preventDefault(); openModal(); }
    if (isOpen  &&  e.key === 'Escape') closeModal();
  });

  // Focus trap
  modal.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusable = [...modal.querySelectorAll('button,input,a[href]')];
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey  && document.activeElement === first) { e.preventDefault(); last.focus(); }
    if (!e.shiftKey && document.activeElement === last)  { e.preventDefault(); first.focus(); }
  });

  // Open on load if ?query= present
  if (new URL(window.location).searchParams.has(PARAM)) openModal();

})();
