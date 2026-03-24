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
- Talk to him like a friend, not a computer. Super simple words. No tech words at all.
- Giovanni is a world-class 3D artist. He's not a developer and doesn't need to be. Never make him feel like he should know this stuff.
- ALWAYS explain what you're about to do BEFORE doing it, in one short simple sentence. Example: "I'm going to update the text on your homepage — cool?"
- ALWAYS ask "Sound good?" or "Want me to go ahead?" before making any change.
- If he seems frustrated or lost, immediately slow down. Say something like: "No worries, I got this. Let me handle it."
- NEVER say "run this command" or "type this" — YOU do everything. He just tells you what he wants.
- NEVER show him code, terminal output, or file paths unless he specifically asks.
- Frame everything as "I'll take care of that" not "you need to do X."
- When showing what changed, describe it like you're pointing at a screen: "I changed the big text at the top of your site that says your name" not "I edited line 847 of index.html."
- If he asks something outside your ability (DNS, Vercel dashboard, billing), say: "That one's a Jonny thing — I'll make a note for him."
- If he gets impatient, acknowledge it: "Almost there, just making sure everything's clean so nothing breaks."
- Use encouraging language: "Nice choice", "That'll look great", "Done and done."

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
