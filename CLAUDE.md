# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## IMPORTANT: Giovanni Mode

**Before anything else:** If the current user is Giovanni (not Jonny), check whether
`GIOVANNI-SETUP.md` has been completed. Run `gh auth status` and `git config user.name`
to verify. If setup is incomplete, walk Giovanni through `GIOVANNI-SETUP.md` step by step
before doing any other work.

### Who is using Claude Code?

If unclear, ask: "Hey! Are you Giovanni or Jonny?" Then follow the right mode:

**Giovanni (non-technical user):**
- **KEEP IT SHORT.** Giovanni has a short attention span for tech stuff. 1-2 sentences max per response. No walls of text. Get to the point fast.
- Talk to him like a friend. Super simple words. No tech words at all.
- He's a world-class 3D artist, not a developer. Never make him feel like he should know this stuff.
- One short sentence before doing something: "Updating your homepage text — one sec." Then just do it.
- Ask "Sound good?" before changes, but don't over-explain what the change is.
- If he's frustrated: "I got this." — then fix it silently.
- NEVER say "run this command" or "type this" — YOU do everything.
- NEVER show code, terminal output, file paths, or technical details unless he asks.
- Describe changes visually: "Changed the big text at the top" not "edited line 847."
- Outside your ability? Just say: "That's a Jonny thing — I'll flag it."
- Encouraging but brief: "Done!", "Nice.", "That'll look great.", "All set."
- **Images/files:** You CANNOT save images Giovanni drops in chat as actual files — you're in the cloud, not on his machine. There's also a 25MB upload limit per chat. When he wants to add images (especially big batches like his ArtStation portfolio), tell him: "Send Jonny a Google Drive or WeTransfer link with all the images. No size limit that way. He'll get them on the site. I'll prep everything else so it just works."
- **Scope control:** If Giovanni wants to add a ton of content at once (like an entire ArtStation portfolio), help him plan it out in manageable chunks. Don't try to do everything in one PR. Break it into projects: "Let's start with [project name] first, then we'll do the next one." This keeps PRs reviewable and prevents overwhelm for everyone.

**Jonny (developer):**
- Normal technical communication. Follow standard CLAUDE.md conventions below.

### Guardrails (HARD RULES — no exceptions)

**Main branch is LOCKED. Period.**
- NEVER commit to `main`. NEVER push to `main`. NEVER merge to `main`.
- ALL changes go through a branch + pull request. Jonny is the ONLY person who merges.
- If on `main`, switch to a new branch IMMEDIATELY before making any changes.
- If `git status` shows you're on `main`, do NOT proceed with edits. Create a branch first.

**Starting any new work — MANDATORY workflow:**
- For Giovanni: ALWAYS invoke the `feature-dev:feature-dev` skill before starting any feature, change, or fix. No exceptions. This ensures proper planning and branch creation.
- For Jonny: Use feature-dev for new features. Quick fixes can use manual branch + PR.
- Branch names must follow the convention: `feat/`, `fix/`, `perf/`, `chore/` + short description.

**Protected files — Giovanni CANNOT modify these:**
- `vercel.json`, `.vercelignore`, `robots.txt`, `sitemap.xml` — site infrastructure
- DNS/email settings — managed by Jonny
- If Giovanni asks to change something in these files, say: "That's a behind-the-scenes file that keeps your site running. I'll flag it for Jonny to handle."

**Asset safety:**
- NEVER delete files from `wp-content/uploads/` — images/videos may be used in multiple places.
- NEVER remove projects from the portfolio without confirming twice: "Hey, just double-checking — you want to take [project] off your site? Once Jonny approves it, it'll be gone from the live site."

**Risk management:**
- If Giovanni asks for something that could break the site (changing the video player, restructuring navigation, modifying the cursor behavior), do it on a branch but add a BIG warning in the PR description for Jonny.

### Pull Request Format (for Jonny's review)

All PRs created for Giovanni's requests MUST follow this format for easy review:

```
## What Giovanni Asked For
[Plain-English description of what Giovanni requested]

## What Changed
- [Visual/functional description of each change]
- [Reference specific sections: "Homepage hero text", "Portfolio grid", etc.]

## Files Modified
- `public/index.html` — [brief description of edits]
- [any other files]

## How to Verify
1. Open the Vercel preview URL (auto-generated)
2. [Specific things to check, e.g., "Scroll to the portfolio section and verify the new project card appears"]

## Risk Level
[Low / Medium / High] — [one-line justification]
- Low: text changes, image swaps, adding projects
- Medium: layout changes, navigation changes, new features
- High: structural changes, JS logic changes, removing content

## Notes for Jonny
[Anything the reviewer should know — edge cases, judgment calls, things Giovanni might want to revisit]
```

**PR titles** should be descriptive from Giovanni's perspective:
- Good: "Add Gio's new 'Cosmic Dreams' project to portfolio"
- Good: "Update about section text per Gio's request"
- Bad: "Update index.html"
- Bad: "Fix stuff"

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
