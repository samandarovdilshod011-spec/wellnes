/**
 * MindCare App
 * Core SPA controller:
 *   – Screen routing (auth / onboarding / app)
 *   – Sidebar navigation
 *   – Mobile drawer
 *   – Onboarding flow
 *   – Toast system
 *   – Particle background
 */

/* ─── Toast ──────────────────────────────────────────────────────────────── */
window.showToast = function (message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const colors = {
    success: '#10b981',
    error:   '#ef4444',
    warning: '#f59e0b',
    info:    '#3b82f6'
  };

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.style.cssText = `
    padding: 14px 20px;
    border-radius: 10px;
    color: #fff;
    background: ${colors[type] || colors.info};
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    font-size: 0.9rem;
    font-weight: 500;
    opacity: 0;
    transform: translateY(-10px) translateX(10px);
    transition: opacity 0.3s ease, transform 0.3s ease;
    max-width: 340px;
    pointer-events: none;
  `;
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity   = '1';
    toast.style.transform = 'translateY(0) translateX(0)';
  });

  setTimeout(() => {
    toast.style.opacity   = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => toast.remove(), 350);
  }, 3200);
};

/* ─── MindCareApp ────────────────────────────────────────────────────────── */
const MindCareApp = (() => {

  // ── Screen management ──────────────────────────────────────────────────────

  function showScreen(id) {
    // id: 'auth' | 'onboarding' | 'app'
    document.querySelectorAll('.screen-container').forEach(el => {
      el.classList.remove('active');
    });

    const screenMap = {
      auth:       'auth-screen',
      onboarding: 'onboarding-screen',
      app:        'app-screen'
    };

    const target = document.getElementById(screenMap[id]);
    if (target) {
      target.classList.add('active');
    }
  }

  // ── Onboarding flow ────────────────────────────────────────────────────────

  function initOnboarding(name) {
    // Personalise greeting
    const nameEl = document.getElementById('onboarding-name');
    if (nameEl) nameEl.textContent = name || 'there';

    let currentStep = 1;
    let selectedMood  = null;
    let selectedFocus = [];

    const steps    = document.querySelectorAll('.onboarding-step');
    const dots     = document.querySelectorAll('.onboarding-dot');
    const moodBtns = document.querySelectorAll('.onboarding-mood-btn');
    const focusBtns= document.querySelectorAll('.onboarding-opt-btn');

    function goToStep(n) {
      steps.forEach(s => s.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));

      const target  = document.querySelector(`.onboarding-step[data-step="${n}"]`);
      const dotEl   = document.querySelector(`.onboarding-dot[data-dot="${n}"]`);
      if (target) target.classList.add('active');
      if (dotEl)  dotEl.classList.add('active');

      currentStep = n;
      // Re-render icons in new step
      if (window.lucide) lucide.createIcons();
    }

    // Mood selection
    moodBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        moodBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedMood = btn.getAttribute('data-mood');
      });
    });

    // Focus selection (multi-select)
    focusBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('selected');
        const focus = btn.getAttribute('data-focus');
        if (btn.classList.contains('selected')) {
          if (!selectedFocus.includes(focus)) selectedFocus.push(focus);
        } else {
          selectedFocus = selectedFocus.filter(f => f !== focus);
        }
      });
    });

    // Next buttons
    document.querySelectorAll('.onboarding-next-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (currentStep < 3) goToStep(currentStep + 1);
      });
    });

    // Back buttons
    document.querySelectorAll('.onboarding-back-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (currentStep > 1) goToStep(currentStep - 1);
      });
    });

    // Enter MindCare
    const enterBtn = document.getElementById('enter-mindcare-btn');
    if (enterBtn) {
      enterBtn.addEventListener('click', () => {
        finishOnboarding(selectedMood, selectedFocus);
      });
    }

    // Skip
    const skipBtn = document.getElementById('skip-onboarding');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        finishOnboarding(null, []);
      });
    }

    // Start on step 1
    goToStep(1);
  }

  function finishOnboarding(mood, focus) {
    MindCareStorage.setOnboardingCompleted(focus.join(','));

    // Save mood if user picked one in onboarding
    if (mood) MindCareStorage.saveCheckin(mood, []);

    enterApp();
  }

  // ── App entry ──────────────────────────────────────────────────────────────

  function enterApp() {
    const user = MindCareStorage.getUser();
    const name = user ? user.name : 'there';

    showScreen('app');
    updateSidebarProfile(name);
    updateGreeting(name);
    navigateTo('overview');

    // Re-render Lucide icons after DOM swap
    if (window.lucide) lucide.createIcons();
  }

  // ── Sidebar profile ────────────────────────────────────────────────────────

  function updateSidebarProfile(name) {
    const usernameEl = document.getElementById('sidebar-username');
    const avatarEl   = document.getElementById('sidebar-avatar');

    if (usernameEl) usernameEl.textContent = name || 'User';
    if (avatarEl)   avatarEl.textContent   = (name || 'U').charAt(0).toUpperCase();
  }

  // ── Greeting ───────────────────────────────────────────────────────────────

  function updateGreeting(name) {
    const nameEl  = document.getElementById('greeting-name');
    const greetEl = document.getElementById('time-greeting');

    if (nameEl) nameEl.textContent = name || 'Do‘stim';

    if (greetEl) {
      const h = new Date().getHours();
      greetEl.textContent = h < 6 ? 'tun' : h < 11 ? 'tong' : h < 18 ? 'kun' : 'oqshom';
    }
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  function navigateTo(viewId) {
    // Hide all views
    document.querySelectorAll('.app-view').forEach(v => {
      v.classList.remove('active');
    });

    // Show target view
    const target = document.getElementById('view-' + viewId);
    if (target) {
      target.classList.add('active');
      // Scroll to top of main content
      const main = document.getElementById('main-content');
      if (main) main.scrollTop = 0;
    }

    // Update sidebar and mobile bottom nav active state
    document.querySelectorAll('.sidebar-nav-item, .mobile-nav-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-view') === viewId);
    });

    // Re-render Lucide icons
    if (window.lucide) lucide.createIcons();

    // Trigger view-specific refresh hooks
    triggerViewRefresh(viewId);

    // Close mobile sidebar
    closeMobileSidebar();
  }

  function triggerViewRefresh(viewId) {
    switch (viewId) {
      case 'overview':
        if (window.refreshOverview) window.refreshOverview();
        break;
      case 'videos':
        setTimeout(function(){ if(window.VCRefreshVideos) window.VCRefreshVideos(); }, 50);
        break;
      case 'planner':
        if (window.renderPlannerTimeline) window.renderPlannerTimeline();
        break;
      case 'ai':
        if (window.initAIChat) window.initAIChat();
        break;
      case 'resources':
        if (window.refreshResources) window.refreshResources();
        else if (window.initResourceSaveButtons) window.initResourceSaveButtons();
        break;
      case 'checkin':
        if (window.resetCheckin) window.resetCheckin();
        break;
    }
  }

  // ── Mobile sidebar ─────────────────────────────────────────────────────────

  function openMobileSidebar() {
    const sidebar  = document.getElementById('sidebar');
    const overlay  = document.getElementById('sidebar-overlay');
    sidebar?.classList.add('mobile-open');
    overlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar?.classList.remove('mobile-open');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ── Public interface ───────────────────────────────────────────────────────

  return {
    showScreen,
    initOnboarding,
    finishOnboarding,
    enterApp,
    navigateTo,
    updateSidebarProfile,
    updateGreeting,
    openMobileSidebar,
    closeMobileSidebar
  };
})();

/* ─── Bootstrap ──────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  // ── Routing: decide first screen ──────────────────────────────────────────
  const route = MindCareAuth.getInitialRoute();

  if (route === 'app') {
    MindCareApp.enterApp();
  } else if (route === 'onboarding') {
    const user = MindCareStorage.getUser();
    MindCareApp.showScreen('onboarding');
    MindCareApp.initOnboarding(user ? user.name : '');
  } else {
    MindCareApp.showScreen('auth');
  }

  // ── Sidebar nav clicks ────────────────────────────────────────────────────
  document.getElementById('sidebar-nav')?.addEventListener('click', e => {
    const item = e.target.closest('.sidebar-nav-item');
    if (!item) return;
    e.preventDefault();
    const view = item.getAttribute('data-view');
    if (view) MindCareApp.navigateTo(view);
  });

  // ── Mobile bottom nav clicks ──────────────────────────────────────────────
  document.getElementById('mobile-bottom-nav')?.addEventListener('click', e => {
    const item = e.target.closest('.mobile-nav-item');
    if (!item) return;
    e.preventDefault();
    const view = item.getAttribute('data-view');
    if (view) MindCareApp.navigateTo(view);
  });

  // ── Quick action cards (overview) ─────────────────────────────────────────
  document.getElementById('main-content')?.addEventListener('click', e => {
    const card = e.target.closest('[data-action-nav]');
    if (!card) return;
    const view = card.getAttribute('data-action-nav');
    if (view) MindCareApp.navigateTo(view);
  });

  // ── Check-in result action buttons ────────────────────────────────────────
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-nav-to]');
    if (!btn) return;
    const view = btn.getAttribute('data-nav-to');
    if (view) MindCareApp.navigateTo(view);
  });

  // ── Logout ────────────────────────────────────────────────────────────────
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    MindCareAuth.logout();
    // Reset form fields
    ['reg-name','reg-email','reg-password'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    const regBtn = document.getElementById('register-btn');
    if (regBtn) {
      regBtn.disabled  = false;
      regBtn.innerHTML = 'Create my MindCare account <i data-lucide="arrow-right" width="18" height="18"></i>';
    }
    MindCareApp.showScreen('auth');
    if (window.lucide) lucide.createIcons();
    showToast('You have been logged out.', 'info');
  });

  // ── Trust cards interactive modal ────────────────────────────────────────
  const trustData = {
    privacy: {
      icon: '🔒',
      title: '100% Shaxsiy Maxfiylik',
      subtitle: 'Ma\'lumotlaringiz faqat sizning qurilmangizda',
      body: '<p>Youth Mental Wellness platformasida shaxsiy daxlsizlik eng oliy qadriyatdir.</p>' +
            '<ul style="margin:12px 0 12px 20px;display:flex;flex-direction:column;gap:6px">' +
            '<li><strong>Lokal Xotira:</strong> Kayfiyat kundaligingiz, o\'tkazilgan testlar, saqlangan videolar va AI suhbatlaringiz faqatgina o\'zingizning brauzeringizda (localStorage) saqlanadi.</li>' +
            '<li><strong>Tashqi serverlarga yuborilmaydi:</strong> Biz profilingiz yoki his-tuyg\'ularingizni begona serverlarga yozib bormaymiz.</li>' +
            '<li><strong>Hech qanday reklama yoki trekerlar yo\'q:</strong> Faoliyatingiz kuzatilmaydi.</li>' +
            '</ul>' +
            '<p style="color:var(--accent-cyan);font-size:0.85rem">✨ Siz xavfsiz va to\'liq maxfiy muhitdasiz.</p>',
      actionBtn: '<button class="btn btn-primary btn-sm" id="trust-modal-ok">Tushunarli</button>'
    },
    security: {
      icon: '🛡️',
      title: 'Zamonaviy Xavfsizlik Kafolatlari',
      subtitle: 'Ilg\'or veb-xavfsizlik andozalari',
      body: '<p>Platformamiz zamonaviy xavfsizlik protokollari asosida qurilgan:</p>' +
            '<ul style="margin:12px 0 12px 20px;display:flex;flex-direction:column;gap:6px">' +
            '<li><strong>Mijoz tomoni izolyatsiyasi:</strong> Barcha hisob-kitoblar va ma\'lumotlar sizning qurilmangizda xavfsiz ishlanadi.</li>' +
            '<li><strong>API Kalitlari Himoyasi:</strong> Kiritilgan shaxsiy AI kalitlari faqat qurilmangizda saqlanadi va uchinchi shaxslarga uzatilmaydi.</li>' +
            '<li><strong>Xavfsiz ulanish:</strong> Barcha tashqi video va audio oqimlari rasmiy va litsenziyalangan manbalardan olinadi.</li>' +
            '</ul>',
      actionBtn: '<button class="btn btn-primary btn-sm" id="trust-modal-ok">Yaxshi</button>'
    },
    control: {
      icon: '👤',
      title: 'Ma\'lumotlar To\'liq Sizning Nazoratingizda',
      subtitle: 'Istalgan payt boshqaring yoki o\'chiring',
      body: '<p>Siz o\'z ma\'lumotlaringizning yagona egasisiz. Quyidagi amallarni bajarishingiz mumkin:</p>' +
            '<ul style="margin:12px 0 12px 20px;display:flex;flex-direction:column;gap:6px">' +
            '<li><strong>Eksport qilish:</strong> Barcha qaydlaringizni bitta JSON faylda yuklab oling.</li>' +
            '<li><strong>Tozalash:</strong> Istalgan vaqtda barcha yozuvlarni bir zumda tozalab o\'chirib tashlang.</li>' +
            '</ul>',
      actionBtn: '<button class="btn btn-secondary btn-sm" id="trust-export-btn">📥 Ma\'lumotlarni yuklab olish</button>' +
                 '<button class="btn btn-primary btn-sm" id="trust-modal-ok">Yopish</button>'
    },
    science: {
      icon: '📚',
      title: 'Ilmiy Psixologiya Asoslari',
      subtitle: 'CBT va kognitiv psixologiya maktabi',
      body: '<p>Youth Mental Wellness ilmiy dalillarga asoslangan metodikalardan foydalanadi:</p>' +
            '<ul style="margin:12px 0 12px 20px;display:flex;flex-direction:column;gap:6px">' +
            '<li><strong>Kognitiv-Xulq-Atvor Terapiyasi (CBT):</strong> Salbiy avtomatik fikrlarni aniqlash va xolis qayta baholash (Aaron Beck).</li>' +
            '<li><strong>Garvard Baxt Tadqiqoti:</strong> Inson ruhiy salomatligi va munosabatlari bo\'yicha 85 yillik eng uzoq davom etgan ilmiy izlanish.</li>' +
            '<li><strong>Parasimpatik Nafas Amaliyotlari:</strong> 4-4-6 va Box breathing usullari orqali vagus asabini tinchlantirish.</li>' +
            '</ul>',
      actionBtn: '<button class="btn btn-primary btn-sm" id="trust-modal-ok">Foydali ma\'lumot</button>'
    }
  };

  document.addEventListener('click', e => {
    const card = e.target.closest('.trust-card');
    if (!card) return;
    const type = card.getAttribute('data-trust');
    const info = trustData[type];
    if (!info) return;

    const modal = document.getElementById('trust-modal');
    if (!modal) return;

    document.getElementById('trust-modal-icon').textContent = info.icon;
    document.getElementById('trust-modal-title').textContent = info.title;
    document.getElementById('trust-modal-subtitle').textContent = info.subtitle;
    document.getElementById('trust-modal-body').innerHTML = info.body;
    document.getElementById('trust-modal-actions').innerHTML = info.actionBtn;
    modal.style.display = 'flex';
  });

  // Modal close handlers
  document.addEventListener('click', e => {
    if (e.target.id === 'trust-modal-close' || e.target.id === 'trust-modal-ok' || e.target.id === 'trust-modal') {
      const modal = document.getElementById('trust-modal');
      if (modal) modal.style.display = 'none';
    }

    if (e.target.id === 'trust-export-btn') {
      const allData = {
        user: MindCareStorage.getUser(),
        checkins: MindCareStorage.getCheckins(),
        savedResources: MindCareStorage.getSavedResources ? MindCareStorage.getSavedResources() : [],
        exportDate: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'youth-mental-wellness-data.json';
      a.click();
      URL.revokeObjectURL(url);
      showToast('Ma\'lumotlaringiz yuklab olindi! 📥', 'success');
    }
  });

  // ── Mobile menu toggle ────────────────────────────────────────────────────
  document.getElementById('mobile-menu-toggle')?.addEventListener('click', () => {
    MindCareApp.openMobileSidebar();
  });

  // ── Sidebar overlay click (close) ─────────────────────────────────────────
  document.getElementById('sidebar-overlay')?.addEventListener('click', () => {
    MindCareApp.closeMobileSidebar();
  });

  // ── Particle canvas ───────────────────────────────────────────────────────
  initParticles();

  // ── Render Lucide icons ───────────────────────────────────────────────────
  if (window.lucide) lucide.createIcons();
});

/* ─── Particle background ────────────────────────────────────────────────── */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [], w, h;

  function resize() {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
    spawnParticles();
  }

  function spawnParticles() {
    const count = Math.max(20, Math.floor((w * h) / 18000));
    particles = Array.from({ length: count }, () => ({
      x:      Math.random() * w,
      y:      Math.random() * h,
      vx:     (Math.random() - 0.5) * 0.45,
      vy:     (Math.random() - 0.5) * 0.45,
      r:      Math.random() * 1.8 + 0.6,
      color:  Math.random() > 0.5
                ? 'rgba(59,130,246,0.18)'
                : 'rgba(124,58,237,0.18)'
    }));
  }

  resize();
  window.addEventListener('resize', resize);

  (function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q  = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(100,116,139,${0.08 * (1 - d / 110)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    });
    requestAnimationFrame(draw);
  })();
}

/* ─── Intersection-observer fade-in (reused by views) ────────────────────── */
window.observeFadeElements = function (root) {
  const els = (root || document).querySelectorAll('.fade-in:not(.visible)');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 5) * 0.07}s`;
    obs.observe(el);
  });
};
