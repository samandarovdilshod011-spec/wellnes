/**
 * MindCare Reset Space
 * Breathing timer, focus reset, screen break timer, gratitude note.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Breathing exercise ────────────────────────────────────────────────── */
  const breathCircle = document.getElementById('breathing-circle');
  const breathText   = document.getElementById('breathing-text');
  const breathBtn    = document.getElementById('breathing-btn');

  let breathTimeout  = null;
  let isBreathing    = false;

  if (breathBtn) {
    breathBtn.addEventListener('click', () => {
      if (isBreathing) stopBreathing(false);
      else             startBreathing();
    });
  }

  function startBreathing() {
    isBreathing            = true;
    breathBtn.textContent  = 'To‘xtatish';

    let cycles = 0;
    const MAX  = 5;

    function cycle() {
      if (!isBreathing || cycles >= MAX) { stopBreathing(cycles >= MAX); return; }

      // Inhale 4s
      setBreath('Nafas oling', 'scale(1.4)');

      breathTimeout = setTimeout(() => {
        if (!isBreathing) return;
        // Hold 4s
        setBreath('Ushlab turing', 'scale(1.4)');

        breathTimeout = setTimeout(() => {
          if (!isBreathing) return;
          // Exhale 4s
          setBreath('Nafas chiqaring', 'scale(1)');

          cycles++;
          breathTimeout = setTimeout(cycle, 4200);
        }, 4000);
      }, 4000);
    }

    cycle();
  }

  function setBreath(label, scale) {
    if (breathText)   breathText.textContent = label;
    if (breathCircle) breathCircle.style.transform = scale;
  }

  function stopBreathing(completed) {
    isBreathing           = false;
    clearTimeout(breathTimeout);
    if (breathBtn)   breathBtn.textContent  = 'Boshlash';
    if (breathText)  breathText.textContent = 'Tayyor';
    if (breathCircle) breathCircle.style.transform = 'scale(1)';
    if (completed) showToast('Ajoyib! Nafas mashqi muvaffaqiyatli yakunlandi.', 'success');
  }

  /* ── 2. Focus reset ───────────────────────────────────────────────────────── */
  const focusCard = document.querySelector(".reset-card[data-activity='focus']");
  const focusBtn  = focusCard?.querySelector('button');

  let isFocusing   = false;
  let focusTimeout = null;

  if (focusBtn && focusCard) {
    // Text display element
    let focusDisplay = focusCard.querySelector('.focus-display');
    if (!focusDisplay) {
      focusDisplay = document.createElement('p');
      focusDisplay.className = 'focus-display';
      focusDisplay.style.cssText =
        'color:var(--accent-cyan);font-weight:500;font-size:0.95rem;min-height:48px;margin:14px 0;transition:opacity 0.5s ease;text-align:center;';
      focusCard.insertBefore(focusDisplay, focusBtn);
    }

    const steps = [
      { text: '🧘 Ko‘zingizni yuming. Yelkangizni bo‘sh qo‘ying.', ms: 5000 },
      { text: '🌬️ Sekin chuqur nafas oling… va chiqaring.', ms: 5000 },
      { text: '🎯 Endi bajarishingiz kerak bo‘lgan bitta kichik ish haqida o‘ylang.', ms: 6000 },
      { text: '✨ Ko‘zingizni oching. Siz diqqatingizni jamladingiz va tayyorsiz.', ms: 4000 }
    ];

    focusBtn.addEventListener('click', () => {
      if (isFocusing) {
        isFocusing = false;
        clearTimeout(focusTimeout);
        focusDisplay.textContent = '';
        focusBtn.textContent     = 'Mashqni boshlash';
        return;
      }

      isFocusing           = true;
      focusBtn.textContent = 'Bekor qilish';
      let i = 0;

      function nextStep() {
        if (!isFocusing || i >= steps.length) {
          if (isFocusing) showToast('Diqqat tiklandi! Siz tayyorsiz.', 'success');
          isFocusing           = false;
          focusDisplay.textContent = '✨ Ongingiz tozalandi';
          focusBtn.textContent = 'Mashqni boshlash';
          return;
        }
        focusDisplay.style.opacity = '0';
        setTimeout(() => {
          if (!isFocusing) return;
          focusDisplay.textContent   = steps[i].text;
          focusDisplay.style.opacity = '1';
          focusTimeout = setTimeout(nextStep, steps[i].ms);
          i++;
        }, 450);
      }
      nextStep();
    });
  }

  /* ── 3. Screen break timer ────────────────────────────────────────────────── */
  const screenCard = document.querySelector(".reset-card[data-activity='screen-break']");
  const screenBtn  = screenCard?.querySelector('button');

  let isTimerRunning = false;
  let timerInterval  = null;

  if (screenBtn && screenCard) {
    let display = screenCard.querySelector('.timer-display');
    if (!display) {
      display = document.createElement('div');
      display.className = 'timer-display';
      display.style.cssText =
        'font-size:2rem;font-weight:700;color:var(--accent-blue);margin:14px 0 4px;font-variant-numeric:tabular-nums;';
      display.textContent = '05:00';
      screenCard.insertBefore(display, screenBtn);
    }

    screenBtn.addEventListener('click', () => {
      if (isTimerRunning) {
        clearInterval(timerInterval);
        isTimerRunning       = false;
        display.textContent  = '05:00';
        screenBtn.textContent = 'Taymerni boshlash';
        return;
      }

      isTimerRunning        = true;
      screenBtn.textContent = 'To‘xtatish';
      let secs              = 300; // 5 minutes

      timerInterval = setInterval(() => {
        secs--;
        const m = String(Math.floor(secs / 60)).padStart(2, '0');
        const s = String(secs % 60).padStart(2, '0');
        display.textContent = `${m}:${s}`;

        if (secs <= 0) {
          clearInterval(timerInterval);
          isTimerRunning        = false;
          display.textContent   = '05:00';
          screenBtn.textContent = 'Taymerni boshlash';
          showToast('Ko‘z tanaffusi yakunlandi! Qaytganingizdan xursandmiz 👋', 'success');
        }
      }, 1000);
    });
  }

  /* ── 4. Gratitude / Reflection note ──────────────────────────────────────── */
  const reflectionInput = document.getElementById('reflection-input');
  const saveBtn         = document.getElementById('reflection-save');

  if (saveBtn && reflectionInput) {
    saveBtn.addEventListener('click', () => {
      const text = reflectionInput.value.trim();
      if (!text) {
        showToast('Iltimos, avval biror narsa yozing.', 'warning');
        return;
      }
      MindCareStorage.saveReflection(text);
      reflectionInput.value = '';
      showToast('Minnatdorchilik qaydi saqlandi!', 'success');
    });
  }
});
