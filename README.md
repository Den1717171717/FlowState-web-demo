# FlowState Web Onboarding Demo

Interactive demo of all 30 FlowState onboarding screens.  
Works on **Android, iPhone, Windows, desktop — any browser, no install required**.

## 🚀 Deploy to GitHub Pages (5 min)

### 1. Create a new GitHub repo

Go to [github.com/new](https://github.com/new) and create a repo named `flowstate-demo` (or anything you want).

### 2. Push this folder

```bash
cd flowstate-web-demo
git init
git add .
git commit -m "FlowState web demo"
git remote add origin https://github.com/YOUR_USERNAME/flowstate-demo.git
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repo → **Settings** → **Pages**
2. Under **Source**, select `main` branch → `/ (root)` folder
3. Click **Save**

Your demo will be live at:
```
https://YOUR_USERNAME.github.io/flowstate-demo/
```

(Takes ~2 minutes to go live after saving.)

### 4. Share the link

Send the URL to anyone — they open it in their browser on any device. Done.

---

## 📱 What's included

All 30 onboarding screens:

| # | Screen |
|---|--------|
| 0 | Welcome — cycle ring, Build My Profile CTA |
| 1 | Feature slides (5 swipeable slides) |
| 2 | Sign in (Apple / Email / Guest) |
| 3 | Name input |
| 4 | Date of birth |
| 5 | Cycle info intro |
| 6 | Hormonal contraception (yes/no) |
| 7 | Contraception type |
| 8 | Regular bleed (yes/no) |
| 9 | Last period date |
| 10 | Average cycle length (stepper) |
| 11 | Average bleeding days (stepper) |
| 12 | Timeline plan |
| 13 | Weight (stepper) |
| 14 | Height (stepper) |
| 15 | Activity level |
| 16 | Training goal |
| 17 | Pain points (multi-select) |
| 18 | Today check-in intro |
| 19 | Mood / readiness slider |
| 20 | AI plan generation (animated, 8s) |
| 21 | Transition splash |
| 22 | Plan roadmap (phase-synced) |
| 23 | Goal synthesis |
| 24 | Referral source |
| 25 | Social proof + reviews |
| 26 | Notifications setup |
| 27 | Streak kickoff + confetti |
| 28 | Trial reminder timeline |
| 29 | Paywall (monthly/yearly toggle) |

---

## 🎨 Design

- Clinical-Warm Sage palette (matches `DESIGN.md` exactly)
- SF Pro / Inter typography
- Smooth slide transitions (350ms easeInOut)
- Phone frame on desktop, full-screen on mobile
- Haptic feedback on mobile (vibration API)
