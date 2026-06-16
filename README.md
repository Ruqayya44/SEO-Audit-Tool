# SEO Audit Checklist Tool 🔍

![SEO Score Badge](https://img.shields.io/badge/SEO-Audit%20Tool-6c63ff?style=for-the-badge&logo=google&logoColor=white)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

A **professional, fully-client-side SEO Audit Checklist Tool** that evaluates your website across 7 critical SEO dimensions. Built with vanilla HTML, CSS, and JavaScript — no dependencies, no build step, instant deploy.

---

## 🚀 Live Demo

> [Add your live demo link here after deployment]

---

## ✨ Features

- **54 checklist items** across 7 SEO categories
- **Animated SVG score ring** (0–100 live score)
- **Colour-coded priority labels**: High / Medium / Low
- **Per-category progress bars** and score pills
- **Smart recommendations** that change with your score range
- **localStorage persistence** — progress saves automatically on refresh
- **Filter tabs** — view All categories or drill into one at a time
- **Collapsible cards** — collapse categories you've completed
- **Reset button** with confirmation dialog
- **Print / Export PDF report** — clean print-optimised layout
- **Toast notifications** for user feedback
- **Fully responsive** — mobile, tablet, and desktop
- **Accessible** — ARIA roles, keyboard navigation, focus states
- **Zero dependencies** — pure HTML/CSS/JS

---

## 📋 SEO Categories Covered

| # | Category | Items | Focus |
|---|----------|-------|-------|
| 1 | 📄 On-Page SEO | 12 | Title, meta, headings, URLs, Open Graph |
| 2 | ⚙️ Technical SEO | 9 | Robots.txt, sitemap, HTTPS, schema, canonicals |
| 3 | ✍️ Content Quality | 8 | Depth, keywords, freshness, CTAs |
| 4 | 🖼️ Images & Media | 7 | Alt text, compression, WebP, lazy load |
| 5 | 🔗 Links | 6 | Internal links, anchor text, orphan pages |
| 6 | 📱 Mobile & UX | 7 | Mobile-friendly, viewport, touch targets |
| 7 | ⚡ Performance | 9 | Core Web Vitals (LCP, INP, CLS), CDN, caching |

**Total: 58 items**

---

## 🗂️ Folder Structure

```
seo-audit-tool/
├── index.html            # Main app (all markup)
├── css/
│   └── style.css         # Dark glassmorphism design system
├── js/
│   └── main.js           # All logic: data, rendering, score, export
├── advanced-backend/
│   ├── app.py            # Flask API — URL scanner
│   ├── requirements.txt  # Python dependencies
│   └── README.md         # Backend setup & deployment guide
└── README.md             # This file
```

---

## 🛠️ Setup & Local Development

### Option 1 — Open directly in browser
```bash
# Clone the repo
git clone https://github.com/yourusername/seo-audit-tool.git
cd seo-audit-tool

# Just open in browser
start index.html        # Windows
open index.html         # macOS
xdg-open index.html     # Linux
```

### Option 2 — VS Code Live Server
1. Open the folder in VS Code
2. Install the **Live Server** extension
3. Right-click `index.html` → **Open with Live Server**
4. Visit `http://127.0.0.1:5500`

### Option 3 — Python simple server
```bash
python -m http.server 8080
# Visit http://localhost:8080
```

---

## 🌐 Deployment

### GitHub Pages (recommended for portfolio)
1. Push to GitHub
2. Go to **Settings → Pages**
3. Source: **Deploy from branch** → `main` → `/root`
4. Visit `https://yourusername.github.io/seo-audit-tool`

### Netlify
1. Import the GitHub repo at [app.netlify.com](https://app.netlify.com)
2. Build command: _(leave blank)_
3. Publish directory: `/` (root)
4. Click **Deploy** — done!

### Vercel
1. Import at [vercel.com/new](https://vercel.com/new)
2. Framework preset: **Other**
3. Root directory: `/`
4. Deploy — instant URL provided

---

## 📊 Score Ranges & Meaning

| Score | Rating | Colour | What It Means |
|-------|--------|--------|---------------|
| 90–100 | 🏆 Excellent | Green | Outstanding SEO health |
| 75–89 | 👍 Good | Cyan | Solid foundation, minor gaps |
| 50–74 | ⚠️ Average | Amber | Significant improvements needed |
| 25–49 | 🔴 Poor | Red | Major SEO issues present |
| 0–24 | 🚨 Critical | Red | Start from the basics |

---

## 🖨️ Exporting Reports

Click **"Export Report"** to open the browser print dialog. You can:
- **Print to paper** — formatted, clean two-column layout
- **Save as PDF** — select "Save as PDF" in the print dialog (all browsers)

The print layout includes your score, rating, recommendation text, and every category with checkbox states.

---

## 🔧 Advanced Backend (Optional)

See [`advanced-backend/README.md`](./advanced-backend/README.md) for the optional Python Flask backend that can auto-audit a live URL using **Requests** and **BeautifulSoup4**.

**Endpoints:**
```
POST /audit   { "url": "https://example.com" }
GET  /health
```

**Returns:** title length, meta description, H1/H2 count, image alt coverage, internal/external link counts, canonical tag, robots meta, and recommendations.

---

## 🗺️ Roadmap / Future Improvements

- [ ] Dark / Light theme toggle
- [ ] Multiple audit profiles (save/load named audits)
- [ ] Share results via URL hash state
- [ ] Progress chart over time (chart.js)
- [ ] AI-powered custom recommendations
- [ ] Chrome Extension version
- [ ] Real-time URL auditing with backend integration

---

## 🧪 Testing Checklist

- [x] Check and uncheck items → score updates correctly
- [x] Refresh page → checked state persists (localStorage)
- [x] Reset button → clears all items with confirmation
- [x] Export/Print → opens print dialog with formatted report
- [x] Filter tabs → shows correct category
- [x] Collapse cards → state persists across page refresh
- [x] Mobile layout → fully responsive at 375px width
- [x] Keyboard navigation → Tab, Enter, Space all work

---

## 👤 Author

**[Your Name]**  
Portfolio: [yourportfolio.com](https://yourportfolio.com)  
GitHub: [@yourusername](https://github.com/yourusername)  
LinkedIn: [linkedin.com/in/yourprofile](https://linkedin.com/in/yourprofile)

---

## 📄 License

MIT © [Your Name] — free to use, modify, and distribute.
