/* =====================================================
   SEO AUDIT TOOL — main.js
   Features:
     • Dynamic category rendering
     • Score calculation & ring animation
     • localStorage persistence
     • Reset, Export/Print report
     • Toast notifications
     • Filter tabs
     • Collapsible category cards
   ===================================================== */

'use strict';

// ── 1. CHECKLIST DATA ──────────────────────────────────────
const CATEGORIES = [
  {
    id: 'onpage',
    label: 'On-Page SEO',
    emoji: '📄',
    color: 'var(--cat-onpage)',
    description: 'Title, meta tags & headings',
    items: [
      { id: 'op1',  label: 'Page has a unique, descriptive <title> tag',                  hint: 'Ideal length: 50–60 characters',             priority: 'high' },
      { id: 'op2',  label: 'Title tag contains the primary keyword',                       hint: 'Place keyword near the start of the title',  priority: 'high' },
      { id: 'op3',  label: 'Meta description is present and compelling',                   hint: 'Ideal length: 150–160 characters',            priority: 'high' },
      { id: 'op4',  label: 'Meta description includes primary and secondary keywords',     hint: 'Write for users first, then search engines',  priority: 'medium' },
      { id: 'op5',  label: 'Page has exactly one H1 tag',                                 hint: 'H1 should describe the main page topic',      priority: 'high' },
      { id: 'op6',  label: 'H1 includes the target keyword',                              hint: 'Natural placement, not keyword stuffing',     priority: 'high' },
      { id: 'op7',  label: 'Heading hierarchy is logical (H1→H2→H3)',                    hint: 'Do not skip heading levels',                  priority: 'medium' },
      { id: 'op8',  label: 'URL is short, descriptive, and uses hyphens',                hint: 'Avoid underscores and stop words',             priority: 'medium' },
      { id: 'op9',  label: 'URL contains the target keyword',                             hint: 'Keep URLs readable and meaningful',           priority: 'medium' },
      { id: 'op10', label: 'Canonical tag is correctly implemented',                      hint: 'Prevents duplicate content issues',           priority: 'medium' },
      { id: 'op11', label: 'Open Graph tags are present (og:title, og:description)',      hint: 'Improves social media sharing appearance',    priority: 'low' },
      { id: 'op12', label: 'Twitter Card meta tags are present',                          hint: 'Enhance visibility when shared on Twitter/X', priority: 'low' },
    ]
  },
  {
    id: 'technical',
    label: 'Technical SEO',
    emoji: '⚙️',
    color: 'var(--cat-technical)',
    description: 'Indexing, crawlability & structure',
    items: [
      { id: 'tc1',  label: 'robots.txt file exists and is correctly configured',          hint: 'Ensure important pages are not blocked',      priority: 'high' },
      { id: 'tc2',  label: 'XML sitemap is present and submitted to Google Search Console', hint: 'Helps Google discover all pages faster',   priority: 'high' },
      { id: 'tc3',  label: 'Site uses HTTPS (SSL certificate is valid)',                  hint: 'HTTP is flagged as "Not Secure" in Chrome',  priority: 'high' },
      { id: 'tc4',  label: 'No broken links (4xx, 5xx) found on the page',               hint: 'Use a tool like Screaming Frog to check',    priority: 'high' },
      { id: 'tc5',  label: 'www vs non-www is consistent and properly redirected',        hint: 'Choose one canonical domain version',        priority: 'medium' },
      { id: 'tc6',  label: 'Structured data / schema markup is implemented',              hint: 'Article, Product, FAQ, LocalBusiness, etc.', priority: 'medium' },
      { id: 'tc7',  label: 'Hreflang tags used for multilingual / multi-regional content', hint: 'Only needed if targeting multiple languages', priority: 'low' },
      { id: 'tc8',  label: 'No duplicate content detected across pages',                  hint: 'Use canonical tags or 301 redirects',        priority: 'high' },
      { id: 'tc9',  label: '404 page is customized and useful to visitors',               hint: 'Include navigation links to help users',     priority: 'low' },
    ]
  },
  {
    id: 'content',
    label: 'Content Quality',
    emoji: '✍️',
    color: 'var(--cat-content)',
    description: 'Depth, relevance & keyword usage',
    items: [
      { id: 'ct1',  label: 'Content is original and not copied from other sources',       hint: 'Use Copyscape or Grammarly to check',        priority: 'high' },
      { id: 'ct2',  label: 'Content thoroughly covers the topic (1000+ words for pillar pages)', hint: 'Depth signals authority to Google',  priority: 'high' },
      { id: 'ct3',  label: 'Primary keyword appears in first 100 words',                  hint: 'Natural placement in the intro paragraph',   priority: 'high' },
      { id: 'ct4',  label: 'Keyword density is natural (1–3%)',                           hint: 'Avoid keyword stuffing — write naturally',   priority: 'medium' },
      { id: 'ct5',  label: 'LSI / semantic keywords are naturally included',              hint: 'Related terms help Google understand context', priority: 'medium' },
      { id: 'ct6',  label: 'Content is up to date and regularly reviewed',                hint: 'Update dates and outdated statistics',       priority: 'medium' },
      { id: 'ct7',  label: 'Content has a clear call-to-action (CTA)',                   hint: 'Guide visitors to the next step',            priority: 'medium' },
      { id: 'ct8',  label: 'Reading level is appropriate for target audience',            hint: 'Use Hemingway Editor to test readability',   priority: 'low' },
    ]
  },
  {
    id: 'images',
    label: 'Images & Media',
    emoji: '🖼️',
    color: 'var(--cat-images)',
    description: 'Alt text, file size & formats',
    items: [
      { id: 'im1',  label: 'All images have descriptive alt attributes',                  hint: 'Critical for accessibility and Google Images', priority: 'high' },
      { id: 'im2',  label: 'Alt text includes relevant keywords where appropriate',       hint: 'Keep it natural — describe the image first', priority: 'medium' },
      { id: 'im3',  label: 'Image file sizes are optimised (< 200KB where possible)',    hint: 'Use TinyPNG or Squoosh for compression',      priority: 'high' },
      { id: 'im4',  label: 'Modern image formats used (WebP, AVIF)',                     hint: 'Significantly reduces file size vs JPEG/PNG', priority: 'medium' },
      { id: 'im5',  label: 'Images are lazy-loaded (loading="lazy")',                    hint: 'Defer off-screen images for faster loads',   priority: 'medium' },
      { id: 'im6',  label: 'Image file names are descriptive (not "img001.jpg")',        hint: 'Use hyphens between words in filenames',     priority: 'low' },
      { id: 'im7',  label: 'Responsive images use srcset / sizes attributes',            hint: 'Serve correct image size per screen width',  priority: 'medium' },
    ]
  },
  {
    id: 'links',
    label: 'Links',
    emoji: '🔗',
    color: 'var(--cat-links)',
    description: 'Internal & external link health',
    items: [
      { id: 'lk1',  label: 'Internal links are present and contextually relevant',       hint: 'Link to related pages on the same domain',   priority: 'high' },
      { id: 'lk2',  label: 'Anchor text for links is descriptive (not "click here")',    hint: 'Descriptive anchors help Google understand context', priority: 'high' },
      { id: 'lk3',  label: 'External links are credible and relevant',                   hint: 'Link to authoritative sources (gov, edu)',    priority: 'medium' },
      { id: 'lk4',  label: 'External links open in a new tab (target="_blank")',         hint: 'Keeps users on your site longer',            priority: 'low' },
      { id: 'lk5',  label: 'No orphan pages (every page reachable via navigation)',      hint: 'Check with a site crawl tool',               priority: 'medium' },
      { id: 'lk6',  label: 'Pagination implemented correctly (rel="next/prev") or infinite scroll handled', hint: 'Helps Google crawl paginated content', priority: 'low' },
    ]
  },
  {
    id: 'mobile',
    label: 'Mobile & UX',
    emoji: '📱',
    color: 'var(--cat-mobile)',
    description: 'Mobile-first design & usability',
    items: [
      { id: 'mb1',  label: 'Site passes Google Mobile-Friendly Test',                    hint: 'Test at search.google.com/test/mobile-friendly', priority: 'high' },
      { id: 'mb2',  label: 'Viewport meta tag is set correctly',                         hint: '<meta name="viewport" content="width=device-width, initial-scale=1">', priority: 'high' },
      { id: 'mb3',  label: 'Text is readable without zooming on mobile',                 hint: 'Minimum 16px font size for body text',        priority: 'high' },
      { id: 'mb4',  label: 'Touch targets are large enough (44×44px minimum)',           hint: 'Avoid tightly packed buttons and links',      priority: 'medium' },
      { id: 'mb5',  label: 'No horizontal scrolling on mobile',                          hint: 'Use overflow-x:hidden and responsive units',  priority: 'high' },
      { id: 'mb6',  label: 'Pop-ups / interstitials don\'t block content on mobile',    hint: 'Google penalises intrusive interstitials',    priority: 'medium' },
      { id: 'mb7',  label: 'Site has a clear, intuitive navigation on all devices',     hint: 'Hamburger menus should be obvious',           priority: 'medium' },
    ]
  },
  {
    id: 'performance',
    label: 'Performance',
    emoji: '⚡',
    color: 'var(--cat-performance)',
    description: 'Core Web Vitals & load speed',
    items: [
      { id: 'pf1',  label: 'LCP (Largest Contentful Paint) is under 2.5 seconds',       hint: 'Optimise hero images and server response time', priority: 'high' },
      { id: 'pf2',  label: 'FID / INP (Interaction to Next Paint) is under 200ms',      hint: 'Minimise long JavaScript tasks',              priority: 'high' },
      { id: 'pf3',  label: 'CLS (Cumulative Layout Shift) score is under 0.1',          hint: 'Set explicit width/height on images',         priority: 'high' },
      { id: 'pf4',  label: 'Page achieves 90+ score on PageSpeed Insights',             hint: 'Test both mobile and desktop scores',         priority: 'high' },
      { id: 'pf5',  label: 'CSS and JS are minified',                                   hint: 'Use build tools (Vite, Webpack, esbuild)',    priority: 'medium' },
      { id: 'pf6',  label: 'Render-blocking resources are eliminated or deferred',      hint: 'Use async/defer on non-critical scripts',     priority: 'medium' },
      { id: 'pf7',  label: 'Browser caching is properly configured',                    hint: 'Set Cache-Control headers via server config', priority: 'medium' },
      { id: 'pf8',  label: 'A Content Delivery Network (CDN) is used',                  hint: 'Cloudflare, AWS CloudFront, Fastly, etc.',   priority: 'low' },
      { id: 'pf9',  label: 'TTFB (Time to First Byte) is under 800ms',                 hint: 'Optimise server configuration and hosting',  priority: 'medium' },
    ]
  }
];

// ── 2. STATE ───────────────────────────────────────────────
const STORAGE_KEY = 'seoAuditChecked_v2';
const COLLAPSE_KEY = 'seoAuditCollapsed_v2';
let checkedItems    = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
let collapsedCards  = new Set(JSON.parse(localStorage.getItem(COLLAPSE_KEY) || '[]'));
let activeFilter    = 'all';

// ── 3. UTILITY ─────────────────────────────────────────────
const totalItems = CATEGORIES.reduce((s, c) => s + c.items.length, 0);

function saveState() {
  localStorage.setItem(STORAGE_KEY,  JSON.stringify([...checkedItems]));
  localStorage.setItem(COLLAPSE_KEY, JSON.stringify([...collapsedCards]));
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._tid);
  t._tid = setTimeout(() => t.classList.remove('show'), 2800);
}

function lerp(a, b, t) { return a + (b - a) * t; }

// ── 4. SCORE & STATS ───────────────────────────────────────
const RECOMMENDATIONS = [
  { min: 90, badge: 'Excellent 🏆', badgeCls: 'excellent', icon: '🏆',
    text: 'Outstanding SEO health! Your site is well-optimised. Continue monitoring Core Web Vitals and keep content fresh to maintain your rankings.' },
  { min: 75, badge: 'Good 👍',       badgeCls: 'good',      icon: '👍',
    text: 'Your SEO is solid. Focus on the remaining unchecked items — especially any High priority ones — to push towards the top tier.' },
  { min: 50, badge: 'Average ⚠️',   badgeCls: 'average',   icon: '⚠️',
    text: 'You have a decent foundation but there are clear gaps. Prioritise High-priority items, especially title tags, mobile-friendliness, and Core Web Vitals.' },
  { min: 25, badge: 'Poor 🔴',       badgeCls: 'poor',      icon: '🔴',
    text: 'Significant SEO issues detected. Start with Technical SEO (HTTPS, sitemap, robots.txt) and On-Page fundamentals (title, H1, meta description).' },
  { min:  0, badge: 'Critical 🚨',  badgeCls: 'poor',      icon: '🚨',
    text: 'Your site has critical SEO problems. Begin with the most fundamental items: unique title tags, meta descriptions, HTTPS, and mobile optimisation.' },
];

function getRecommendation(score) {
  return RECOMMENDATIONS.find(r => score >= r.min) || RECOMMENDATIONS[RECOMMENDATIONS.length - 1];
}

function updateScoreUI() {
  const checked = checkedItems.size;
  const score   = totalItems > 0 ? Math.round((checked / totalItems) * 100) : 0;
  const rec     = getRecommendation(score);

  // Ring
  const circumference = 2 * Math.PI * 58; // 364.4
  const offset = circumference - (score / 100) * circumference;
  const ring = document.getElementById('ringProgress');
  if (ring) ring.style.strokeDashoffset = offset;

  // Score number with animation
  const scoreEl = document.getElementById('scoreValue');
  if (scoreEl) {
    const prev = parseInt(scoreEl.dataset.prev || '0', 10);
    animateNum(scoreEl, prev, score, 600);
    scoreEl.dataset.prev = score;
    scoreEl.classList.remove('pulse');
    void scoreEl.offsetWidth; // reflow
    scoreEl.classList.add('pulse');
  }

  // Badge
  const badge = document.getElementById('scoreBadge');
  if (badge) {
    badge.textContent = rec.badge;
    badge.className   = `score-badge ${rec.badgeCls}`;
  }

  // Stats
  setText('statChecked', checked);
  setText('statTotal', totalItems);

  // Progress bar
  const fill = document.getElementById('overallProgressFill');
  const pct  = document.getElementById('progressPercent');
  if (fill) fill.style.width = score + '%';
  if (pct)  pct.textContent  = score + '%';

  // Recommendation
  const recEl   = document.getElementById('recText');
  const recIcon = document.getElementById('recIcon');
  if (recEl)   recEl.textContent   = rec.text;
  if (recIcon) recIcon.textContent = rec.icon;
  const recBox = document.getElementById('recommendationBox');
  if (recBox) {
    recBox.style.borderLeftColor =
      score >= 90 ? 'var(--clr-green)' :
      score >= 75 ? 'var(--clr-cyan)'  :
      score >= 50 ? 'var(--clr-amber)' : 'var(--clr-red)';
  }

  // Update each category score pill
  CATEGORIES.forEach(cat => {
    const checked = cat.items.filter(i => checkedItems.has(i.id)).length;
    const catScore = cat.items.length > 0 ? Math.round((checked / cat.items.length) * 100) : 0;
    const pill = document.getElementById(`pill-${cat.id}`);
    const fillEl = document.getElementById(`catFill-${cat.id}`);
    if (pill) {
      pill.textContent = `${checked}/${cat.items.length}`;
      const clr = catScore >= 80 ? 'var(--clr-green)' : catScore >= 50 ? 'var(--clr-amber)' : 'var(--clr-red)';
      pill.style.color = clr;
      pill.style.borderColor = clr + '66';
      pill.style.background  = clr + '15';
    }
    if (fillEl) {
      fillEl.style.width = catScore + '%';
    }
  });
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function animateNum(el, from, to, duration) {
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    el.textContent = Math.round(lerp(from, to, easedProgress));
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ── 5. RENDER ──────────────────────────────────────────────
function renderCategories(filter = 'all') {
  const grid = document.getElementById('categoriesGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const cats = filter === 'all' ? CATEGORIES : CATEGORIES.filter(c => c.id === filter);

  cats.forEach(cat => {
    const card = buildCard(cat);
    grid.appendChild(card);
  });
}

function buildCard(cat) {
  const isCollapsed = collapsedCards.has(cat.id);
  const card = document.createElement('div');
  card.className = `category-card${isCollapsed ? ' collapsed' : ''}`;
  card.dataset.catId = cat.id;

  const checkedCount = cat.items.filter(i => checkedItems.has(i.id)).length;
  const catScore = Math.round((checkedCount / cat.items.length) * 100);
  const pillClr = catScore >= 80 ? 'var(--clr-green)' : catScore >= 50 ? 'var(--clr-amber)' : 'var(--clr-red)';

  card.innerHTML = `
    <div class="card-header" tabindex="0" role="button" aria-expanded="${!isCollapsed}" aria-controls="body-${cat.id}" id="header-${cat.id}">
      <div class="card-title-wrap">
        <div class="cat-icon" style="background:${cat.color}22; color:${cat.color}">${cat.emoji}</div>
        <div>
          <div class="card-title">${cat.label}</div>
          <div class="card-subtitle">${cat.description}</div>
        </div>
      </div>
      <div class="card-meta">
        <span class="cat-score-pill" id="pill-${cat.id}"
          style="color:${pillClr};border-color:${pillClr}66;background:${pillClr}15">
          ${checkedCount}/${cat.items.length}
        </span>
        <div class="card-toggle" aria-hidden="true">▼</div>
      </div>
    </div>
    <div class="card-progress">
      <div class="card-progress-fill" id="catFill-${cat.id}"
        style="width:${catScore}%;background:${cat.color}"></div>
    </div>
    <div class="card-body" id="body-${cat.id}" role="list">
      ${cat.items.map(item => buildItem(item, cat.color)).join('')}
    </div>
  `;

  // Header toggle
  const header = card.querySelector('.card-header');
  header.addEventListener('click', () => toggleCard(cat.id));
  header.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCard(cat.id); }
  });

  // Item checkboxes
  card.querySelectorAll('.checklist-item').forEach(el => {
    el.addEventListener('click', () => toggleItem(el.dataset.id));
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleItem(el.dataset.id); }
    });
  });

  return card;
}

function buildItem(item, catColor) {
  const checked = checkedItems.has(item.id);
  return `
    <div class="checklist-item${checked ? ' checked' : ''}" 
         data-id="${item.id}" 
         role="listitem checkbox"
         tabindex="0"
         aria-checked="${checked}"
         aria-label="${item.label}">
      <div class="item-checkbox">
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke="#0b0d17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="item-text-wrap">
        <div class="item-label">${item.label}</div>
        <div class="item-hint">${item.hint}</div>
      </div>
      <span class="item-priority priority-${item.priority}">${item.priority}</span>
    </div>
  `;
}

// ── 6. INTERACTIONS ────────────────────────────────────────
function toggleItem(id) {
  if (checkedItems.has(id)) {
    checkedItems.delete(id);
  } else {
    checkedItems.add(id);
  }
  saveState();
  // Update item DOM
  const el = document.querySelector(`.checklist-item[data-id="${id}"]`);
  if (el) {
    const isNowChecked = checkedItems.has(id);
    el.classList.toggle('checked', isNowChecked);
    el.setAttribute('aria-checked', isNowChecked);
  }
  updateScoreUI();
}

function toggleCard(catId) {
  const card = document.querySelector(`.category-card[data-cat-id="${catId}"]`);
  if (!card) return;
  const header = card.querySelector('.card-header');
  if (collapsedCards.has(catId)) {
    collapsedCards.delete(catId);
    card.classList.remove('collapsed');
    if (header) header.setAttribute('aria-expanded', 'true');
  } else {
    collapsedCards.add(catId);
    card.classList.add('collapsed');
    if (header) header.setAttribute('aria-expanded', 'false');
  }
  saveState();
}

// ── 7. FILTER TABS ─────────────────────────────────────────
function buildFilterTabs() {
  const container = document.getElementById('filterTabs');
  if (!container) return;

  // "All" tab already in HTML — wire it up
  const allTab = container.querySelector('[data-filter="all"]');
  if (allTab) allTab.addEventListener('click', () => setFilter('all', allTab));

  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-tab';
    btn.dataset.filter = cat.id;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', 'false');
    btn.innerHTML = `${cat.emoji} ${cat.label}`;
    btn.addEventListener('click', () => setFilter(cat.id, btn));
    container.appendChild(btn);
  });
}

function setFilter(filter, activeBtn) {
  activeFilter = filter;
  document.querySelectorAll('.filter-tab').forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });
  activeBtn.classList.add('active');
  activeBtn.setAttribute('aria-selected', 'true');
  renderCategories(filter);
  updateScoreUI();
}

// ── 8. RESET ───────────────────────────────────────────────
function resetAll() {
  if (!confirm('Reset all checked items? This cannot be undone.')) return;
  checkedItems.clear();
  saveState();
  renderCategories(activeFilter);
  updateScoreUI();
  showToast('✅ Checklist has been reset.');
}

// ── 9. PRINT / EXPORT ──────────────────────────────────────
function buildPrintReport() {
  const score   = totalItems > 0 ? Math.round((checkedItems.size / totalItems) * 100) : 0;
  const rec     = getRecommendation(score);

  setText('printDate',  new Date().toLocaleString());
  setText('printScore', score);
  setText('printBadge', rec.badge);
  setText('printRec',   rec.text);

  const catContainer = document.getElementById('printCategories');
  if (!catContainer) return;

  catContainer.innerHTML = CATEGORIES.map(cat => {
    const items = cat.items.map(item => {
      const done = checkedItems.has(item.id);
      return `
        <div class="print-item${done ? ' done' : ''}">
          <span class="print-check">${done ? '☑' : '☐'}</span>
          <span class="print-label">${item.label}</span>
        </div>
      `;
    }).join('');
    const cnt = cat.items.filter(i => checkedItems.has(i.id)).length;
    return `
      <div class="print-category">
        <div class="print-category-title">
          <span>${cat.emoji} ${cat.label}</span>
          <span>${cnt}/${cat.items.length} items</span>
        </div>
        ${items}
      </div>
    `;
  }).join('');
}

function exportReport() {
  buildPrintReport();
  const printEl = document.getElementById('printReport');
  if (printEl) printEl.setAttribute('aria-hidden', 'false');
  window.print();
  if (printEl) printEl.setAttribute('aria-hidden', 'true');
  showToast('📄 Report sent to printer / PDF dialog.');
}

// ── 10. SVG RING GRADIENT ──────────────────────────────────
function injectRingGradient() {
  const svg = document.querySelector('.ring-svg');
  if (!svg) return;
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.innerHTML = `
    <linearGradient id="ringGradDef" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#6c63ff"/>
      <stop offset="100%" stop-color="#3ecfcf"/>
    </linearGradient>
  `;
  svg.prepend(defs);
}

// ── 10.5 BACKEND URL AUDIT INTEGRATION ──────────────────────
const BACKEND_URL = 'http://localhost:5000';

async function checkBackendStatus() {
  const dot = document.getElementById('statusDot');
  const label = document.getElementById('statusLabel');
  const badge = document.getElementById('backendStatus');
  if (!dot || !label || !badge) return;

  try {
    const res = await fetch(`${BACKEND_URL}/health`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      badge.className = 'backend-status online';
      label.textContent = 'Backend Online';
    } else {
      throw new Error();
    }
  } catch (err) {
    badge.className = 'backend-status offline';
    label.textContent = 'Backend Offline';
  }
}

async function runUrlAudit(e) {
  e.preventDefault();
  const input = document.getElementById('auditUrlInput');
  const btn = document.getElementById('btnAudit');
  const textSpan = btn?.querySelector('.btn-audit-text');
  const loadSpan = btn?.querySelector('.btn-audit-loading');
  const resultsPanel = document.getElementById('auditResultsPanel');
  const resultsGrid = document.getElementById('auditResultsGrid');

  if (!input || !btn) return;

  const url = input.value.trim();
  if (!url) return;

  // UI loading state
  input.disabled = true;
  btn.disabled = true;
  if (textSpan) textSpan.hidden = true;
  if (loadSpan) loadSpan.hidden = false;

  try {
    const res = await fetch(`${BACKEND_URL}/audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Server error. Is backend running?');
    }

    // Process Checklist Updates
    applyAuditToChecklist(data);
    
    // Render Results Panel
    renderAuditResults(data);
    if (resultsPanel) resultsPanel.hidden = false;

    showToast('🚀 URL Audit completed! Checklist updated.');
  } catch (err) {
    console.error(err);
    showToast(`❌ Audit failed: ${err.message}`);
  } finally {
    input.disabled = false;
    btn.disabled = false;
    if (textSpan) textSpan.hidden = false;
    if (loadSpan) loadSpan.hidden = true;
  }
}

function applyAuditToChecklist(data) {
  // Map scraped data fields directly to checklist item IDs
  const matches = {
    'op1': data.title.status === 'ok' || data.title.length >= 30,
    'op2': data.title.text.toLowerCase().includes('seo') || data.title.length > 15,
    'op3': data.meta_description.status === 'ok' || data.meta_description.length > 70,
    'op4': data.meta_description.length > 20,
    'op5': data.headings.h1_count === 1,
    'op6': data.headings.h1_count > 0,
    'op7': data.headings.h2_count > 0,
    'op10': data.canonical.present === true,
    'tc3': data.https.final_https === true,
    'tc4': data.status_code === 200,
    'tc8': data.robots_meta.is_indexable === true,
    'im1': data.images.alt_coverage_pct >= 90,
    'im2': data.images.alt_coverage_pct > 0,
    'lk1': data.links.internal_count > 0,
    'lk3': data.links.external_count > 0,
  };

  Object.entries(matches).forEach(([itemId, isMet]) => {
    if (isMet) {
      checkedItems.add(itemId);
    }
  });

  saveState();
  renderCategories(activeFilter);
  updateScoreUI();
}

function renderAuditResults(data) {
  const grid = document.getElementById('auditResultsGrid');
  if (!grid) return;

  grid.innerHTML = `
    <div class="audit-result-item">
      <span class="audit-result-label">Page Title (${data.title.length} chars)</span>
      <span class="audit-result-value" title="${data.title.text}">${data.title.text || '(None)'}</span>
      <span class="audit-result-status" style="color: ${data.title.status === 'ok' ? 'var(--clr-green)' : 'var(--clr-amber)'}">
        ${data.title.recommendation}
      </span>
    </div>
    
    <div class="audit-result-item">
      <span class="audit-result-label">Meta Description (${data.meta_description.length} chars)</span>
      <span class="audit-result-value" title="${data.meta_description.text}">${data.meta_description.text || '(None)'}</span>
      <span class="audit-result-status" style="color: ${data.meta_description.status === 'ok' ? 'var(--clr-green)' : 'var(--clr-red)'}">
        ${data.meta_description.recommendation}
      </span>
    </div>

    <div class="audit-result-item">
      <span class="audit-result-label">Headings & Structure</span>
      <span class="audit-result-value">H1: ${data.headings.h1_count} | H2: ${data.headings.h2_count} | H3: ${data.headings.h3_count}</span>
      <span class="audit-result-status" style="color: ${data.headings.status === 'ok' ? 'var(--clr-green)' : 'var(--clr-red)'}">
        ${data.headings.recommendation}
      </span>
    </div>

    <div class="audit-result-item">
      <span class="audit-result-label">Image Alt Tags</span>
      <span class="audit-result-value">Alt Tag Coverage: ${data.images.alt_coverage_pct}%</span>
      <span class="audit-result-status" style="color: ${data.images.status === 'ok' ? 'var(--clr-green)' : 'var(--clr-amber)'}">
        ${data.images.recommendation} (Total: ${data.images.total})
      </span>
    </div>

    <div class="audit-result-item">
      <span class="audit-result-label">Links Checked</span>
      <span class="audit-result-value">Internal: ${data.links.internal_count} | External: ${data.links.external_count}</span>
      <span class="audit-result-status" style="color: var(--clr-cyan)">
        ${data.links.recommendation}
      </span>
    </div>

    <div class="audit-result-item">
      <span class="audit-result-label">Security & Indexing</span>
      <span class="audit-result-value">HTTPS: ${data.https.final_https ? 'Yes' : 'No'} | Indexable: ${data.robots_meta.is_indexable ? 'Yes' : 'No'}</span>
      <span class="audit-result-status" style="color: ${data.https.final_https ? 'var(--clr-green)' : 'var(--clr-red)'}">
        ${data.canonical.recommendation}
      </span>
    </div>
  `;
}

// ── 11. INIT ───────────────────────────────────────────────
function init() {
  injectRingGradient();
  buildFilterTabs();
  renderCategories('all');
  updateScoreUI();

  // Backend event setup
  checkBackendStatus();
  // Poll backend status every 10 seconds
  setInterval(checkBackendStatus, 10000);

  document.getElementById('urlAuditForm')?.addEventListener('submit', runUrlAudit);
  document.getElementById('btnReset')?.addEventListener('click', resetAll);
  document.getElementById('btnExport')?.addEventListener('click', exportReport);

  // Welcome toast on first visit
  if (!localStorage.getItem('seoAuditVisited')) {
    localStorage.setItem('seoAuditVisited', '1');
    setTimeout(() => showToast('👋 Welcome! Start checking items or use the URL Auditor.'), 900);
  }
}

document.addEventListener('DOMContentLoaded', init);

