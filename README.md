# 🍲 Kingdom Academy — DIY Hotpot Cafe

AI-assisted DIY hotpot cafe + 2-Year Traineeship (earn while you learn).
Inspired by the **Kingdom Livelihood Academy** deck (G.R.O.W. model, Singapore HQ + Siem Reap training cafe).

Live pages: `index.html` • `menu.html` (Build-A-Bowl + broth finder + tray) • `interns.html` (2-Year Traineeship + application) • `about.html` (story + G.R.O.W.)

## Push to GitHub (3 steps)

This folder **is** your website repo. Push its *contents* to GitHub:

```powershell
cd "C:\Users\0473c\Documents\Isaac\Broad Vision\Cafe Website"
git init
git add .
git commit -m "Launch Kingdom Academy hotpot cafe"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

Then enable Pages:
1. GitHub repo → **Settings → Pages**
2. Source: **GitHub Actions** (workflow in `.github/workflows/deploy.yml` auto-deploys)
3. Your site goes live at `https://YOUR-USERNAME.github.io/YOUR-REPO/`

> The `↩ Broad Vision` buttons are external `file:///...` links to your Echo From Above site (works on your PC).
> When both sites are on GitHub Pages, swap them to the live `https://...` URL.

## Before you publish — fill these in

Search files for `[Your` placeholders:
- `index.html` → address, phone, email
- `interns.html` → allowance details, intake dates, Singapore vs Siem Reap placement
- `script.js` → `BROTHS`, `NOODLES`, `TOPPINGS`, `MENU` (names, prices)

## Make forms + payments real later

- **Traineeship form** (`interns.html`): demo only, saves to browser `localStorage`.
  Swap to Google Forms / Formspree / Basin for real submissions.
- **Tray checkout** (`menu.html`): demo only.
  Connect Stripe / PayNow QR when ready.
- **AI chat**: rule-based demo in `script.js → botReply()`.
  Swap to a real AI API later — same chatbox UI works.

## Run locally

Just double-click `index.html`.
