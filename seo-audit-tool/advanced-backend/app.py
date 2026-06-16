"""
SEO Audit Tool — Advanced Backend
Flask API that scrapes a URL and returns SEO audit data.

Endpoints:
    POST /audit    { "url": "https://example.com" }
    GET  /health
"""

# pyrefly: ignore [missing-import]
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
# pyrefly: ignore [missing-import]
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urljoin
import re
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (compatible; SEOAuditBot/1.0; "
        "+https://github.com/yourusername/seo-audit-tool)"
    )
}
TIMEOUT = 12  # seconds


# ─── Helpers ────────────────────────────────────────────────

def fetch_page(url: str):
    """Fetch URL and return (response, soup) or raise."""
    resp = requests.get(url, headers=HEADERS, timeout=TIMEOUT, allow_redirects=True)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")
    return resp, soup


def analyse_title(soup) -> dict:
    tag = soup.find("title")
    text = tag.get_text(strip=True) if tag else ""
    length = len(text)
    return {
        "text": text,
        "length": length,
        "status": "ok" if 50 <= length <= 60 else ("too_short" if length < 50 else "too_long"),
        "recommendation": (
            "✅ Title length is ideal (50–60 chars)." if 50 <= length <= 60
            else f"⚠️ Title is {'too short' if length < 50 else 'too long'} ({length} chars). Aim for 50–60."
        ),
    }


def analyse_meta_description(soup) -> dict:
    tag = soup.find("meta", attrs={"name": re.compile(r"description", re.I)})
    text = tag.get("content", "").strip() if tag else ""
    length = len(text)
    return {
        "text": text,
        "length": length,
        "status": "ok" if 140 <= length <= 160 else ("missing" if length == 0 else "suboptimal"),
        "recommendation": (
            "✅ Meta description length is ideal." if 140 <= length <= 160
            else "🚨 Meta description is missing." if length == 0
            else f"⚠️ Meta description is {length} chars. Aim for 140–160."
        ),
    }


def analyse_headings(soup) -> dict:
    h1_tags = soup.find_all("h1")
    h2_tags = soup.find_all("h2")
    h3_tags = soup.find_all("h3")
    h1_count = len(h1_tags)
    h1_texts = [h.get_text(strip=True) for h in h1_tags]
    return {
        "h1_count": h1_count,
        "h1_texts": h1_texts,
        "h2_count": len(h2_tags),
        "h3_count": len(h3_tags),
        "status": "ok" if h1_count == 1 else ("missing" if h1_count == 0 else "multiple"),
        "recommendation": (
            "✅ Page has exactly one H1 — perfect." if h1_count == 1
            else "🚨 Page has no H1 tag." if h1_count == 0
            else f"⚠️ Page has {h1_count} H1 tags — use only one."
        ),
    }


def analyse_images(soup, base_url: str) -> dict:
    images = soup.find_all("img")
    total = len(images)
    missing_alt = [
        urljoin(base_url, img.get("src", ""))
        for img in images
        if not img.get("alt")
    ]
    coverage = round((1 - len(missing_alt) / total) * 100, 1) if total > 0 else 100
    return {
        "total": total,
        "missing_alt_count": len(missing_alt),
        "alt_coverage_pct": coverage,
        "missing_alt_srcs": missing_alt[:10],  # limit output
        "status": "ok" if coverage >= 95 else ("poor" if coverage < 70 else "partial"),
        "recommendation": (
            "✅ All images have alt text." if coverage == 100
            else f"⚠️ {len(missing_alt)} of {total} images ({100 - coverage:.0f}%) are missing alt text."
        ),
    }


def analyse_links(soup, base_url: str) -> dict:
    parsed_base = urlparse(base_url)
    all_links = soup.find_all("a", href=True)
    internal, external = [], []
    for a in all_links:
        href = a["href"].strip()
        if href.startswith("#") or href.startswith("mailto:") or href.startswith("tel:"):
            continue
        full = urljoin(base_url, href)
        parsed = urlparse(full)
        if parsed.netloc == parsed_base.netloc:
            internal.append(full)
        else:
            external.append(full)
    return {
        "internal_count": len(internal),
        "external_count": len(external),
        "total_count": len(internal) + len(external),
        "sample_internal": internal[:5],
        "sample_external": external[:5],
        "recommendation": (
            "⚠️ No internal links found — add links to related pages."
            if len(internal) == 0
            else f"✅ {len(internal)} internal links and {len(external)} external links found."
        ),
    }


def analyse_canonical(soup) -> dict:
    tag = soup.find("link", rel="canonical")
    href = tag.get("href", "").strip() if tag else ""
    return {
        "present": bool(href),
        "value": href,
        "recommendation": (
            f"✅ Canonical tag found: {href}" if href
            else "⚠️ No canonical tag found. Add <link rel='canonical'> to prevent duplicate content."
        ),
    }


def analyse_robots_meta(soup) -> dict:
    tag = soup.find("meta", attrs={"name": re.compile(r"robots", re.I)})
    content = tag.get("content", "").strip() if tag else ""
    is_blocked = any(k in content.lower() for k in ("noindex", "none"))
    return {
        "present": bool(content),
        "content": content,
        "is_indexable": not is_blocked,
        "recommendation": (
            "🚨 Page is set to NOINDEX — it will not appear in search results!" if is_blocked
            else "✅ Page is indexable." if content
            else "ℹ️ No robots meta tag — page defaults to indexable (fine for most pages)."
        ),
    }


def analyse_https(url: str, response) -> dict:
    used_https = url.startswith("https://")
    final_https = response.url.startswith("https://")
    return {
        "requested_https": used_https,
        "final_https": final_https,
        "status": "ok" if final_https else "fail",
        "recommendation": (
            "✅ Site uses HTTPS." if final_https
            else "🚨 Site does not use HTTPS. This is a ranking signal and trust indicator."
        ),
    }


def score_from_audit(audit: dict) -> int:
    """Calculate a simple 0–100 score from audit results."""
    points = 0
    checks = [
        audit["title"]["status"] == "ok",
        audit["meta_description"]["status"] == "ok",
        audit["headings"]["status"] == "ok",
        audit["images"]["alt_coverage_pct"] >= 95,
        audit["links"]["internal_count"] > 0,
        audit["canonical"]["present"],
        not audit["robots_meta"].get("is_indexable") is False,
        audit["https"]["final_https"],
    ]
    points = sum(checks)
    return round((points / len(checks)) * 100)


# ─── Routes ─────────────────────────────────────────────────

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "SEO Audit API"}), 200


@app.route("/audit", methods=["POST"])
def audit():
    data = request.get_json(force=True, silent=True) or {}
    url  = (data.get("url") or "").strip()

    if not url:
        return jsonify({"error": "URL is required."}), 400

    # Normalise — add https:// if scheme missing
    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    try:
        resp, soup = fetch_page(url)
    except requests.exceptions.Timeout:
        return jsonify({"error": "Request timed out. The site took too long to respond."}), 504
    except requests.exceptions.TooManyRedirects:
        return jsonify({"error": "Too many redirects."}), 400
    except requests.exceptions.HTTPError as e:
        return jsonify({"error": f"HTTP error: {e}"}), 502
    except Exception as e:
        return jsonify({"error": f"Could not fetch URL: {str(e)}"}), 500

    audit_result = {
        "url":              resp.url,
        "status_code":      resp.status_code,
        "title":            analyse_title(soup),
        "meta_description": analyse_meta_description(soup),
        "headings":         analyse_headings(soup),
        "images":           analyse_images(soup, resp.url),
        "links":            analyse_links(soup, resp.url),
        "canonical":        analyse_canonical(soup),
        "robots_meta":      analyse_robots_meta(soup),
        "https":            analyse_https(url, resp),
    }
    audit_result["score"] = score_from_audit(audit_result)

    return jsonify(audit_result), 200


# ─── Entry point ─────────────────────────────────────────────
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    app.run(host="0.0.0.0", port=port, debug=debug)
