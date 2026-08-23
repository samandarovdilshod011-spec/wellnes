/**
 * MindCare Check-in
 * Multi-step mood + factor selection, saves to storage, shows personalised result.
 */

(function () {
  let currentStep   = 1;
  let selectedMood  = null;
  let selectedFactors = [];

  const MOOD_LABELS = {
    great:       'A’lo 🤩',
    good:        'Yaxshi 🙂',
    okay:        'O‘rtacha 😐',
    stressed:    'Stressda 😫',
    overwhelmed: 'Charchagan 😵‍💫'
  };

  const MOOD_MESSAGES = {
    great:       "Ajoyib! Bugun sizga ijobiy quvvat berayotgan ishlarni davom ettiring.",
    good:        "Juda yaxshi. Kichik ijobiy lahzalar ham katta baxtga aylanadi.",
    okay:        "Samimiy qayd — ba’zi kunlar oddiy o‘tishi mutlaqo tabiiy va me’yordir.",
    stressed:    "Stress — bu vaqtinchalik holat. Resurslar va rejalashtirgich sizga erkin nafas olishga yordam beradi.",
    overwhelmed: "Bu biroz og‘irlik qilayotgan bo‘lishi mumkin. Hammasini bir kunda tugatish shart emas — bitta qadam yetarli."
  };

  /* ── Expose reset for router ─────────────────────────────────────────────── */
  window.resetCheckin = function () {
    selectedMood    = null;
    selectedFactors = [];

    document.querySelectorAll('.mood-option').forEach(o  => o.classList.remove('selected'));
    document.querySelectorAll('.factor-tag').forEach(t  => t.classList.remove('selected'));

    const todayCheckin = MindCareStorage.getTodayCheckin();
    if (todayCheckin) {
      showResultStep(todayCheckin.mood, todayCheckin.factors, false);
    } else {
      goToStep(1);
    }
  };

  /* ── Step navigation ─────────────────────────────────────────────────────── */
  function goToStep(n) {
    const steps   = document.querySelectorAll('.checkin-step');
    const nextBtn = document.getElementById('checkin-next');
    const backBtn = document.getElementById('checkin-back');

    steps.forEach(s => s.classList.remove('active'));
    const target = document.querySelector(`.checkin-step[data-step="${n}"]`);
    if (target) target.classList.add('active');

    currentStep = n;

    if (backBtn) backBtn.style.visibility = n > 1 ? 'visible' : 'hidden';

    if (nextBtn) {
      if (n === 1) nextBtn.innerHTML = 'Davom etish <i data-lucide="arrow-right" width="16" height="16"></i>';
      if (n === 2) nextBtn.innerHTML = 'Qaydni saqlash <i data-lucide="check" width="16" height="16"></i>';
    }

    if (window.lucide) lucide.createIcons();
  }

  /* ── Result step ─────────────────────────────────────────────────────────── */
  function showResultStep(mood, factors, animate) {
    const nextBtn = document.getElementById('checkin-next');
    const backBtn = document.getElementById('checkin-back');

    document.querySelectorAll('.checkin-step').forEach(s => s.classList.remove('active'));
    const resultStep = document.querySelector('.checkin-step[data-step="3"]');
    if (resultStep) resultStep.classList.add('active');

    currentStep = 3;

    if (nextBtn) nextBtn.style.display = 'none';
    if (backBtn) backBtn.style.visibility = 'hidden';

    const resultMoodEl = document.getElementById('result-mood');
    const resultTextEl = document.getElementById('result-text');
    const actionsEl    = document.getElementById('checkin-actions-wrap');

    if (resultMoodEl) resultMoodEl.textContent = MOOD_LABELS[mood] || mood;
    if (resultTextEl) resultTextEl.textContent = MOOD_MESSAGES[mood] || '';

    if (actionsEl) {
      actionsEl.innerHTML = '';

      const actions = [
        { label: 'Kuningizni rejalashtiring', view: 'planner',   style: 'btn-primary' },
        { label: 'Qisqa tanaffus oling',      view: 'reset',     style: 'btn-secondary' },
        { label: 'Resurslarni ko‘rish',       view: 'resources', style: 'btn-secondary' }
      ];

      if (mood === 'stressed' || mood === 'overwhelmed') {
        actions.push({ label: 'Yordam markazi', view: 'support', style: 'btn-secondary' });
      }

      actions.forEach(a => {
        const btn = document.createElement('button');
        btn.className = `btn ${a.style}`;
        btn.setAttribute('data-nav-to', a.view);
        btn.innerHTML = a.label;
        btn.addEventListener('click', () => {
          if (window.MindCareApp) window.MindCareApp.navigateTo(a.view);
        });
        actionsEl.appendChild(btn);
      });

      // Re-do button
      const redoBtn = document.createElement('button');
      redoBtn.className = 'btn btn-ghost btn-sm';
      redoBtn.style.marginTop = '8px';
      redoBtn.textContent = '↺ Qayta belgilash';
      redoBtn.addEventListener('click', () => {
        selectedMood    = null;
        selectedFactors = [];
        document.querySelectorAll('.mood-option').forEach(o => o.classList.remove('selected'));
        document.querySelectorAll('.factor-tag').forEach(t  => t.classList.remove('selected'));
        if (nextBtn) nextBtn.style.display = 'inline-flex';
        goToStep(1);
      });
      actionsEl.appendChild(redoBtn);
    }

    if (window.lucide) lucide.createIcons();
  }

  /* ── DOMContentLoaded ────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    const moodOptions = document.querySelectorAll('.mood-option[data-mood]');
    const factorTags  = document.querySelectorAll('.factor-tag[data-factor]');
    const nextBtn     = document.getElementById('checkin-next');
    const backBtn     = document.getElementById('checkin-back');

    if (!nextBtn) return; // checkin view not present

    // Mood click
    moodOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        moodOptions.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        selectedMood = opt.getAttribute('data-mood');
      });
    });

    // Factor click
    factorTags.forEach(tag => {
      tag.addEventListener('click', () => {
        tag.classList.toggle('selected');
        const f = tag.getAttribute('data-factor');
        if (tag.classList.contains('selected')) {
          if (!selectedFactors.includes(f)) selectedFactors.push(f);
        } else {
          selectedFactors = selectedFactors.filter(x => x !== f);
        }
      });
    });

    // Next
    nextBtn.addEventListener('click', () => {
      if (currentStep === 1) {
        if (!selectedMood) {
          showToast('Iltimos, avval kayfiyatingizni tanlang.', 'warning');
          return;
        }
        goToStep(2);
      } else if (currentStep === 2) {
        MindCareStorage.saveCheckin(selectedMood, selectedFactors);
        showToast('Hissiyot muvaffaqiyatli saqlandi!', 'success');
        if (window.refreshOverview) window.refreshOverview();
        showResultStep(selectedMood, selectedFactors, true);
      }
    });

    // Back
    backBtn.addEventListener('click', () => {
      if (currentStep === 2) goToStep(1);
    });

    // Initial state
    window.resetCheckin();
  });
})();
