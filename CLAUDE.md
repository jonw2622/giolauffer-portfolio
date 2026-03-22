# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML portfolio site for Giovanni Lauffer (3D Artist), deployed on Vercel free tier. The site is a single self-contained HTML file with inline CSS/JS — no build step, no framework, no dependencies.

- **Live:** https://giovannilauffer.com (redirects to www)
- **Preview:** https://giolauffer-portfolio.vercel.app
- **GitHub:** github.com/jonw2622/giolauffer-portfolio
- **Vercel project:** jonw2622s-projects/giolauffer-portfolio

## Architecture

```
public/
  index.html              ← The entire site (1627 lines, inline CSS + JS)
  ts-rewind-2k-v3.mp4     ← Hero reel video
  wp-content/uploads/     ← All media assets (WebP images, MP4 videos, MP3 audio)
vercel.json               ← Output dir = public, cache headers for assets
.vercelignore             ← Excludes site/, backups/, .git/ from deploys
```

All code lives in `public/index.html`. There is no separate CSS, JS, or component structure. The site has three main sections rendered via JS: Home (video reel + about + work), Portfolio (project cards grid), and Post (project detail with gallery/lightbox).

## Deployment

Push to `main` auto-deploys to production via Vercel GitHub integration. No build command — Vercel serves `public/` as static files.

## Assets

- Images are WebP (converted from PNG/JPG via cwebp, quality 82)
- Videos compressed with ffmpeg (H.264 CRF 26, `-movflags +faststart`)
- ~12 images kept as original JPG/PNG where WebP was larger
- Original unoptimized assets backed up in `backups/original-assets-unoptimized.zip` (gitignored)
- Asset URLs in HTML are relative (`/wp-content/uploads/...`), not absolute

## DNS & Email

Domain managed at Hover.com with nameservers `ns1.hover.com` / `ns2.hover.com`. MX record (`mx.hover.com.cust.hostedemail.com`) handles email for `@giovannilauffer.com` — do not modify or delete MX/mail DNS records.

## Key Gotchas

- The `site/` directory contains the original WordPress backup (2.5GB) and Giovanni's original HTML file — it is gitignored
- The wildcard `*` A record at Hover also points to Vercel (`216.198.79.1`)
- Google Fonts are loaded from CDN (Barlow Condensed, Bebas Neue, Inter, DM Mono)
- YouTube embeds use `youtube-nocookie.com`
- Custom cursor replaces default (`cursor:none` on body)
- Background music requires user click to play (browser autoplay policy)
