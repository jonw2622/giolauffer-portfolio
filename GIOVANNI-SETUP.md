# Giovanni's Setup Guide

> **For Claude Code:** When Giovanni opens this project for the first time, walk him through
> every step below before doing anything else. Be patient, warm, and encouraging.
> Giovanni is a world-class 3D artist — not a developer — and that's perfectly fine.
> He should never need to understand git, GitHub, or code to use this.
>
> **Communication rules during setup:**
> - Talk like you're helping a friend set up a new phone — casual, patient, zero jargon.
> - If a step fails, don't dump the error on him. Just say "Hmm, that didn't work. Let me try something else" and troubleshoot yourself.
> - If something needs to be installed, explain it as: "I need to set up a small tool first — takes about a minute."
> - If he needs to do something in a browser (like logging in), give him step-by-step "click this, then click that" directions.
> - If he gets impatient, say: "Almost done! Just a couple more quick things and you're set forever."
>
> After ALL checks pass, print exactly: **AWOOOOO, KITIN KITIN?**

---

## What To Tell Giovanni First

Say something like this (in your own words, keep it casual):

"Hey Gio! I'm going to be your assistant for making changes to your portfolio site.
You tell me what you want — like 'add my new project' or 'change the text on my homepage' —
and I do all the behind-the-scenes work. Then Jonny gives it a quick thumbs up, and your
site updates. Simple as that.

Before we get started, I need to do a quick one-time setup. Should take just a couple
minutes. You might need to log into something in your browser — I'll walk you through it.
Ready?"

---

## Setup Checklist

Run these checks yourself. Only involve Giovanni when he needs to do something
(like logging in via browser). Keep him updated with simple progress:
"Setting things up... checking your tools... almost there..."

### Step 1: Git installed?

```
git --version
```

**If missing:** Tell Giovanni: "I need to install a small tool called Git. It's what lets
me save and send your changes safely." Then guide him to https://git-scm.com/download/win —
tell him: "Click the big download button, open the file, and just keep clicking Next until
it's done. Then come back here." Restart Claude Code after.

### Step 2: Set up identity

```
git config user.name "Giovanni Lauffer"
git config user.email "giovanni@giovannilauffer.com"
```

Don't explain this. Just do it and say "Set up your name and email — you're good."

### Step 3: GitHub CLI installed?

```
gh --version
```

**If missing:** Tell Giovanni: "I need one more small tool so I can send your changes to
Jonny for approval." Install with `winget install --id GitHub.cli` if winget is available.
Otherwise guide him to https://cli.github.com — same deal: "Download, install, click Next
through everything."

### Step 4: Log into GitHub

```
gh auth status
```

**If not logged in:** Tell Giovanni: "I need you to log into GitHub real quick. A page will
open in your browser — just follow the steps there." Then run:

```
gh auth login
```

Walk him through each prompt:
- "Pick GitHub.com" (it's the first option)
- "Pick HTTPS" (first option again)
- "Say yes to authenticating with your GitHub credentials"
- "Pick 'Login with a web browser'"
- "It'll show you a code. Copy that code, and a browser page will open. Paste the code there and click Authorize."

**If Giovanni doesn't have a GitHub account:** Stop here and say: "Looks like you need a
GitHub account first. That's a Jonny thing — let's ping him to get that set up, and we can
finish this next time. Won't take long!"

### Step 5: Can we reach the project?

```
gh repo view jonw2622/giolauffer-portfolio --json name,url
```

**If this fails with "not found" or permission error:** Tell Giovanni: "Jonny needs to
give your GitHub account access to the project. I'll let him know — we can pick this up
right after." Stop setup here.

### Step 6: Is the project properly connected?

```
git remote -v
```

Should show `origin` pointing to the portfolio repo.

**If not cloned:** Tell Giovanni: "Let me download your project files real quick" and run:
```
git clone https://github.com/jonw2622/giolauffer-portfolio.git
cd giolauffer-portfolio
```

### Step 7: Clean starting point?

```
git status
```

Must be on `main` with clean working tree. If there are uncommitted changes, handle them
yourself (stash or discard if safe). Don't bother Giovanni with this unless you're unsure
whether changes matter.

### Step 8: Quick test

```
git checkout -b test/setup-verification && git checkout main && git branch -d test/setup-verification
```

If this works, git is fully functional.

---

## All Done!

When every step passes, say:

**AWOOOOO, KITIN KITIN?**

Then say something like:

"You're all set up! From now on, just tell me what you want to change on your site and
I'll handle everything. I'll always check with you before I do anything, and Jonny will
review everything before it goes live. Nothing can break, I promise.

Here's the kind of stuff you can ask me:
- 'Add my new project to the portfolio'
- 'Change the text that says [whatever] to [something else]'
- 'I have a new showreel video'
- 'Remove that old project I don't want anymore'
- 'The site looks weird on my phone' (I'll investigate)

Just talk to me like a normal person. I'll figure out the rest."

---

## Troubleshooting (for Claude, not Giovanni)

| Problem | Fix |
|---|---|
| Git not found after install | Ask Giovanni to close and reopen the Claude app |
| gh auth fails | Try `gh auth login --web` as fallback |
| Permission denied on repo | Giovanni needs collaborator access — Jonny must add him at github.com/jonw2622/giolauffer-portfolio/settings/access |
| Clone fails | Check internet connection, try HTTPS explicitly |
| On wrong branch | `git checkout main && git pull origin main` |
| Dirty working tree | `git stash` if changes look intentional, otherwise `git checkout .` |
