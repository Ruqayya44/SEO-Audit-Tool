# SEO Audit Tool — Advanced Backend 🐍

Flask API that auto-audits a live URL using **Requests** + **BeautifulSoup4**.

---

## Endpoints

| Method | Path | Body | Description |
|--------|------|------|-------------|
| POST | `/audit` | `{"url": "https://example.com"}` | Full SEO audit of a URL |
| GET | `/health` | — | Health check |

## Response Example

```json
{
  "url": "https://example.com",
  "status_code": 200,
  "score": 75,
  "title": {
    "text": "Example Domain",
    "length": 14,
    "status": "too_short",
    "recommendation": "⚠️ Title is too short (14 chars). Aim for 50–60."
  },
  "meta_description": { ... },
  "headings": { "h1_count": 1, "h2_count": 2, ... },
  "images": { "total": 3, "alt_coverage_pct": 100, ... },
  "links": { "internal_count": 5, "external_count": 2, ... },
  "canonical": { "present": true, "value": "https://example.com/" },
  "robots_meta": { "is_indexable": true, ... },
  "https": { "final_https": true, "status": "ok", ... }
}
```

---

## Local Setup

```bash
# 1. Create and activate virtual environment
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Create .env file
cp .env.example .env

# 4. Run development server
python app.py
# → http://localhost:5000

# 5. Test the API
curl -X POST http://localhost:5000/audit \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

---

## Environment Variables

Create a `.env` file:

```env
PORT=5000
FLASK_DEBUG=false
```

---

## Production Deployment (Render / Railway)

### Render
1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repo
3. Build command: `pip install -r requirements.txt`
4. Start command: `gunicorn app:app --bind 0.0.0.0:$PORT`
5. Add environment variables in the Render dashboard

### Railway
1. `railway login`
2. `railway init`
3. `railway up`
4. Set `PORT` env var in the Railway dashboard

---

## CORS

CORS is enabled for all origins by default via `flask-cors`. To restrict to your frontend domain, modify `app.py`:

```python
CORS(app, origins=["https://yourdomain.com"])
```
