/**
 * MindCare Dashboard / Overview
 * Renders the overview cards, weekly mood chart, and quick-action wiring.
 */

const MOOD_LABELS = {
  great:       'A’lo 🤩',
  good:        'Yaxshi 🙂',
  okay:        'O‘rtacha 😐',
  stressed:    'Stressda 😫',
  overwhelmed: 'Charchagan 😵‍💫'
};

const MOOD_VALUES = {
  overwhelmed: 1,
  stressed:    2,
  okay:        3,
  good:        4,
  great:       5
};

/* ── Public refresh hook called by MindCareApp.navigateTo ─────────────────── */
window.refreshOverview = function () {
  updateDashboardCards();
  drawWeeklyChart();
  if (window.lucide) lucide.createIcons();
};

/* ── Card updater ─────────────────────────────────────────────────────────── */
function updateDashboardCards() {
  const checkin = MindCareStorage.getTodayCheckin();
  const tasks   = MindCareStorage.getPlannerTasks();

  // Mood card
  const moodText = document.getElementById('dash-mood-text');
  const moodSub  = document.getElementById('dash-mood-sub');
  if (moodText) {
    moodText.textContent = checkin ? (MOOD_LABELS[checkin.mood] || checkin.mood) : 'Kutilmoqda';
  }
  if (moodSub) {
    moodSub.textContent = checkin
      ? 'Bugun qayd etildi · ' + new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' })
      : 'Hissiyotni qayd qilish uchun bosing';
  }

  // Balance card — derived from mood score
  const balanceBar  = document.getElementById('dash-balance-bar');
  const balanceTxt  = document.getElementById('dash-balance-text');
  const moodScore   = checkin ? (MOOD_VALUES[checkin.mood] || 3) : 3;
  const balancePct  = Math.round((moodScore / 5) * 100);

  if (balanceBar) balanceBar.style.width = balancePct + '%';
  if (balanceTxt) {
    balanceTxt.textContent = balancePct >= 80 ? 'A’lo darajada'
      : balancePct >= 60 ? 'Yaxshi'
      : balancePct >= 40 ? 'O‘rtacha'
      : 'E’tibor kerak';
  }

  // Plan card — show next scheduled task for today
  const planText = document.getElementById('dash-plan-text');
  const planSub  = document.getElementById('dash-plan-sub');
  const now      = new Date();
  const timeNow  = now.getHours() * 60 + now.getMinutes();

  const upcoming = tasks
    .filter(t => !t.isBreak)
    .sort((a, b) => a.time.localeCompare(b.time))
    .find(t => {
      const [h, m] = (t.time || '00:00').split(':').map(Number);
      return (h * 60 + m) >= timeNow;
    });

  if (planText) planText.textContent = upcoming ? upcoming.name : 'Bajarildi';
  if (planSub)  planSub.textContent  = upcoming ? `Soat ${upcoming.time} da` : 'Barcha rejalar tugatilgan';
}

/* ── Weekly mood chart ────────────────────────────────────────────────────── */
function drawWeeklyChart() {
  const canvas = document.getElementById('weekly-chart-canvas');
  if (!canvas) return;

  const parent = canvas.parentElement;
  const rect   = parent.getBoundingClientRect();
  const W      = rect.width  || 600;
  const H      = rect.height || 190;

  canvas.width  = W;
  canvas.height = H;

  const ctx  = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);

  const rawData = MindCareStorage.getWeeklyMoods(); // 7-item array, null if no entry
  const values  = rawData.map(m => m ? (MOOD_VALUES[m] || 3) : null);

  const padL = 30, padR = 20, padT = 12, padB = 28;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth   = 1;
  for (let i = 1; i <= 5; i++) {
    const y = padT + plotH - ((i - 1) / 4) * plotH;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(W - padR, y);
    ctx.stroke();
  }

  // Compute point positions (skip nulls)
  const points = values.map((v, i) => {
    if (v === null) return null;
    return {
      x: padL + (i / 6) * plotW,
      y: padT + plotH - ((v - 1) / 4) * plotH
    };
  });

  // Fill only connected segments
  const filled = points.filter(Boolean);
  if (filled.length >= 2) {
    const grad = ctx.createLinearGradient(0, padT, 0, H - padB);
    grad.addColorStop(0, 'rgba(59,130,246,0.28)');
    grad.addColorStop(1, 'rgba(59,130,246,0.00)');

    ctx.beginPath();
    ctx.moveTo(filled[0].x, H - padB);
    filled.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(filled[filled.length - 1].x, H - padB);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    filled.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else {
        const prev = filled[i - 1];
        const cpX  = (prev.x + p.x) / 2;
        ctx.bezierCurveTo(cpX, prev.y, cpX, p.y, p.x, p.y);
      }
    });
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth   = 2.5;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    ctx.stroke();
  }

  // Dots
  points.forEach(p => {
    if (!p) return;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fillStyle   = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth   = 2;
    ctx.stroke();
  });

  // X-axis labels
  const days = ['Du', 'Se', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak'];
  ctx.fillStyle  = 'rgba(255,255,255,0.38)';
  ctx.font       = '11px Inter, sans-serif';
  ctx.textAlign  = 'center';
  for (let i = 0; i < 7; i++) {
    const x = padL + (i / 6) * plotW;
    ctx.fillText(days[i], x, H - 6);
  }
}

/* ── Init on DOMContentLoaded ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Initial render when navigating to overview for the first time
  window.addEventListener('resize', () => {
    if (document.getElementById('view-overview')?.classList.contains('active')) {
      drawWeeklyChart();
    }
  });
});
