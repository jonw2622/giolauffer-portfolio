# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML portfolio site for Giovanni Lauffer (3D Artist), deployed on Vercel free tier. The site is a single self-contained HTML file with inline CSS/JS — no build step, no framework, no dependencies.

- **Live:** https://giovannilauffer.com (307 redirects to www)
- **Preview:** https://giolauffer-portfolio.vercel.app
- **GitHub:** github.com/jonw2622/giolauffer-portfolio
- **Vercel project:** jonw2622s-projects/giolauffer-portfolio (orgId: team_Kazatl1LjKfAbyNOSWaXx003)

## Architecture

```
public/
  index.html              ← The entire site (~1700 lines, inline CSS + JS)
  ts-rewind-2k-v3.mp4     ← Hero reel video (8.9MB, compressed)
  robots.txt              ← SEO: allows all crawlers
  sitemap.xml             ← SEO: single-page sitemap
  wp-content/uploads/     ← All media assets (WebP images, MP4 videos, MP3 audio)
vercel.json               ← Output dir = public, cache + security headers
.vercelignore             ← Excludes site/, backups/, .git/ from deploys
```

All code lives in `public/index.html`. There is no separate CSS, JS, or component structure. The site has three main JS-rendered sections: Home (video reel + about + work), Portfolio (CSS Grid cards), and Post (project detail with single-column gallery/lightbox).

JS uses `const B='/wp-content/uploads/'` as base path — portfolio data objects reference assets via `B+'path'`.

## Workflow

Use branch → PR → merge for all changes. Branch naming:
- `fix/` — something broken or wrong
- `feat/` — new functionality
- `perf/` — performance improvement
- `chore/` — maintenance, cleanup, docs

Push to `main` auto-deploys to production via Vercel GitHub integration. No build command — Vercel serves `public/` as static files.

## Assets

- Images are WebP (converted from PNG/JPG via cwebp, quality 82)
- Videos compressed with ffmpeg (H.264 CRF 26, `-movflags +faststart`)
- ~12 images kept as original JPG/PNG where WebP was larger
- Original unoptimized assets backed up in `backups/original-assets-unoptimized.zip` (gitignored)
- WordPress full backup at `site/wordpress/wp.26_77889.2026-03-18_00-25-02.tar.gz` (2.7GB, gitignored) — use for extracting missing assets
- Asset URLs in HTML are relative (`/wp-content/uploads/...`), not absolute
- When adding new images, convert to WebP with `cwebp -q 82 input.png -o output.webp`
- When adding new videos, compress with `ffmpeg -i input.mp4 -c:v libx264 -crf 26 -preset slow -c:a aac -b:a 128k -movflags +faststart output.mp4`

## Security & Headers

vercel.json includes security headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`. All `target="_blank"` links have `rel="noopener noreferrer"`.

Vercel Firewall has a bypass rule for owner IP (82.217.106.124). DDoS mitigation is automatic.

## DNS & Email

Domain managed at Hover.com with nameservers `ns1.hover.com` / `ns2.hover.com`. MX record (`mx.hover.com.cust.hostedemail.com`) handles email for `@giovannilauffer.com` — do not modify or delete MX/mail DNS records.

## Lighthouse Scores (as of 2026-03-22)

- Accessibility: 96, Best Practices: 100, SEO: 100
- LCP: 435ms, CLS: 0.00, TTFB: 97ms

## Key Gotchas

- The `site/` directory contains the original WordPress backup and Giovanni's original HTML file — gitignored
- The wildcard `*` A record at Hover also points to Vercel (`216.198.79.1`)
- Google Fonts loaded from CDN with `preconnect` hints (Barlow Condensed, Bebas Neue, Inter, DM Mono)
- YouTube embeds use `youtube-nocookie.com`
- Custom cursor replaces default (`cursor:none` on body), restored via `@media (prefers-reduced-motion: reduce)`
- Background music requires user click to play (browser autoplay policy)
- Contact buttons (Hire Me, Get in Touch, Contact Me) all use `mailto:giovanni@giovannilauffer.com`
