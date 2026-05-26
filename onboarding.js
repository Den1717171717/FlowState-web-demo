/* =============================================================
   FlowState Web Onboarding Demo — app.js
   Mirrors the iOS SwiftUI onboarding 1-to-1
   ============================================================= */

// ─── State ────────────────────────────────────────────────────
const state = {
  step: 0,
  totalSteps: 29,
  profile: {
    name: '',
    dob: '',
    hormonalContraception: null,
    contraceptionType: null,
    regularBleed: null,
    lastPeriodDate: '',
    averageCycleLength: 28,
    averageBleedingDays: 5,
    weightKG: 65,
    heightCM: 168,
    experience: null,
    trainingGoal: null,
    painPoints: [],
    innerCycleLevel: 3,
    selectedPlan: 'yearly',
    privacyConsent: false,
    termsConsent: false,
    notificationCount: 5,
  },
  isForward: true,
};

// ─── Steps with progress chrome ───────────────────────────────
const STEPS_WITH_PROGRESS = new Set([3,5,6,7,8,9,10,11,12,13,14,15,16,20,21]);
const STEPS_WITH_BACK     = new Set([3,5,6,7,8,9,10,11,12,13,14,15,16,17,20]);

// ─── Helpers ──────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const el = (tag, cls, html) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
};

function haptic() {
  if (navigator.vibrate) navigator.vibrate(10);
}

// ─── Navigation ───────────────────────────────────────────────
function next() {
  haptic();
  state.isForward = true;
  let delta = 1;
  // Skip ContraceptionType (step 7) if no hormonal contraception
  if (state.step === 6 && state.profile.hormonalContraception === false) delta = 2;
  goTo(state.step + delta);
}

function back() {
  haptic();
  state.isForward = false;
  let delta = 1;
  if (state.step === 8 && state.profile.hormonalContraception === false) delta = 2;
  goTo(Math.max(0, state.step - delta));
}

function goTo(newStep) {
  const container = $('screen-container');
  const oldScreen = container.querySelector('.screen');

  state.step = newStep;
  const newScreen = buildScreen(newStep);

  // Animate out old screen
  if (oldScreen) {
    oldScreen.classList.add(state.isForward ? 'exiting-left' : 'exiting-right');
    oldScreen.addEventListener('animationend', () => oldScreen.remove(), { once: true });
  }

  // Animate in new screen
  newScreen.classList.add(state.isForward ? 'entering-right' : 'entering-left');
  container.appendChild(newScreen);

  // Remove animation class after it plays
  newScreen.addEventListener('animationend', () => {
    newScreen.classList.remove('entering-right', 'entering-left');
  }, { once: true });
}

// ─── Screen Builder ───────────────────────────────────────────
function buildScreen(step) {
  const screens = {
    0:  buildWelcome,
    1:  buildFeatureSlides,
    2:  buildSignIn,
    3:  buildNameInput,
    4:  buildDateOfBirth,
    5:  buildCycleInfoIntro,
    6:  buildHormonalContraception,
    7:  buildContraceptionType,
    8:  buildRegularBleed,
    9:  buildLastPeriodDate,
    10: buildCycleLength,
    11: buildBleedingDays,
    12: buildTimelinePlan,
    13: buildWeight,
    14: buildHeight,
    15: buildActivityLevel,
    16: buildTrainingGoal,
    17: buildPainPoints,
    18: buildTodayCheckInIntro,
    19: buildMoodSlider,
    20: buildPlanGeneration,
    21: buildTransitionSplash,
    22: buildPlanRoadmap,
    23: buildGoalSynthesis,
    24: buildReferralSource,
    25: buildSocialProof,
    26: buildNotifications,
    27: buildStreakKickoff,
    28: buildTrialReminder,
    29: buildPaywall,
  };

  const builder = screens[step] || buildWelcome;
  return builder();
}

// ─── Chrome Builder ───────────────────────────────────────────
function buildChrome(screenEl) {
  const step = state.step;
  if (!STEPS_WITH_PROGRESS.has(step) && !STEPS_WITH_BACK.has(step)) return;

  const chrome = el('div', 'top-chrome');

  // Back button
  if (STEPS_WITH_BACK.has(step)) {
    const btn = el('button', 'back-btn', '‹');
    btn.setAttribute('aria-label', 'Go back');
    btn.addEventListener('click', back);
    chrome.appendChild(btn);
  } else {
    const spacer = el('div');
    spacer.style.cssText = 'width:44px;height:44px;flex-shrink:0';
    chrome.appendChild(spacer);
  }

  // Progress bar
  if (STEPS_WITH_PROGRESS.has(step)) {
    const wrap = el('div', 'progress-bar-wrap');
    const fill = el('div', 'progress-bar-fill');
    fill.style.width = `${(step / state.totalSteps) * 100}%`;
    wrap.appendChild(fill);
    chrome.appendChild(wrap);
  }

  screenEl.appendChild(chrome);
}

// ─── SCREEN 0: Welcome ────────────────────────────────────────
function buildWelcome() {
  const s = el('div', 'screen');
  s.style.alignItems = 'center';
  s.style.justifyContent = 'center';
  s.style.textAlign = 'center';
  s.style.padding = '0 24px';

  s.innerHTML = `
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;gap:0">
      <div class="cycle-ring fade-in" style="margin-bottom:28px">
        <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="80" cy="80" r="72" stroke="#EAE0E4" stroke-width="2"/>
          <circle cx="80" cy="8"  r="10" fill="#F49EAF"/>
          <circle cx="152" cy="80" r="8"  fill="#D9A055"/>
          <circle cx="80" cy="152" r="8"  fill="#9C7A8E"/>
          <circle cx="8"  cy="80" r="8"  fill="#7BA68B"/>
        </svg>
      </div>
      <div class="welcome-logo fade-in fade-in-d1">FlowState</div>
      <p class="fade-in fade-in-d2" style="font-size:18px;font-weight:500;color:#8E8689;margin-top:14px;max-width:280px;line-height:1.5">
        AI-generated gym workouts that match your cycle, your goals, your day.
      </p>
    </div>
    <div style="width:100%;padding:0 0 48px" class="fade-in fade-in-d3">
      <button class="btn-primary" id="btn-welcome">Build My Profile</button>
    </div>
  `;

  setTimeout(() => {
    s.querySelector('#btn-welcome')?.addEventListener('click', () => { haptic(); next(); });
  }, 0);
  return s;
}

// ─── SCREEN 1: Feature Slides ─────────────────────────────────
function buildFeatureSlides() {
  const s = el('div', 'screen');
  const slides = [
    { icon: '🏋️', title: 'Training that actually fits your cycle', body: 'FlowState doesn\'t just track your cycle. It builds the actual workout — sets, reps and load — around where your body is each day.' },
    { icon: '📊', title: 'Check in daily, train smarter instantly', body: 'Tell us how you feel today. Your session adapts in seconds based on your energy and readiness.' },
    { icon: '📈', title: 'An AI that learns your patterns', body: 'Every workout you rate teaches FlowState more about you, so suggestions get sharper over time.' },
    { icon: '🥗', title: 'Nutrition that follows your cycle too', body: 'Coming soon on Premium: recipe ideas tuned to your phase, your cravings and your goals.' },
    { icon: '🔒', title: 'Your cycle data is yours alone', body: 'Everything is encrypted and stored securely. We never sell or share your data.' },
  ];

  let current = 0;

  const render = () => {
    const slide = slides[current];
    const isLast = current === slides.length - 1;

    s.innerHTML = `
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 24px;text-align:center">
        <div class="feature-icon-wrap fade-in">${slide.icon}</div>
        <div style="height:40px"></div>
        <h2 class="fade-in fade-in-d1" style="font-size:26px;font-weight:700;color:#2D2628;max-width:300px;line-height:1.25;margin-bottom:16px">${slide.title}</h2>
        <p class="fade-in fade-in-d2" style="font-size:16px;color:#8E8689;max-width:280px;line-height:1.55">${slide.body}</p>
      </div>
      <div style="padding-bottom:8px">
        <div class="slide-dots" id="slide-dots">
          ${slides.map((_, i) => `<div class="slide-dot ${i === current ? 'active' : ''}"></div>`).join('')}
        </div>
        <div style="padding:0 24px 48px">
          <button class="btn-primary" id="btn-slide">${isLast ? 'Get started' : 'Continue'}</button>
        </div>
      </div>
    `;

    s.querySelector('#btn-slide')?.addEventListener('click', () => {
      haptic();
      if (current < slides.length - 1) {
        current++;
        render();
      } else {
        next();
      }
    });
  };

  render();
  return s;
}

// ─── SCREEN 2: Sign In ────────────────────────────────────────
function buildSignIn() {
  const s = el('div', 'screen');
  s.style.padding = '0';

  s.innerHTML = `
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 24px;text-align:center">
      <div style="font-size:52px;margin-bottom:24px" class="fade-in">🔑</div>
      <h1 class="screen-title fade-in fade-in-d1" style="text-align:center">Create your account</h1>
      <p class="screen-subtitle fade-in fade-in-d2" style="text-align:center">Your cycle data stays private and encrypted. Always.</p>
      
      <div style="width:100%;margin-bottom:12px" class="fade-in fade-in-d3">
        <button class="btn-primary" id="btn-apple" style="background:#2D2628;color:#FFF7F9;gap:10px">
          <span style="font-size:20px"></span> Continue with Apple
        </button>
      </div>
      <div style="width:100%" class="fade-in fade-in-d4">
        <button class="btn-primary" id="btn-email" style="background:#FFFFFF;border:1.5px solid #EAE0E4;color:#2D2628">
          Continue with Email
        </button>
      </div>
    </div>
    <div style="padding:0 24px 48px">
      <button class="btn-secondary" id="btn-guest">Skip for now →</button>
    </div>
  `;

  setTimeout(() => {
    s.querySelector('#btn-apple')?.addEventListener('click', () => { haptic(); next(); });
    s.querySelector('#btn-email')?.addEventListener('click', () => { haptic(); next(); });
    s.querySelector('#btn-guest')?.addEventListener('click', () => { haptic(); next(); });
  }, 0);
  return s;
}

// ─── SCREEN 3: Name Input ─────────────────────────────────────
function buildNameInput() {
  const s = el('div', 'screen');
  buildChrome(s);

  const body = el('div', 'screen-body has-chrome');
  body.innerHTML = `
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding-top:24px">
      <p class="screen-label fade-in">Your name</p>
      <h1 class="screen-title fade-in fade-in-d1">What should we<br>call you?</h1>
      <input class="text-input fade-in fade-in-d2" id="name-input" type="text" placeholder="First name" autocomplete="given-name" value="${state.profile.name}" />
      <p style="font-size:13px;color:#8E8689;margin-top:12px" class="fade-in fade-in-d3">Used to personalise your plan. Not shared.</p>
    </div>
  `;
  s.appendChild(body);

  const footer = el('div', 'cta-footer');
  footer.innerHTML = `<button class="btn-primary" id="btn-name" ${!state.profile.name ? 'disabled' : ''}>Continue</button>`;
  s.appendChild(footer);

  setTimeout(() => {
    const input = s.querySelector('#name-input');
    const btn   = s.querySelector('#btn-name');

    input.addEventListener('input', () => {
      state.profile.name = input.value.trim();
      btn.disabled = !state.profile.name;
    });

    btn.addEventListener('click', () => {
      if (state.profile.name) { haptic(); next(); }
    });

    // Auto-focus after animation
    setTimeout(() => input.focus(), 400);
  }, 0);

  return s;
}

// ─── SCREEN 4: Date of Birth ──────────────────────────────────
function buildDateOfBirth() {
  const s = el('div', 'screen');
  buildChrome(s);

  const body = el('div', 'screen-body has-chrome');
  body.innerHTML = `
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding-top:24px">
      <p class="screen-label fade-in">About you</p>
      <h1 class="screen-title fade-in fade-in-d1">When were you born?</h1>
      <p class="screen-subtitle fade-in fade-in-d2">Helps us calibrate your plan and phase predictions.</p>
      <input class="date-input fade-in fade-in-d3" id="dob-input" type="date" value="${state.profile.dob}" max="${new Date().toISOString().split('T')[0]}" />
    </div>
  `;
  s.appendChild(body);

  const footer = el('div', 'cta-footer');
  footer.innerHTML = `<button class="btn-primary" id="btn-dob" ${!state.profile.dob ? 'disabled' : ''}>Continue</button>`;
  s.appendChild(footer);

  setTimeout(() => {
    const input = s.querySelector('#dob-input');
    const btn   = s.querySelector('#btn-dob');
    input.addEventListener('change', () => {
      state.profile.dob = input.value;
      btn.disabled = !input.value;
    });
    btn.addEventListener('click', () => { if (state.profile.dob) { haptic(); next(); } });
  }, 0);

  return s;
}

// ─── SCREEN 5: Cycle Info Intro ───────────────────────────────
function buildCycleInfoIntro() {
  const s = el('div', 'screen');
  buildChrome(s);

  s.innerHTML += `
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:110px 24px 0;text-align:center">
      <div style="font-size:72px;margin-bottom:24px" class="fade-in">🌙</div>
      <h1 class="screen-title fade-in fade-in-d1" style="text-align:center">Now, let's talk<br>about your cycle</h1>
      <p class="screen-subtitle fade-in fade-in-d2" style="text-align:center;max-width:280px">This is what makes FlowState different. Your training adapts to each phase.</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:8px" class="fade-in fade-in-d3">
        <span class="stat-chip">🔴 Menstrual</span>
        <span class="stat-chip" style="color:#7BA68B">🌱 Follicular</span>
        <span class="stat-chip" style="color:#D9A055">☀️ Ovulatory</span>
        <span class="stat-chip" style="color:#9C7A8E">🌙 Luteal</span>
      </div>
    </div>
    <div class="cta-footer">
      <button class="btn-primary" id="btn-ci">Got it</button>
    </div>
  `;

  setTimeout(() => {
    s.querySelector('#btn-ci')?.addEventListener('click', () => { haptic(); next(); });
  }, 0);
  return s;
}

// ─── SCREEN 6: Hormonal Contraception ────────────────────────
function buildHormonalContraception() {
  const s = el('div', 'screen');
  buildChrome(s);

  const body = el('div', 'screen-body has-chrome');
  body.innerHTML = `
    <div style="padding-top:24px">
      <p class="screen-label fade-in">Cycle tracking</p>
      <h1 class="screen-title fade-in fade-in-d1">Do you use hormonal contraception?</h1>
      <p class="screen-subtitle fade-in fade-in-d2">This shapes how we predict your phases.</p>
      <div id="options-hc" class="fade-in fade-in-d3">
        <button class="option-card ${state.profile.hormonalContraception === true ? 'selected' : ''}" data-val="yes">
          <span class="option-card-emoji">✓</span>
          <span class="option-card-text"><span class="option-card-label">Yes</span><span class="option-card-sub">I use hormonal contraception</span></span>
          <span class="option-card-check">${state.profile.hormonalContraception === true ? '✓' : ''}</span>
        </button>
        <button class="option-card ${state.profile.hormonalContraception === false ? 'selected' : ''}" data-val="no">
          <span class="option-card-emoji">✗</span>
          <span class="option-card-text"><span class="option-card-label">No</span><span class="option-card-sub">No hormonal contraception</span></span>
          <span class="option-card-check">${state.profile.hormonalContraception === false ? '✓' : ''}</span>
        </button>
      </div>
    </div>
  `;
  s.appendChild(body);

  setTimeout(() => {
    s.querySelectorAll('.option-card').forEach(card => {
      card.addEventListener('click', () => {
        haptic();
        state.profile.hormonalContraception = card.dataset.val === 'yes';
        setTimeout(() => next(), 250);
      });
    });
  }, 0);
  return s;
}

// ─── SCREEN 7: Contraception Type ────────────────────────────
function buildContraceptionType() {
  const s = el('div', 'screen');
  buildChrome(s);

  const types = [
    { val: 'pill',         emoji: '💊', label: 'Combined pill',       sub: 'Estrogen + progestin' },
    { val: 'mini-pill',    emoji: '💊', label: 'Mini pill',           sub: 'Progestin only' },
    { val: 'iud-hormonal', emoji: '🔵', label: 'Hormonal IUD',        sub: 'e.g. Mirena' },
    { val: 'implant',      emoji: '📌', label: 'Implant',             sub: 'e.g. Nexplanon' },
    { val: 'injection',    emoji: '💉', label: 'Injection',           sub: 'e.g. Depo-Provera' },
    { val: 'patch',        emoji: '🩹', label: 'Patch',               sub: 'Hormonal patch' },
    { val: 'ring',         emoji: '⭕', label: 'Vaginal ring',        sub: 'e.g. NuvaRing' },
  ];

  const body = el('div', 'screen-body has-chrome');
  body.innerHTML = `
    <div style="padding-top:24px">
      <p class="screen-label fade-in">Contraception type</p>
      <h1 class="screen-title fade-in fade-in-d1">Which type do you use?</h1>
      <div class="fade-in fade-in-d2">
        ${types.map(t => `
          <button class="option-card ${state.profile.contraceptionType === t.val ? 'selected' : ''}" data-val="${t.val}">
            <span class="option-card-emoji">${t.emoji}</span>
            <span class="option-card-text">
              <span class="option-card-label">${t.label}</span>
              <span class="option-card-sub">${t.sub}</span>
            </span>
            <span class="option-card-check">${state.profile.contraceptionType === t.val ? '✓' : ''}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
  s.appendChild(body);

  setTimeout(() => {
    s.querySelectorAll('.option-card').forEach(card => {
      card.addEventListener('click', () => {
        haptic();
        state.profile.contraceptionType = card.dataset.val;
        setTimeout(() => next(), 250);
      });
    });
  }, 0);
  return s;
}

// ─── SCREEN 8: Regular Bleed ──────────────────────────────────
function buildRegularBleed() {
  const s = el('div', 'screen');
  buildChrome(s);

  const body = el('div', 'screen-body has-chrome');
  body.innerHTML = `
    <div style="padding-top:24px">
      <p class="screen-label fade-in">Your cycle</p>
      <h1 class="screen-title fade-in fade-in-d1">Do you have regular periods?</h1>
      <p class="screen-subtitle fade-in fade-in-d2">Helps us detect irregularities and flag them for you.</p>
      <div class="fade-in fade-in-d3">
        <button class="option-card ${state.profile.regularBleed === true ? 'selected' : ''}" data-val="yes">
          <span class="option-card-emoji">📅</span>
          <span class="option-card-text"><span class="option-card-label">Yes, fairly regular</span><span class="option-card-sub">Cycle varies by less than a week</span></span>
          <span class="option-card-check">${state.profile.regularBleed === true ? '✓' : ''}</span>
        </button>
        <button class="option-card ${state.profile.regularBleed === false ? 'selected' : ''}" data-val="no">
          <span class="option-card-emoji">🔀</span>
          <span class="option-card-text"><span class="option-card-label">No, irregular</span><span class="option-card-sub">Cycle length varies a lot</span></span>
          <span class="option-card-check">${state.profile.regularBleed === false ? '✓' : ''}</span>
        </button>
      </div>
    </div>
  `;
  s.appendChild(body);

  setTimeout(() => {
    s.querySelectorAll('.option-card').forEach(card => {
      card.addEventListener('click', () => {
        haptic();
        state.profile.regularBleed = card.dataset.val === 'yes';
        setTimeout(() => next(), 250);
      });
    });
  }, 0);
  return s;
}

// ─── SCREEN 9: Last Period Date ───────────────────────────────
function buildLastPeriodDate() {
  const s = el('div', 'screen');
  buildChrome(s);

  const body = el('div', 'screen-body has-chrome');
  body.innerHTML = `
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding-top:24px">
      <p class="screen-label fade-in">Cycle start</p>
      <h1 class="screen-title fade-in fade-in-d1">When did your last period start?</h1>
      <p class="screen-subtitle fade-in fade-in-d2">This seeds your first cycle in FlowState.</p>
      <input class="date-input fade-in fade-in-d3" id="period-date" type="date" value="${state.profile.lastPeriodDate}" max="${new Date().toISOString().split('T')[0]}" />
    </div>
  `;
  s.appendChild(body);

  const footer = el('div', 'cta-footer');
  footer.innerHTML = `<button class="btn-primary" id="btn-period" ${!state.profile.lastPeriodDate ? 'disabled' : ''}>Continue</button>`;
  s.appendChild(footer);

  setTimeout(() => {
    const input = s.querySelector('#period-date');
    const btn   = s.querySelector('#btn-period');
    input.addEventListener('change', () => {
      state.profile.lastPeriodDate = input.value;
      btn.disabled = !input.value;
    });
    btn.addEventListener('click', () => { if (state.profile.lastPeriodDate) { haptic(); next(); } });
  }, 0);
  return s;
}

// ─── SCREEN 10: Average Cycle Length ─────────────────────────
function buildCycleLength() {
  const s = el('div', 'screen');
  buildChrome(s);

  const body = el('div', 'screen-body has-chrome');
  body.innerHTML = `
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding-top:24px">
      <p class="screen-label fade-in">Cycle length</p>
      <h1 class="screen-title fade-in fade-in-d1">Average cycle length?</h1>
      <p class="screen-subtitle fade-in fade-in-d2">Day 1 of your period to day 1 of your next.</p>
      <div class="number-stepper fade-in fade-in-d3">
        <button class="stepper-btn" id="btn-cl-minus">−</button>
        <div>
          <div class="stepper-value" id="cl-value">${state.profile.averageCycleLength}</div>
          <div class="stepper-unit">days</div>
        </div>
        <button class="stepper-btn" id="btn-cl-plus">+</button>
      </div>
      <p style="font-size:13px;color:#8E8689;text-align:center" class="fade-in fade-in-d4">Typical range: 21–35 days</p>
    </div>
  `;
  s.appendChild(body);

  const footer = el('div', 'cta-footer');
  footer.innerHTML = `<button class="btn-primary" id="btn-cl">Continue</button>`;
  s.appendChild(footer);

  setTimeout(() => {
    const val = s.querySelector('#cl-value');
    s.querySelector('#btn-cl-minus').addEventListener('click', () => {
      haptic();
      if (state.profile.averageCycleLength > 15) { state.profile.averageCycleLength--; val.textContent = state.profile.averageCycleLength; }
    });
    s.querySelector('#btn-cl-plus').addEventListener('click', () => {
      haptic();
      if (state.profile.averageCycleLength < 45) { state.profile.averageCycleLength++; val.textContent = state.profile.averageCycleLength; }
    });
    s.querySelector('#btn-cl').addEventListener('click', () => { haptic(); next(); });
  }, 0);
  return s;
}

// ─── SCREEN 11: Average Bleeding Days ────────────────────────
function buildBleedingDays() {
  const s = el('div', 'screen');
  buildChrome(s);

  const body = el('div', 'screen-body has-chrome');
  body.innerHTML = `
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding-top:24px">
      <p class="screen-label fade-in">Your period</p>
      <h1 class="screen-title fade-in fade-in-d1">Average bleeding days?</h1>
      <p class="screen-subtitle fade-in fade-in-d2">Helps us know when your menstrual phase ends.</p>
      <div class="number-stepper fade-in fade-in-d3">
        <button class="stepper-btn" id="btn-bd-minus">−</button>
        <div>
          <div class="stepper-value" id="bd-value">${state.profile.averageBleedingDays}</div>
          <div class="stepper-unit">days</div>
        </div>
        <button class="stepper-btn" id="btn-bd-plus">+</button>
      </div>
      <p style="font-size:13px;color:#8E8689;text-align:center" class="fade-in fade-in-d4">Typical range: 3–7 days</p>
    </div>
  `;
  s.appendChild(body);

  const footer = el('div', 'cta-footer');
  footer.innerHTML = `<button class="btn-primary" id="btn-bd">Continue</button>`;
  s.appendChild(footer);

  setTimeout(() => {
    const val = s.querySelector('#bd-value');
    s.querySelector('#btn-bd-minus').addEventListener('click', () => {
      haptic();
      if (state.profile.averageBleedingDays > 1) { state.profile.averageBleedingDays--; val.textContent = state.profile.averageBleedingDays; }
    });
    s.querySelector('#btn-bd-plus').addEventListener('click', () => {
      haptic();
      if (state.profile.averageBleedingDays < 12) { state.profile.averageBleedingDays++; val.textContent = state.profile.averageBleedingDays; }
    });
    s.querySelector('#btn-bd').addEventListener('click', () => { haptic(); next(); });
  }, 0);
  return s;
}

// ─── SCREEN 12: Timeline Plan ─────────────────────────────────
function buildTimelinePlan() {
  const s = el('div', 'screen');
  buildChrome(s);

  const body = el('div', 'screen-body has-chrome');
  body.innerHTML = `
    <div style="padding-top:24px">
      <p class="screen-label fade-in">Your journey</p>
      <h1 class="screen-title fade-in fade-in-d1">Here's your FlowState timeline</h1>
      <p class="screen-subtitle fade-in fade-in-d2" style="margin-bottom:20px">A personalised training plan, aligned to your cycle from day one.</p>
      <div class="fade-in fade-in-d3">
        <div class="roadmap-phase">
          <div class="phase-dot" style="background:#F49EAF"></div>
          <div>
            <div class="roadmap-week">Week 1–2</div>
            <div class="roadmap-name">Foundation & Cycle Calibration</div>
            <div class="roadmap-desc">Light form work. FlowState learns your baseline.</div>
          </div>
        </div>
        <div class="roadmap-phase">
          <div class="phase-dot" style="background:#7BA68B"></div>
          <div>
            <div class="roadmap-week">Week 3–4</div>
            <div class="roadmap-name">Building Strength in Follicular</div>
            <div class="roadmap-desc">Push harder when energy is naturally higher.</div>
          </div>
        </div>
        <div class="roadmap-phase">
          <div class="phase-dot" style="background:#D9A055"></div>
          <div>
            <div class="roadmap-week">Week 5–6</div>
            <div class="roadmap-name">Peak Power at Ovulation</div>
            <div class="roadmap-desc">Your strongest week — AI pushes intensity here.</div>
          </div>
        </div>
        <div class="roadmap-phase">
          <div class="phase-dot" style="background:#9C7A8E"></div>
          <div>
            <div class="roadmap-week">Week 7–8</div>
            <div class="roadmap-name">Smart Recovery in Luteal</div>
            <div class="roadmap-desc">De-load intelligently. Protect your long-term gains.</div>
          </div>
        </div>
      </div>
    </div>
  `;
  s.appendChild(body);

  const footer = el('div', 'cta-footer');
  footer.innerHTML = `<button class="btn-primary" id="btn-tl">Let's build it →</button>`;
  s.appendChild(footer);

  setTimeout(() => {
    s.querySelector('#btn-tl')?.addEventListener('click', () => { haptic(); next(); });
  }, 0);
  return s;
}

// ─── SCREEN 13: Weight ────────────────────────────────────────
function buildWeight() {
  const s = el('div', 'screen');
  buildChrome(s);

  const body = el('div', 'screen-body has-chrome');
  body.innerHTML = `
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding-top:24px">
      <p class="screen-label fade-in">Your body</p>
      <h1 class="screen-title fade-in fade-in-d1">Current weight?</h1>
      <p class="screen-subtitle fade-in fade-in-d2">Used to calibrate load suggestions. Always adjustable.</p>
      <div class="number-stepper fade-in fade-in-d3">
        <button class="stepper-btn" id="btn-w-minus">−</button>
        <div>
          <div class="stepper-value" id="w-value">${state.profile.weightKG}</div>
          <div class="stepper-unit">kg</div>
        </div>
        <button class="stepper-btn" id="btn-w-plus">+</button>
      </div>
    </div>
  `;
  s.appendChild(body);

  const footer = el('div', 'cta-footer');
  footer.innerHTML = `<button class="btn-primary" id="btn-w">Continue</button>`;
  s.appendChild(footer);

  setTimeout(() => {
    const val = s.querySelector('#w-value');
    s.querySelector('#btn-w-minus').addEventListener('click', () => {
      haptic();
      if (state.profile.weightKG > 30) { state.profile.weightKG--; val.textContent = state.profile.weightKG; }
    });
    s.querySelector('#btn-w-plus').addEventListener('click', () => {
      haptic();
      if (state.profile.weightKG < 200) { state.profile.weightKG++; val.textContent = state.profile.weightKG; }
    });
    s.querySelector('#btn-w').addEventListener('click', () => { haptic(); next(); });
  }, 0);
  return s;
}

// ─── SCREEN 14: Height ────────────────────────────────────────
function buildHeight() {
  const s = el('div', 'screen');
  buildChrome(s);

  const body = el('div', 'screen-body has-chrome');
  body.innerHTML = `
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding-top:24px">
      <p class="screen-label fade-in">Your body</p>
      <h1 class="screen-title fade-in fade-in-d1">Your height?</h1>
      <p class="screen-subtitle fade-in fade-in-d2">Helps us fine-tune load and form cues.</p>
      <div class="number-stepper fade-in fade-in-d3">
        <button class="stepper-btn" id="btn-h-minus">−</button>
        <div>
          <div class="stepper-value" id="h-value">${state.profile.heightCM}</div>
          <div class="stepper-unit">cm</div>
        </div>
        <button class="stepper-btn" id="btn-h-plus">+</button>
      </div>
    </div>
  `;
  s.appendChild(body);

  const footer = el('div', 'cta-footer');
  footer.innerHTML = `<button class="btn-primary" id="btn-h">Continue</button>`;
  s.appendChild(footer);

  setTimeout(() => {
    const val = s.querySelector('#h-value');
    s.querySelector('#btn-h-minus').addEventListener('click', () => {
      haptic();
      if (state.profile.heightCM > 130) { state.profile.heightCM--; val.textContent = state.profile.heightCM; }
    });
    s.querySelector('#btn-h-plus').addEventListener('click', () => {
      haptic();
      if (state.profile.heightCM < 220) { state.profile.heightCM++; val.textContent = state.profile.heightCM; }
    });
    s.querySelector('#btn-h').addEventListener('click', () => { haptic(); next(); });
  }, 0);
  return s;
}

// ─── SCREEN 15: Activity Level ────────────────────────────────
function buildActivityLevel() {
  const s = el('div', 'screen');
  buildChrome(s);

  const levels = [
    { val: 'beginner',     emoji: '🌱', label: 'Beginner',     sub: 'New to structured training' },
    { val: 'intermediate', emoji: '🏋️', label: 'Intermediate', sub: '1–3 years of training' },
    { val: 'advanced',     emoji: '⚡', label: 'Advanced',     sub: '3+ years, knows their lifts' },
  ];

  const body = el('div', 'screen-body has-chrome');
  body.innerHTML = `
    <div style="padding-top:24px">
      <p class="screen-label fade-in">Experience</p>
      <h1 class="screen-title fade-in fade-in-d1">Training experience?</h1>
      <p class="screen-subtitle fade-in fade-in-d2">Sets your starting programme complexity.</p>
      <div class="fade-in fade-in-d3">
        ${levels.map(l => `
          <button class="option-card ${state.profile.experience === l.val ? 'selected' : ''}" data-val="${l.val}">
            <span class="option-card-emoji">${l.emoji}</span>
            <span class="option-card-text">
              <span class="option-card-label">${l.label}</span>
              <span class="option-card-sub">${l.sub}</span>
            </span>
            <span class="option-card-check">${state.profile.experience === l.val ? '✓' : ''}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
  s.appendChild(body);

  setTimeout(() => {
    s.querySelectorAll('.option-card').forEach(card => {
      card.addEventListener('click', () => {
        haptic();
        state.profile.experience = card.dataset.val;
        setTimeout(() => next(), 250);
      });
    });
  }, 0);
  return s;
}

// ─── SCREEN 16: Training Goal ─────────────────────────────────
function buildTrainingGoal() {
  const s = el('div', 'screen');
  buildChrome(s);

  const goals = [
    { val: 'strength',     emoji: '💪', label: 'Build strength',      sub: 'Focus on compound lifts and PR chasing' },
    { val: 'hypertrophy',  emoji: '📐', label: 'Gain muscle',         sub: 'Volume and hypertrophy focus' },
    { val: 'fitness',      emoji: '🏃', label: 'General fitness',     sub: 'Mix of strength, cardio, and conditioning' },
    { val: 'weight-loss',  emoji: '🔥', label: 'Lose weight',         sub: 'Caloric deficit + training to preserve muscle' },
  ];

  const body = el('div', 'screen-body has-chrome');
  body.innerHTML = `
    <div style="padding-top:24px">
      <p class="screen-label fade-in">Primary goal</p>
      <h1 class="screen-title fade-in fade-in-d1">What's your main goal?</h1>
      <div class="fade-in fade-in-d2">
        ${goals.map(g => `
          <button class="option-card ${state.profile.trainingGoal === g.val ? 'selected' : ''}" data-val="${g.val}">
            <span class="option-card-emoji">${g.emoji}</span>
            <span class="option-card-text">
              <span class="option-card-label">${g.label}</span>
              <span class="option-card-sub">${g.sub}</span>
            </span>
            <span class="option-card-check">${state.profile.trainingGoal === g.val ? '✓' : ''}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
  s.appendChild(body);

  setTimeout(() => {
    s.querySelectorAll('.option-card').forEach(card => {
      card.addEventListener('click', () => {
        haptic();
        state.profile.trainingGoal = card.dataset.val;
        setTimeout(() => next(), 250);
      });
    });
  }, 0);
  return s;
}

// ─── SCREEN 17: Pain Points ───────────────────────────────────
function buildPainPoints() {
  const s = el('div', 'screen');
  buildChrome(s);

  const points = [
    { val: 'inconsistency', emoji: '📉', label: 'Inconsistent training',    sub: 'Hard to stay on a programme' },
    { val: 'energy',        emoji: '😴', label: 'Energy crashes',           sub: 'Some days I have nothing left' },
    { val: 'pain',          emoji: '😣', label: 'Period pain affects gym',  sub: 'I skip sessions or train through it' },
    { val: 'plateau',       emoji: '📊', label: 'Stuck at a plateau',       sub: 'Progress has stalled' },
    { val: 'overwhelm',     emoji: '🤯', label: 'Overwhelmed by options',   sub: 'Don\'t know what programme to follow' },
  ];

  const body = el('div', 'screen-body has-chrome');
  body.innerHTML = `
    <div style="padding-top:24px">
      <p class="screen-label fade-in">Your challenges</p>
      <h1 class="screen-title fade-in fade-in-d1">What holds you back?</h1>
      <p class="screen-subtitle fade-in fade-in-d2">Select all that apply.</p>
      <div id="pain-options" class="fade-in fade-in-d3">
        ${points.map(p => `
          <button class="option-card ${state.profile.painPoints.includes(p.val) ? 'selected' : ''}" data-val="${p.val}">
            <span class="option-card-emoji">${p.emoji}</span>
            <span class="option-card-text">
              <span class="option-card-label">${p.label}</span>
              <span class="option-card-sub">${p.sub}</span>
            </span>
            <span class="option-card-check">${state.profile.painPoints.includes(p.val) ? '✓' : ''}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
  s.appendChild(body);

  const footer = el('div', 'cta-footer');
  footer.innerHTML = `<button class="btn-primary" id="btn-pp">Continue</button>`;
  s.appendChild(footer);

  setTimeout(() => {
    s.querySelectorAll('.option-card').forEach(card => {
      card.addEventListener('click', () => {
        haptic();
        const val = card.dataset.val;
        const idx = state.profile.painPoints.indexOf(val);
        if (idx > -1) { state.profile.painPoints.splice(idx, 1); card.classList.remove('selected'); card.querySelector('.option-card-check').textContent = ''; }
        else          { state.profile.painPoints.push(val); card.classList.add('selected'); card.querySelector('.option-card-check').textContent = '✓'; }
      });
    });
    s.querySelector('#btn-pp')?.addEventListener('click', () => { haptic(); next(); });
  }, 0);
  return s;
}

// ─── SCREEN 18: Today Check-In Intro ─────────────────────────
function buildTodayCheckInIntro() {
  const s = el('div', 'screen');
  s.style.alignItems = 'center';
  s.style.justifyContent = 'center';
  s.style.textAlign = 'center';
  s.style.padding = '0 24px';

  s.innerHTML = `
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0">
      <div style="font-size:72px;margin-bottom:28px" class="fade-in">☀️</div>
      <h1 class="screen-title fade-in fade-in-d1" style="text-align:center">One quick check-in</h1>
      <p style="font-size:17px;color:#8E8689;max-width:280px;line-height:1.55;text-align:center;margin-top:10px" class="fade-in fade-in-d2">
        Tell us how you're feeling today. Your first workout adapts to your current readiness.
      </p>
    </div>
    <div style="width:100%;padding:0 0 48px" class="fade-in fade-in-d3">
      <button class="btn-primary" id="btn-tci">Tell us how I feel</button>
    </div>
  `;

  setTimeout(() => {
    s.querySelector('#btn-tci')?.addEventListener('click', () => { haptic(); next(); });
  }, 0);
  return s;
}

// ─── SCREEN 19: Mood / Readiness Slider ──────────────────────
function buildMoodSlider() {
  const s = el('div', 'screen');
  buildChrome(s);

  const moods = [
    { level: 1, emoji: '😩', label: 'Running on empty',      color: '#B25148' },
    { level: 2, emoji: '😔', label: 'A bit low',             color: '#C89B4A' },
    { level: 3, emoji: '😊', label: 'Feeling okay',          color: '#7BA68B' },
    { level: 4, emoji: '😄', label: 'Pretty good!',          color: '#D9A055' },
    { level: 5, emoji: '🔥', label: 'Let\'s smash it!',     color: '#F49EAF' },
  ];

  const body = el('div', 'screen-body has-chrome');
  body.innerHTML = `
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding-top:24px">
      <p class="screen-label fade-in">Daily check-in</p>
      <h1 class="screen-title fade-in fade-in-d1">How are you feeling today?</h1>
      <div id="mood-display" class="fade-in fade-in-d2" style="text-align:center;padding:32px 0 24px">
        <div id="mood-emoji" style="font-size:72px;margin-bottom:12px;transition:all 0.25s ease">${moods[state.profile.innerCycleLevel - 1].emoji}</div>
        <div id="mood-label" style="font-size:18px;font-weight:600;color:#2D2628;transition:all 0.25s ease">${moods[state.profile.innerCycleLevel - 1].label}</div>
      </div>
      <div class="fade-in fade-in-d3" style="padding:0 16px">
        <input type="range" id="mood-slider" min="1" max="5" value="${state.profile.innerCycleLevel}"
          style="width:100%;height:6px;-webkit-appearance:none;appearance:none;background:linear-gradient(to right,#F49EAF,#FFEDC2);border-radius:999px;outline:none;cursor:pointer"/>
        <div style="display:flex;justify-content:space-between;margin-top:8px">
          <span style="font-size:20px">😩</span>
          <span style="font-size:20px">🔥</span>
        </div>
      </div>
    </div>
  `;
  s.appendChild(body);

  const footer = el('div', 'cta-footer');
  footer.innerHTML = `<button class="btn-primary" id="btn-mood">Continue</button>`;
  s.appendChild(footer);

  setTimeout(() => {
    const slider = s.querySelector('#mood-slider');
    const emojiEl = s.querySelector('#mood-emoji');
    const labelEl = s.querySelector('#mood-label');

    slider.addEventListener('input', () => {
      const lvl = parseInt(slider.value);
      state.profile.innerCycleLevel = lvl;
      const m = moods[lvl - 1];
      emojiEl.style.transform = 'scale(0.85)';
      setTimeout(() => { emojiEl.textContent = m.emoji; labelEl.textContent = m.label; emojiEl.style.transform = 'scale(1)'; }, 100);
      haptic();
    });

    s.querySelector('#btn-mood')?.addEventListener('click', () => { haptic(); next(); });
  }, 0);
  return s;
}

// ─── SCREEN 20: Plan Generation ───────────────────────────────
function buildPlanGeneration() {
  const s = el('div', 'screen');

  const steps = [
    { icon: '🌙', label: 'Reading your cycle profile' },
    { icon: '🔄', label: 'Aligning workouts to your phases' },
    { icon: '🏋️', label: 'Picking lifts for your goals' },
    { icon: '⚙️', label: 'Calibrating volume & intensity' },
    { icon: '✅', label: 'Your first 4 weeks are ready' },
  ];

  s.innerHTML = `
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding-bottom:32px">
      <div class="gen-percent fade-in" id="gen-pct">0%</div>
      <h2 style="font-size:22px;font-weight:700;color:#2D2628;margin:8px 0 24px;text-align:center" class="fade-in fade-in-d1">Generating your plan</h2>
      <div class="gen-progress-bar fade-in fade-in-d2" style="width:calc(100% - 80px)">
        <div class="gen-progress-fill" id="gen-bar"></div>
      </div>
      <p id="gen-status" style="font-size:13px;color:#8E8689;margin:12px 0 28px;text-align:center;min-height:20px" class="fade-in fade-in-d3">Reading your cycle profile...</p>
      <div class="gen-steps-card fade-in fade-in-d4" style="width:calc(100% - 48px)">
        ${steps.map((st, i) => `
          <div class="gen-step-row" id="gen-step-${i}">
            <div class="gen-step-icon" id="gen-icon-${i}">${st.icon}</div>
            <span class="gen-step-label">${st.label}</span>
            <span class="gen-step-check" id="gen-chk-${i}">○</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Animation
  setTimeout(() => {
    const bar    = s.querySelector('#gen-bar');
    const pct    = s.querySelector('#gen-pct');
    const status = s.querySelector('#gen-status');

    if (bar) bar.style.width = '100%';

    const statuses = [
      'Reading your cycle profile...',
      'Aligning workouts to your phases...',
      'Picking lifts for your goals...',
      'Calibrating volume + intensity...',
      'Your first 4 weeks are ready.',
    ];

    const delays = [0.96, 2.8, 4.4, 6.0, 7.2];
    const total = 8000;
    let startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(elapsed / total, 1);
      if (pct) pct.textContent = Math.round(p * 100) + '%';
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    delays.forEach((d, i) => {
      setTimeout(() => {
        const row  = s.querySelector(`#gen-step-${i}`);
        const icon = s.querySelector(`#gen-icon-${i}`);
        const chk  = s.querySelector(`#gen-chk-${i}`);
        if (row)  row.classList.add('done');
        if (icon) icon.textContent = '✓';
        if (chk)  chk.textContent = '●';
        if (status && statuses[i + 1]) status.textContent = statuses[i + 1];
      }, d * 1000);
    });

    setTimeout(() => next(), total + 600);
  }, 400);

  return s;
}

// ─── SCREEN 21: Transition Splash ─────────────────────────────
function buildTransitionSplash() {
  const s = el('div', 'screen splash-screen');

  s.innerHTML = `
    <div style="font-size:80px;margin-bottom:28px" class="fade-in">✨</div>
    <h1 class="screen-title fade-in fade-in-d1" style="text-align:center;font-size:28px">Your personalised<br>training plan is ready.</h1>
    <p style="font-size:16px;color:#8E8689;margin-top:12px;max-width:260px;text-align:center;line-height:1.55" class="fade-in fade-in-d2">
      Built around your cycle phase, your goals, and how you feel today.
    </p>
    <div style="position:absolute;bottom:48px;left:24px;right:24px" class="fade-in fade-in-d3">
      <button class="btn-primary" id="btn-splash">See My Plan</button>
    </div>
  `;

  setTimeout(() => {
    s.querySelector('#btn-splash')?.addEventListener('click', () => { haptic(); next(); });
  }, 0);
  return s;
}

// ─── SCREEN 22: Plan Roadmap ──────────────────────────────────
function buildPlanRoadmap() {
  const s = el('div', 'screen');
  buildChrome(s);

  const body = el('div', 'screen-body has-chrome');
  body.innerHTML = `
    <div style="padding-top:24px">
      <p class="screen-label fade-in">Your 8-week plan</p>
      <h1 class="screen-title fade-in fade-in-d1">Here's what's waiting for you</h1>
      <p class="screen-subtitle fade-in fade-in-d2" style="margin-bottom:20px">Phase-synced, AI-generated, adapts as you go.</p>
      <div class="fade-in fade-in-d3">
        <div class="roadmap-phase">
          <div class="phase-dot" style="background:#B25148"></div>
          <div>
            <div class="roadmap-week">Menstrual · Days 1–5</div>
            <div class="roadmap-name">Active Recovery</div>
            <div class="roadmap-desc">Mobility, light movement, bodyweight. Protect your joints.</div>
          </div>
        </div>
        <div class="roadmap-phase">
          <div class="phase-dot" style="background:#7BA68B"></div>
          <div>
            <div class="roadmap-week">Follicular · Days 6–13</div>
            <div class="roadmap-name">Strength Building</div>
            <div class="roadmap-desc">Estrogen peaks → strength and skill acquisition improves.</div>
          </div>
        </div>
        <div class="roadmap-phase">
          <div class="phase-dot" style="background:#D9A055"></div>
          <div>
            <div class="roadmap-week">Ovulatory · Days 14–16</div>
            <div class="roadmap-name">Peak Performance</div>
            <div class="roadmap-desc">Your strongest window. Heavy lifts, PRs, intensity peaks.</div>
          </div>
        </div>
        <div class="roadmap-phase">
          <div class="phase-dot" style="background:#9C7A8E"></div>
          <div>
            <div class="roadmap-week">Luteal · Days 17–28</div>
            <div class="roadmap-name">Smart Load Management</div>
            <div class="roadmap-desc">Volume down, technique focus. Set up next cycle's gains.</div>
          </div>
        </div>
      </div>
    </div>
  `;
  s.appendChild(body);

  const footer = el('div', 'cta-footer');
  footer.innerHTML = `<button class="btn-primary" id="btn-rm">This is exactly what I need →</button>`;
  s.appendChild(footer);

  setTimeout(() => {
    s.querySelector('#btn-rm')?.addEventListener('click', () => { haptic(); next(); });
  }, 0);
  return s;
}

// ─── SCREEN 23: Goal Synthesis ────────────────────────────────
function buildGoalSynthesis() {
  const s = el('div', 'screen');

  const name = state.profile.name || 'there';
  const goalMap = { strength: 'build real strength', hypertrophy: 'gain muscle', fitness: 'get fitter', 'weight-loss': 'lose weight' };
  const goalText = goalMap[state.profile.trainingGoal] || 'reach your goals';

  const body = el('div', 'screen-body');
  body.style.paddingTop = '72px';
  body.innerHTML = `
    <div style="margin-bottom:24px" class="fade-in">
      <div class="synthesis-highlight">
        Hey <em>${name}</em>, FlowState is built for you.<br>
        <span style="font-size:22px;font-weight:500;color:#8E8689">You're here to <em>${goalText}</em> — and your cycle is your advantage, not a complication.</span>
      </div>
    </div>
    <div class="fade-in fade-in-d1">
      <div class="insight-row">
        <span class="insight-icon">🧬</span>
        <span class="insight-text">Your training will automatically shift across all 4 cycle phases.</span>
      </div>
      <div class="insight-row">
        <span class="insight-icon">📱</span>
        <span class="insight-text">Daily check-ins refine every session before you step into the gym.</span>
      </div>
      <div class="insight-row">
        <span class="insight-icon">📈</span>
        <span class="insight-text">FlowState's AI learns your patterns and gets smarter every week.</span>
      </div>
    </div>
  `;
  s.appendChild(body);

  const footer = el('div', 'cta-footer');
  footer.innerHTML = `<button class="btn-primary" id="btn-gs">I'm ready →</button>`;
  s.appendChild(footer);

  setTimeout(() => {
    s.querySelector('#btn-gs')?.addEventListener('click', () => { haptic(); next(); });
  }, 0);
  return s;
}

// ─── SCREEN 24: Referral Source ───────────────────────────────
function buildReferralSource() {
  const s = el('div', 'screen');

  const sources = [
    { val: 'friend',    emoji: '👯', label: 'A friend told me' },
    { val: 'instagram', emoji: '📸', label: 'Instagram / TikTok' },
    { val: 'search',    emoji: '🔍', label: 'App Store search' },
    { val: 'podcast',   emoji: '🎙️', label: 'Podcast / YouTube' },
    { val: 'article',   emoji: '📰', label: 'Article / blog' },
    { val: 'other',     emoji: '✨', label: 'Something else' },
  ];

  const body = el('div', 'screen-body');
  body.style.paddingTop = '72px';
  body.innerHTML = `
    <p class="screen-label fade-in">Quick question</p>
    <h1 class="screen-title fade-in fade-in-d1">How did you hear about us?</h1>
    <p class="screen-subtitle fade-in fade-in-d2">Helps us grow the community.</p>
    <div class="fade-in fade-in-d3">
      ${sources.map(src => `
        <button class="option-card" data-val="${src.val}">
          <span class="option-card-emoji">${src.emoji}</span>
          <span class="option-card-text"><span class="option-card-label">${src.label}</span></span>
          <span class="option-card-check"></span>
        </button>
      `).join('')}
    </div>
  `;
  s.appendChild(body);

  setTimeout(() => {
    s.querySelectorAll('.option-card').forEach(card => {
      card.addEventListener('click', () => {
        haptic();
        setTimeout(() => next(), 250);
      });
    });
  }, 0);
  return s;
}

// ─── SCREEN 25: Social Proof ──────────────────────────────────
function buildSocialProof() {
  const s = el('div', 'screen');

  const reviews = [
    { name: 'Maya T.',     body: 'My energy isn\'t "always on." FlowState gets that. My deload weeks aren\'t a failure anymore — they\'re scheduled.' },
    { name: 'Priya N.',    body: 'I stopped pushing through bad days. Strength is up, period symptoms are way down. I trust the plan.' },
    { name: 'Sam K.',      body: 'PRs go on follicular days. Recovery work on luteal. It\'s obvious in hindsight. Best decision I made for my training.' },
    { name: 'Elena R.',    body: 'This app completely changed how I look at my cycle. The AI actually learns my patterns. Worth every penny.' },
    { name: 'Jessica W.',  body: 'Finally an app that gets it. I\'ve been struggling to stay consistent but having my workouts adapt to my cycle is a game changer.' },
  ];

  const body = el('div', 'screen-body');
  body.style.paddingTop = '72px';
  body.innerHTML = `
    <h1 class="screen-title fade-in" style="font-size:30px;text-align:center;margin-bottom:8px">Join thousands of<br>women like you</h1>
    <div class="stats-row fade-in fade-in-d1">
      <span class="laurel" id="laurel-l">🏅</span>
      <div class="big-stars">
        ${[0,1,2,3,4].map(i => `<span class="big-star" id="star-${i}">★</span>`).join('')}
      </div>
      <span class="laurel" id="laurel-r">🏅</span>
    </div>
    <p class="people-count fade-in fade-in-d2">😌😎🤩  + 5,000 people</p>
    ${reviews.map((r, i) => `
      <div class="review-card" id="rev-${i}" style="transition-delay:${i * 0.12}s">
        <div class="review-name">${r.name}</div>
        <div class="review-stars">★★★★★</div>
        <div class="review-text">${r.body}</div>
      </div>
    `).join('')}
    <div style="height:100px"></div>
  `;
  s.appendChild(body);

  const footer = el('div', 'cta-footer gradient-fade');
  footer.innerHTML = `<button class="btn-primary" id="btn-sp">Continue</button>`;
  s.appendChild(footer);

  setTimeout(() => {
    // Animate laurels
    setTimeout(() => {
      s.querySelector('#laurel-l')?.classList.add('visible');
      s.querySelector('#laurel-r')?.classList.add('visible');
    }, 350);

    // Animate stars
    [0,1,2,3,4].forEach((_, i) => {
      setTimeout(() => s.querySelector(`#star-${i}`)?.classList.add('pop'), 500 + i * 100);
    });

    // Animate reviews
    setTimeout(() => {
      reviews.forEach((_, i) => {
        setTimeout(() => s.querySelector(`#rev-${i}`)?.classList.add('visible'), i * 120);
      });
    }, 550);

    s.querySelector('#btn-sp')?.addEventListener('click', () => { haptic(); next(); });
  }, 0);
  return s;
}

// ─── SCREEN 26: Notifications ─────────────────────────────────
function buildNotifications() {
  const s = el('div', 'screen');

  const body = el('div', 'screen-body');
  body.style.paddingTop = '72px';
  body.innerHTML = `
    <div style="font-size:56px;text-align:center;margin-bottom:20px" class="fade-in">🔔</div>
    <h1 class="screen-title fade-in fade-in-d1" style="text-align:center">Stay on track</h1>
    <p class="screen-subtitle fade-in fade-in-d2" style="text-align:center;max-width:260px;margin:0 auto 28px">Nudges that keep your training consistent — never spammy.</p>

    <div class="notif-card fade-in fade-in-d3">
      <div class="notif-label">Daily reminders</div>
      <div class="notif-row">
        <button class="notif-count-btn" id="notif-minus">−</button>
        <span class="notif-count-val" id="notif-val">${state.profile.notificationCount}</span>
        <button class="notif-count-btn" id="notif-plus">+</button>
        <span style="font-size:14px;font-weight:500;color:#8E8689">per day</span>
      </div>
    </div>

    <div class="notif-card fade-in fade-in-d4">
      <div class="notif-label">What you'll get</div>
      <div style="display:flex;flex-direction:column;gap:10px">
        <div style="display:flex;gap:10px;align-items:center">
          <span style="font-size:18px">⏰</span>
          <span style="font-size:14px;font-weight:500;color:#2D2628">Today's workout reminder</span>
        </div>
        <div style="display:flex;gap:10px;align-items:center">
          <span style="font-size:18px">🌙</span>
          <span style="font-size:14px;font-weight:500;color:#2D2628">Phase transition alerts</span>
        </div>
        <div style="display:flex;gap:10px;align-items:center">
          <span style="font-size:18px">📊</span>
          <span style="font-size:14px;font-weight:500;color:#2D2628">Weekly progress summaries</span>
        </div>
      </div>
    </div>
  `;
  s.appendChild(body);

  const footer = el('div', 'cta-footer');
  footer.innerHTML = `
    <button class="btn-primary" id="btn-notif">Allow Notifications</button>
    <button class="btn-secondary" id="btn-skip-notif">Maybe later</button>
  `;
  s.appendChild(footer);

  setTimeout(() => {
    const val = s.querySelector('#notif-val');
    s.querySelector('#notif-minus')?.addEventListener('click', () => {
      haptic();
      if (state.profile.notificationCount > 1) { state.profile.notificationCount--; val.textContent = state.profile.notificationCount; }
    });
    s.querySelector('#notif-plus')?.addEventListener('click', () => {
      haptic();
      if (state.profile.notificationCount < 10) { state.profile.notificationCount++; val.textContent = state.profile.notificationCount; }
    });
    s.querySelector('#btn-notif')?.addEventListener('click', () => { haptic(); next(); });
    s.querySelector('#btn-skip-notif')?.addEventListener('click', () => { haptic(); next(); });
  }, 0);
  return s;
}

// ─── SCREEN 27: Streak Kickoff ────────────────────────────────
function buildStreakKickoff() {
  const s = el('div', 'screen');
  s.style.alignItems = 'center';
  s.style.justifyContent = 'center';
  s.style.textAlign = 'center';
  s.style.padding = '0 24px';

  const name = state.profile.name || '';
  const greeting = name ? `You're in, ${name}! 🎉` : 'You\'re in! 🎉';

  s.innerHTML = `
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center">
      <div class="streak-badge">🔥</div>
      <h1 style="font-size:28px;font-weight:700;color:#2D2628;margin-bottom:12px">${greeting}</h1>
      <p style="font-size:16px;color:#8E8689;max-width:260px;line-height:1.55;margin-bottom:28px">Your FlowState journey starts today. Your first AI workout is waiting.</p>
      <div style="display:flex;flex-wrap:wrap;justify-content:center">
        <span class="stat-chip">🎯 Day 1 streak</span>
        <span class="stat-chip">🧬 Cycle synced</span>
        <span class="stat-chip">🤖 AI active</span>
      </div>
    </div>
    <div style="width:100%;padding:0 0 48px">
      <button class="btn-primary" id="btn-streak">See My First Workout →</button>
    </div>
  `;

  // Confetti
  setTimeout(() => {
    for (let i = 0; i < 12; i++) {
      const dot = document.createElement('div');
      dot.className = 'confetti-dot';
      const colors = ['#F49EAF','#FFEDC2','#7BA68B','#D9A055','#9C7A8E'];
      dot.style.cssText = `
        left:${10 + Math.random() * 80}%;
        top:${10 + Math.random() * 40}%;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        animation-delay:${Math.random() * 0.5}s;
        animation-duration:${1 + Math.random()}s;
      `;
      s.appendChild(dot);
    }
    s.querySelector('#btn-streak')?.addEventListener('click', () => { haptic(); next(); });
  }, 0);
  return s;
}

// ─── SCREEN 28: Trial Reminder ────────────────────────────────
function buildTrialReminder() {
  const s = el('div', 'screen');
  s.style.background = '#FFFFFF';

  s.innerHTML = `
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 24px;text-align:center">
      <div style="font-size:56px;margin-bottom:24px" class="fade-in">⏳</div>
      <h1 class="screen-title fade-in fade-in-d1" style="text-align:center">Your free trial starts now</h1>
      <p style="font-size:16px;color:#8E8689;max-width:270px;line-height:1.55;margin:12px auto 32px" class="fade-in fade-in-d2">
        7 days free. We'll remind you 2 days before your trial ends. Cancel anytime.
      </p>

      <div style="width:100%;text-align:left" class="fade-in fade-in-d3">
        <div class="timeline-card" style="margin-bottom:10px">
          <div class="timeline-icon-wrap">🔓</div>
          <div>
            <div class="timeline-day">Today</div>
            <div class="timeline-title">Full access unlocked</div>
            <div class="timeline-body">Get your first AI workout and start tracking.</div>
          </div>
        </div>
        <div class="timeline-card" style="margin-bottom:10px">
          <div class="timeline-icon-wrap">🔔</div>
          <div>
            <div class="timeline-day">In 5 days</div>
            <div class="timeline-title">Trial reminder</div>
            <div class="timeline-body">We'll remind you so you have time to decide.</div>
          </div>
        </div>
        <div class="timeline-card">
          <div class="timeline-icon-wrap">📅</div>
          <div>
            <div class="timeline-day">In 7 days</div>
            <div class="timeline-title">Billing starts</div>
            <div class="timeline-body">Cancel before then — no charge, no questions.</div>
          </div>
        </div>
      </div>
    </div>
    <div style="padding:0 24px 48px">
      <button class="btn-primary" id="btn-trial">Start my free trial →</button>
    </div>
  `;

  setTimeout(() => {
    s.querySelector('#btn-trial')?.addEventListener('click', () => { haptic(); next(); });
  }, 0);
  return s;
}

// ─── SCREEN 29: Paywall ───────────────────────────────────────
function buildPaywall() {
  const s = el('div', 'screen');
  s.style.background = 'linear-gradient(180deg, #FFFFFF 0%, #FFF7F9 50%, #FFF0F4 100%)';

  const renderPaywall = () => {
    const isYearly = state.profile.selectedPlan === 'yearly';

    s.innerHTML = `
      <div style="flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:0 0 180px">
        <!-- Hero -->
        <div style="text-align:center;padding:42px 24px 0">
          <div class="paywall-pill">✦ FLOWSTATE PREMIUM</div>
          <h1 style="font-size:28px;font-weight:700;color:#2D2628;line-height:1.25;margin-bottom:14px">
            ${isYearly ? 'Start your 7-day free trial today.' : 'Unlock your cycle-aware training plan.'}
          </h1>
          <p style="font-size:15px;font-weight:500;color:#8E8689;line-height:1.5;max-width:280px;margin:0 auto">
            ${isYearly ? 'Train with FlowState now. We\'ll remind you before billing starts.' : 'A gym program that adapts to your phase, symptoms, energy, and training history.'}
          </p>
        </div>

        <!-- Plan toggle -->
        <div style="padding:28px 24px 0">
          ${isYearly ? `
            <div style="padding:0 4px 24px">
              <div class="timeline-card" style="margin-bottom:8px">
                <div class="timeline-icon-wrap">🔓</div>
                <div><div class="timeline-day">Today</div><div class="timeline-title">Unlock Everything</div><div class="timeline-body">AI workouts tuned to your cycle phase and readiness.</div></div>
              </div>
              <div class="timeline-card" style="margin-bottom:8px">
                <div class="timeline-icon-wrap">🔔</div>
                <div><div class="timeline-day">In 5 Days</div><div class="timeline-title">Trial Reminder</div><div class="timeline-body">We'll remind you before your trial ends.</div></div>
              </div>
              <div class="timeline-card">
                <div class="timeline-icon-wrap">📅</div>
                <div><div class="timeline-day">In 7 Days</div><div class="timeline-title">Billing Starts</div><div class="timeline-body">Cancel anytime before your trial ends.</div></div>
              </div>
            </div>
          ` : `
            <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:24px">
              ${['AI workouts built around your current cycle phase','Daily readiness adjusts sets, reps, rest, and intensity','Your plan learns from symptoms, sleep, energy, and history','Phase-aware training blocks for strength, hypertrophy, and recovery','Private cycle data stays protected and never sold'].map(f => `
                <div style="display:flex;align-items:center;gap:12px;padding:14px;background:#FFFFFF;border-radius:18px;border:1px solid #EAE0E4;box-shadow:0 5px 12px rgba(217,138,154,0.1)">
                  <div style="width:48px;height:48px;background:rgba(244,158,175,0.18);border-radius:15px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">🔥</div>
                  <span style="font-size:15px;font-weight:600;color:#2D2628;line-height:1.4">${f}</span>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>

      <!-- Bottom sticky -->
      <div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(to bottom,transparent,#FFF7F9 40%);padding:24px 24px 48px">
        <div class="plan-toggle" style="margin-bottom:16px">
          <button class="plan-option ${state.profile.selectedPlan === 'monthly' ? 'selected' : ''}" id="plan-monthly">
            <div class="plan-title">Monthly</div>
            <div class="plan-price">$9.99/mo</div>
            <div class="plan-check">${state.profile.selectedPlan === 'monthly' ? '✓' : ''}</div>
          </button>
          <button class="plan-option ${state.profile.selectedPlan === 'yearly' ? 'selected' : ''}" id="plan-yearly" style="position:relative">
            <div class="plan-badge">
              <span class="badge badge-warm">Best Value</span>
              <span class="badge badge-accent">7 days FREE</span>
            </div>
            <div class="plan-title">Yearly</div>
            <div class="plan-price">$2.49/mo</div>
            <div class="plan-check">${state.profile.selectedPlan === 'yearly' ? '✓' : ''}</div>
          </button>
        </div>
        <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:12px">
          <span style="color:#F49EAF;font-weight:700">✓</span>
          <span style="font-size:14px;font-weight:600;color:#2D2628">${isYearly ? 'No Payment Due Now' : 'No Commitment — Cancel Anytime'}</span>
        </div>
        <button class="btn-purchase" id="btn-subscribe">${isYearly ? 'Start My Free Trial' : 'Start My Journey'}</button>
        <p style="font-size:13px;font-weight:500;color:#8E8689;text-align:center;margin-top:10px">
          ${isYearly ? '7 days free, then $29.99/year ($2.49/mo)' : 'Just $9.99 per month'}
        </p>
        <button class="btn-secondary" id="btn-restore" style="margin-top:4px">Restore Purchases</button>
      </div>
    `;

    s.querySelector('#plan-monthly')?.addEventListener('click', () => {
      haptic();
      state.profile.selectedPlan = 'monthly';
      renderPaywall();
    });
    s.querySelector('#plan-yearly')?.addEventListener('click', () => {
      haptic();
      state.profile.selectedPlan = 'yearly';
      renderPaywall();
    });
    s.querySelector('#btn-subscribe')?.addEventListener('click', () => {
      haptic();
      const btn = s.querySelector('#btn-subscribe');
      if (btn) { btn.textContent = '✓ Welcome to FlowState!'; btn.style.opacity = '0.8'; }
      // Save profile to localStorage for home screen
      try { localStorage.setItem('fsUserProfile', JSON.stringify(state.profile)); } catch(e) {}
      setTimeout(() => { window.location.href = 'home.html'; }, 900);
    });
    s.querySelector('#btn-restore')?.addEventListener('click', () => { haptic(); });
  };

  renderPaywall();
  return s;
}

// ─── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const container = $('screen-container');
  const first = buildScreen(0);
  container.appendChild(first);
});

